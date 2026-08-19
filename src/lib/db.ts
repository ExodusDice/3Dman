import fs from 'fs';
import path from 'path';
import { CustomerOrder, ChatMessage, ShowcaseReview, OrderStatus, MaterialOption, ModelGeometryInfo, ArtStyle } from '@/types';
import { AVAILABLE_MATERIALS, AVAILABLE_SHIPPING_OPTIONS } from './materials';
import { calculateProfitPrice } from './pricing';

interface StoreData {
  orders: CustomerOrder[];
  chats: ChatMessage[];
  reviews: ShowcaseReview[];
}

export interface GalleryDesignItem {
  id: string;
  orderNumber: string;
  title: string;
  prompt: string;
  style: ArtStyle;
  modelGeometry: ModelGeometryInfo;
  material: MaterialOption;
  customerName: string;
  customerLocation: string;
  rating: number;
  reviewText: string;
  specs: string;
  createdAt: string;
  isVerifiedPrint: boolean;
  status: OrderStatus;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_REVIEWS: ShowcaseReview[] = [
  {
    id: 'rev_1',
    customerName: 'Alex Mercer',
    location: 'Austin, TX',
    title: 'Mind-blowing detail & arrived in 9 days!',
    review: 'I gave Meshy a prompt for a Cyberpunk Oni mask and selected the Carbon Fiber PETG. The physical print arrived earlier than the 14-day SLA, and the quality is completely indistinguishable from industrial factory prototypes. 10/10!',
    rating: 5,
    materialUsed: 'Carbon Fiber Reinforced PETG',
    printSize: '16.5cm Height',
    timeToDeliverDays: 9,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    modelType: 'Cyberpunk Helmet',
  },
  {
    id: 'rev_2',
    customerName: 'Elena Rostova',
    location: 'Seattle, WA',
    title: 'Solid bronze sculpture is museum quality',
    review: 'I was skeptical about AI 3D to physical metal casting, but the antique bronze finish has a genuine heavy weight (over 400g!). The admin team answered my questions via direct chat within 5 minutes. Amazing service.',
    rating: 5,
    materialUsed: 'Solid Cast Bronze Metal',
    printSize: '15.0cm Height',
    timeToDeliverDays: 11,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    modelType: 'Roman Emperor Bust',
  },
  {
    id: 'rev_3',
    customerName: 'Kenji Sato',
    location: 'San Francisco, CA',
    title: 'Smooth 8K resin detail for my gaming shelf',
    review: 'Used 2 of my 3 prompt revisions to refine the wings on my dragon model before locking the order. The SLA delivery guarantee gave me complete peace of mind. Arrived perfectly boxed with zero layer lines.',
    rating: 5,
    materialUsed: '8K Ultra-Detail Resin',
    printSize: '18.0cm Wingspan',
    timeToDeliverDays: 8,
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    modelType: 'Mythical Dragon',
  }
];

const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'msg_1',
    orderId: 'ORD-88219',
    sender: 'admin',
    senderName: 'Master Artisan Dave (Admin)',
    message: 'Hello Alex! We reviewed your Cyberpunk Oni mesh in our slicer. Support pillars look clean and we have approved the print for fabrication.',
    timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: 'msg_2',
    orderId: 'ORD-88219',
    sender: 'customer',
    senderName: 'Alex Mercer',
    message: 'Awesome! Can you make sure the horn tips are polished with extra matte coating before packaging?',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'msg_3',
    orderId: 'ORD-88219',
    sender: 'admin',
    senderName: 'Master Artisan Dave (Admin)',
    message: 'Absolutely! Our post-processing lab will hand-finish the edges during packaging.',
    timestamp: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  }
];

function generateSeedOrders(): CustomerOrder[] {
  const resin = AVAILABLE_MATERIALS[0];
  const carbon = AVAILABLE_MATERIALS[2];
  const bronze = AVAILABLE_MATERIALS[3];
  const luminescent = AVAILABLE_MATERIALS[4];
  const stdShipping = AVAILABLE_SHIPPING_OPTIONS[0];
  const expressShipping = AVAILABLE_SHIPPING_OPTIONS[1];

  const now = Date.now();
  const day = 24 * 3600 * 1000;

  const order1Pricing = calculateProfitPrice({
    widthCm: 14,
    heightCm: 18,
    depthCm: 12,
    infillPercent: 35,
    material: carbon,
    shippingOption: stdShipping,
  });

  const order2Pricing = calculateProfitPrice({
    widthCm: 12,
    heightCm: 16,
    depthCm: 11,
    infillPercent: 40,
    material: bronze,
    shippingOption: expressShipping,
  });

  const order3Pricing = calculateProfitPrice({
    widthCm: 15,
    heightCm: 17,
    depthCm: 14,
    infillPercent: 30,
    material: resin,
    shippingOption: stdShipping,
  });

  const order4Pricing = calculateProfitPrice({
    widthCm: 14,
    heightCm: 19,
    depthCm: 12,
    infillPercent: 35,
    material: luminescent,
    shippingOption: stdShipping,
  });

  return [
    {
      id: 'ord_1',
      orderNumber: 'ORD-88219',
      createdAt: new Date(now - 4 * day).toISOString(),
      updatedAt: new Date(now - 1 * day).toISOString(),
      customerName: 'Alex Mercer',
      customerEmail: 'alex.mercer@cyberart.io',
      status: 'printing',
      prompt: 'Cyberpunk Oni warrior mask with geometric angular horns and cyber-optic breather vents',
      style: 'cyberpunk',
      modelGeometry: {
        shape: 'cyberpunk_helmet',
        widthCm: 14,
        heightCm: 18,
        depthCm: 12,
        infillPercent: 35,
        triangleCount: 124000,
      },
      material: carbon,
      shippingOption: stdShipping,
      shippingAddress: {
        fullName: 'Alex Mercer',
        email: 'alex.mercer@cyberart.io',
        phone: '+1 (512) 555-0192',
        addressLine1: '404 Silicon Hills Blvd, Suite 300',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'United States',
      },
      pricing: order1Pricing,
      estimatedPrice: order1Pricing.totalPrice,
      actualPrice: order1Pricing.totalPrice,
      estimatedSlaDeliveryDate: new Date(now + 10 * day).toISOString(),
      actualSlaDeliveryDate: new Date(now + 10 * day).toISOString(),
      slaGuaranteedDeliveryDate: new Date(now + 10 * day).toISOString(),
      adminApprovedAt: new Date(now - 3 * day).toISOString(),
      adminApprovalNotes: 'Mesh density approved. Slicing with 0.12mm layer height.',
      revisionCount: 1,
      maxRevisionsAllowed: 3,
      revisionHistory: [],
      isSlaMet: true,
      trackingCarrier: 'FedEx Express Air',
      receiptConfirmation: {
        matchesOrder: true,
        satisfactionRating: 5,
        feedbackNotes: 'Exceeded my expectations on layer smoothness!',
      }
    },
    {
      id: 'ord_2',
      orderNumber: 'ORD-77194',
      createdAt: new Date(now - 6 * day).toISOString(),
      updatedAt: new Date(now - 2 * day).toISOString(),
      customerName: 'Elena Rostova',
      customerEmail: 'elena.rostova@galleryart.org',
      status: 'delivered_pending_confirmation',
      prompt: 'Marcus Aurelius Roman Emperor stoic bust sculpture with classical folds and weathered patina',
      style: 'ancient_bronze',
      modelGeometry: {
        shape: 'roman_bust',
        widthCm: 12,
        heightCm: 16,
        depthCm: 11,
        infillPercent: 40,
        triangleCount: 98000,
      },
      material: bronze,
      shippingOption: expressShipping,
      shippingAddress: {
        fullName: 'Elena Rostova',
        email: 'elena.rostova@galleryart.org',
        phone: '+1 (206) 555-0144',
        addressLine1: '1201 3rd Avenue, Apt 14B',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States',
      },
      pricing: order2Pricing,
      estimatedPrice: order2Pricing.totalPrice,
      actualPrice: order2Pricing.totalPrice,
      estimatedSlaDeliveryDate: new Date(now + 1 * day).toISOString(),
      actualSlaDeliveryDate: new Date(now + 1 * day).toISOString(),
      slaGuaranteedDeliveryDate: new Date(now + 1 * day).toISOString(),
      adminApprovedAt: new Date(now - 5 * day).toISOString(),
      revisionCount: 2,
      maxRevisionsAllowed: 3,
      revisionHistory: [],
      isSlaMet: true,
      trackingNumber: '3DM-4820194-EXP',
      trackingCarrier: 'DHL Express Priority',
      receiptConfirmation: {
        matchesOrder: true,
        satisfactionRating: 5,
        feedbackNotes: 'Heavy solid metal feel. Truly museum quality sculpture.',
      }
    },
    {
      id: 'ord_3',
      orderNumber: 'ORD-99302',
      createdAt: new Date(now - 1 * day).toISOString(),
      updatedAt: new Date(now - 1 * day).toISOString(),
      customerName: 'Kenji Sato',
      customerEmail: 'kenji.sato@creative.jp',
      status: 'admin_review',
      prompt: 'Majestic celestial dragon wrapped around a crystalline sphere with sharp scales and fierce gaze',
      style: 'realistic',
      modelGeometry: {
        shape: 'dragon_sculpture',
        widthCm: 15,
        heightCm: 17,
        depthCm: 14,
        infillPercent: 30,
        triangleCount: 145000,
      },
      material: resin,
      shippingOption: stdShipping,
      shippingAddress: {
        fullName: 'Kenji Sato',
        email: 'kenji.sato@creative.jp',
        phone: '+1 (415) 555-0811',
        addressLine1: '750 Mission Street, Unit 802',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        country: 'United States',
      },
      pricing: order3Pricing,
      estimatedPrice: order3Pricing.totalPrice,
      estimatedSlaDeliveryDate: new Date(now + 13 * day).toISOString(),
      slaGuaranteedDeliveryDate: new Date(now + 13 * day).toISOString(),
      revisionCount: 0,
      maxRevisionsAllowed: 3,
      revisionHistory: [],
      isSlaMet: true,
      receiptConfirmation: {
        matchesOrder: true,
        satisfactionRating: 5,
        feedbackNotes: 'Dragon wings and scales look sharp and pristine.',
      }
    },
    {
      id: 'ord_4',
      orderNumber: 'ORD-66205',
      createdAt: new Date(now - 8 * day).toISOString(),
      updatedAt: new Date(now - 3 * day).toISOString(),
      customerName: 'Liam Vance',
      customerEmail: 'liam.vance@studio.co',
      status: 'completed',
      prompt: 'Heavy Sci-Fi Mech Titan Armor with shoulder battery cannons and core reactor',
      style: 'sci_fi_mech',
      modelGeometry: {
        shape: 'scifi_mech',
        widthCm: 14,
        heightCm: 19,
        depthCm: 12,
        infillPercent: 35,
        triangleCount: 115000,
      },
      material: luminescent,
      shippingOption: stdShipping,
      shippingAddress: {
        fullName: 'Liam Vance',
        email: 'liam.vance@studio.co',
        phone: '+1 (312) 555-0988',
        addressLine1: '200 E Randolph St',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'United States',
      },
      pricing: order4Pricing,
      estimatedPrice: order4Pricing.totalPrice,
      actualPrice: order4Pricing.totalPrice,
      estimatedSlaDeliveryDate: new Date(now - 1 * day).toISOString(),
      actualSlaDeliveryDate: new Date(now - 1 * day).toISOString(),
      slaGuaranteedDeliveryDate: new Date(now - 1 * day).toISOString(),
      revisionCount: 1,
      maxRevisionsAllowed: 3,
      revisionHistory: [],
      isSlaMet: true,
      trackingNumber: '3DM-6620599-US',
      trackingCarrier: 'FedEx Express',
      receiptConfirmation: {
        confirmedAt: new Date(now - 1 * day).toISOString(),
        matchesOrder: true,
        satisfactionRating: 5,
        feedbackNotes: 'The luminescent glow under dark room lighting is unbelievable!',
      }
    }
  ];
}

function ensureStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const data = JSON.parse(raw) as StoreData;
      if (data && Array.isArray(data.orders)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Error reading store file, reinitializing:', err);
  }

  const initialStore: StoreData = {
    orders: generateSeedOrders(),
    chats: INITIAL_CHATS,
    reviews: INITIAL_REVIEWS,
  };

  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write store file:', err);
  }

  return initialStore;
}

function saveStore(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store file:', err);
  }
}

export function getOrders(): CustomerOrder[] {
  const store = ensureStore();
  return store.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrderById(id: string): CustomerOrder | null {
  const store = ensureStore();
  return store.orders.find(o => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase()) || null;
}

export function createOrder(orderData: Omit<CustomerOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): CustomerOrder {
  const store = ensureStore();
  const id = `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();

  const newOrder: CustomerOrder = {
    ...orderData,
    id,
    orderNumber,
    createdAt: now,
    updatedAt: now,
    status: 'admin_review',
  };

  store.orders.unshift(newOrder);
  saveStore(store);
  return newOrder;
}

export function updateOrder(id: string, updates: Partial<CustomerOrder>): CustomerOrder | null {
  const store = ensureStore();
  const index = store.orders.findIndex(o => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
  
  if (index === -1) return null;

  store.orders[index] = {
    ...store.orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveStore(store);
  return store.orders[index];
}

// Phase 1: Admin Approves Request with Actual Price & Actual SLA Date
export function approveOrderWithFinalPriceAndSla(
  orderId: string,
  actualPrice: number,
  actualSlaDate: string,
  notes?: string
): CustomerOrder | null {
  const order = getOrderById(orderId);
  if (!order) return null;

  const priceChanged = Math.abs(actualPrice - order.estimatedPrice) > 0.01;
  const newStatus: OrderStatus = priceChanged ? 'price_adjusted_pending_customer' : 'printing';

  const updatedPricing = calculateProfitPrice({
    widthCm: order.modelGeometry.widthCm,
    heightCm: order.modelGeometry.heightCm,
    depthCm: order.modelGeometry.depthCm,
    infillPercent: order.modelGeometry.infillPercent,
    material: order.material,
    shippingOption: order.shippingOption,
    customPriceOverride: actualPrice - order.shippingOption.price,
    overrideReason: notes || 'Admin final mesh engineering calibration',
  });

  return updateOrder(order.id, {
    status: newStatus,
    actualPrice,
    actualSlaDeliveryDate: actualSlaDate,
    slaGuaranteedDeliveryDate: actualSlaDate,
    adminApprovalNotes: notes,
    adminApprovedAt: new Date().toISOString(),
    pricing: updatedPricing,
  });
}

// Phase 1: Customer Accepts Price Adjustment
export function customerAcceptPriceAdjustment(orderId: string): CustomerOrder | null {
  const order = getOrderById(orderId);
  if (!order) return null;

  return updateOrder(order.id, {
    status: 'printing',
  });
}

// Phase 3: Customer Confirms Receiving Product & Matches Order
export function customerConfirmReceipt(
  orderId: string,
  matchesOrder: boolean,
  satisfactionRating?: number,
  feedbackNotes?: string
): CustomerOrder | null {
  const order = getOrderById(orderId);
  if (!order) return null;

  return updateOrder(order.id, {
    status: 'completed',
    receiptConfirmation: {
      confirmedAt: new Date().toISOString(),
      matchesOrder,
      satisfactionRating: satisfactionRating || 5,
      feedbackNotes,
    },
  });
}

// Refund Flow
export function requestRefund(orderId: string, reason: string): CustomerOrder | null {
  const order = getOrderById(orderId);
  if (!order) return null;

  return updateOrder(order.id, {
    status: 'refund_requested',
    refundRequest: {
      requestedAt: new Date().toISOString(),
      reason,
      status: 'pending',
      refundAmount: order.pricing.totalPrice,
    },
  });
}

export function resolveRefund(orderId: string, approved: boolean, adminResponse: string): CustomerOrder | null {
  const order = getOrderById(orderId);
  if (!order || !order.refundRequest) return null;

  const newStatus: OrderStatus = approved ? 'refund_approved' : 'refund_rejected';

  return updateOrder(order.id, {
    status: newStatus,
    refundRequest: {
      ...order.refundRequest,
      status: approved ? 'approved' : 'rejected',
      adminResponse,
      resolvedAt: new Date().toISOString(),
    },
  });
}

export function overrideOrderPrice(orderId: string, newSubtotal: number, reason: string): CustomerOrder | null {
  const store = ensureStore();
  const order = store.orders.find(o => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase());
  
  if (!order) return null;

  const newPricing = calculateProfitPrice({
    widthCm: order.modelGeometry.widthCm,
    heightCm: order.modelGeometry.heightCm,
    depthCm: order.modelGeometry.depthCm,
    infillPercent: order.modelGeometry.infillPercent,
    material: order.material,
    shippingOption: order.shippingOption,
    customPriceOverride: newSubtotal,
    overrideReason: reason,
  });

  return updateOrder(order.id, {
    pricing: newPricing,
    actualPrice: newPricing.totalPrice,
    adminNotes: `${order.adminNotes ? order.adminNotes + ' | ' : ''}Price adjusted to $${newSubtotal.toFixed(2)} by Admin: ${reason}`,
  });
}

// Dynamically retrieves all customer designs stored in the database for the trust gallery
export function getGalleryDesigns(): GalleryDesignItem[] {
  const orders = getOrders();
  
  return orders.map((o) => {
    const city = o.shippingAddress?.city || 'Verified Buyer';
    const state = o.shippingAddress?.state || 'US';
    const location = `${city}, ${state}`;

    // Extract title from prompt
    const cleanPrompt = o.prompt.trim();
    const title = cleanPrompt.length > 35 ? cleanPrompt.slice(0, 35) + '...' : cleanPrompt;

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      title,
      prompt: o.prompt,
      style: o.style,
      modelGeometry: o.modelGeometry,
      material: o.material,
      customerName: o.customerName || 'Verified Customer',
      customerLocation: location,
      rating: o.receiptConfirmation?.satisfactionRating || 5,
      reviewText: o.receiptConfirmation?.feedbackNotes || `Custom 3D sculpture printed in ${o.material.name} with micron precision.`,
      specs: `${o.modelGeometry.heightCm}cm Height • ${o.pricing.estimatedWeightGrams}g • ${o.material.name}`,
      createdAt: o.createdAt,
      isVerifiedPrint: true,
      status: o.status,
    };
  });
}

export function getChatMessages(orderId?: string): ChatMessage[] {
  const store = ensureStore();
  if (orderId) {
    return store.chats.filter(c => c.orderId === orderId || !c.orderId);
  }
  return store.chats;
}

export function addChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const store = ensureStore();
  const newMsg: ChatMessage = {
    ...msg,
    id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };

  store.chats.push(newMsg);
  saveStore(store);
  return newMsg;
}

export function getReviews(): ShowcaseReview[] {
  const store = ensureStore();
  return store.reviews;
}

export function getAdminProfitAnalytics() {
  const orders = getOrders();
  const activeOrders = orders.filter(o => o.status !== 'refund_approved');

  let totalGrossRevenue = 0;
  let totalCogs = 0;
  let totalProfit = 0;
  let totalMaterialsGrams = 0;
  let totalPrintHours = 0;

  for (const o of activeOrders) {
    totalGrossRevenue += o.pricing.totalPrice;
    totalCogs += o.pricing.cogsTotal;
    totalProfit += o.pricing.profitMarginAmount;
    totalMaterialsGrams += o.pricing.estimatedWeightGrams;
    totalPrintHours += o.pricing.printTimeHours;
  }

  const averageMarginPercent = totalGrossRevenue > 0
    ? Number(((totalProfit / totalGrossRevenue) * 100).toFixed(1))
    : 0;

  const ordersAtRiskSLA = activeOrders.filter(o => {
    const deadline = new Date(o.slaGuaranteedDeliveryDate).getTime();
    const now = Date.now();
    const remainingDays = (deadline - now) / (1000 * 3600 * 24);
    return remainingDays <= 3 && o.status !== 'completed' && o.status !== 'delivered_pending_confirmation';
  });

  const pendingAdminReviewCount = orders.filter(o => o.status === 'admin_review').length;
  const pendingRefundsCount = orders.filter(o => o.status === 'refund_requested').length;

  return {
    totalOrdersCount: orders.length,
    activeOrdersCount: activeOrders.length,
    pendingAdminReviewCount,
    pendingRefundsCount,
    totalGrossRevenue: Number(totalGrossRevenue.toFixed(2)),
    totalCogs: Number(totalCogs.toFixed(2)),
    totalProfit: Number(totalProfit.toFixed(2)),
    averageMarginPercent,
    totalMaterialsGrams,
    totalPrintHours: Number(totalPrintHours.toFixed(1)),
    ordersAtRiskSLA: ordersAtRiskSLA.length,
  };
}
