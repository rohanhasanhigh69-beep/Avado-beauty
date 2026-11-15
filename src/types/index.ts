export type SkinType = 'All Skin' | 'Oily' | 'Dry' | 'Sensitive' | 'Combination';

export type CollectionGroup = 'skincare' | 'makeup' | 'body-hair' | 'accessories';

export interface ProductVariant {
  id: string;
  label: string;
  swatch?: string;
  priceDelta?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  skinType: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  collection: CollectionGroup;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  skinTypes: SkinType[];
  productType: string;
  variants: ProductVariant[];
  images: string[];
  shortBenefit: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isSpecialOffer?: boolean;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  collection: CollectionGroup;
  tagline: string;
  image: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  variantLabel: string;
  quantity: number;
}

export interface CouponCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSubtotal: number;
  description: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';

export interface DemoOrderItem {
  productId: string;
  name: string;
  brand: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface DemoOrder {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  items: DemoOrderItem[];
}

export interface BeautyTip {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  image: string;
  steps: string[];
  recommendedProductIds: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  productBought: string;
  beforeAfter: string;
  quote: string;
  rating: number;
}
