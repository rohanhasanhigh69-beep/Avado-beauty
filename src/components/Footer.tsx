import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    showToast('Subscribed to Avado Beauty insider notes (Demo).', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#1F171C] text-[#FDFBF9] border-t border-[#342830]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Bangladesh Flagship Info */}
          <div className="space-y-4">
            <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-white">
              Avado Beauty
            </Link>
            <p className="text-sm text-[#D6C8CE] leading-relaxed">
              Curated international skincare, dermatologist favorites, and breathable cosmetics tailored for Bangladesh’s climate.
            </p>
            <div className="space-y-2.5 pt-2 text-sm text-[#E9DDE2]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E8C4B8] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Uttara, Sector 11, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E8C4B8] shrink-0" aria-hidden="true" />
                <a href="tel:01722371905" className="hover:text-[#E8C4B8] transition-colors tabular-nums">
                  01722371905
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E8C4B8] shrink-0" aria-hidden="true" />
                <span>care@avadobeauty.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Instagram @avadobeauty.bd (Demo link)', 'info');
                }}
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[#E9DDE2] hover:border-[#E8C4B8] hover:text-[#E8C4B8] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Facebook Avado Beauty Bangladesh (Demo link)', 'info');
                }}
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[#E9DDE2] hover:border-[#E8C4B8] hover:text-[#E8C4B8] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('YouTube Avado Beauty Guides (Demo link)', 'info');
                }}
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[#E9DDE2] hover:border-[#E8C4B8] hover:text-[#E8C4B8] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#E8C4B8] mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6C8CE]">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=skincare" className="hover:text-white transition-colors">
                  Skincare Essentials
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=makeup" className="hover:text-white transition-colors">
                  Makeup &amp; Lipsticks
                </Link>
              </li>
              <li>
                <Link to="/category/sunscreen" className="hover:text-white transition-colors">
                  SPF50+ Sunscreens
                </Link>
              </li>
              <li>
                <Link to="/category/serum" className="hover:text-white transition-colors">
                  Serums &amp; Essences
                </Link>
              </li>
              <li>
                <Link to="/shop?sale=true" className="hover:text-white transition-colors">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#E8C4B8] mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6C8CE]">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Flagship Studio
                </Link>
              </li>
              <li>
                <Link to="/beauty-tips" className="hover:text-white transition-colors">
                  Skincare &amp; Beauty Tips
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Demo Order History
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-white transition-colors">
                  Dhaka &amp; Nationwide Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Delivery Standards */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#E8C4B8] mb-4">
              Beauty Insider Notes
            </h3>
            <p className="text-sm text-[#D6C8CE] leading-relaxed mb-4">
              Seasonal routine guides, restock alerts on CeraVe &amp; COSRX, and member-only BDT savings.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#E8C4B8]"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#9E4D5D] hover:bg-[#833C4B] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-[#B7A6AE] mt-4">
              Delivery: ৳70 Dhaka (Free over ৳2,000) · ৳130 Nationwide · Cash on Delivery
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B7A6AE]">
          <p>© {new Date().getFullYear()} Avado Beauty · Uttara, Sector 11, Dhaka, Bangladesh</p>
          <p>Frontend E-Commerce Demo — Prices in BDT (৳). No real payments or orders processed.</p>
        </div>
      </div>
    </footer>
  );
};
