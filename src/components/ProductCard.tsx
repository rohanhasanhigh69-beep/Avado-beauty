import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { formatBDT, getDiscountPercentage } from '../utils/currency';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const wished = isInWishlist(product.id);
  const discountPct = getDiscountPercentage(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice ?? product.price;

  return (
    <article className="group flex flex-col bg-white border border-[#EADEE2] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(31,23,28,0.12)]">
      {/* Image Canvas (68% of card focus) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F9F0F2]">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <SafeImage
            src={product.images[0]}
            alt={`${product.brand} ${product.name}`}
            fallbackLabel={product.name}
            className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Maximum 1 subtle corner indicator */}
        {discountPct > 0 ? (
          <span className="absolute top-3 left-3 bg-[#1F171C]/90 text-white text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-md tabular-nums">
            -{discountPct}%
          </span>
        ) : product.isNewArrival ? (
          <span className="absolute top-3 left-3 bg-white/95 text-[#1F171C] text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-md border border-[#EADEE2]">
            New
          </span>
        ) : null}

        {/* Action controls: Wishlist & Quick View */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id, product.name)}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
              wished
                ? 'bg-[#9E4D5D] border-[#9E4D5D] text-white'
                : 'bg-white/95 border-[#EADEE2] text-[#1F171C] hover:border-[#9E4D5D] hover:text-[#9E4D5D]'
            }`}
          >
            <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            aria-label={`Quick view ${product.name}`}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/95 border border-[#EADEE2] text-[#1F171C] hover:border-[#9E4D5D] hover:text-[#9E4D5D] transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Metadata & Actions */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#5A4A52] mb-1.5">
          <span className="truncate">
            {product.brand} · {product.category}
          </span>
          <span className="inline-flex items-center gap-1 text-[#1F171C] shrink-0 tabular-nums">
            <Star className="w-3 h-3 fill-[#C88D96] text-[#C88D96]" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="font-semibold text-[15px] leading-snug text-[#1F171C] hover:text-[#9E4D5D] transition-colors line-clamp-2 min-h-[2.6rem]"
        >
          {product.name}
        </Link>

        <p className="text-xs text-[#5A4A52] mt-1.5 line-clamp-1">
          {product.shortBenefit}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-[#EADEE2]/70">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-[16px] font-semibold text-[#1F171C]">
              {formatBDT(effectivePrice)}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-xs text-[#5A4A52] line-through">
                {formatBDT(product.price)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, product.variants[0]?.id, 1, false)}
            disabled={product.stock === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#9E4D5D] text-white hover:bg-[#833C4B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </article>
  );
};
