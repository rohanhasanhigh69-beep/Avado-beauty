import { BeautyTip, CategoryInfo, Testimonial } from '../types';
import { MEDIA } from './media';

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Face Wash',
    slug: 'face-wash',
    collection: 'skincare',
    tagline: 'Gentle purifying washes for humid weather',
    image: MEDIA.prodFaceWashGel,
  },
  {
    name: 'Cleanser',
    slug: 'cleanser',
    collection: 'skincare',
    tagline: 'pH-balanced ceramide & micellar care',
    image: MEDIA.prodFoamingPumpCleanser,
  },
  {
    name: 'Moisturizer',
    slug: 'moisturizer',
    collection: 'skincare',
    tagline: 'Weightless hydration & barrier repair',
    image: MEDIA.prodWaterGelMoisturizer,
  },
  {
    name: 'Sunscreen',
    slug: 'sunscreen',
    collection: 'skincare',
    tagline: 'No-white-cast SPF50+ protection',
    image: MEDIA.catSunscreenToner,
  },
  {
    name: 'Serum',
    slug: 'serum',
    collection: 'skincare',
    tagline: 'Concentrated niacinamide, snail mucin & vitamin C',
    image: MEDIA.catSerumDropper,
  },
  {
    name: 'Toner',
    slug: 'toner',
    collection: 'skincare',
    tagline: 'Soothing botanical & clarifying essences',
    image: MEDIA.prodTonerBottle,
  },
  {
    name: 'Face Mask',
    slug: 'face-mask',
    collection: 'skincare',
    tagline: 'Overnight sleeping masks & pore clay',
    image: MEDIA.prodSheetMaskClay,
  },
  {
    name: 'Lip Care',
    slug: 'lip-care',
    collection: 'skincare',
    tagline: 'Peptide & berry overnight lip therapy',
    image: MEDIA.prodLipSleepingBalm,
  },
  {
    name: 'Makeup',
    slug: 'makeup',
    collection: 'makeup',
    tagline: 'Breathable powders, blushes & setting care',
    image: MEDIA.prodFoundationCompact,
  },
  {
    name: 'Foundation',
    slug: 'foundation',
    collection: 'makeup',
    tagline: 'Sweat-resistant shades for South Asian undertones',
    image: MEDIA.catMakeupLipstick,
  },
  {
    name: 'Lipstick',
    slug: 'lipstick',
    collection: 'makeup',
    tagline: 'Velvet mattes & vinyl inks that last',
    image: MEDIA.prodVelvetLipsticks,
  },
  {
    name: 'Eyeliner',
    slug: 'eyeliner',
    collection: 'makeup',
    tagline: 'Smudge-proof precision liquid & kohl liners',
    image: MEDIA.prodEyelinerMascara,
  },
  {
    name: 'Mascara',
    slug: 'mascara',
    collection: 'makeup',
    tagline: 'Length, curl & humidity-proof volume',
    image: MEDIA.prodEyelinerMascara,
  },
  {
    name: 'Body Lotion',
    slug: 'body-lotion',
    collection: 'body-hair',
    tagline: 'Fast-absorbing niacinamide & shea moisture',
    image: MEDIA.catBodyHairCare,
  },
  {
    name: 'Hair Care',
    slug: 'hair-care',
    collection: 'body-hair',
    tagline: 'Frizz-taming serums & keratin repair',
    image: MEDIA.catBodyHairCare,
  },
  {
    name: 'Beauty Accessories',
    slug: 'beauty-accessories',
    collection: 'accessories',
    tagline: 'Rose quartz rollers, sponges & brushes',
    image: MEDIA.prodBeautyTools,
  },
];

export const POPULAR_BRANDS: string[] = [
  'CeraVe',
  'COSRX',
  'Beauty of Joseon',
  'The Ordinary',
  'Simple',
  'Cetaphil',
  'Neutrogena',
  'Maybelline',
  "L'Oréal Paris",
  'Garnier',
  "Pond's",
  'Dove',
  'Vaseline',
  'Nivea',
  'Laneige',
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Farhana Tasnim',
    city: 'Banani, Dhaka',
    productBought: 'Beauty of Joseon Relief Sun SPF50+',
    beforeAfter: 'Zero white cast in 36°C Dhaka sun over 4 weeks',
    quote:
      'Every sunscreen used to feel greasy on my combination skin during Dhaka commutes. Switching to Relief Sun from Avado Beauty kept my T-zone calm under powder all day.',
    rating: 5,
  },
  {
    id: 'rev-2',
    name: 'Nusrat Jahan Mim',
    city: 'Agrabad, Chattogram',
    productBought: 'COSRX Advanced Snail 96 Mucin Essence',
    beforeAfter: 'Calmed post-acne redness in 3 weeks',
    quote:
      'Received sealed authentic COSRX within 48 hours in Chattogram. My damaged moisture barrier stopped flaking after two weeks of layering Snail Mucin under CeraVe.',
    rating: 5,
  },
  {
    id: 'rev-3',
    name: 'Samira Rahman',
    city: 'Uttara, Dhaka',
    productBought: 'Maybelline Fit Me Matte Foundation',
    beforeAfter: 'Shade 228 Soft Tan matched warm olive undertone cleanly',
    quote:
      'Finding real warm-olive Fit Me shades without oxidation is tough. The Shade 228 bottle arrived same day from Uttara Sector 11 and stays satin-matte through evening events.',
    rating: 5,
  },
];

export const BEAUTY_TIPS: BeautyTip[] = [
  {
    id: 'tip-1',
    slug: 'humid-climate-layering-dhaka',
    title: 'Humidity-Proof Morning Layering for Dhaka Summers',
    category: 'Skincare Guide',
    readTime: '4 min read',
    excerpt:
      'Build a breathable three-step AM routine that controls midday sebum without stripping your moisture barrier.',
    image: MEDIA.catSunscreenToner,
    steps: [
      'Cleanse gently with a low-pH gel cleanser (COSRX Good Morning or Simple Refreshing) for 45 seconds rather than harsh foaming scrubs.',
      'Press 2 drops of Niacinamide 10% or lightweight Hyaluronic serum onto slightly damp skin to balance oil output.',
      'Seal with an oil-free water gel moisturizer only on dry zones, then apply two finger-lengths of rice-extract SPF50+ sunscreen.',
    ],
    recommendedProductIds: ['p-cosrx-good-morning', 'p-ordinary-niacinamide', 'p-boj-relief-sun'],
  },
  {
    id: 'tip-2',
    slug: 'barrier-repair-night-ritual',
    title: 'Evening Barrier Recovery After City Pollution & Makeup',
    category: 'Night Ritual',
    readTime: '5 min read',
    excerpt:
      'Remove stubborn waterproof mascara and Dhaka traffic dust cleanly while rebuilding ceramides overnight.',
    image: MEDIA.promoSkincareRitual,
    steps: [
      'Saturate a cotton pad with Pink Micellar Water to dissolve SPF, eyeliner, and matte lipstick without tugging.',
      'Follow with CeraVe Foaming Cleanser or Cetaphil Gentle Cleanser to remove water-soluble residue.',
      'Layer Snail 96 Mucin Essence followed by CeraVe Moisturizing Cream and an overnight berry lip mask.',
    ],
    recommendedProductIds: ['p-garnier-micellar-pink', 'p-cosrx-snail-mucin', 'p-cerave-cream'],
  },
  {
    id: 'tip-3',
    slug: 'choosing-warm-undertone-makeup',
    title: 'Mastering Long-Wear Soft Glam for South Asian Undertones',
    category: 'Makeup Edit',
    readTime: '4 min read',
    excerpt:
      'Prevent foundation ashiness and lipstick feathering using breathable skin prep and velvet-matte formulas.',
    image: MEDIA.catMakeupLipstick,
    steps: [
      'Prep lips with Vaseline Rosy Lips 10 minutes before foundation, then blot excess balm so matte lipsticks glide evenly.',
      'Press Fit Me Matte + Poreless Foundation with a damp sponge starting from the center of the face outward.',
      'Set only the under-eye and T-zone with a light veil of compact powder and finish with waterproof lengthening mascara.',
    ],
    recommendedProductIds: ['p-maybelline-fitme-foundation', 'p-maybelline-vinyl-ink', 'p-maybelline-skyhigh'],
  },
];
