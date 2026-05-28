import React, { useState } from 'react';
import { Star, MessageSquare, Check, RefreshCw, Edit2, BarChart2 } from 'lucide-react';
import { Order } from '../types.js';

interface OrderFeedbackPanelProps {
  order: Order;
  orders?: Order[];
  token: string;
  lang: 'en' | 'km';
  onFeedbackSaved: (updatedOrder: Order) => void;
  triggerNotification: (type: 'success' | 'error', msg: string) => void;
}

export function OrderFeedbackPanel({
  order,
  orders = [],
  token,
  lang,
  onFeedbackSaved,
  triggerNotification
}: OrderFeedbackPanelProps) {
  const [rating, setRating] = useState<number>(order.rating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>(order.reviewComment || '');
  const [isEditing, setIsEditing] = useState<boolean>(!order.rating);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      triggerNotification('error', lang === 'km' ? 'សូមជ្រើសរើសផ្កាយពី ១ ដល់ ៥!' : 'Please pick 1 to 5 stars!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          reviewComment: reviewComment.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      triggerNotification('success', lang === 'km' ? 'បានរក្សាទុកមតិយោបល់ដោយជោគជ័យ!' : 'Feedback submitted successfully!');
      onFeedbackSaved(data);
      setIsEditing(false);
    } catch (err: any) {
      triggerNotification('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    setRating(order.rating || 5);
    setReviewComment(order.reviewComment || '');
    setIsEditing(true);
  };

  const km = lang === 'km';

  // Aggregate ratings calculations
  const ratedOrders = orders.filter(
    (o) => o.status === 'completed' && typeof o.rating === 'number' && o.rating > 0
  );
  const totalRatings = ratedOrders.length;
  const sumRatings = ratedOrders.reduce((sum, o) => sum + (o.rating || 0), 0);
  const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : '0.0';

  // Calculate percentage breakdown for 5★, 4★, 3★, 2★, 1★
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = ratedOrders.filter((o) => o.rating === star).length;
    const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
    return { star, count, percentage };
  });

  return (
    <div className="mt-4 p-5 rounded-2xl border transition-all duration-300 bg-gradient-to-br from-slate-50 to-white border-slate-200/80 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: User's individual rating form or rating summary */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          
          {!isEditing ? (
            /* Read-only submitted feedback view */
            <div className="space-y-3.5 text-left h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {km ? 'ការវាយតម្លៃរបស់អ្នក' : 'Your Shared Feedback'}
                </span>
                
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4.5 h-4.5 ${
                          star <= (order.rating || 0)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    ({order.rating}/5)
                  </span>
                </div>

                {order.reviewComment ? (
                  <p className="text-xs text-slate-600 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 font-sans italic mt-2.5 shadow-2xs">
                    "{order.reviewComment}"
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 italic font-sans mt-2">
                    {km ? 'គ្មានមតិយោបល់សរសេរទុកទេ។' : 'No written comments shared.'}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Edit2 className="w-3 h-3 text-blue-500" />
                  <span>{km ? 'កែប្រែការវាយតម្លៃ' : 'Edit Review'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Interactive feedback inputs */
            <form onSubmit={handleSubmit} className="space-y-4 text-left h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {km ? 'វាយតម្លៃសេវាកម្មនេះ' : 'Rate Your Experience'}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-sans">
                      {km 
                        ? 'តើលោកអ្នកពេញចិត្តនឹងល្បឿន និងគុណភាពសេវាកម្មនេះកម្រិតណា?' 
                        : 'How satisfied were you with this order speed & quality?'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isActive = hoverRating ? star <= hoverRating : star <= rating;
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-125 active:scale-95 transition-transform cursor-pointer focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 transition-all ${
                                isActive 
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-sm' 
                                  : 'text-slate-200 hover:text-slate-350'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-extrabold text-slate-650 font-mono w-10 text-center">
                      {rating > 0 ? `${rating}/5` : '--/5'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-id flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{km ? 'មតិយោបល់មតិកែលម្អ (មិនបង្ខំ)' : 'Optional Comments & Detail'}</span>
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={km 
                      ? 'ឧទាហរណ៍៖ សេវាកម្មលឿនណាស់! គាំទ្រ ១០០%...' 
                      : 'Example: Super fast delivery, and premium account profiles! Will buy again...'}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 font-sans shadow-2xs transition-all text-slate-700 min-h-[50px] resize-y"
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-2">
                {!order.rating ? null : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-[10px] font-extrabold text-slate-400 hover:text-slate-600 uppercase tracking-wide transition-all cursor-pointer"
                  >
                    {km ? 'បោះបង់' : 'Cancel'}
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className={`px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wide transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                    rating === 0 || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3 text-emerald-400" />
                  )}
                  <span>{km ? 'ផ្ញើមតិយោបល់' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Diagonal Split border for desktop views */}
        <div className="hidden md:block col-span-1 w-px bg-slate-150 mx-auto self-stretch"></div>

        {/* Right Column: Community Feedback & Percent Breakdowns Summary */}
        <div className="col-span-1 md:col-span-4 bg-slate-100/50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between text-left space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-slate-450 pb-2">
              <BarChart2 className="w-4 h-4 text-slate-500" />
              <h5 className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest">
                {km ? 'សេចក្តីសង្ខេបការវាយតម្លៃ' : 'Overall Service Ratings'}
              </h5>
            </div>

            {/* Average rating summary visual box */}
            <div className="flex items-center gap-3.5 bg-white border border-slate-150 rounded-xl p-3 shadow-3xs mb-4">
              <div className="text-center shrink-0">
                <span className="block text-2xl font-black text-slate-800 tracking-tight font-mono leading-none">
                  {averageRating}
                </span>
                <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                  {km ? 'ក្នុង ៥' : 'out of 5'}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(Number(averageRating))
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-sans font-semibold leading-tight">
                  {km 
                    ? `ផ្អែកលើការវាយតម្លៃចំនួន ${totalRatings}` 
                    : `Based on ${totalRatings} rating${totalRatings === 1 ? '' : 's'}`}
                </p>
              </div>
            </div>

            {/* Percentage details rows */}
            <div className="space-y-1.5">
              {distribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span className="w-4 text-right font-extrabold text-slate-600">{star}★</span>
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right font-bold text-slate-500">{percentage}%</span>
                  <span className="text-[9px] text-slate-350 font-sans font-medium">({count})</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[9px] text-slate-405 italic font-sans pt-1 border-t border-slate-150/60 leading-normal">
            {km 
              ? 'ស្ថិតិគណនាដោយស្វ័យប្រវត្តិចេញពីគ្រប់កម្ម៉ង់ដែលបានបញ្ចប់។' 
              : 'Computed dynamically from all completed orders in real time.'}
          </p>
        </div>

      </div>
    </div>
  );
}
