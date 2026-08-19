import { MaterialOption, PriceBreakdown, ShippingOption } from '@/types';

interface PriceCalculationParams {
  widthCm: number;
  heightCm: number;
  depthCm: number;
  infillPercent: number;
  material: MaterialOption;
  shippingOption: ShippingOption;
  customPriceOverride?: number;
  overrideReason?: string;
}

export function calculateProfitPrice({
  widthCm,
  heightCm,
  depthCm,
  infillPercent,
  material,
  shippingOption,
  customPriceOverride,
  overrideReason,
}: PriceCalculationParams): PriceBreakdown {
  // Bounding box volume in cm3 with organic geometry fill factor (~52% average for sculptures/figurines)
  const boundingVolumeCm3 = widthCm * heightCm * depthCm;
  const solidVolumeCm3 = boundingVolumeCm3 * 0.52;
  
  // Shell (outer wall) represents ~30% of solid volume; interior infill is scaled by infillPercent
  const effectiveInfillRatio = 0.30 + (0.70 * (infillPercent / 100));
  const netVolumeCm3 = solidVolumeCm3 * effectiveInfillRatio;
  
  // Weight in grams based on material density
  const estimatedWeightGrams = Math.max(15, Math.round(netVolumeCm3 * material.densityGPerCm3));
  
  // Print machine hours calculation: baseline 1.5h + scaling with height and volume
  const printTimeHours = Number((1.2 + (heightCm * 0.35) + (netVolumeCm3 * 0.025)).toFixed(1));
  
  // 1. Raw direct material cost
  const rawMaterialCost = Number((estimatedWeightGrams * material.pricePerGram).toFixed(2));
  
  // 2. Machine runtime cost ($2.20 / hour electricity + printer depreciation)
  const machineTimeCost = Number((printTimeHours * 2.20).toFixed(2));
  
  // 3. AI 3D Neural compute & neural meshing fee
  const aiComputeFee = 6.50;
  
  // 4. Manual Post-Processing, Support Removal, UV Curing & 14-Day SLA Guarantee Insurance Reserve
  const handFinishingQAFee = 7.50;
  const slaInsuranceFee = 4.00;
  
  // 5. Direct Cost of Goods Sold (COGS)
  const cogsTotal = Number((rawMaterialCost + machineTimeCost + aiComputeFee + handFinishingQAFee + slaInsuranceFee).toFixed(2));
  
  // 6. Platform Profit Margin Target: 58% gross margin on service
  // Price = COGS / (1 - MarginRate)
  const targetMarginRate = 0.58;
  const calculatedSubtotal = Number((cogsTotal / (1 - targetMarginRate)).toFixed(2));
  
  const shippingFee = shippingOption.price;
  
  let finalSubtotal = calculatedSubtotal;
  let isPriceOverridden = false;
  
  if (customPriceOverride !== undefined && customPriceOverride > 0) {
    finalSubtotal = customPriceOverride;
    isPriceOverridden = true;
  }
  
  const totalPrice = Number((finalSubtotal + shippingFee).toFixed(2));
  const profitMarginAmount = Number((finalSubtotal - cogsTotal).toFixed(2));
  const profitMarginPercent = Number(((profitMarginAmount / finalSubtotal) * 100).toFixed(1));

  return {
    volumeCm3: Number(netVolumeCm3.toFixed(1)),
    estimatedWeightGrams,
    printTimeHours,
    aiComputeFee,
    rawMaterialCost,
    machineTimeCost,
    handFinishingQAFee,
    slaInsuranceFee,
    shippingFee,
    cogsTotal,
    profitMarginAmount,
    profitMarginPercent: Math.max(0, profitMarginPercent),
    subtotal: finalSubtotal,
    totalPrice,
    originalPrice: isPriceOverridden ? Number((calculatedSubtotal + shippingFee).toFixed(2)) : undefined,
    isPriceOverridden,
    priceOverrideReason: overrideReason,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
