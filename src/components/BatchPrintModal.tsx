import React, { useState } from 'react';
import { Participant } from '../types';
import { IdCardPreview } from './IdCardPreview';
import { X, Printer, CheckSquare, Square, Download, Sparkles } from 'lucide-react';
import { toBengaliNumber } from '../utils/bengali';

interface BatchPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  isOpen,
  onClose,
  participants,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(participants.map(p => p.id))
  );

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    setSelectedIds(new Set(participants.map(p => p.id)));
  };

  const clearAll = () => {
    setSelectedIds(new Set());
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedParticipants = participants.filter(p => selectedIds.has(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Controls (No Print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-emerald-400" />
              <span>একসাথে ব্যাচ প্রিন্ট প্রিভিউ (Batch Printing)</span>
            </h3>
            <p className="text-xs text-slate-400">
              নির্বাচিত {toBengaliNumber(selectedParticipants.length, 1)} টি আইডি কার্ড প্রিন্ট করার জন্য প্রস্তুত
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium cursor-pointer"
            >
              সব সিলেক্ট
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium cursor-pointer"
            >
              সিলেকশন মুছুন
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={selectedParticipants.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-40"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্টার এ পাঠান</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Grid Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60">
          {selectedParticipants.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <p className="text-sm">প্রিন্ট করার জন্য কমপক্ষে একটি কার্ড নির্বাচন করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-4xl mx-auto">
              {selectedParticipants.map(participant => (
                <div key={participant.id} className="relative w-full max-w-[380px]">
                  {/* Select toggle button */}
                  <button
                    type="button"
                    onClick={() => toggleSelect(participant.id)}
                    className="no-print absolute -top-3 -right-3 z-30 p-1.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 shadow-lg cursor-pointer hover:scale-110 transition"
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>

                  <IdCardPreview participant={participant} isPrintOnly={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
