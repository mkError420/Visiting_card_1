import { Participant } from '../types';

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string, padTo: number = 3): string {
  const numStr = String(num).padStart(padTo, '0');
  return numStr
    .split('')
    .map(char => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) && parsed >= 0 && parsed <= 9 ? bengaliDigits[parsed] : char;
    })
    .join('');
}

export function fromBengaliNumber(bengaliStr: string): number {
  const englishStr = bengaliStr
    .split('')
    .map(char => {
      const idx = bengaliDigits.indexOf(char);
      return idx !== -1 ? String(idx) : char;
    })
    .join('');
  return parseInt(englishStr, 10) || 0;
}

export const EVENT_DETAILS = {
  title: 'এসএসসি ৮৮ ব্যাচের বন্ধুদের মিলনমেলা',
  subtitle: 'বাহের ডাক',
  slogan: 'স্মৃতির আবেশ.......বন্ধুত্বের উচ্ছ্বাসে....... আমরা আবার এক সাথে',
  date: '১৮ ডিসেম্বর, ২০২৬',
  venue: 'আনান সিটি পার্ক, রংপুর',
  organizer: "আয়োজনে: ৮৮'র রংপুরের বন্ধুরা",
};

export const RELATION_OPTIONS: Array<{
  value: Participant['relation'];
  label: string;
  badgeColor: string;
  description: string;
}> = [
  {
    value: 'নিজে',
    label: 'নিজে (প্রাক্তন শিক্ষার্থী)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'ব্যাচ ৮৮ প্রাক্তন শিক্ষার্থী',
  },
  {
    value: 'সহধর্মিনী',
    label: 'সহধর্মিনী (Spouse)',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    description: 'সহধর্মিণী / জীবনসঙ্গী',
  },
  {
    value: 'সন্তান',
    label: 'সন্তান (Child)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'সন্তান সন্ততি',
  },
  {
    value: 'পরিবারের সদস্য',
    label: 'পরিবারের সদস্য (Family Member)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'পরিবারের অন্যান্য সদস্য',
  },
  {
    value: 'অতিথি',
    label: 'অতিথি (Guest)',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'আমন্ত্রিত বিশেষ অতিথি',
  },
  {
    value: 'গাড়ির চালক',
    label: 'গাড়ির চালক (Driver)',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    description: 'ব্যক্তিগত গাড়ির চালক',
  },
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'sample-najmul-033',
    regNo: 33,
    name: 'মোঃ নাজমুল আহসান',
    school: 'রংপুর জিলা স্কুল',
    address: 'রংপুর সদর, রংপুর',
    relation: 'নিজে',
    photoUrl: '/sample-avatar.jpg',
    phone: '01712345678',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-farhana-034',
    regNo: 34,
    name: 'নাসরিন সুলতানা',
    school: 'সরকারি বালিকা উচ্চ বিদ্যালয়, রংপুর',
    address: 'ধাপ, রংপুর',
    relation: 'সহধর্মিনী',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=380',
    phone: '01819876543',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-tariq-035',
    regNo: 35,
    name: 'তারিকুল ইসলাম চৌধুরী',
    school: 'ক্যান্টনমেন্ট পাবলিক স্কুল ও কলেজ, রংপুর',
    address: 'আরকে রোড, রংপুর',
    relation: 'নিজে',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=380',
    phone: '01912445566',
    createdAt: new Date().toISOString(),
  },
];
