export type ArtStyle = 
  | 'cyberpunk'
  | 'realistic'
  | 'anime_cartoon'
  | 'sculpted_marble'
  | 'ancient_bronze'
  | 'low_poly'
  | 'sci_fi_mech'
  | 'voronoi_art';

export interface MaterialOption {
  id: string;
  name: string;
  category: 'Resin' | 'Filament' | 'Metal Composite' | 'Specialty';
  description: string;
  finish: string;
  colorHex: string;
  densityGPerCm3: number;
  pricePerGram: number;
  durability: number;
  detailLevel: number;
  badge?: string;
  textureRoughness: number;
  textureMetalness: number;
  transmission?: number;
  emissive?: string;
}

export interface ShippingOption {
  id: 'standard_14d' | 'express_7d' | 'rush_3d';
  name: string;
  slaDays: number;
  price: number;
  description: string;
  guaranteeText: string;
  badge?: string;
}

// 3-Phase Fulfillment Flow + Refund States
export type OrderStatus =
  // Phase 1: Review & Finalization
  | 'admin_review'                  // Customer paid estimate, admin reviewing 3D mesh & specs
  | 'price_adjusted_pending_customer' // Admin adjusted price/SLA, waiting customer confirmation
  | 'approved'                      // Admin approved final price & SLA
  // Phase 2: Manufacturing & Shipping
  | 'printing'                      // 3D printer running (layer fabrication)
  | 'packaging'                     // Post-curing done, optical QA passed, packaging in progress
  | 'shipping'                      // In transit with carrier tracking
  // Phase 3: Delivery & Confirmation
  | 'delivered_pending_confirmation'// Courier delivered, awaiting customer confirmation
  | 'completed'                     // Customer confirmed receiving & matching order!
  // Refund Flow
  | 'refund_requested'              // Customer requested refund
  | 'refund_approved'               // Admin approved 100% refund
  | 'refund_rejected';              // Admin rejected refund with explanation

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  specialInstructions?: string;
}

export interface PriceBreakdown {
  volumeCm3: number;
  estimatedWeightGrams: number;
  printTimeHours: number;
  aiComputeFee: number;
  rawMaterialCost: number;
  machineTimeCost: number;
  handFinishingQAFee: number;
  slaInsuranceFee: number;
  shippingFee: number;
  cogsTotal: number;
  profitMarginAmount: number;
  profitMarginPercent: number;
  subtotal: number;
  totalPrice: number;
  originalPrice?: number;
  isPriceOverridden?: boolean;
  priceOverrideReason?: string;
}

export interface ModelGeometryInfo {
  shape: 
    | 'cyberpunk_helmet' 
    | 'dragon_sculpture' 
    | 'roman_bust' 
    | 'human_bust'
    | 'scifi_mech' 
    | 'sacred_artifact' 
    | 'voronoi_vase' 
    | 'cute_mascot' 
    | 'weapon_sword'
    | 'skull_anatomy'
    | 'vehicle_spaceship'
    | 'photo_relief'
    | 'custom_glb'
    | string;
  glbUrl?: string;
  previewImageUrl?: string;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  infillPercent: number;
  triangleCount: number;
}

export interface CustomerReceiptConfirmation {
  confirmedAt?: string;
  matchesOrder: boolean;
  satisfactionRating?: number; // 1-5
  feedbackNotes?: string;
  customerPhotoUrl?: string;
}

export interface RefundRequestInfo {
  requestedAt: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: string;
  resolvedAt?: string;
  refundAmount?: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  prompt: string;
  negativePrompt?: string;
  style: ArtStyle;
  modelGeometry: ModelGeometryInfo;
  material: MaterialOption;
  shippingOption: ShippingOption;
  shippingAddress: ShippingAddress;
  pricing: PriceBreakdown;

  // Phase 1: Admin Review & Finalization fields
  estimatedPrice: number;
  actualPrice?: number;
  priceAdjustmentReason?: string;
  estimatedSlaDeliveryDate: string;
  actualSlaDeliveryDate?: string;
  adminApprovalNotes?: string;
  adminApprovedAt?: string;

  // Re-edit limits (max 3)
  revisionCount: number;
  maxRevisionsAllowed: number;
  revisionHistory: Array<{
    timestamp: string;
    prompt: string;
    style: ArtStyle;
    materialId: string;
  }>;

  // Courier & Tracking
  slaGuaranteedDeliveryDate: string; // Active guaranteed SLA deadline
  isSlaMet: boolean;
  trackingNumber?: string;
  trackingCarrier?: string;
  packagingNotes?: string;

  // Phase 3: Customer Receipt Confirmation
  receiptConfirmation?: CustomerReceiptConfirmation;

  // Refund Management
  refundRequest?: RefundRequestInfo;
  adminNotes?: string;
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  sender: 'customer' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

export interface ShowcaseReview {
  id: string;
  customerName: string;
  location: string;
  title: string;
  review: string;
  rating: number;
  materialUsed: string;
  printSize: string;
  timeToDeliverDays: number;
  imageUrl: string;
  modelType: string;
}
