import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { getItemUnitPrice, useStore } from '../context/StoreContext';
import {
  FREE_DHAKA_DELIVERY_THRESHOLD,
  formatBDT,
} from '../utils/currency';
import { SafeImage } from './SafeImage';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartSubtotal,
    couponCode,
    couponDiscount,
    applyCoupon,
    clearCoupon,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const remainingForFreeDhaka = Math.max(0, FREE_DHAKA_DELIVERY_THRESHOLD - cartSubtotal);
  const progressPct = Math.min(100, Math.round((cartSubtotal / FREE_DHAKA_DELIVERY_THRESHOLD) * 100));
  const netSubtotal = Math.max(0, cartSubtotal - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    if (res.valid) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      <div
        className="fixed inset-0 bg-[#1F171C]/45 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <aside className="relative w-full max-w-md bg-[#FDFBF9] h-full shadow-2xl flex flex-col border-l border-[#EADEE2]">
        <div className="px-6 py-4 border-b border-[#EADEE2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#9E4D5D]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-[#1F171C]">Your Beauty Bag</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping bag"
            className="p-2 rounded-full text-[#5A4A52] hover:text-[#1F171C] hover:bg-[#F9F0F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery bar */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-[#F9F0F2] border-b border-[#EADEE2]">
            <p className="text-xs text-[#1F171C] font-medium mb-1.5">
              {remainingForFreeDhaka === 0
                ? 'You unlocked Free Dhaka Delivery!'
                : `Add ${formatBDT(remainingForFreeDhaka)} more for Free Dhaka Delivery`}
            </p>
            <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9E4D5D] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F9F0F2] flex items-center justify-center text-[#9E4D5D] mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#1F171C] mb-2">
                Your bag is empty
              </h3>
              <p className="text-sm text-[#5A4A52] max-w-xs mb-6">
                Explore dermatologist-approved skincare, SPF50+ sunscreens, and long-wear makeup.
              </p>
              <Link
                to="/shop"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            cart.map((item) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              if (!product) return null;
              const unitPrice = getItemUnitPrice(product, item.variantId);

              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 bg-white border border-[#EADEE2] rounded-xl p-3.5"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#F9F0F2]"
                  >
                    <SafeImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#5A4A52] font-medium">
                          {product.brand}
                        </p>
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-[#1F171C] hover:text-[#9E4D5D] line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-[#5A4A52] mt-0.5">{item.variantLabel}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        aria-label={`Remove ${product.name}`}
                        className="p-1 text-[#5A4A52] hover:text-[#9E4D5D] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#EADEE2] rounded-lg bg-[#FDFBF9]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#1F171C] tabular-nums">
                        {formatBDT(unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary & Actions */}
        {cart.length > 0 && (
          <div className="border-t border-[#EADEE2] bg-white px-6 py-5 space-y-4">
            {couponCode ? (
              <div className="flex items-center justify-between bg-[#F4F1F8] px-3 py-2 rounded-lg text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#1F171C]">
                  <Tag className="w-3.5 h-3.5 text-[#9E4D5D]" />
                  Coupon <strong>{couponCode}</strong> applied (-{formatBDT(couponDiscount)})
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
                  placeholder="Promo code (try AVADO10)"
                  className="flex-1 px-3 py-2 rounded-lg border border-[#EADEE2] text-xs focus:outline-none focus:border-[#9E4D5D]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg border border-[#1F171C] text-xs font-semibold text-[#1F171C] hover:bg-[#1F171C] hover:text-white transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5A4A52]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatBDT(cartSubtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatBDT(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-[#1F171C] pt-1 border-t border-[#EADEE2]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatBDT(netSubtotal)}</span>
              </div>
              <p className="text-[11px] text-[#5A4A52]">
                Shipping (৳70 Dhaka / ৳130 Nationwide) calculated at checkout.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="text-center py-2.5 px-4 rounded-lg border border-[#EADEE2] text-sm font-semibold text-[#1F171C] hover:bg-[#F9F0F2] transition-colors"
              >
                View Bag
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="text-center py-2.5 px-4 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
