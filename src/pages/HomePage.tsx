import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react';
import { BEAUTY_TIPS, CATEGORIES, POPULAR_BRANDS, TESTIMONIALS } from '../data/categories';
import { MEDIA } from '../data/media';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';

type ShowcaseTab = 'best-sellers' | 'new-arrivals' | 'trending' | 'skincare' | 'makeup' | 'offers';

export const HomePage: React.FC = () => {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('best-sellers');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const showcaseTabs: { id: ShowcaseTab; label: string; shopLink: string }[] = [
    { id: 'best-sellers', label: 'Best Sellers', shopLink: '/shop?sort=popular' },
    { id: 'new-arrivals', label: 'New Arrivals', shopLink: '/shop?sort=newest' },
    { id: 'trending', label: 'Trending', shopLink: '/shop?collection=skincare' },
    { id: 'skincare', label: 'Skincare', shopLink: '/shop?collection=skincare' },
    { id: 'makeup', label: 'Makeup', shopLink: '/shop?collection=makeup' },
    { id: 'offers', label: 'Special Offers', shopLink: '/shop?sale=true' },
  ];

  const showcasedProducts = useMemo(() => {
    let pool = PRODUCTS;
    switch (activeTab) {
      case 'best-sellers':
        pool = PRODUCTS.filter((p) => p.isBestSeller);
        break;
      case 'new-arrivals':
        pool = PRODUCTS.filter((p) => p.isNewArrival);
        break;
      case 'trending':
        pool = PRODUCTS.filter((p) => p.isTrending);
        break;
      case 'skincare':
        pool = PRODUCTS.filter((p) => p.collection === 'skincare');
        break;
      case 'makeup':
        pool = PRODUCTS.filter((p) => p.collection === 'makeup');
        break;
      case 'offers':
        pool = PRODUCTS.filter(
          (p) => p.isSpecialOffer || (p.discountPrice && p.discountPrice < p.price)
        );
        break;
      default:
        pool = PRODUCTS;
    }

    const picked: typeof PRODUCTS = [];
    const seenImages = new Set<string>();

    for (const item of pool) {
      if (!seenImages.has(item.images[0])) {
        picked.push(item);
        seenImages.add(item.images[0]);
      }
      if (picked.length === 6) break;
    }

    if (picked.length < 6) {
      for (const item of pool) {
        if (!picked.some((p) => p.id === item.id)) {
          picked.push(item);
        }
        if (picked.length === 6) break;
      }
    }

    return picked;
  }, [activeTab]);

  const currentTabMeta = showcaseTabs.find((t) => t.id === activeTab) ?? showcaseTabs[0];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    showToast('Welcome to Avado Beauty Insider Notes! Check code AVADO10 at checkout.', 'success');
    setNewsletterEmail('');
  };

  return (
    <div>
      {/* 1. Storefront Split Editorial Hero */}
      <section className="bg-gradient-to-br from-[#F9F0F2] via-[#FDFBF9] to-[#F4F1F8] border-b border-[#EADEE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9E4D5D]">
                Avado Beauty Dhaka · Curated Skincare &amp; Cosmetics
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] text-[#1F171C]">
                Luminous skin rituals crafted for warm, humid days
              </h1>

              <p className="text-base sm:text-lg text-[#5A4A52] leading-relaxed max-w-xl">
                Discover dermatologist-trusted CeraVe, COSRX, Beauty of Joseon, The Ordinary, and breathable long-wear makeup—priced transparently in BDT with nationwide delivery from Uttara, Dhaka.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors whitespace-nowrap shrink-0"
                >
                  Shop Collection
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/shop?collection=skincare"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[#1F171C]/20 bg-white text-[#1F171C] text-sm font-semibold hover:border-[#9E4D5D] hover:text-[#9E4D5D] transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Skincare
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-[#EADEE2] shadow-sm">
                <SafeImage
                  src={MEDIA.heroBeautyEditorial}
                  alt="Radiant South Asian woman showcasing luminous dewy skin with Avado Beauty skincare"
                  className="w-full h-full lg:h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1F171C]/80 via-[#1F171C]/35 to-transparent p-6 sm:p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#E8C4B8] font-medium">
                    Season Edit · Glass Skin &amp; SPF50+
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-medium mt-1">
                    Zero white cast protection &amp; barrier hydration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Trust & Service Strip below Hero */}
          <div className="mt-10 pt-8 border-t border-[#EADEE2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#9E4D5D] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#1F171C]">100% Authentic Brands</p>
                <p className="text-xs text-[#5A4A52] mt-0.5">Batch-verified Korean, French &amp; US essentials</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#9E4D5D] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#1F171C]">Dhaka Same/Next-Day</p>
                <p className="text-xs text-[#5A4A52] mt-0.5">Free in Dhaka over ৳2,000 · ৳130 Nationwide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#9E4D5D] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#1F171C]">Cash on Delivery</p>
                <p className="text-xs text-[#5A4A52] mt-0.5">COD, bKash &amp; Nagad supported (Demo Checkout)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#9E4D5D] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#1F171C]">Uttara Flagship Studio</p>
                <p className="text-xs text-[#5A4A52] mt-0.5">Sector 11, Dhaka · Call 01722371905</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-2">
              Shop by Category
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
              Every Step of Your Routine
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9E4D5D] hover:underline whitespace-nowrap shrink-0"
          >
            All 16 Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group bg-white border border-[#EADEE2] rounded-xl overflow-hidden hover:-translate-y-0.5 hover:border-[#C88D96] transition-all duration-200"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F9F0F2]">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-[#1F171C] group-hover:text-[#9E4D5D] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#5A4A52] mt-1 line-clamp-1">{cat.tagline}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Remaining categories quick links */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-[#EADEE2] text-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
            More Departments:
          </span>
          {CATEGORIES.slice(8).map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="text-sm font-medium text-[#1F171C] hover:text-[#9E4D5D] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Interactive Product Showcase (Best Sellers, New Arrivals, Trending, Skincare, Makeup, Offers) */}
      <section className="bg-[#F9F0F2]/60 border-y border-[#EADEE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-2">
                Curated Storefront
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
                Most-Loved Across Bangladesh
              </h2>
            </div>

            {/* Segmented Tab Controls */}
            <div
              role="tablist"
              aria-label="Product collections"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#EADEE2] rounded-xl"
            >
              {showcaseTabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#9E4D5D] text-white'
                        : 'text-[#5A4A52] hover:text-[#1F171C] hover:bg-[#F9F0F2]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {showcasedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to={currentTabMeta.shopLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1F171C] text-white text-sm font-semibold hover:bg-[#9E4D5D] transition-colors whitespace-nowrap shrink-0"
            >
              Explore All {currentTabMeta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Editorial Promotional Banner + Special Offers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-[#EADEE2] bg-[#FDF3EC]">
          <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto">
            <SafeImage
              src={MEDIA.promoSkincareRitual}
              alt="Luxury lavender and botanical skincare ritual flatlay"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D]">
              Seasonal Privilege · Demo Offer
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C] leading-tight">
              Save ৳200 on Barrier &amp; Glow Sets
            </h2>
            <p className="text-sm sm:text-base text-[#5A4A52] leading-relaxed">
              Pair any Korean essence, ceramide moisturizer, and SPF50+ sunscreen over ৳1,500 and enter promo code <strong className="text-[#1F171C]">GLOW200</strong> at checkout—or use <strong className="text-[#1F171C]">DHAKA15</strong> for 15% off baskets over ৳3,000.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/shop?sale=true"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors whitespace-nowrap shrink-0"
              >
                Shop Special Offers
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/beauty-tips"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#EADEE2] bg-white text-[#1F171C] text-sm font-semibold hover:border-[#9E4D5D] transition-colors whitespace-nowrap shrink-0"
              >
                Read Routine Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Brands Directory */}
      <section className="bg-[#F4F1F8]/70 border-y border-[#EADEE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-2">
              Authorized &amp; Trusted Labels
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F171C]">
              Shop by Popular Brands
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {POPULAR_BRANDS.map((brand) => (
              <Link
                key={brand}
                to={`/shop?brand=${encodeURIComponent(brand)}`}
                className="bg-white border border-[#EADEE2] rounded-xl py-3.5 px-3 text-center text-sm font-semibold text-[#1F171C] hover:border-[#9E4D5D] hover:text-[#9E4D5D] transition-colors truncate"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials & Beauty Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-16">
        {/* Testimonials */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-2">
                Verified Community Stories
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
                Real Results in Our Climate
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-[#9E4D5D] hover:underline whitespace-nowrap shrink-0"
            >
              Browse Top-Rated Products →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <blockquote
                key={item.id}
                className="bg-white border border-[#EADEE2] rounded-xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 fill-[#C88D96] text-[#C88D96]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-[#9E4D5D]">
                    {item.beforeAfter}
                  </p>
                  <p className="text-sm text-[#1F171C] leading-relaxed">
                    “{item.quote}”
                  </p>
                </div>
                <footer className="pt-3 border-t border-[#EADEE2] text-xs text-[#5A4A52]">
                  <p className="font-semibold text-[#1F171C]">
                    {item.name} · {item.city}
                  </p>
                  <p className="mt-0.5">{item.productBought}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Beauty Tips */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-2">
                The Avado Journal
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
                Skincare &amp; Makeup Guides
              </h2>
            </div>
            <Link
              to="/beauty-tips"
              className="text-sm font-semibold text-[#9E4D5D] hover:underline whitespace-nowrap shrink-0"
            >
              All Beauty Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BEAUTY_TIPS.map((tip) => (
              <article
                key={tip.id}
                className="group bg-white border border-[#EADEE2] rounded-xl overflow-hidden flex flex-col"
              >
                <Link to="/beauty-tips" className="aspect-[4/3] w-full overflow-hidden bg-[#F9F0F2]">
                  <SafeImage
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs text-[#5A4A52] font-medium">
                      {tip.category} · {tip.readTime}
                    </p>
                    <Link
                      to="/beauty-tips"
                      className="block font-display text-xl font-semibold text-[#1F171C] hover:text-[#9E4D5D] transition-colors mt-1.5 leading-snug"
                    >
                      {tip.title}
                    </Link>
                    <p className="text-sm text-[#5A4A52] mt-2 line-clamp-2">
                      {tip.excerpt}
                    </p>
                  </div>
                  <Link
                    to="/beauty-tips"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E4D5D] hover:underline pt-2"
                  >
                    Read 3-Step Routine <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter Subscription Strip */}
      <section className="bg-gradient-to-r from-[#F9F0F2] via-[#FDF3EC] to-[#F4F1F8] border-t border-[#EADEE2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 text-center space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D]">
            Join the Avado Inner Circle
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F171C]">
            Receive restock alerts &amp; seasonal skincare edits
          </h2>
          <p className="text-sm text-[#5A4A52] max-w-lg mx-auto">
            Be first to know when fresh batches of Beauty of Joseon, COSRX, and Maybelline Fit Me arrive at our Uttara studio.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          >
            <label htmlFor="home-newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="home-newsletter"
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white border border-[#EADEE2] text-sm text-[#1F171C] placeholder:text-[#5A4A52]/70 focus:outline-none focus:border-[#9E4D5D]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Join Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
