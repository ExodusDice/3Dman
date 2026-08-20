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

// 7-Stage Transparent Artisan Fulfillment Lifecycle
export type OrderStatus =
  // Stage 1 & 2: Order Placed & 300 THB Artisan Deposit
  | 'deposit_pending'               // Customer submitted request, waiting for 300 THB deposit
  | 'deposit_paid'                  // 300 THB deposit received, artisan queue started
  // Stage 3: Artisan 3D Drafting & 3-Round Review
  | 'artisan_drafting'              // Artisan is hand-crafting / sculpting the 3D model
  | 'revision_1_review'             // Round 1: Artisan posted draft, awaiting customer review
  | 'revision_2_review'             // Round 2: LAST CHANCE FOR 300 THB REFUND
  | 'revision_3_review'             // Round 3: Final design polish
  // Stage 4: Quotation & Customer Affirmation
  | 'quotation_pending'             // Design confirmed, final material/weight/SLA price sent
  | 'affirmation_confirmed'         // Customer agreed to final price/SLA/refund terms
  // Stage 5: Manufacturing & Packaging
  | 'printing'                      // 3D printing in progress (SLA running)
  | 'packaging'                     // Post-processing, curing, optical QA & packaging
  // Stage 6: Delivery
  | 'shipping'                      // In transit with courier tracking
  | 'delivered'                     // Delivered to customer
  | 'completed'                     // Customer confirmed receiving matching product
  // Stage 7: 300 THB Cashback Photo Review
  | 'cashback_submitted'            // Customer uploaded photo for 300 THB cashback
  | 'cashback_paid'                 // 300 THB cashback paid to customer
  // Refund States
  | 'deposit_refunded'              // 300 THB deposit refunded (Round 1 or 2)
  | 'cancelled_no_refund';          // Cancelled after design confirmation (300 THB retained)

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

export interface ArtisanRevisionItem {
  round: number; // 1, 2, or 3
  submittedAt: string;
  artisanNote: string;
  draftImageUrl?: string;
  draft3dUrl?: string;
  customerFeedback?: string;
  customerFeedbackAt?: string;
  status: 'pending_customer' | 'approved' | 'rework_requested' | 'refund_requested';
  isLastChanceRefund?: boolean; // true for round 2
}

export interface FinalQuotation {
  material: MaterialOption;
  estimatedWeightGrams: number;
  printTimeHours: number;
  productionCostThb: number;
  depositCreditedThb: number; // 300 THB
  remainingBalanceThb: number;
  slaDays: number;
  estimatedDeliveryDate: string;
  affirmationAccepted: boolean;
  affirmationAcceptedAt?: string;
}

export interface CashbackPhotoClaim {
  submitted: boolean;
  photoUrl?: string;
  submittedAt?: string;
  status: 'none' | 'pending' | 'approved' | 'paid' | 'rejected';
  amountThb: number; // 300 THB
  adminNote?: string;
  payoutMethod?: string;
  payoutAccount?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  
  // Custom Request Details
  description: string;
  referenceImages: string[];
  dimensionsText?: string;
  intendedUse?: string;
  
  // 300 THB Design Deposit
  depositAmountThb: number; // 300
  depositPaid: boolean;
  depositPaidAt?: string;
  depositStripePaymentId?: string;

  // 3-Round Artisan Drafting & Feedback
  currentRevisionRound: number; // 1, 2, or 3
  maxRevisions: number; // 3
  revisions: ArtisanRevisionItem[];
  canRefundDeposit: boolean; // true during round 1 and round 2

  // Final Quotation & Affirmation
  quotation?: FinalQuotation;
  
  // Model & Physical Specs
  modelGeometry: ModelGeometryInfo;
  material: MaterialOption;
  shippingOption: ShippingOption;
  shippingAddress: ShippingAddress;
  pricing: PriceBreakdown;

  // Courier & Tracking
  slaGuaranteedDeliveryDate: string;
  isSlaMet: boolean;
  trackingNumber?: string;
  trackingCarrier?: string;
  packagingNotes?: string;

  // 300 THB Cashback Photo Claim
  cashbackClaim?: CashbackPhotoClaim;
  
  // Internal Admin & Artisan Notes
  artisanInternalNotes?: string;
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
