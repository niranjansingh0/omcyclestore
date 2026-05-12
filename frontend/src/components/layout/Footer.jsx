import { Facebook, Instagram, Twitter, CircleDot, Wrench, Smartphone, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const categories = [
    { name: 'Bike Tyres & Repair', icon: CircleDot },
    { name: 'Cycle Repair & Parts', icon: Wrench },
    { name: 'Money Transfer & AEPS', icon: Wallet },
    { name: 'Mobile Recharge', icon: Smartphone },
  ];
  return (
    <footer className="mt-8 bg-slate-950 text-slate-200 sm:mt-16">
      <div className="container-shell grid gap-8 py-10 sm:grid-cols-2 sm:py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-12">
        <div>
          <h3 className="text-base font-bold text-white sm:text-lg">OmcycleStore</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400 sm:mt-4">
            A premium storefront experience for everyday essentials, bold upgrades, and smarter shopping moments.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white sm:text-base">Quick Links</h4>
          <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:mt-4 sm:gap-3">
            <Link to="/products" className="hover:text-white">Shop All</Link>
            <Link to="/wishlist" className="hover:text-white">Wishlist</Link>
            <Link to="/orders" className="hover:text-white">Orders</Link>
            <Link to="/profile" className="hover:text-white">My Account</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white sm:text-base">Categories</h4>
          <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:mt-4 sm:gap-3">
            {categories.map(({ name, icon: Icon }) => (
              <div key={name} className="flex items-center gap-2">
                <Icon size={16} className="text-brand-secondary" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white sm:text-base">Contact</h4>
          <div className="mt-3 space-y-2 text-sm text-slate-400 sm:mt-4 sm:space-y-3">
            <p>omcyclestorejio@gmail.com</p>
            <p>+91 9935156392</p>
            <div className="flex gap-4 pt-1">
              <Facebook size={18} className="cursor-pointer hover:text-white" />
              <Instagram size={18} className="cursor-pointer hover:text-white" />
              <Twitter size={18} className="cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        Copyright 2026 OmcycleStore. Crafted for fast, modern shopping.
      </div>
    </footer>
  );
}
