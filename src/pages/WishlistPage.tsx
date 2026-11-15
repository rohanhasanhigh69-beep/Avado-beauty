import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useStore();

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="pb-6 border-b border-[#EADEE2] mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-1.5">
            Saved Routine Favorites
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
            Your Wishlist ({savedProducts.length})
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-sm font-semibold text-[#9E4D5D] hover:underline whitespace-nowrap shrink-0"
        >
          Browse Catalog →
        </Link>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-white border border-[#EADEE2] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F9F0F2] text-[#9E4D5D] flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
            No saved favorites yet
          </h2>
          <p className="text-sm text-[#5A4A52]">
            Tap the heart icon on any cleanser, sunscreen, serum, or lipstick to keep it handy in your browser.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
