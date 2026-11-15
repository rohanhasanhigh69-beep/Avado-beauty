import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, CreditCard, ShieldCheck, Smartphone, Tag, Truck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { getItemUnitPrice, useStore } from '../context/StoreContext';
import { DemoOrder, PaymentMethod } from '../types';
import { calculateShippingFee, formatBDT } from '../utils/currency';
import { SafeImage } from '../components/SafeImage';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    couponCode,
    couponDiscount,
    applyCoupon,
    clearCoupon,
    profile,
    placeDemoOrder,
    showToast,
  } = useStore();

  const [customerName, setCustomerName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [city, setCity] = useState(profile.city || 'Dhaka');
  const [address, setAddress] = useState(profile.address);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [couponInput, setCouponInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const netSubtotal = Math.max(0, cartSubtotal - couponDiscount);
  const shippingFee = calculateShippingFee(netSubtotal, city);
  const total = netSubtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-3xl font-semibold text-[#1F171C]">
          Your bag is empty
        </h1>
        <p className="text-sm text-[#5A4A52]">
          Please add at least one product before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!customerName.trim()) nextErrors.customerName = 'Full name is required.';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      nextErrors.phone = 'Enter a valid Bangladesh phone number (e.g. 017XXXXXXXX).';
    }
    if (!email.trim() || !email.includes('@')) {
      nextErrors.email = 'Enter a valid email address for demo receipt.';
    }
    if (!address.trim() || address.trim().length < 8) {
      nextErrors.address = 'Enter your full house, road, and area address.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please complete the highlighted delivery fields.', 'warning');
      return;
    }

    const orderItems = cart
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          variantLabel: item.variantLabel,
          unitPrice: getItemUnitPrice(product, item.variantId),
          quantity: item.quantity,
          image: product.images[0],
        };
      })
      .filter((i): i is NonNullable<typeof i> => Boolean(i));

    const order: DemoOrder = {
      orderNumber: `AVD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city,
      address: address.trim(),
      notes: notes.trim(),
      paymentMethod,
      couponCode: couponCode || undefined,
      subtotal: cartSubtotal,
      discountAmount: couponDiscount,
      shippingFee,
      total,
      items: orderItems,
    };

    placeDemoOrder(order);
    navigate('/order-confirmation', { state: { order } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Explicit Demo Notice */}
      <div className="mb-8 bg-[#F4F1F8] border border-[#EADEE2] rounded-xl px-5 py-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#9E4D5D] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs sm:text-sm text-[#1F171C]">
          <p className="font-semibold">
            Demo Checkout Only — No Real Orders or Payments Are Processed
          </p>
          <p className="text-[#5A4A52] mt-0.5">
            This storefront is a frontend e-commerce demonstration for Avado Beauty. Submitting generates a local simulated receipt in your browser.
          </p>
        </div>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C] mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
              Customer &amp; Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-name" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                  Full Name *
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tasnim Tabassum"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
                />
                {errors.customerName && (
                  <p className="text-xs text-[#9E4D5D] mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="chk-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                  Phone Number *
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm tabular-nums focus:outline-none focus:border-[#9E4D5D]"
                />
                {errors.phone && (
                  <p className="text-xs text-[#9E4D5D] mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-email" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                  Email Address *
                </label>
                <input
                  id="chk-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
                />
                {errors.email && (
                  <p className="text-xs text-[#9E4D5D] mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="chk-city" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                  City / Division *
                </label>
                <select
                  id="chk-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] bg-white text-sm focus:outline-none focus:border-[#9E4D5D]"
                >
                  <option value="Dhaka">Dhaka (৳70 · Free over ৳2,000)</option>
                  <option value="Chattogram">Chattogram (৳130)</option>
                  <option value="Sylhet">Sylhet (৳130)</option>
                  <option value="Rajshahi">Rajshahi (৳130)</option>
                  <option value="Khulna">Khulna (৳130)</option>
                  <option value="Barishal">Barishal (৳130)</option>
                  <option value="Rangpur">Rangpur (৳130)</option>
                  <option value="Mymensingh">Mymensingh (৳130)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="chk-address" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                Full Delivery Address *
              </label>
              <textarea
                id="chk-address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Sector/Block, Area (e.g. House 14, Road 7, Uttara Sector 11)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
              />
              {errors.address && (
                <p className="text-xs text-[#9E4D5D] mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label htmlFor="chk-notes" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                Order Notes (Optional)
              </label>
              <input
                id="chk-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Delivery timing preference or gift wrapping note"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
              />
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
              Payment Method (Demo Simulation)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'cod' as PaymentMethod,
                  title: 'Cash on Delivery (COD)',
                  desc: 'Pay rider in cash upon delivery',
                  icon: Truck,
                },
                {
                  id: 'bkash' as PaymentMethod,
                  title: 'bKash (Simulated)',
                  desc: 'Instant simulated mobile wallet',
                  icon: Smartphone,
                },
                {
                  id: 'nagad' as PaymentMethod,
                  title: 'Nagad (Simulated)',
                  desc: 'Instant simulated mobile wallet',
                  icon: Smartphone,
                },
                {
                  id: 'card' as PaymentMethod,
                  title: 'Visa / Mastercard (Simulated)',
                  desc: 'Demo card authorization only',
                  icon: CreditCard,
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-[#9E4D5D] bg-[#F9F0F2]'
                        : 'border-[#EADEE2] bg-white hover:border-[#C88D96]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#9E4D5D] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1F171C]">{opt.title}</p>
                      <p className="text-xs text-[#5A4A52] mt-0.5">{opt.desc}</p>
                    </div>
                    {active && <CheckCircle2 className="w-4 h-4 text-[#9E4D5D] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <aside className="lg:col-span-5 bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-7 space-y-5 sticky top-24">
          <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
            Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              if (!product) return null;
              const unitPrice = getItemUnitPrice(product, item.variantId);
              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center gap-3 pb-3 border-b border-[#EADEE2]/70"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F9F0F2] shrink-0">
                    <SafeImage src={product.images[0]} alt={product.name} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1F171C] truncate">{product.name}</p>
                    <p className="text-xs text-[#5A4A52]">
                      {item.variantLabel} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#1F171C] tabular-nums">
                    {formatBDT(unitPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Coupon */}
          {couponCode ? (
            <div className="flex items-center justify-between bg-[#F4F1F8] px-3.5 py-2.5 rounded-lg text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#1F171C]">
                <Tag className="w-3.5 h-3.5 text-[#9E4D5D]" />
                <strong>{couponCode}</strong> applied (-{formatBDT(couponDiscount)})
              </span>
              <button
                type="button"
                onClick={clearCoupon}
                className="text-[#9E4D5D] font-semibold hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Promo code (AVADO10 / GLOW200)"
                className="flex-1 px-3 py-2 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
              />
              <button
                type="button"
                onClick={() => {
                  const res = applyCoupon(couponInput);
                  if (res.valid) setCouponInput('');
                }}
                className="px-4 py-2 rounded-lg border border-[#1F171C] text-xs font-semibold text-[#1F171C] hover:bg-[#1F171C] hover:text-white transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          <div className="space-y-2 text-sm pt-2 border-t border-[#EADEE2]">
            <div className="flex justify-between text-[#5A4A52]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatBDT(cartSubtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount</span>
                <span className="tabular-nums">-{formatBDT(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#5A4A52]">
              <span>Shipping ({city})</span>
              <span className="tabular-nums">
                {shippingFee === 0 ? 'Free' : formatBDT(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-[#1F171C] pt-3 border-t border-[#EADEE2]">
              <span>Total Payable (BDT)</span>
              <span className="tabular-nums">{formatBDT(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-lg bg-[#9E4D5D] hover:bg-[#833C4B] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Place Demo Order ({formatBDT(total)})
          </button>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#5A4A52]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9E4D5D]" />
            Demo order only — no real payment is charged.
          </p>
        </aside>
      </form>
    </div>
  );
};
