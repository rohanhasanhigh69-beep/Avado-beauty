import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { formatBDT } from '../utils/currency';
import { SafeImage } from './SafeImage';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setIsSearchOpen]);

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 6);
    }
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.brand.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.shortBenefit.toLowerCase().includes(trimmed)
    ).slice(0, 8);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    navigate(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search Avado Beauty"
    >
      <div
        className="fixed inset-0 bg-[#1F171C]/50 backdrop-blur-xs"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative bg-[#FDFBF9] border border-[#EADEE2] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 bg-white border-b border-[#EADEE2]">
          <Search className="w-5 h-5 text-[#9E4D5D] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CeraVe, COSRX, sunscreen, Fit Me foundation..."
            className="flex-1 text-sm sm:text-base text-[#1F171C] placeholder:text-[#5A4A52]/70 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[#5A4A52] hover:text-[#1F171C] cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="p-1.5 rounded-full text-[#5A4A52] hover:bg-[#F9F0F2] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        <div className="p-5 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
              {query.trim() ? `Results for "${query.trim()}"` : 'Popular Searches'}
            </span>
            <Link
              to={`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`}
              onClick={() => setIsSearchOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E4D5D] hover:underline"
            >
              View in Shop <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {matches.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-[#1F171C]">
                No matching cosmetics or skincare found.
              </p>
              <p className="text-xs text-[#5A4A52] mt-1">
                Try searching for a brand like Beauty of Joseon, Simple, Garnier, or Maybelline.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matches.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#EADEE2] hover:border-[#9E4D5D] transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#F9F0F2]">
                    <SafeImage src={product.images[0]} alt={product.name} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-wider text-[#5A4A52] truncate">
                      {product.brand} · {product.category}
                    </p>
                    <p className="text-sm font-semibold text-[#1F171C] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs font-semibold text-[#9E4D5D] tabular-nums mt-0.5">
                      {formatBDT(product.discountPrice ?? product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
