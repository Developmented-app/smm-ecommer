import React, { useState } from 'react';
import { FileText, Check, Edit2, RefreshCw } from 'lucide-react';
import { Order } from '../types.js';

interface OrderNotesPanelProps {
  order: Order;
  token: string;
  lang: 'en' | 'km';
  onNotesSaved: (updatedOrder: Order) => void;
  triggerNotification: (type: 'success' | 'error', msg: string) => void;
}

export function OrderNotesPanel({
  order,
  token,
  lang,
  onNotesSaved,
  triggerNotification
}: OrderNotesPanelProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [notesStr, setNotesStr] = useState<string>(order.notes || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const km = lang === 'km';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: notesStr })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update notes');
      }

      triggerNotification('success', km ? 'បានរក្សាទុកកំណត់ត្រាដោយជោគជ័យ!' : 'Order notes updated successfully!');
      onNotesSaved(data);
      setIsEditing(false);
    } catch (err: any) {
      triggerNotification('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNotesStr(order.notes || '');
    setIsEditing(false);
  };

  return (
    <div className="mt-3 p-4 rounded-xl border border-slate-150 bg-slate-50 text-left transition-all duration-300">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-500" />
          <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
            {km ? 'កំណត់ត្រា និងការរំលឹក' : 'Order Notes & Reminders'}
          </h5>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-[9px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer shadow-3xs"
          >
            <Edit2 className="w-2.5 h-2.5 text-indigo-500" />
            <span>{km ? 'កែប្រែកំណត់ត្រា' : 'Edit Note'}</span>
          </button>
        )}
      </div>

      <div className="mt-2.5">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-2.5">
            <textarea
              value={notesStr}
              onChange={(e) => setNotesStr(e.target.value)}
              placeholder={km 
                ? 'បញ្ជាក់ចំណាំជាក់លាក់ ឬកម្មវិធីរំលឹកសម្រាប់កម្ម៉ង់នេះនៅទីនេះ...' 
                : 'Example: Target user @coolguy, boost content, client campaign #102...'}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 font-sans shadow-3xs transition-all text-slate-700 min-h-[60px] resize-y focus:outline-none"
              maxLength={400}
            />
            <div className="flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-[9px] font-bold text-slate-400 hover:text-slate-650 uppercase tracking-wide transition-all cursor-pointer"
              >
                {km ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-lg text-[9px] uppercase tracking-wide transition-all inline-flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                ) : (
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                )}
                <span>{km ? 'រក្សាទុក' : 'Save'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div>
            {order.notes ? (
              <p className="text-xs text-slate-600 font-sans italic bg-white border border-slate-100 rounded-lg p-2.5 shadow-3xs leading-relaxed break-words whitespace-pre-wrap">
                "{order.notes}"
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 italic font-sans py-1">
                {km 
                  ? 'គ្មានការណែនាំ ឬការរំលឹកដែលបានភ្ជាប់ទេ។ សូមចុច "កែប្រែកំណត់ត្រា" ដើម្បីបន្ថែម។' 
                  : 'No specific notes or reminders attached. Click "Edit Note" to add details.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
