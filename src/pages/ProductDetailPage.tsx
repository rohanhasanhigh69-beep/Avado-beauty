import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { getItemUnitPrice, useStore } from '../context/StoreContext';
import { formatBDT, getDiscountPercentage } from '../utils/currency';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';

type DetailTab = 'overview' | 'ingredients' | 'usage' | 'reviews';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    recordRecentlyViewed,
    recentlyViewed,
    getProductReviews,
    addProductReview,
  } = useStore();

  const product = useMemo(
    () => PRODUCTS.find((p) => p.slug === slug),
    [slug]
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  // Review form state
  const [revName, setRevName] = useState('');
  const [revCity, setRevCity] = useState('Dhaka');
  const [revSkin, setRevSkin] = useState('Combination');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedVariantId(product.variants[0]?.id ?? '');
      setQuantity(1);
      setActiveTab('overview');
      recordRecentlyViewed(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-semibold text-[#1F171C]">
          Product Not Found
        </h1>
        <p className="text-sm text-[#5A4A52]">
          This beauty product may have moved or been discontinued.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const wished = isInWishlist(product.id);
  const unitPrice = getItemUnitPrice(product, selectedVariantId);
  const baseDelta =
    product.variants.find((v) => v.id === selectedVariantId)?.priceDelta ?? 0;
  const originalPrice = Math.max(50, product.price + baseDelta);
  const discountPct = getDiscountPercentage(originalPrice, unitPrice);
  const reviews = getProductReviews(product.id);

  const relatedProducts = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.categorySlug === product.categorySlug || p.brand === product.brand)
  ).slice(0, 3);

  const recentProducts = recentlyViewed
    .filter((id) => id !== product.id)
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;
    addProductReview(product.id, {
      author: revName.trim(),
      location: revCity.trim() || 'Dhaka',
      skinType: revSkin,
      rating: revRating,
      comment: revComment.trim(),
    });
    setRevName('');
    setRevComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#5A4A52] mb-6 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-[#1F171C]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to="/shop" className="hover:text-[#1F171C]">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to={`/category/${product.categorySlug}`} className="hover:text-[#1F171C]">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[#1F171C] font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Sticky Gallery Left */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#EADEE2] bg-[#F9F0F2]">
            <SafeImage
              src={product.images[activeImageIdx] ?? product.images[0]}
              alt={`${product.brand} ${product.name}`}
              className="w-full h-full"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-[#9E4D5D]'
                      : 'border-[#EADEE2] opacity-75 hover:opacity-100'
                  }`}
                >
                  <SafeImage src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module Right */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3 pb-5 border-b border-[#EADEE2]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9E4D5D]">
              <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="hover:underline">
                {product.brand}
              </Link>{' '}
              · {product.category} · {product.productType}
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C] leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 font-semibold text-[#1F171C] tabular-nums">
                <Star className="w-4 h-4 fill-[#C88D96] text-[#C88D96]" aria-hidden="true" />
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[#5A4A52] tabular-nums">
                {product.reviewCount + reviews.length} reviews
              </span>
              <span className="text-[#5A4A52]">·</span>
              <span className="text-xs font-semibold text-emerald-700">
                {product.stock > 0 ? `In Stock (${product.stock} ready)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 pt-2 tabular-nums">
              <span className="text-3xl font-semibold text-[#1F171C]">
                {formatBDT(unitPrice)}
              </span>
              {discountPct > 0 && (
                <>
                  <span className="text-lg text-[#5A4A52] line-through">
                    {formatBDT(originalPrice)}
                  </span>
                  <span className="text-xs font-semibold text-[#9E4D5D]">
                    Save {discountPct}% ({formatBDT(originalPrice - unitPrice)})
                  </span>
                </>
              )}
            </div>

            <p className="text-sm sm:text-base text-[#5A4A52] leading-relaxed pt-1">
              {product.shortBenefit}. {product.description}
            </p>
          </div>

          {/* Skin Type & Variants */}
          <div className="space-y-4">
            <div className="text-xs text-[#5A4A52]">
              <span className="font-semibold text-[#1F171C]">Suitable for:</span>{' '}
              {product.skinTypes.join(', ')}
            </div>

            {product.variants.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-2">
                  Select Option / Shade
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((variant) => {
                    const active = variant.id === selectedVariantId;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#9E4D5D] bg-[#F9F0F2] text-[#1F171C]'
                            : 'border-[#EADEE2] bg-white text-[#5A4A52] hover:border-[#C88D96]'
                        }`}
                      >
                        {variant.swatch && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: variant.swatch }}
                          />
                        )}
                        <span>{variant.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-[#9E4D5D]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Buy Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center border border-[#EADEE2] rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-11 h-12 flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="w-11 h-12 flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => addToCart(product, selectedVariantId, quantity, true)}
                className="flex-1 min-w-[160px] h-12 inline-flex items-center justify-center gap-2 px-6 rounded-lg bg-[#9E4D5D] hover:bg-[#833C4B] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, selectedVariantId, quantity, false);
                  navigate('/checkout');
                }}
                className="h-12 px-5 rounded-lg border border-[#1F171C] text-[#1F171C] text-sm font-semibold hover:bg-[#1F171C] hover:text-white transition-colors cursor-pointer"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id, product.name)}
                aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                  wished
                    ? 'bg-[#F9F0F2] border-[#9E4D5D] text-[#9E4D5D]'
                    : 'bg-white border-[#EADEE2] text-[#1F171C] hover:border-[#9E4D5D]'
                }`}
              >
                <Heart className={`w-5 h-5 ${wished ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bangladesh Delivery Guarantee */}
          <div className="bg-[#F9F0F2]/80 border border-[#EADEE2] rounded-xl p-4 space-y-2 text-xs text-[#5A4A52]">
            <div className="flex items-center gap-2 text-[#1F171C] font-medium">
              <Truck className="w-4 h-4 text-[#9E4D5D]" />
              <span>Dhaka Delivery ৳70 (Free over ৳2,000) · Outside Dhaka ৳130</span>
            </div>
            <div className="flex items-center gap-2 text-[#1F171C] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#9E4D5D]" />
              <span>Cash on Delivery &amp; Simulated bKash/Nagad · Dispatched from Uttara Sector 11</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tabs */}
      <section className="mt-14 pt-10 border-t border-[#EADEE2]">
        <div
          role="tablist"
          aria-label="Product details"
          className="flex flex-wrap gap-2 border-b border-[#EADEE2] pb-3 mb-6"
        >
          {(
            [
              { id: 'overview', label: 'Benefits & Overview' },
              { id: 'ingredients', label: 'Key Ingredients' },
              { id: 'usage', label: 'How to Use' },
              { id: 'reviews', label: `Customer Reviews (${reviews.length})` },
            ] as { id: DetailTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#9E4D5D] text-white'
                  : 'text-[#5A4A52] hover:bg-[#F9F0F2] hover:text-[#1F171C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-8">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
                Why We Curated This
              </h2>
              <p className="text-sm sm:text-base text-[#5A4A52] leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-xl font-semibold text-[#1F171C]">
                Key Skin &amp; Beauty Benefits
              </h3>
              <ul className="space-y-2.5 text-sm text-[#1F171C]">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#9E4D5D] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
              Key Active &amp; Supporting Ingredients
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {product.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="px-3.5 py-2 rounded-lg bg-[#F9F0F2] border border-[#EADEE2] text-sm font-medium text-[#1F171C]"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
              Application &amp; Routine Instructions
            </h2>
            <p className="text-sm sm:text-base text-[#5A4A52] leading-relaxed max-w-3xl">
              {product.usage}
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-white border border-[#EADEE2] rounded-2xl p-8 text-center text-sm text-[#5A4A52]">
                  No written reviews yet for this product. Be the first to share your experience below!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border border-[#EADEE2] rounded-xl p-5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#1F171C]">
                          {rev.author} · <span className="font-normal text-[#5A4A52]">{rev.location}</span>
                        </p>
                        <p className="text-xs text-[#5A4A52]">
                          Skin Type: {rev.skinType} · {rev.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#C88D96] text-[#C88D96]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#1F171C] leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Demo Review */}
            <form
              onSubmit={handleReviewSubmit}
              className="lg:col-span-5 bg-white border border-[#EADEE2] rounded-2xl p-6 space-y-4 h-fit"
            >
              <h3 className="font-display text-xl font-semibold text-[#1F171C]">
                Write a Customer Review
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A4A52] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A4A52] mb-1">City</label>
                  <input
                    type="text"
                    value={revCity}
                    onChange={(e) => setRevCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A4A52] mb-1">Skin Type</label>
                  <select
                    value={revSkin}
                    onChange={(e) => setRevSkin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
                  >
                    <option>Combination</option>
                    <option>Oily</option>
                    <option>Dry</option>
                    <option>Sensitive</option>
                    <option>Normal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A4A52] mb-1">Rating</label>
                  <select
                    value={revRating}
                    onChange={(e) => setRevRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A4A52] mb-1">Review</label>
                <textarea
                  rows={3}
                  required
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="Share texture, finish, or results on your skin..."
                  className="w-full px-3 py-2 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#9E4D5D] hover:bg-[#833C4B] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#EADEE2]">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F171C] mb-6">
            Pair With Similar Essentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#EADEE2]">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F171C] mb-6">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
