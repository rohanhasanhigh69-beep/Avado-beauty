import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2 } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { getItemUnitPrice, useStore } from '../context/StoreContext';
import {
  calculateShippingFee,
  DEMO_COUPONS,
  FREE_DHAKA_DELIVERY_THRESHOLD,
  formatBDT,
} from '../utils/currency';
import { SafeImage } from '../components/SafeImage';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    couponCode,
    couponDiscount,
    applyCoupon,
    clearCoupon,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [cityEstimate, setCityEstimate] = useState('Dhaka');

  const netSubtotal = Math.max(0, cartSubtotal - couponDiscount);
  const shippingFee = calculateShippingFee(netSubtotal, cityEstimate);
  const grandTotal = netSubtotal + shippingFee;
  const remainingFreeDhaka = Math.max(0, FREE_DHAKA_DELIVERY_THRESHOLD - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    if (res.valid) setCouponInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="pb-6 border-b border-[#EADEE2] mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-1.5">
            Avado Beauty Bag
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
            Shopping Bag
          </h1>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-[#5A4A52] hover:text-[#9E4D5D] underline cursor-pointer self-start sm:self-auto"
          >
            Clear All Items
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-[#EADEE2] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F9F0F2] text-[#9E4D5D] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
            Your beauty bag is currently empty
          </h2>
          <p className="text-sm text-[#5A4A52]">
            Add skincare serums, sunscreens, or everyday makeup staples to preview delivery charges and coupon savings in BDT.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#F9F0F2] border border-[#EADEE2] rounded-xl px-5 py-3.5 text-xs sm:text-sm text-[#1F171C] font-medium">
              {remainingFreeDhaka === 0
                ? 'Your basket qualifies for Free Delivery inside Dhaka!'
                : `Add ${formatBDT(remainingFreeDhaka)} more to unlock Free Delivery inside Dhaka (standard ৳70).`}
            </div>

            {cart.map((item) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              if (!product) return null;
              const unitPrice = getItemUnitPrice(product, item.variantId);

              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-[#EADEE2] rounded-2xl p-4 sm:p-5"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    className="w-full sm:w-28 aspect-[4/3] rounded-xl overflow-hidden bg-[#F9F0F2] shrink-0"
                  >
                    <SafeImage src={product.images[0]} alt={product.name} className="w-full h-full" />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-[11px] uppercase tracking-wider text-[#5A4A52] font-medium">
                      {product.brand} · {product.category}
                    </p>
                    <Link
                      to={`/product/${product.slug}`}
                      className="font-semibold text-base text-[#1F171C] hover:text-[#9E4D5D] transition-colors block"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-[#5A4A52]">
                      Option: <strong className="text-[#1F171C]">{item.variantLabel}</strong> · Unit:{' '}
                      <span className="tabular-nums">{formatBDT(unitPrice)}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EADEE2]">
                    <div className="inline-flex items-center border border-[#EADEE2] rounded-lg bg-[#FDFBF9]">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="w-9 h-9 flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="w-9 h-9 flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="text-base font-semibold text-[#1F171C] tabular-nums">
                        {formatBDT(unitPrice * item.quantity)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      aria-label={`Remove ${product.name}`}
                      className="p-2 text-[#5A4A52] hover:text-[#9E4D5D] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 bg-white border border-[#EADEE2] rounded-2xl p-6 space-y-5 sticky top-24">
            <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
              Order Summary
            </h2>

            {/* Coupon Box */}
            <div className="space-y-2 pb-4 border-b border-[#EADEE2]">
              {couponCode ? (
                <div className="flex items-center justify-between bg-[#F4F1F8] px-3.5 py-2.5 rounded-lg text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#1F171C]">
                    <Tag className="w-3.5 h-3.5 text-[#9E4D5D]" />
                    <strong>{couponCode}</strong> (-{formatBDT(couponDiscount)})
                  </span>
                  <button
                    type="button"
                    onClick={clearCoupon}
                    className="text-[#9E4D5D] font-semibold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg border border-[#1F171C] text-xs font-semibold text-[#1F171C] hover:bg-[#1F171C] hover:text-white transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              <div className="text-[11px] text-[#5A4A52] space-y-0.5 pt-1">
                <p className="font-semibold text-[#1F171C]">Available Demo Codes:</p>
                {DEMO_COUPONS.map((c) => (
                  <p key={c.code}>
                    <button
                      type="button"
                      onClick={() => applyCoupon(c.code)}
                      className="font-semibold text-[#9E4D5D] hover:underline cursor-pointer"
                    >
                      {c.code}
                    </button>{' '}
                    — {c.description}
                  </p>
                ))}
              </div>
            </div>

            {/* Delivery Estimator */}
            <div className="space-y-1.5">
              <label htmlFor="cart-city" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
                Delivery Zone Estimate
              </label>
              <select
                id="cart-city"
                value={cityEstimate}
                onChange={(e) => setCityEstimate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] text-sm bg-white focus:outline-none focus:border-[#9E4D5D]"
              >
                <option value="Dhaka">Inside Dhaka (৳70 · Free over ৳2,000)</option>
                <option value="Chattogram">Outside Dhaka — Chattogram / Sylhet / Nationwide (৳130)</option>
              </select>
            </div>

            <div className="space-y-2.5 text-sm pt-2 border-t border-[#EADEE2]">
              <div className="flex justify-between text-[#5A4A52]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatBDT(cartSubtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({couponCode})</span>
                  <span className="tabular-nums">-{formatBDT(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5A4A52]">
                <span>Estimated Shipping</span>
                <span className="tabular-nums">
                  {shippingFee === 0 ? 'Free' : formatBDT(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-[#1F171C] pt-3 border-t border-[#EADEE2]">
                <span>Total (BDT)</span>
                <span className="tabular-nums">{formatBDT(grandTotal)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-lg bg-[#9E4D5D] hover:bg-[#833C4B] text-white text-sm font-semibold transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};
