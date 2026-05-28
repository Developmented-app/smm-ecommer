import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw, ShoppingBag, Link2, Coins, AlertCircle, Sparkles, AlertTriangle } from 'lucide-react';
import { Order, SMMService, User } from '../types.js';

interface ReorderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  services: SMMService[];
  user: User | null;
  token: string;
  lang: 'en' | 'km';
  triggerNotification: (type: 'success' | 'error', msg: string) => void;
  onOrderPlaced: () => void;
}

export function ReorderDrawer({
  isOpen,
  onClose,
  order,
  services,
  user,
  token,
  lang,
  triggerNotification,
  onOrderPlaced
}: ReorderDrawerProps) {
  const [targetLink, setTargetLink] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const service = order 
    ? (services.find(s => s.id === order.serviceId) || services.find(s => s.name === order.serviceName))
    : null;

  // Sync state with pre-filled details when drawer is opened/changed
  useEffect(() => {
    if (order) {
      setTargetLink(order.link || '');
      setQuantity(order.quantity || 0);
    }
  }, [order]);

  const km = lang === 'km';

  // Dynamic cost calculation
  const calculatedCharge = service && quantity 
    ? parseFloat(((service.price * quantity) / 1000).toFixed(4))
    : 0.00;

  const isLowBalance = user ? user.balance < calculatedCharge : true;
  const isOutOfLimits = service ? (quantity < service.min || quantity > service.max) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    let finalLink = targetLink.trim();
    if (service.isProduct && !finalLink) {
      finalLink = "Instant Download / Delivery";
    }

    if (!finalLink || !quantity) {
      triggerNotification('error', km ? 'សូមបំពេញព័ត៌មានដែលត្រូវការឱ្យបានត្រឹមត្រូវ!' : 'Please fill out all order parameters');
      return;
    }

    if (quantity < service.min || quantity > service.max) {
      triggerNotification('error', km 
        ? `បរិមាណត្រូវតែស្ថិតនៅចន្លោះ [${service.min} - ${service.max}]` 
        : `Requested quantities must be between [${service.min} - ${service.max}]`
      );
      return;
    }

    if (isLowBalance) {
      triggerNotification('error', km ? 'សមតុល្យទឹកប្រាក់មិនគ្រប់គ្រាន់សម្រាប់ការបញ្ជាទិញនេះទេ!' : 'Insufficient wallet balance for this order!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: service.id,
          link: finalLink,
          quantity: quantity
        })
      });

      const data = await response.json();
      if (response.ok) {
        triggerNotification('success', km 
          ? `ការបញ្ជាទិញលេខ ${data.id} ត្រូវបានដាក់ដោយជោគជ័យ!` 
          : `Order ${data.id} placed successfully via quick reorder!`
        );
        onOrderPlaced();
        onClose();
      } else {
        triggerNotification('error', data.error || (km ? 'មិនអាចបង្កើតការបញ្ជាទិញបានទេ' : 'Unable to place order'));
      }
    } catch (e: any) {
      triggerNotification('error', km ? `កំហុសក្នុងការតភ្ជាប់៖ ${e.message}` : `Connection error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            id="reorder-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-all duration-300 pointer-events-auto"
          />

          {/* Sliding Panel */}
          <motion.div
            id="reorder-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 z-50 flex flex-col justify-between overflow-hidden pointer-events-auto"
          >
            {/* Header section with category and simple close */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-650 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 font-extrabold text-[10px] tracking-wide rounded-full uppercase">
                  {service?.category || km ? 'សកម្មភាពរហ័ស' : 'QUICK ACTION'}
                </span>
                <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest">
                  ID: #{order.id.slice(0, 8)}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5 pt-1">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span>{km ? 'ទិញម្តងទៀតរហ័ស' : 'Quick Reorder'}</span>
              </h2>
              <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">
                {km 
                  ? 'កែប្រែព័ត៌មានលម្អិតខាងក្រោមដើម្បីទិញសេវាកម្មនេះម្តងទៀតភ្លាមៗ។' 
                  : 'Adjust links and quantity parameter settings below to recreate this order immediately.'}
              </p>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Product/Service Information card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/25 border border-slate-150/80 text-left">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                      {km ? 'សេវាកម្មដែលបានជ្រើសរើស' : 'Selected Service'}
                    </h4>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight mt-1 leading-snug">
                      {service?.name || order.serviceName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans mt-1.5 italic">
                      {service?.description || km ? 'គ្មានការពិពណ៌នា' : 'No description available'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-150 flex items-center justify-between text-xs font-mono text-slate-500">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">{km ? 'តម្លៃក្នុង ១ពាន់' : 'Rate /1,000'}</span>
                    <strong className="text-slate-800 text-sm font-black leading-none mt-1 block">${service?.price.toFixed(2) || '0.00'}</strong>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">{km ? 'ដែនកំណត់បរិមាណ' : 'Bounds (Min-Max)'}</span>
                    <strong className="text-slate-800 text-sm font-black leading-none mt-1 block font-mono">
                      {service ? `${service.min.toLocaleString()} - ${service.max.toLocaleString()}` : '--'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Target Link input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-slate-400" />
                  <span>{km ? 'តំណភ្ជាប់គោលដៅ (Target Link)' : 'Target/Destination Link'}</span>
                </label>
                <input
                  type="text"
                  required={!service?.isProduct}
                  disabled={service?.isProduct}
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  placeholder={service?.isProduct ? (km ? 'ទំនិញឌីជីថល៖ ដឹកជញ្ជូនភ្លាមៗ' : 'Digital item: Instant Delivery') : "https://instagram.com/p/..."}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/80 shadow-2xs font-sans transition-all text-slate-700"
                />
                {!service?.isProduct && (
                  <span className="text-[10px] text-slate-400 block leading-normal pt-1 pl-1">
                    {km ? 'បញ្ចូលគណនី Profile ឬលីងផុសដែលត្រូវបញ្ជូនសេវាកម្ម។' : 'Provide the social page or content hyperlink to deposit traffic.'}
                  </span>
                )}
              </div>

              {/* Quantity input */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {km ? 'បរិមាណកម្ម៉ង់' : 'Order Quantity'}
                  </label>
                  {service && (
                    <span className="text-[10px] text-slate-400 font-sans font-bold">
                      {km ? `ចន្លោះពី ${service.min} - ${service.max}` : `Range: ${service.min} - ${service.max}`}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  required
                  step="50"
                  min={service?.min || 10}
                  max={service?.max || 100000}
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 font-mono transition-all ${
                    isOutOfLimits ? 'border-amber-400 text-amber-600 focus:border-amber-400' : 'border-slate-200 focus:border-blue-500/80 text-slate-700 hover:border-slate-350'
                  }`}
                />
                {isOutOfLimits && service && (
                  <div className="flex items-center gap-1 text-amber-600 text-[10px] pt-1.5 px-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      {km 
                        ? `បរិមាណត្រូវតែកែតម្រូវចន្លោះ ${service.min.toLocaleString()} ដល់ ${service.max.toLocaleString()}!` 
                        : `Adjust quantities between ${service.min.toLocaleString()} and ${service.max.toLocaleString()}!`
                      }
                    </span>
                  </div>
                )}
              </div>

              {/* Cost widget card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 text-left space-y-3.5">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-150">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-slate-400" />
                    <span>{km ? 'តម្លៃប៉ាន់ស្មាន' : 'Estimated Cost'}</span>
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-800 font-mono leading-none">${calculatedCharge.toFixed(3)}</span>
                    <span className="text-[10px] font-bold text-slate-450 ml-1">USD</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-450 font-bold">{km ? 'កាបូបលុយរបស់អ្នក៖' : 'Available Wallet:'}</span>
                  <strong className="text-slate-700 font-bold font-mono">${user?.balance.toFixed(2) || '0.00'} USD</strong>
                </div>

                {isLowBalance && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-2 text-[10px]">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-extrabold leading-normal">
                        {km 
                          ? `⚠️ ខ្វះសមតុល្យឥណទាន! សូមเติม ${ (calculatedCharge - (user?.balance || 0)).toFixed(2) } USD.`
                          : `⚠️ Insufficient credit! Top up with ${ (calculatedCharge - (user?.balance || 0)).toFixed(2) } USD.`
                        }
                      </p>
                      <p className="font-medium text-red-650 font-sans">
                        {km 
                          ? 'សូមធ្វើការបញ្ចូលលុយទៅក្នុងគណនីរបស់អ្នកជាមុនសិន។'
                          : 'Please recharge SMM budgets in the dashboard.'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </form>

            {/* Footer with actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-100 text-slate-500 font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer transition-all active:scale-98"
              >
                {km ? 'បោះបង់' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={isSubmitting || isOutOfLimits || isLowBalance || quantity <= 0}
                onClick={handleSubmit}
                className={`flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSubmitting || isOutOfLimits || isLowBalance || quantity <= 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-blue-200" />
                )}
                <span>{km ? 'បញ្ជាក់ការកម្ម៉ង់' : 'Confirm Reorder'}</span>
              </button>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
