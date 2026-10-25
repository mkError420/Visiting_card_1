import React, { useState } from 'react';
import { Participant } from '../types';
import { parseQrPayload, DecodedQRData, generateQrPayload } from '../utils/qrPayload';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Scan,
  UserCheck,
  Calendar,
  MapPin,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { toBengaliNumber } from '../utils/bengali';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  currentParticipant?: Participant;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  participants,
  currentParticipant,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<DecodedQRData | null>(null);
  const [matchedParticipant, setMatchedParticipant] = useState<Participant | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (rawText: string) => {
    setErrorMsg(null);
    const decoded = parseQrPayload(rawText);
    if (!decoded) {
      setErrorMsg('কিউআর কোডের ডেটা পড়তে ব্যর্থ হয়েছে। সঠিক ফরম্যাট নিশ্চিত করুন।');
      setScanResult(null);
      setMatchedParticipant(null);
      return;
    }

    setScanResult(decoded);
    // Find matching attendee in database
    const matched = participants.find(
      p =>
        toBengaliNumber(p.regNo) === decoded.regNo ||
        String(p.regNo).padStart(3, '0') === decoded.regNo ||
        p.name === decoded.name
    );
    setMatchedParticipant(matched || null);
  };

  const handleSimulateScan = (participant: Participant) => {
    const payload = generateQrPayload(participant);
    setManualCode(payload);
    handleVerify(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ভেন্যু প্রবেশদ্বার কিউআর কোড স্ক্যানার ও ভেরিফায়ার</span>
              </h3>
              <p className="text-xs text-slate-400">
                আইডি কার্ডের কিউআর কোড স্ক্যান করে গোপন সম্পর্ক (Relation) ও সত্যতা নিশ্চিত করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Simulator Buttons for Testing */}
        <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 space-y-2">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            দ্রুত টেস্ট করার জন্য অংশগ্রহণকারী নির্বাচন করুন:
          </span>
          <div className="flex flex-wrap gap-2">
            {participants.slice(0, 5).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSimulateScan(p)}
                className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-emerald-700 text-slate-200 hover:text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{p.name}</span>
                <span className="text-[10px] text-emerald-300 font-mono">({toBengaliNumber(p.regNo)})</span>
              </button>
            ))}
            {currentParticipant && (
              <button
                type="button"
                onClick={() => handleSimulateScan(currentParticipant)}
                className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 text-xs font-medium transition cursor-pointer"
              >
                বর্তমান ফর্মের কার্ড
              </button>
            )}
          </div>
        </div>

        {/* Manual Input or Scanner Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            কিউআর কোড পে-লোড টেক্সট / স্ক্যানার ডেটা:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              placeholder="কিউআর কোডের ডেটা এখানে পেস্ট করুন..."
              className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <button
              type="button"
              onClick={() => handleVerify(manualCode)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
            >
              যাচাই করুন
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Verified Result Card */}
        {scanResult && (
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-emerald-950/60 border border-emerald-500/50 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-emerald-800/50 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>যাচাইকরণ সফল! বৈধ কার্ডধারী</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                রেজিস্ট্রেশন নং: {scanResult.regNo}
              </span>
            </div>

            <div className="flex items-start gap-4">
              {/* Photo */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/80 bg-slate-800 flex-shrink-0 shadow-md">
                <img
                  src={matchedParticipant?.photoUrl || '/sample-avatar.jpg'}
                  alt={scanResult.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Data */}
              <div className="flex-1 space-y-1.5">
                <h4 className="text-lg font-bold text-white">{scanResult.name}</h4>

                {/* Highlighted Relation badge - Core requirement */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">প্রাক্তন শিক্ষার্থীর সাথে সম্পর্ক:</span>
                  <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md">
                    {scanResult.relation}
                  </span>
                </div>

                <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>{scanResult.school}</span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{scanResult.address}</span>
                </div>
              </div>
            </div>

            {/* Event Details Ribbon */}
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-emerald-900/60 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>১৮ ডিসেম্বর, ২০২৬</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>আনান সিটি পার্ক, রংপুর</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Close Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
