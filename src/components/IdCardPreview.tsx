import React, { useEffect, useState } from 'react';
import { Participant } from '../types';
import { toBengaliNumber } from '../utils/bengali';
import { generateQrDataUrl } from '../utils/qrPayload';
import { Download, Printer, QrCode, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { downloadCardAsPng } from '../utils/canvasRenderer';

interface IdCardPreviewProps {
  participant: Participant;
  isPrintOnly?: boolean;
  onOpenVerifier?: () => void;
}

export const IdCardPreview: React.FC<IdCardPreviewProps> = ({
  participant,
  isPrintOnly = false,
  onOpenVerifier,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    generateQrDataUrl(participant).then(url => {
      if (isMounted) setQrCodeUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [participant]);

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      await downloadCardAsPng(participant);
    } catch (err) {
      console.error('Error downloading card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`flex flex-col items-center ${isPrintOnly ? 'print-only-container' : ''}`}>
      {/* Action Bar (Hidden during Print) */}
      {!isPrintOnly && (
        <div className="no-print w-full max-w-[430px] flex items-center justify-between gap-2 mb-3 bg-slate-800/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-700/70 shadow-lg">
          <div className="flex items-center gap-2 pl-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300">
              লাইভ আইডি কার্ড প্রিভিউ
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-medium text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              title="আইডি কার্ড প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>প্রিন্ট</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              title="এইচডি পিএনজি ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'ডাউনলোড হচ্ছে...' : 'PNG সেভ'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Actual ID Card (Printable Wrapper) */}
      <div
        id={`card-${participant.id}`}
        className="printable-card-wrapper relative w-full max-w-[430px] aspect-[1024/1536] rounded-2xl overflow-hidden shadow-2xl transition-all border border-emerald-900/40 select-none bg-white"
        style={{
          boxShadow: isPrintOnly ? 'none' : '0 25px 50px -12px rgba(5, 46, 22, 0.45)',
        }}
      >
        {/* Template Backdrop Image */}
        <img
          src="/assets/aistudio/WhatsApp-Image-2026-10-25-at-4.00_417cf231.png"
          alt="SSC 88 Card Template"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />

        {/* Dynamic Profile Photo: Circular Cutout overlay */}
        <div
          className="absolute z-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border-2 border-emerald-700/80 shadow-inner"
          style={{
            left: '24.414%',
            top: '50.391%',
            width: '36.8%',
            height: '24.5%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {participant.photoUrl ? (
            <img
              src={participant.photoUrl}
              alt={participant.name}
              className="w-full h-full object-cover"
              onError={e => {
                // fallback to default avatar
                (e.target as HTMLImageElement).src = '/sample-avatar.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-emerald-50">
              <UserCheck className="w-12 h-12 text-emerald-600/60" />
              <span className="text-[10px] text-emerald-800 font-medium">ছবি যুক্ত করুন</span>
            </div>
          )}
        </div>

        {/* Dynamic Text Information Box 1: Name (নাম) */}
        <div
          className="absolute z-10 flex items-center px-2 sm:px-3 overflow-hidden"
          style={{
            top: '39.8%',
            height: '5.5%',
            left: '54.2%',
            right: '4.2%',
          }}
        >
          <span
            className="font-bold text-slate-900 text-sm sm:text-base md:text-lg tracking-tight truncate leading-tight w-full drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.8)]"
            title={participant.name}
          >
            {participant.name || 'নাম প্রদান করুন'}
          </span>
        </div>

        {/* Dynamic Text Information Box 2: School (স্কুল) */}
        <div
          className="absolute z-10 flex items-center px-2 sm:px-3 overflow-hidden"
          style={{
            top: '46.4%',
            height: '5.5%',
            left: '54.2%',
            right: '4.2%',
          }}
        >
          <span
            className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base truncate leading-tight w-full drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.8)]"
            title={participant.school}
          >
            {participant.school || 'স্কুলের নাম লিখুন'}
          </span>
        </div>

        {/* Dynamic Text Information Box 3: Address (ঠিকানা) */}
        <div
          className="absolute z-10 flex items-center px-2 sm:px-3 overflow-hidden"
          style={{
            top: '53.0%',
            height: '5.5%',
            left: '54.2%',
            right: '4.2%',
          }}
        >
          <span
            className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base truncate leading-tight w-full drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.8)]"
            title={participant.address}
          >
            {participant.address || 'ঠিকানা লিখুন'}
          </span>
        </div>

        {/* Dynamic Text Information Box 4: Registration Number (নিবন্ধন নং) */}
        <div
          className="absolute z-10 flex items-center px-2 sm:px-3 overflow-hidden"
          style={{
            top: '59.6%',
            height: '5.6%',
            left: '54.2%',
            right: '4.2%',
          }}
        >
          <span className="font-bold text-slate-900 text-xs sm:text-sm md:text-base truncate leading-tight w-full tracking-wider drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.8)]">
            নিবন্ধন নং- {toBengaliNumber(participant.regNo)}
          </span>
        </div>

        {/* Dynamic QR Code: Full fill inside the white box area */}
        <div
          className="absolute z-10 flex items-center justify-center overflow-hidden bg-white"
          style={{
            left: '81.5%',
            top: '86.8%',
            width: '15.0%',
            height: '9.6%',
          }}
        >
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Participant Verification QR"
              className="w-full h-full object-fill block"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white">
              <QrCode className="w-6 h-6 text-emerald-800 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Card Info Summary & Security Verification Notice */}
      {!isPrintOnly && (
        <div className="no-print w-full max-w-[430px] mt-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              কিউআর কোড নিরাপত্তা যাচাই:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              সম্পর্ক: {participant.relation}
            </span>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            বিশেষ নির্দেশনা অনুযায়ী আইডি কার্ডের মূল বডিতে সম্পর্ক মুদ্রিত হয় না; এটি কিউআর কোডের ভেতরে ডিজিটালভাবে এনকোড করা রয়েছে যা স্ক্যান করে তাৎক্ষণিক যাচাই করা যায়।
          </p>

          {onOpenVerifier && (
            <button
              onClick={onOpenVerifier}
              type="button"
              className="mt-1 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 font-medium transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>গেটে কিউআর কোড স্ক্যানার দিয়ে চেক করুন</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
