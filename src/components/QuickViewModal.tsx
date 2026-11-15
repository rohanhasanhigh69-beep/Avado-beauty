import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Heart, Minus, Plus, ShoppingBag, Star, X } from 'lucide-react';
import { getItemUnitPrice, useStore } from '../context/StoreContext';
import { formatBDT, getDiscountPercentage } from '../utils/currency';
import { SafeImage } from './SafeImage';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedVariantId(quickViewProduct.variants[0]?.id ?? '');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickViewProduct(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const wished = isInWishlist(quickViewProduct.id);
  const unitPrice = getItemUnitPrice(quickViewProduct, selectedVariantId);
  const baseDelta =
    quickViewProduct.variants.find((v) => v.id === selectedVariantId)?.priceDelta ?? 0;
  const originalPrice = Math.max(50, quickViewProduct.price + baseDelta);
  const discountPct = getDiscountPercentage(originalPrice, unitPrice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${quickViewProduct.name}`}
    >
      <div
        className="fixed inset-0 bg-[#1F171C]/50 backdrop-blur-xs"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative bg-[#FDFBF9] border border-[#EADEE2] rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white border border-[#EADEE2] flex items-center justify-center text-[#1F171C] hover:text-[#9E4D5D] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="aspect-[4/3] md:aspect-auto md:h-full bg-[#F9F0F2]">
          <SafeImage
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            className="w-full h-full"
          />
        </div>

        <div className="p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#5A4A52] font-medium">
              <span>{quickViewProduct.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{quickViewProduct.category}</span>
            </div>

            <h2 className="font-display text-2xl font-semibold text-[#1F171C] leading-snug">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 font-medium text-[#1F171C] tabular-nums">
                <Star className="w-4 h-4 fill-[#C88D96] text-[#C88D96]" aria-hidden="true" />
                {quickViewProduct.rating.toFixed(1)}
              </span>
              <span className="text-[#5A4A52] tabular-nums">
                ({quickViewProduct.reviewCount} reviews)
              </span>
              <span className="text-[#5A4A52]">·</span>
              <span className="text-emerald-700 font-medium text-xs">
                {quickViewProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 tabular-nums pt-1">
              <span className="text-2xl font-semibold text-[#1F171C]">
                {formatBDT(unitPrice)}
              </span>
              {discountPct > 0 && (
                <>
                  <span className="text-sm text-[#5A4A52] line-through">
                    {formatBDT(originalPrice)}
                  </span>
                  <span className="text-xs font-semibold text-[#9E4D5D]">
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-[#5A4A52] leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Variants */}
            {quickViewProduct.variants.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-2">
                  Option / Shade
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.variants.map((variant) => {
                    const active = variant.id === selectedVariantId;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#9E4D5D] bg-[#F9F0F2] text-[#1F171C]'
                            : 'border-[#EADEE2] bg-white text-[#5A4A52] hover:border-[#C88D96]'
                        }`}
                      >
                        {variant.swatch && (
                          <span
                            className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: variant.swatch }}
                          />
                        )}
                        <span>{variant.label}</span>
                        {active && <Check className="w-3 h-3 text-[#9E4D5D]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-[#EADEE2]">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-[#EADEE2] rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-10 flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-semibold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="w-9 h-10 flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(quickViewProduct, selectedVariantId, quantity, true);
                  setQuickViewProduct(null);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#9E4D5D] hover:bg-[#833C4B] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id, quickViewProduct.name)}
                aria-label="Toggle wishlist"
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                  wished
                    ? 'bg-[#F9F0F2] border-[#9E4D5D] text-[#9E4D5D]'
                    : 'bg-white border-[#EADEE2] text-[#1F171C] hover:border-[#9E4D5D]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${quickViewProduct.slug}`}
              onClick={() => setQuickViewProduct(null)}
              className="block text-center text-xs font-semibold text-[#9E4D5D] hover:underline py-1"
            >
              View Full Product Details &amp; Ingredients →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
