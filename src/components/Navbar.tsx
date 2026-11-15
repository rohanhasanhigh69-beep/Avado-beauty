import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    cartTotalQuantity,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
  } = useStore();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Skincare', to: '/shop?collection=skincare' },
    { label: 'Makeup', to: '/shop?collection=makeup' },
    { label: 'Beauty Tips', to: '/beauty-tips' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <>
      {showAnnouncement && (
        <div className="bg-[#1F171C] text-[#FDFBF9] text-xs px-4 py-2 flex items-center justify-center relative">
          <p className="text-center pr-6 truncate">
            Complimentary Dhaka delivery over ৳2,000 · Use code <span className="font-semibold text-[#E8C4B8]">AVADO10</span> for 10% off (Demo Store)
          </p>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 p-1 text-[#FDFBF9]/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#FDFBF9]/95 backdrop-blur-md border-b border-[#EADEE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 -ml-2 text-[#1F171C] hover:text-[#9E4D5D] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link
              to="/"
              className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#1F171C] whitespace-nowrap shrink-0"
            >
              Avado Beauty
            </Link>
          </div>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#5A4A52]"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    isActive && item.to === '/'
                      ? 'border-[#9E4D5D] text-[#1F171C]'
                      : 'border-transparent hover:text-[#1F171C] hover:border-[#C88D96]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Utility & Primary Bag Action */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              to="/account"
              aria-label="Account and demo orders"
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>

            <Link
              to="/wishlist"
              aria-label={`Wishlist (${wishlist.length} saved items)`}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#1F171C] hover:bg-[#F9F0F2] transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#9E4D5D] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag (${cartTotalQuantity} items)`}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#9E4D5D] text-white text-xs sm:text-sm font-semibold hover:bg-[#833C4B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Bag</span>
              <span className="tabular-nums">({cartTotalQuantity})</span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EADEE2] bg-[#FDFBF9] px-4 py-4 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#1F171C] hover:bg-[#F9F0F2] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-[#EADEE2] flex items-center gap-3">
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg border border-[#EADEE2] text-sm font-medium text-[#1F171C]"
              >
                Demo Account
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg bg-[#1F171C] text-white text-sm font-medium"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
