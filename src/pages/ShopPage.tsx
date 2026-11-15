import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { SkinType } from '../types';
import { formatBDT } from '../utils/currency';
import { ProductCard } from '../components/ProductCard';

type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(
    categorySlug ?? searchParams.get('category') ?? 'all'
  );
  const [selectedCollection, setSelectedCollection] = useState(
    searchParams.get('collection') ?? 'all'
  );
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') ?? 'all');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [selectedProductType, setSelectedProductType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(searchParams.get('sale') === 'true');
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'popular'
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL params / route changes cleanly
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
      setSelectedCollection('all');
    } else {
      const catParam = searchParams.get('category');
      setSelectedCategory(catParam ?? 'all');
      setSelectedCollection(searchParams.get('collection') ?? 'all');
    }
    setSelectedBrand(searchParams.get('brand') ?? 'all');
    setSearchQuery(searchParams.get('q') ?? '');
    setOnSaleOnly(searchParams.get('sale') === 'true');
    const sortParam = searchParams.get('sort') as SortOption | null;
    if (sortParam) setSortBy(sortParam);
  }, [categorySlug, searchParams]);

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
  }, []);

  const uniqueProductTypes = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.productType))).sort();
  }, []);

  const skinTypeOptions: ('all' | SkinType)[] = [
    'all',
    'All Skin',
    'Oily',
    'Dry',
    'Sensitive',
    'Combination',
  ];

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;
      if (selectedCollection !== 'all' && p.collection !== selectedCollection) return false;
      if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase())
        return false;
      if (
        selectedSkinType !== 'all' &&
        !p.skinTypes.includes(selectedSkinType as SkinType)
      )
        return false;
      if (selectedProductType !== 'all' && p.productType !== selectedProductType) return false;

      const effectivePrice = p.discountPrice ?? p.price;
      if (effectivePrice > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (onSaleOnly && !(p.discountPrice && p.discountPrice < p.price)) return false;

      if (q) {
        const hay = `${p.name} ${p.brand} ${p.category} ${p.shortBenefit}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;
      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'rating':
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case 'newest':
          return Number(Boolean(b.isNewArrival)) - Number(Boolean(a.isNewArrival)) || b.reviewCount - a.reviewCount;
        case 'popular':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedCollection,
    selectedBrand,
    selectedSkinType,
    selectedProductType,
    maxPrice,
    minRating,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  const activeCategoryMeta = CATEGORIES.find((c) => c.slug === selectedCategory);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedBrand('all');
    setSelectedSkinType('all');
    setSelectedProductType('all');
    setMaxPrice(3000);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedCollection !== 'all' ||
    selectedBrand !== 'all' ||
    selectedSkinType !== 'all' ||
    selectedProductType !== 'all' ||
    maxPrice < 3000 ||
    minRating > 0 ||
    inStockOnly ||
    onSaleOnly;

  const filterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1F171C] flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#9E4D5D]" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E4D5D] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Collection */}
      <div className="space-y-2 border-t border-[#EADEE2] pt-4">
        <label htmlFor="filter-collection" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
          Department
        </label>
        <select
          id="filter-collection"
          value={selectedCollection}
          onChange={(e) => {
            setSelectedCollection(e.target.value);
            setSelectedCategory('all');
          }}
          className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] bg-white text-sm text-[#1F171C] focus:outline-none focus:border-[#9E4D5D]"
        >
          <option value="all">All Departments</option>
          <option value="skincare">Skincare</option>
          <option value="makeup">Makeup</option>
          <option value="body-hair">Body &amp; Hair Care</option>
          <option value="accessories">Beauty Accessories</option>
        </select>
      </div>

      {/* Category */}
      <div className="space-y-2 border-t border-[#EADEE2] pt-4">
        <label htmlFor="filter-category" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
          Category
        </label>
        <select
          id="filter-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] bg-white text-sm text-[#1F171C] focus:outline-none focus:border-[#9E4D5D]"
        >
          <option value="all">All Categories (16)</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="space-y-2 border-t border-[#EADEE2] pt-4">
        <label htmlFor="filter-brand" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
          Brand
        </label>
        <select
          id="filter-brand"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] bg-white text-sm text-[#1F171C] focus:outline-none focus:border-[#9E4D5D]"
        >
          <option value="all">All Brands</option>
          {uniqueBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 border-t border-[#EADEE2] pt-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
          <span>Max Price</span>
          <span className="text-[#1F171C] tabular-nums">{formatBDT(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={250}
          max={3000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price in BDT"
          className="w-full accent-[#9E4D5D] cursor-pointer"
        />
        <div className="flex flex-wrap gap-1.5">
          {[600, 1200, 2000, 3000].map((cap) => (
            <button
              key={cap}
              type="button"
              onClick={() => setMaxPrice(cap)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer tabular-nums ${
                maxPrice === cap
                  ? 'bg-[#9E4D5D] border-[#9E4D5D] text-white'
                  : 'bg-white border-[#EADEE2] text-[#5A4A52] hover:border-[#9E4D5D]'
              }`}
            >
              {cap === 3000 ? 'All' : `≤ ${formatBDT(cap)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Type */}
      <div className="space-y-2 border-t border-[#EADEE2] pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
          Skin Type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {skinTypeOptions.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedSkinType(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                selectedSkinType === st
                  ? 'bg-[#9E4D5D] border-[#9E4D5D] text-white'
                  : 'bg-white border-[#EADEE2] text-[#5A4A52] hover:border-[#9E4D5D]'
              }`}
            >
              {st === 'all' ? 'Any' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Product Type */}
      <div className="space-y-2 border-t border-[#EADEE2] pt-4">
        <label htmlFor="filter-product-type" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
          Product Formula
        </label>
        <select
          id="filter-product-type"
          value={selectedProductType}
          onChange={(e) => setSelectedProductType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] bg-white text-sm text-[#1F171C] focus:outline-none focus:border-[#9E4D5D]"
        >
          <option value="all">All Formulas</option>
          {uniqueProductTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Rating & Availability */}
      <div className="space-y-3 border-t border-[#EADEE2] pt-4">
        <label htmlFor="filter-rating" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
          Minimum Rating
        </label>
        <select
          id="filter-rating"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] bg-white text-sm text-[#1F171C] focus:outline-none focus:border-[#9E4D5D]"
        >
          <option value={0}>All Ratings</option>
          <option value={4.5}>4.5★ &amp; above</option>
          <option value={4.8}>4.8★ &amp; above</option>
        </select>

        <label className="flex items-center gap-2.5 text-sm text-[#1F171C] pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => setOnSaleOnly(e.target.checked)}
            className="w-4 h-4 accent-[#9E4D5D] rounded"
          />
          <span>Special Offers / Discounted</span>
        </label>

        <label className="flex items-center gap-2.5 text-sm text-[#1F171C] cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-[#9E4D5D] rounded"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Page Header */}
      <div className="pb-8 border-b border-[#EADEE2] mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-2">
          Avado Beauty Catalog
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
              {activeCategoryMeta
                ? activeCategoryMeta.name
                : selectedBrand !== 'all'
                ? `${selectedBrand} Collection`
                : selectedCollection === 'skincare'
                ? 'Skincare Collection'
                : selectedCollection === 'makeup'
                ? 'Makeup & Color Collection'
                : onSaleOnly
                ? 'Special Offers & Savings'
                : 'All Beauty & Skincare'}
            </h1>
            <p className="text-sm text-[#5A4A52] mt-1.5 max-w-2xl">
              {activeCategoryMeta
                ? activeCategoryMeta.tagline
                : 'Authentic global skincare, sunscreens, serums, and long-wear cosmetics priced in Bangladeshi Taka (৳).'}
            </p>
          </div>

          <p className="text-sm font-medium text-[#5A4A52] tabular-nums shrink-0">
            Showing <strong className="text-[#1F171C]">{filteredProducts.length}</strong> of {PRODUCTS.length} products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 bg-white border border-[#EADEE2] rounded-2xl p-6">
            {filterPanel}
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Search + Sort + Mobile Filter Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-[#5A4A52] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, brand, or ingredient..."
                aria-label="Search products"
                className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-[#EADEE2] bg-white text-sm text-[#1F171C] placeholder:text-[#5A4A52]/70 focus:outline-none focus:border-[#9E4D5D]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#5A4A52] hover:text-[#1F171C] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#EADEE2] bg-white text-sm font-semibold text-[#1F171C] hover:border-[#9E4D5D] cursor-pointer"
              >
                <Filter className="w-4 h-4 text-[#9E4D5D]" />
                Filters
              </button>

              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <label htmlFor="sort-select" className="text-xs font-semibold text-[#5A4A52] whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg border border-[#EADEE2] bg-white text-sm font-medium text-[#1F171C] focus:outline-none focus:border-[#9E4D5D]"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid or No Results */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#EADEE2] rounded-2xl p-12 text-center space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
                No matching products found
              </h2>
              <p className="text-sm text-[#5A4A52] max-w-md mx-auto">
                We couldn’t find items matching your current filters. Try raising the maximum BDT price or clearing active category/brand selections.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Product Filters">
          <div
            className="fixed inset-0 bg-[#1F171C]/45 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative bg-[#FDFBF9] w-full max-w-xs h-full overflow-y-auto p-6 shadow-2xl border-r border-[#EADEE2]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-lg font-semibold text-[#1F171C]">
                Refine Results
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1.5 rounded-full text-[#5A4A52] hover:bg-[#F9F0F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
