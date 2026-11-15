import React, { useState } from 'react';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Skincare Routine Advice');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast('Please enter your name and message.', 'warning');
      return;
    }
    showToast('Thank you! Your inquiry has been recorded (Demo Store).', 'success');
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="max-w-2xl mb-10 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E4D5D]">
          Visit or Message Us
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#1F171C]">
          Avado Beauty Dhaka Studio
        </h1>
        <p className="text-base text-[#5A4A52]">
          Need shade matching, routine guidance, or delivery help? Reach our beauty advisors in Uttara.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Business Details */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F9F0F2] text-[#9E4D5D] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1F171C]">Flagship Location</h2>
                <p className="text-sm text-[#5A4A52] mt-1">
                  Uttara, Sector 11, Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F9F0F2] text-[#9E4D5D] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1F171C]">Customer Care Hotline</h2>
                <a
                  href="tel:01722371905"
                  className="text-sm font-semibold text-[#9E4D5D] hover:underline mt-1 inline-block tabular-nums"
                >
                  01722371905
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F9F0F2] text-[#9E4D5D] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1F171C]">Email Support</h2>
                <p className="text-sm text-[#5A4A52] mt-1">care@avadobeauty.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F9F0F2] text-[#9E4D5D] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1F171C]">Studio Hours</h2>
                <p className="text-sm text-[#5A4A52] mt-1">
                  Saturday – Thursday: 10:00 AM – 8:00 PM
                </p>
                <p className="text-xs text-[#5A4A52] mt-0.5">Friday: 3:00 PM – 8:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F1F8] border border-[#EADEE2] rounded-2xl p-6 text-sm text-[#5A4A52]">
            <p className="font-semibold text-[#1F171C] mb-1">Nationwide Delivery Rates</p>
            <p>Inside Dhaka Metro: ৳70 (Complimentary on orders over ৳2,000)</p>
            <p className="mt-1">Outside Dhaka (Steadfast / Pathao Courier): ৳130</p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white border border-[#EADEE2] rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <h2 className="font-display text-2xl font-semibold text-[#1F171C]">
            Send a Message
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cnt-name" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                Your Name *
              </label>
              <input
                id="cnt-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samira Rahman"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
              />
            </div>

            <div>
              <label htmlFor="cnt-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                Phone Number
              </label>
              <input
                id="cnt-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm tabular-nums focus:outline-none focus:border-[#9E4D5D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cnt-email" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                Email Address
              </label>
              <input
                id="cnt-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
              />
            </div>

            <div>
              <label htmlFor="cnt-subject" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
                Inquiry Topic
              </label>
              <select
                id="cnt-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] bg-white text-sm focus:outline-none focus:border-[#9E4D5D]"
              >
                <option>Skincare Routine Advice</option>
                <option>Shade Matching Help</option>
                <option>Delivery &amp; Shipping Query</option>
                <option>Product Availability</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="cnt-msg" className="block text-xs font-semibold uppercase tracking-wider text-[#5A4A52] mb-1.5">
              Message *
            </label>
            <textarea
              id="cnt-msg"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us your skin type, shade preference, or question..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADEE2] text-sm focus:outline-none focus:border-[#9E4D5D]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#9E4D5D] hover:bg-[#833C4B] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
