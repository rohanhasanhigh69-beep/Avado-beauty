import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Save, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatBDT } from '../utils/currency';

export const AccountPage: React.FC = () => {
  const { profile, updateProfile, demoOrders, wishlist } = useStore();
  const [formState, setFormState] = useState(profile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formState);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <div className="pb-6 border-b border-[#EADEE2]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D] mb-1.5">
          Local Browser Profile (Demo Only)
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
          Customer Profile &amp; Demo Orders
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Saved Delivery Profile */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-5 bg-white border border-[#EADEE2] rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#EADEE2]">
            <User className="w-5 h-5 text-[#9E4D5D]" />
            <h2 className="font-display text-xl font-semibold text-[#1F171C]">
              Saved Delivery Details
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              placeholder="e.g. Farhana Tasnim"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm tabular-nums focus:outline-none focus:border-[#9E4D5D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1">
                City
              </label>
              <select
                value={formState.city}
                onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] bg-white text-sm focus:outline-none focus:border-[#9E4D5D]"
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1">
              Email
            </label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1">
              Address
            </label>
            <textarea
              rows={2}
              value={formState.address}
              onChange={(e) => setFormState({ ...formState, address: e.target.value })}
              placeholder="House, Road, Sector, Area"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#9E4D5D] hover:bg-[#833C4B] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Locally
          </button>

          <p className="text-xs text-[#5A4A52]">
            Saved Wishlist Items: <Link to="/wishlist" className="font-semibold text-[#9E4D5D] hover:underline tabular-nums">{wishlist.length} items</Link>
          </p>
        </form>

        {/* Demo Orders History */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
            Recent Demo Orders ({demoOrders.length})
          </h2>

          {demoOrders.length === 0 ? (
            <div className="bg-white border border-[#EADEE2] rounded-2xl p-10 text-center space-y-3">
              <Package className="w-8 h-8 text-[#9E4D5D] mx-auto" />
              <p className="font-semibold text-[#1F171C]">No demo orders placed yet</p>
              <p className="text-sm text-[#5A4A52] max-w-sm mx-auto">
                Add items to your bag and complete the demo checkout to inspect simulated BDT receipts here.
              </p>
              <Link
                to="/shop"
                className="inline-block px-5 py-2.5 rounded-lg bg-[#9E4D5D] text-white text-xs font-semibold"
              >
                Shop Collection
              </Link>
            </div>
          ) : (
            demoOrders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white border border-[#EADEE2] rounded-2xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EADEE2]">
                  <div>
                    <p className="text-sm font-semibold text-[#1F171C] tabular-nums">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs text-[#5A4A52]">
                      {new Date(order.createdAt).toLocaleString()} · {order.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-700">
                      Confirmed (Demo)
                    </span>
                    <p className="text-base font-semibold text-[#1F171C] tabular-nums">
                      {formatBDT(order.total)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#5A4A52]">
                  {order.items.map((it) => (
                    <div
                      key={`${it.productId}-${it.variantLabel}`}
                      className="flex justify-between"
                    >
                      <span>
                        {it.name} ({it.variantLabel}) × {it.quantity}
                      </span>
                      <span className="tabular-nums font-medium text-[#1F171C]">
                        {formatBDT(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
