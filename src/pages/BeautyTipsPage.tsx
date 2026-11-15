import React from 'react';
import { BEAUTY_TIPS } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';

export const BeautyTipsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14">
      <div className="max-w-3xl space-y-3 pb-8 border-b border-[#EADEE2]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D]">
          The Avado Beauty Journal
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#1F171C]">
          Skincare &amp; Beauty Guides for Bangladesh
        </h1>
        <p className="text-base text-[#5A4A52] leading-relaxed">
          Practical, dermatologist-aligned routines designed for humid Dhaka summers, monsoon air, and indoor air-conditioning.
        </p>
      </div>

      <div className="space-y-16">
        {BEAUTY_TIPS.map((tip, index) => {
          const recommended = tip.recommendedProductIds
            .map((id) => PRODUCTS.find((p) => p.id === id))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));

          return (
            <article
              key={tip.id}
              className="bg-white border border-[#EADEE2] rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto">
                  <SafeImage src={tip.image} alt={tip.title} className="w-full h-full object-cover" />
                </div>
                <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9E4D5D]">
                    0{index + 1}. {tip.category} · {tip.readTime}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F171C]">
                    {tip.title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#5A4A52] leading-relaxed">
                    {tip.excerpt}
                  </p>
                  <ol className="space-y-3 pt-2">
                    {tip.steps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-3 text-sm text-[#1F171C]">
                        <span className="w-6 h-6 rounded-full bg-[#F9F0F2] text-[#9E4D5D] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                          {sIdx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {recommended.length > 0 && (
                <div className="bg-[#FDFBF9] border-t border-[#EADEE2] p-6 sm:p-8">
                  <h3 className="font-display text-xl font-semibold text-[#1F171C] mb-5">
                    Featured Routine Picks
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommended.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
