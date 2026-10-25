import React from 'react';
import { EVENT_DETAILS } from '../utils/bengali';
import { Heart, Users, MapPin, Calendar } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print mt-16 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900 border-t border-slate-800/80 py-8 px-4 sm:px-6 text-center text-slate-400">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
          <span className="font-bold text-white">{EVENT_DETAILS.title}</span>
          <span className="text-slate-600">•</span>
          <span className="font-semibold text-emerald-400">{EVENT_DETAILS.subtitle}</span>
          <span className="text-slate-600">•</span>
          <span>{EVENT_DETAILS.date}</span>
          <span className="text-slate-600">•</span>
          <span>{EVENT_DETAILS.venue}</span>
        </div>

        <div className="p-3 max-w-lg mx-auto rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>{EVENT_DETAILS.organizer}</span>
        </div>

        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <span>ডিজিটাল আইডি কার্ড ও রেজিস্ট্রেশন পোর্টাল</span>
          <span>•</span>
          <span>বন্ধুত্বের চিরন্তন বন্ধন অটুট থাকুক</span>
        </p>
      </div>
    </footer>
  );
};
