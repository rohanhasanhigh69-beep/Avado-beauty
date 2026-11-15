import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowRight, PackageCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DemoOrder } from '../types';
import { formatBDT } from '../utils/currency';
import { SafeImage } from '../components/SafeImage';

export const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { demoOrders } = useStore();
  const stateOrder = (location.state as { order?: DemoOrder } | null)?.order;
  const order = stateOrder ?? demoOrders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-semibold text-[#1F171C]">
          No Recent Demo Order Found
        </h1>
        <p className="text-sm text-[#5A4A52]">
          Place an order from your beauty bag to view your simulated BDT receipt.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  const paymentLabels: Record<DemoOrder['paymentMethod'], string> = {
    cod: 'Cash on Delivery (COD)',
    bkash: 'bKash (Simulated)',
    nagad: 'Nagad (Simulated)',
    card: 'Card Payment (Simulated)',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-3 pb-6 border-b border-[#EADEE2]">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D]">
            Order #{order.orderNumber} Confirmed (Demo)
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F171C]">
            Thank you, {order.customerName}
          </h1>
          <p className="text-sm text-[#5A4A52] max-w-md mx-auto">
            Your simulated Avado Beauty order has been recorded locally. Remember, this is a frontend demonstration—no real dispatch or financial charge occurs.
          </p>
        </div>

        {/* Delivery & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="bg-[#FDFBF9] border border-[#EADEE2] rounded-xl p-4 space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
              Delivery Details
            </p>
            <p className="font-semibold text-[#1F171C]">{order.customerName}</p>
            <p className="text-[#5A4A52] tabular-nums">{order.phone}</p>
            <p className="text-[#5A4A52]">{order.email}</p>
            <p className="text-[#1F171C]">
              {order.address}, {order.city}
            </p>
            {order.notes && (
              <p className="text-xs text-[#5A4A52] pt-1">Note: {order.notes}</p>
            )}
          </div>

          <div className="bg-[#FDFBF9] border border-[#EADEE2] rounded-xl p-4 space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5A4A52]">
              Order Status &amp; Payment
            </p>
            <p className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <PackageCheck className="w-4 h-4" />
              Confirmed — Preparing Demo Shipment
            </p>
            <p className="text-[#1F171C]">Method: {paymentLabels[order.paymentMethod]}</p>
            <p className="text-xs text-[#5A4A52]">
              Dispatched from: Uttara, Sector 11, Dhaka
            </p>
            <p className="text-xs text-[#5A4A52] tabular-nums">
              Support: 01722371905
            </p>
          </div>
        </div>

        {/* Itemized Receipt */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-[#1F171C]">
            Receipt Summary
          </h2>
          <div className="divide-y divide-[#EADEE2] border-y border-[#EADEE2]">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.variantLabel}`}
                className="py-3.5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F9F0F2] shrink-0">
                  <SafeImage src={item.image} alt={item.name} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1F171C] truncate">
                    {item.brand} — {item.name}
                  </p>
                  <p className="text-xs text-[#5A4A52]">
                    {item.variantLabel} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#1F171C] tabular-nums">
                  {formatBDT(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-sm pt-2">
            <div className="flex justify-between text-[#5A4A52]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatBDT(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon ({order.couponCode})</span>
                <span className="tabular-nums">-{formatBDT(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#5A4A52]">
              <span>Delivery Fee</span>
              <span className="tabular-nums">
                {order.shippingFee === 0 ? 'Free' : formatBDT(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-[#1F171C] pt-2 border-t border-[#EADEE2]">
              <span>Total Paid / Payable (BDT)</span>
              <span className="tabular-nums">{formatBDT(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#9E4D5D] text-white text-sm font-semibold hover:bg-[#833C4B] transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/account"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#EADEE2] text-[#1F171C] text-sm font-semibold hover:bg-[#F9F0F2] transition-colors"
          >
            View Demo Order History
          </Link>
        </div>
      </div>
    </div>
  );
};
