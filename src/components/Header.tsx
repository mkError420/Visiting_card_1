import React from 'react';
import { Calendar, MapPin, Sparkles, Users, Award } from 'lucide-react';
import { EVENT_DETAILS } from '../utils/bengali';

export const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-900 border-b border-emerald-800/40 pt-6 pb-6 px-4 sm:px-6">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-44 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Top Batch Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold shadow-inner mb-3">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>ঐতিহাসিক পুনর্মিলনী ২০২৬</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-bold">ব্যাচ ৮৮</span>
        </div>

        {/* Main Event Title & Theme */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-300 tracking-tight leading-tight drop-shadow-sm font-bengali">
          {EVENT_DETAILS.title}
        </h1>

        <div className="mt-2 text-xl sm:text-3xl font-extrabold text-amber-300 drop-shadow flex items-center justify-center gap-2">
          <span>— {EVENT_DETAILS.subtitle} —</span>
        </div>

        {/* Slogan */}
        <p className="mt-2 text-xs sm:text-sm md:text-base text-emerald-100/80 font-medium max-w-2xl italic tracking-wide">
          "{EVENT_DETAILS.slogan}"
        </p>

        {/* Event Key Meta Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 shadow-sm">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">{EVENT_DETAILS.date}</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 shadow-sm">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">{EVENT_DETAILS.venue}</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 shadow-sm">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{EVENT_DETAILS.organizer}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
