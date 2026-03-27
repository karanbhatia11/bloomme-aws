// Subscription Plan Types
export interface SubscriptionPlan {
  id: 'traditional' | 'divine' | 'celestial';
  name: string;
  price: number;
  description: string;
  features: string[];
  flowerWeight: number;
  varieties: number;
  packaging: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'active' | 'paused' | 'cancelled';
  deliveryDays: number[];
  startDate: Date;
  nextDeliveryDate?: Date;
  price?: number;
  createdAt: Date;
}

// Add-on Types
export interface AddOn {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: 'flowers' | 'essentials' | 'accessories';
  description: string;
}

export interface SelectedAddOn extends AddOn {
  selectedDays: number[];
  quantity: number;
  totalPrice: number;
}

// Checkout Types
export interface CheckoutFlow {
  type: 'subscription' | 'addons';
  currentStep: number;
  totalSteps: number;
  completed: boolean;
}

export interface OrderSummary {
  subscription?: {
    planId: string;
    planName: string;
    price: number;
    deliveryDays: number[];
  };
  addOns: SelectedAddOn[];
  subtotal: number;
  tax: number;
  promoCode?: string;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string | null;
  guestEmail?: string;
  guestPhone?: string;
  subscription?: OrderSummary['subscription'];
  addOns: SelectedAddOn[];
  subtotal: number;
  tax: number;
  promoCode?: string;
  promoDiscount: number;
  referralDiscount: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: Date;
  paidAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  referralCode: string;
  referralBalance: number;
  createdAt: Date;
}

// Promo Code Types
export interface PromoCode {
  code: string;
  discountAmount?: number;
  discountPercent?: number;
  valid: boolean;
}

// Referral Types
export interface ReferralBalance {
  balance: number;
  totalEarned: number;
  code: string;
}
