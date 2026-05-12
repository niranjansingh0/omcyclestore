const categoryMeta = [
  { id: 'electronics', name: 'Electronics', icon: 'Laptop', accent: 'from-sky-500 to-cyan-400' },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', accent: 'from-pink-500 to-rose-400' },
  { id: 'home-living', name: 'Home & Living', icon: 'Sofa', accent: 'from-amber-500 to-orange-400' },
  { id: 'sports-fitness', name: 'Sports & Fitness', icon: 'Dumbbell', accent: 'from-emerald-500 to-lime-400' },
  { id: 'books-media', name: 'Books & Media', icon: 'BookOpen', accent: 'from-violet-500 to-indigo-400' },
  { id: 'beauty-health', name: 'Beauty & Health', icon: 'Sparkles', accent: 'from-fuchsia-500 to-pink-400' },
];

const productsSeed = [
  ['AeroNoise Pro Headphones', 'electronics', 'Sono', 2499, 3299, 4.6],
  ['Pulse X Smartwatch', 'electronics', 'Nova', 3999, 5299, 4.5],
  ['UltraView 4K Monitor', 'electronics', 'PixelArc', 17999, 20999, 4.7],
  ['Pocket Beam Speaker', 'electronics', 'EchoBeat', 1899, 2499, 4.4],
  ['CloudTouch Mechanical Keyboard', 'electronics', 'KeyMint', 3599, 4299, 4.8],
  ['StreetFlex Overshirt', 'fashion', 'UrbanThread', 1299, 1799, 4.3],
  ['Contour Fit Denim', 'fashion', 'Mono Lane', 1699, 2299, 4.5],
  ['Aurora Everyday Sneakers', 'fashion', 'NorthStep', 2499, 3099, 4.6],
  ['Velvet Drape Dress', 'fashion', 'Maison Loop', 2199, 2999, 4.2],
  ['Minimal Carry Backpack', 'fashion', 'Transit Lab', 1999, 2699, 4.7],
  ['Nordic Glow Floor Lamp', 'home-living', 'Casa Halo', 3199, 3999, 4.6],
  ['SoftNest Accent Chair', 'home-living', 'Loom Home', 8999, 10999, 4.5],
  ['PureBrew Coffee Set', 'home-living', 'BrewScape', 1499, 1899, 4.4],
  ['CottonCloud Bedding', 'home-living', 'Drift & Rest', 2799, 3499, 4.8],
  ['StoneForm Vase Duo', 'home-living', 'Form & Grain', 999, 1399, 4.3],
  ['CoreLift Adjustable Dumbbells', 'sports-fitness', 'PeakForge', 8999, 10999, 4.7],
  ['SprintEdge Running Shoes', 'sports-fitness', 'Kinetic', 2899, 3699, 4.6],
  ['ZenFlex Yoga Mat', 'sports-fitness', 'FlowRoot', 1299, 1699, 4.5],
  ['TrailHydra Bottle', 'sports-fitness', 'Summit Lab', 699, 999, 4.4],
  ['VeloRide Helmet', 'sports-fitness', 'RoadBolt', 2499, 3199, 4.7],
  ['Deep Work Blueprint', 'books-media', 'PaperGrid', 599, 799, 4.8],
  ['Design Systems Handbook', 'books-media', 'Sketch Press', 899, 1199, 4.7],
  ['Audio Tales Box Set', 'books-media', 'StorySync', 1299, 1599, 4.5],
  ['Visual Thinking Cards', 'books-media', 'MindFrame', 799, 1099, 4.3],
  ['Creative Habit Journal', 'books-media', 'Daily Arc', 499, 699, 4.6],
  ['GlowGuard Serum', 'beauty-health', 'Veya', 899, 1299, 4.4],
  ['Mineral Mist Sunscreen', 'beauty-health', 'SolPure', 699, 999, 4.5],
  ['Botanic Repair Shampoo', 'beauty-health', 'Root Ritual', 749, 999, 4.3],
  ['CalmPulse Massager', 'beauty-health', 'EaseForm', 2199, 2799, 4.7],
  ['Revive Sleep Gummies', 'beauty-health', 'Natura Ease', 599, 799, 4.2],
];

const palette = ['ff6b35', '1e3a5f', '00d9a5', '6366f1', 'ef4444', 'f59e0b'];

export const categories = categoryMeta.map((category, index) => ({
  ...category,
  itemCount: 10 + index * 3,
}));

export const products = Array.from({ length: 60 }, (_, index) => {
  const [name, category, brand, price, originalPrice, rating] = productsSeed[index % productsSeed.length];
  const variation = Math.floor(index / productsSeed.length);
  const color = palette[index % palette.length];
  const productId = index + 1;
  const finalPrice = price + variation * 120;
  const finalOriginalPrice = originalPrice + variation * 160;

  return {
    id: productId,
    name: variation ? `${name} ${variation + 1}` : name,
    description:
      'Built for modern shoppers who want premium quality, fast delivery, and a polished everyday experience.',
    price: finalPrice,
    originalPrice: finalOriginalPrice,
    images: [
      `https://picsum.photos/seed/omni-${productId}/900/900`,
      `https://picsum.photos/seed/omni-alt-${productId}/900/900`,
      `https://picsum.photos/seed/omni-detail-${productId}/900/900`,
    ],
    category,
    brand,
    rating,
    reviewCount: 40 + productId * 3,
    inStock: productId % 7 !== 0,
    popularity: 70 + (productId % 30),
    tags: ['Fast shipping', 'Top rated', 'Premium pick'].slice(0, (productId % 3) + 1),
    badge: productId % 5 === 0 ? 'Hot Deal' : productId % 4 === 0 ? 'New' : 'Best Seller',
    color,
  };
});

export const heroSlides = [
  {
    id: 1,
    title: 'Upgrade Every Cart Moment',
    subtitle: 'Discover polished picks across tech, style, home, and fitness with same-day dispatch vibes.',
    image: 'https://picsum.photos/seed/hero-1/1600/900',
    cta: 'Shop Collection',
  },
  {
    id: 2,
    title: 'Big Summer Price Drops',
    subtitle: 'Fresh markdowns on bestselling essentials, curated to feel premium without the premium stress.',
    image: 'https://picsum.photos/seed/hero-2/1600/900',
    cta: 'View Deals',
  },
  {
    id: 3,
    title: 'Designed For Fast Browsing',
    subtitle: 'Swipe, filter, shortlist, and check out with a storefront built for speed on every screen.',
    image: 'https://picsum.photos/seed/hero-3/1600/900',
    cta: 'Start Shopping',
  },
];

export const userProfile = {
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
  phone: '+91 98765 43210',
  addresses: [
    '12 Residency Road, Bengaluru, Karnataka 560025',
    '44 Marine Drive, Mumbai, Maharashtra 400002',
  ],
};

export const sampleOrders = [
  {
    id: 'ORD-24581',
    date: '2026-05-02',
    status: 'Delivered',
    total: 7297,
    items: ['Pulse X Smartwatch', 'GlowGuard Serum'],
  },
  {
    id: 'ORD-24532',
    date: '2026-04-24',
    status: 'Shipped',
    total: 2499,
    items: ['VeloRide Helmet'],
  },
  {
    id: 'ORD-24497',
    date: '2026-04-12',
    status: 'Processing',
    total: 10998,
    items: ['CoreLift Adjustable Dumbbells'],
  },
];
