import connectDB from '../config/db.js';
import { Category, Product, RechargePlan, User } from '../models/index.js';
import { slugify } from '../utils/helpers.js';

const categories = [
  { name: 'Electronics', type: 'product', description: 'Latest gadgets and tech accessories' },
  { name: 'Fashion', type: 'product', description: 'Trendy clothing and accessories' },
  { name: 'Home & Living', type: 'product', description: 'Furniture and home essentials' },
  { name: 'Sports & Fitness', type: 'product', description: 'Sports equipment and fitness gear' },
  { name: 'Books & Media', type: 'product', description: 'Books and entertainment media' },
  { name: 'Beauty & Health', type: 'product', description: 'Beauty products and health supplements' }
];

const products = [
  // Electronics
  { name: 'AeroNoise Pro Headphones', description: 'Premium noise-cancelling headphones with 30-hour battery life', brand: 'Sono', price: 2499, compareAtPrice: 3299, stock: 25, tags: ['audio', 'wireless', 'premium'], averageRating: 4.6, reviewCount: 128 },
  { name: 'Pulse X Smartwatch', description: 'Fitness tracking smartwatch with heart rate monitor', brand: 'Nova', price: 3999, compareAtPrice: 5299, stock: 30, tags: ['wearable', 'fitness', 'smart'], averageRating: 4.5, reviewCount: 95 },
  { name: 'UltraView 4K Monitor', description: '27-inch 4K display with HDR support', brand: 'PixelArc', price: 17999, compareAtPrice: 20999, stock: 15, tags: ['monitor', '4k', 'display'], averageRating: 4.7, reviewCount: 64 },
  { name: 'Pocket Beam Speaker', description: 'Portable Bluetooth speaker with rich bass', brand: 'EchoBeat', price: 1899, compareAtPrice: 2499, stock: 40, tags: ['speaker', 'bluetooth', 'portable'], averageRating: 4.4, reviewCount: 156 },
  { name: 'CloudTouch Mechanical Keyboard', description: 'RGB mechanical keyboard with hot-swappable switches', brand: 'KeyMint', price: 3599, compareAtPrice: 4299, stock: 20, tags: ['keyboard', 'mechanical', 'rgb'], averageRating: 4.8, reviewCount: 89 },
  // Fashion
  { name: 'StreetFlex Overshirt', description: 'Modern overshirt with premium cotton blend', brand: 'UrbanThread', price: 1299, compareAtPrice: 1799, stock: 35, tags: ['clothing', 'casual', 'modern'], averageRating: 4.3, reviewCount: 72 },
  { name: 'Contour Fit Denim', description: 'Slim fit jeans with stretch comfort', brand: 'Mono Lane', price: 1699, compareAtPrice: 2299, stock: 45, tags: ['denim', 'jeans', 'fashion'], averageRating: 4.5, reviewCount: 110 },
  { name: 'Aurora Everyday Sneakers', description: 'Comfortable daily wear sneakers', brand: 'NorthStep', price: 2499, compareAtPrice: 3099, stock: 28, tags: ['sneakers', 'casual', 'footwear'], averageRating: 4.6, reviewCount: 134 },
  { name: 'Velvet Drape Dress', description: 'Elegant velvet dress for special occasions', brand: 'Maison Loop', price: 2199, compareAtPrice: 2999, stock: 18, tags: ['dress', 'formal', 'elegant'], averageRating: 4.2, reviewCount: 45 },
  { name: 'Minimal Carry Backpack', description: 'Stylish backpack for work and travel', brand: 'Transit Lab', price: 1999, compareAtPrice: 2699, stock: 50, tags: ['backpack', 'travel', 'bag'], averageRating: 4.7, reviewCount: 167 },
  // Home & Living
  { name: 'Nordic Glow Floor Lamp', description: 'Modern floor lamp with warm LED lighting', brand: 'Casa Halo', price: 3199, compareAtPrice: 3999, stock: 22, tags: ['lamp', 'lighting', 'modern'], averageRating: 4.6, reviewCount: 78 },
  { name: 'SoftNest Accent Chair', description: 'Comfortable accent chair for living room', brand: 'Loom Home', price: 8999, compareAtPrice: 10999, stock: 10, tags: ['chair', 'furniture', 'comfort'], averageRating: 4.5, reviewCount: 42 },
  { name: 'PureBrew Coffee Set', description: 'Premium coffee brewing set with grinder', brand: 'BrewScape', price: 1499, compareAtPrice: 1899, stock: 35, tags: ['coffee', 'kitchen', 'premium'], averageRating: 4.4, reviewCount: 93 },
  { name: 'CottonCloud Bedding', description: 'Luxury cotton bedding set for comfortable sleep', brand: 'Drift & Rest', price: 2799, compareAtPrice: 3499, stock: 40, tags: ['bedding', 'sleep', 'comfort'], averageRating: 4.8, reviewCount: 156 },
  { name: 'StoneForm Vase Duo', description: 'Decorative vase set for modern homes', brand: 'Form & Grain', price: 999, compareAtPrice: 1399, stock: 55, tags: ['decor', 'vase', 'modern'], averageRating: 4.3, reviewCount: 67 },
  // Sports & Fitness
  { name: 'CoreLift Adjustable Dumbbells', description: 'Adjustable weight dumbbells for home gym', brand: 'PeakForge', price: 8999, compareAtPrice: 10999, stock: 12, tags: ['gym', 'weights', 'fitness'], averageRating: 4.7, reviewCount: 89 },
  { name: 'SprintEdge Running Shoes', description: 'Lightweight running shoes with cushioning', brand: 'Kinetic', price: 2899, compareAtPrice: 3699, stock: 32, tags: ['shoes', 'running', 'sports'], averageRating: 4.6, reviewCount: 145 },
  { name: 'ZenFlex Yoga Mat', description: 'Non-slip yoga mat with carrying strap', brand: 'FlowRoot', price: 1299, compareAtPrice: 1699, stock: 60, tags: ['yoga', 'fitness', 'mat'], averageRating: 4.5, reviewCount: 178 },
  { name: 'TrailHydra Bottle', description: 'Insulated water bottle for outdoor activities', brand: 'Summit Lab', price: 699, compareAtPrice: 999, stock: 75, tags: ['bottle', 'hydration', 'outdoor'], averageRating: 4.4, reviewCount: 234 },
  { name: 'VeloRide Helmet', description: 'Safety-certified cycling helmet', brand: 'RoadBolt', price: 2499, compareAtPrice: 3199, stock: 25, tags: ['helmet', 'cycling', 'safety'], averageRating: 4.7, reviewCount: 112 },
  // Books & Media
  { name: 'Deep Work Blueprint', description: 'Guide to productivity and deep work', brand: 'PaperGrid', price: 599, compareAtPrice: 799, stock: 80, tags: ['book', 'productivity', 'self-help'], averageRating: 4.8, reviewCount: 267 },
  { name: 'Design Systems Handbook', description: 'Comprehensive guide to design systems', brand: 'Sketch Press', price: 899, compareAtPrice: 1199, stock: 45, tags: ['book', 'design', 'ux'], averageRating: 4.7, reviewCount: 134 },
  { name: 'Audio Tales Box Set', description: 'Collection of audio books and podcasts', brand: 'StorySync', price: 1299, compareAtPrice: 1599, stock: 30, tags: ['audio', 'books', 'entertainment'], averageRating: 4.5, reviewCount: 89 },
  { name: 'Visual Thinking Cards', description: 'Creative thinking and brainstorming cards', brand: 'MindFrame', price: 799, compareAtPrice: 1099, stock: 55, tags: ['cards', 'creative', 'tools'], averageRating: 4.3, reviewCount: 56 },
  { name: 'Creative Habit Journal', description: 'Journal for building creative habits', brand: 'Daily Arc', price: 499, compareAtPrice: 699, stock: 90, tags: ['journal', 'creative', 'productivity'], averageRating: 4.6, reviewCount: 198 },
  // Beauty & Health
  { name: 'GlowGuard Serum', description: 'Vitamin C brightening serum for radiant skin', brand: 'Veya', price: 899, compareAtPrice: 1299, stock: 50, tags: ['skincare', 'serum', 'beauty'], averageRating: 4.4, reviewCount: 145 },
  { name: 'Mineral Mist Sunscreen', description: 'SPF 50 mineral sunscreen for sensitive skin', brand: 'SolPure', price: 699, compareAtPrice: 999, stock: 65, tags: ['sunscreen', 'skincare', 'spf'], averageRating: 4.5, reviewCount: 189 },
  { name: 'Botanic Repair Shampoo', description: 'Sulfate-free repair shampoo for damaged hair', brand: 'Root Ritual', price: 749, compareAtPrice: 999, stock: 42, tags: ['shampoo', 'haircare', 'natural'], averageRating: 4.3, reviewCount: 98 },
  { name: 'CalmPulse Massager', description: 'Percussive muscle massager for recovery', brand: 'EaseForm', price: 2199, compareAtPrice: 2799, stock: 20, tags: ['massager', 'recovery', 'wellness'], averageRating: 4.7, reviewCount: 134 },
  { name: 'Revive Sleep Gummies', description: 'Melatonin sleep support gummies', brand: 'Natura Ease', price: 599, compareAtPrice: 799, stock: 70, tags: ['supplement', 'sleep', 'health'], averageRating: 4.2, reviewCount: 87 }
];

const rechargePlans = [
  { operator: 'Jio', circle: 'Karnataka', planName: 'Jio 299 Unlimited', amount: 299, validity: '28 days', description: 'Unlimited calling with daily data', benefits: ['1.5GB/day', 'Unlimited voice', '100 SMS/day'] },
  { operator: 'Airtel', circle: 'Karnataka', planName: 'Airtel 349 Combo', amount: 349, validity: '28 days', description: 'Recharge plan with OTT benefits', benefits: ['2GB/day', 'Unlimited voice', 'OTT access'] },
  { operator: 'Vi', circle: 'Karnataka', planName: 'Vi 249 Essential', amount: 249, validity: '28 days', description: 'Basic plan for everyday use', benefits: ['1GB/day', 'Unlimited voice', '100 SMS/day'] }
];

const seed = async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Connected!');

  console.log('Clearing collections...');
  try {
    await Category.deleteMany({});
    await Product.deleteMany({});
    await RechargePlan.deleteMany({});
    await User.deleteMany({});
    console.log('Collections cleared!');
  } catch (e) {
    console.log('Collections may not exist yet:', e.message);
  }

  console.log('Inserting categories...');
  const createdCategories = await Category.insertMany(
    categories.map((category) => ({
      ...category,
      slug: slugify(category.name)
    }))
  );
  console.log('Categories inserted!');

  const categoryMap = Object.fromEntries(createdCategories.map((item) => [item.name, item._id]));

  const categoryNames = ['Electronics', 'Fashion', 'Home & Living', 'Sports & Fitness', 'Books & Media', 'Beauty & Health'];

  console.log('Preparing products...');
  const productsToInsert = products.map((product, index) => {
    const categoryIndex = Math.floor(index / 5);
    return {
      ...product,
      slug: slugify(product.name),
      sku: `PROD-${String(index + 1).padStart(4, '0')}`,
      category: categoryMap[categoryNames[categoryIndex]],
      lowStockThreshold: 5,
      productType: 'general-shop-product',
      images: [
        { public_id: `omcyclestore/products/${index + 1}`, url: `https://picsum.photos/seed/omni-${index + 1}/900/900` },
        { public_id: `omcyclestore/products/${index + 1}-alt`, url: `https://picsum.photos/seed/omni-alt-${index + 1}/900/900` },
        { public_id: `omcyclestore/products/${index + 1}-detail`, url: `https://picsum.photos/seed/omni-detail-${index + 1}/900/900` }
      ]
    };
  });

  console.log('Inserting products...');
  await Product.insertMany(productsToInsert);
  console.log('Products inserted!');

  console.log('Inserting recharge plans...');
  await RechargePlan.insertMany(rechargePlans);
  console.log('Recharge plans inserted!');

  console.log('Creating users...');
  await User.create({
    name: 'Admin User',
    email: 'admin@omcyclestore.com',
    password: 'Admin@123',
    phone: '9876543210',
    role: 'admin'
  });

  await User.create({
    name: 'Demo Customer',
    email: 'customer@omcyclestore.com',
    password: 'Customer@123',
    phone: '9876543201',
    role: 'customer'
  });

  console.log('Seed data inserted successfully!');
  console.log(`- ${categories.length} categories`);
  console.log(`- ${products.length} products`);
  console.log(`- ${rechargePlans.length} recharge plans`);
  console.log(`- 2 users (admin and customer)`);
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});