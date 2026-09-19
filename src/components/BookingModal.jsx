import React, { useState } from 'react';
import { X, Phone, MapPin, Calendar, Clock, CheckCircle, Send, Sparkles } from 'lucide-react';

export default function BookingModal({ artisan, userProblem, isOpen, onClose, onBookingSuccess }) {
  if (!isOpen || !artisan) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Ikeja, Lagos');
  const [preferredTime, setPreferredTime] = useState('Today (As soon as possible)');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onBookingSuccess({
        artisan,
        customerName: customerName || 'Customer',
        phone,
        address,
        preferredTime,
        problemSummary: userProblem?.rawProblem || 'Service request'
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl border-2 border-emerald-400/40 shadow-2xl p-6 md:p-8 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-300/60 hover:text-emerald-100 p-1.5 rounded-xl hover:bg-emerald-900/50"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={artisan.avatar} alt={artisan.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-400/40" />
              <div>
                <span className="text-xs text-emerald-400 font-semibold block">SEND SERVICE ENQUIRY</span>
                <h3 className="font-heading font-bold text-lg text-emerald-50">{artisan.name}</h3>
              </div>
            </div>

            {/* Problem Pre-fill Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 mb-5">
              <span className="text-[11px] text-emerald-400 font-semibold block mb-0.5">Attached AI Request:</span>
              <p className="text-xs text-emerald-200 line-clamp-2 italic">
                "{userProblem?.rawProblem || 'Requesting service evaluation'}"
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Ogunlesi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">Phone Number (For WhatsApp / Call)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0803 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">Service Location Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14 Allen Avenue, Ikeja Lagos"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">Preferred Arrival Time</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-emerald-100"
                >
                  <option value="Today (As soon as possible)">Today (As soon as possible)</option>
                  <option value="Tomorrow Morning (9:00 AM)">Tomorrow Morning (9:00 AM)</option>
                  <option value="Tomorrow Afternoon (2:00 PM)">Tomorrow Afternoon (2:00 PM)</option>
                  <option value="Weekend (Saturday)">Weekend (Saturday)</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="emerald-button-gradient w-full py-3 rounded-xl text-sm font-bold text-emerald-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
                >
                  <Send className="w-4 h-4 fill-emerald-950" />
                  <span>Send Enquiry to {artisan.ownerName.split(' ')[0]}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="font-heading font-extrabold text-2xl text-emerald-100">
              Enquiry Dispatched!
            </h3>

            <p className="text-xs md:text-sm text-emerald-200/90 leading-relaxed max-w-sm mx-auto">
              We sent your structured request to <span className="text-emerald-300 font-bold">{artisan.name}</span>. They will call or message your line shortly!
            </p>

            <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/20 text-xs text-emerald-300">
              Typical response time: <span className="font-bold text-emerald-200">{artisan.responseTime}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
