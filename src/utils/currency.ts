import { CouponCode } from '../types';

export function formatBDT(amount: number): string {
  const rounded = Math.round(amount);
  return `৳${rounded.toLocaleString('en-BD')}`;
}

export function getDiscountPercentage(price: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export const FREE_DHAKA_DELIVERY_THRESHOLD = 2000;
export const DHAKA_SHIPPING_FEE = 70;
export const OUTSIDE_DHAKA_SHIPPING_FEE = 130;

export function calculateShippingFee(subtotalAfterDiscount: number, city: string): number {
  if (subtotalAfterDiscount <= 0) return 0;
  const isDhaka = city.trim().toLowerCase() === 'dhaka';
  if (isDhaka && subtotalAfterDiscount >= FREE_DHAKA_DELIVERY_THRESHOLD) {
    return 0;
  }
  return isDhaka ? DHAKA_SHIPPING_FEE : OUTSIDE_DHAKA_SHIPPING_FEE;
}

export const DEMO_COUPONS: CouponCode[] = [
  {
    code: 'AVADO10',
    type: 'percentage',
    value: 10,
    minSubtotal: 800,
    description: '10% off orders of ৳800 or more',
  },
  {
    code: 'GLOW200',
    type: 'fixed',
    value: 200,
    minSubtotal: 1500,
    description: '৳200 instant savings on orders of ৳1,500+',
  },
  {
    code: 'DHAKA15',
    type: 'percentage',
    value: 15,
    minSubtotal: 3000,
    description: '15% off luxury baskets of ৳3,000+',
  },
];

export function evaluateCoupon(
  rawCode: string,
  subtotal: number
): { valid: boolean; discount: number; coupon?: CouponCode; message: string } {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, discount: 0, message: 'Enter a coupon code to apply.' };
  }

  const found = DEMO_COUPONS.find((c) => c.code === normalized);
  if (!found) {
    return {
      valid: false,
      discount: 0,
      message: 'Invalid code. Try AVADO10, GLOW200, or DHAKA15.',
    };
  }

  if (subtotal < found.minSubtotal) {
    return {
      valid: false,
      discount: 0,
      message: `Code ${found.code} requires a minimum subtotal of ${formatBDT(found.minSubtotal)}.`,
    };
  }

  const discount =
    found.type === 'percentage'
      ? Math.round((subtotal * found.value) / 100)
      : Math.min(found.value, subtotal);

  return {
    valid: true,
    discount,
    coupon: found,
    message: `${found.code} applied — ${found.description}.`,
  };
}
