import { BookOpen, CircleDot, Dumbbell, Laptop, Shirt, Smartphone, Sofa, Sparkles, Wallet, Wrench } from 'lucide-react';

// Map category names to icons and accent colors
const categoryMeta = {
  'Electronics': { icon: 'Laptop', accent: 'from-sky-500 to-cyan-400' },
  'Fashion': { icon: 'Shirt', accent: 'from-pink-500 to-rose-400' },
  'Home & Living': { icon: 'Sofa', accent: 'from-amber-500 to-orange-400' },
  'Sports & Fitness': { icon: 'Dumbbell', accent: 'from-emerald-500 to-lime-400' },
  'Books & Media': { icon: 'BookOpen', accent: 'from-violet-500 to-indigo-400' },
  'Beauty & Health': { icon: 'Sparkles', accent: 'from-fuchsia-500 to-pink-400' },
  'Bike Tyres & Repair': { icon: 'CircleDot', accent: 'from-orange-500 to-amber-400' },
  'Cycle Repair & Parts': { icon: 'Wrench', accent: 'from-slate-500 to-gray-400' },
  'Money Transfer & AEPS': { icon: 'Wallet', accent: 'from-green-500 to-emerald-400' },
  'Mobile Recharge': { icon: 'Smartphone', accent: 'from-blue-500 to-indigo-400' },
};

const icons = {
  Laptop,
  Shirt,
  Sofa,
  Dumbbell,
  BookOpen,
  Sparkles,
  CircleDot,
  Wrench,
  Wallet,
  Smartphone,
};

export default function CategoryCard({ category }) {
  const meta = categoryMeta[category.name] || { icon: 'Laptop', accent: 'from-slate-500 to-slate-400' };
  const Icon = icons[meta.icon] || Laptop;
  const itemCount = category.productCount || category.itemCount || 0;

  return (
    <div className="glass-panel group overflow-hidden p-5 transition hover:-translate-y-1">
      <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${meta.accent} p-4 text-white shadow-soft`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold">{category.name}</h3>
      <p className="mt-2 text-sm text-brand-muted dark:text-brand-dark-muted">{itemCount}+ curated items</p>
    </div>
  );
}
