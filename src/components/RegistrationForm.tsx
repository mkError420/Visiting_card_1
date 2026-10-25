import React, { useRef, useState, useEffect } from 'react';
import { Participant, AlumniRelation } from '../types';
import { RELATION_OPTIONS, toBengaliNumber } from '../utils/bengali';
import {
  Camera,
  Upload,
  User,
  GraduationCap,
  MapPin,
  Hash,
  Users,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Phone,
  Image as ImageIcon,
  X,
  FlipHorizontal,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationFormProps {
  currentParticipant: Participant;
  onChange: (updated: Participant) => void;
  onSave: (participant: Participant) => void;
  onNew: () => void;
  nextSuggestedRegNo: number;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  currentParticipant,
  onChange,
  onSave,
  onNew,
  nextSuggestedRegNo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const handleInputChange = (field: keyof Participant, value: any) => {
    if (field === 'name' && nameError) {
      setNameError(false);
    }
    onChange({
      ...currentParticipant,
      [field]: value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result as string;
        handleInputChange('photoUrl', result);
        setCameraError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);

    // Stop any existing tracks
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError('আপনার ব্রাউজার বা ডিভাইসে সরাসরি ক্যামেরা ব্যবহারের সুবিধা নেই। অনুগ্রহ করে গ্যালারি থেকে ছবি আপলোড করুন।');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access handled gracefully:', err?.name || err?.message);
      setIsCameraActive(false);
      if (
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        (err?.message && String(err.message).toLowerCase().includes('permission denied'))
      ) {
        setCameraError(
          'ক্যামেরা ব্যবহারের অনুমতি পাওয়া যায়নি (Permission Denied)। অনুগ্রহ করে ব্রাউজার অ্যাড্রেস বার থেকে ক্যামেরা এলাও (Allow) করুন, অথবা নিচে থেকে ছবি আপলোড করুন।'
        );
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        setCameraError('কোনো ক্যামেরা ডিভাইস পাওয়া যায়নি। অনুগ্রহ করে ছবি আপলোড অপশনটি ব্যবহার করুন।');
      } else {
        setCameraError('ক্যামেরা চালু করতে সমস্যা হয়েছে। অনুগ্রহ করে গ্যালারি থেকে ছবি আপলোড করুন।');
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const size = Math.min(videoRef.current.videoWidth, videoRef.current.videoHeight) || 480;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Center crop square
        const sx = (videoRef.current.videoWidth - size) / 2;
        const sy = (videoRef.current.videoHeight - size) / 2;
        ctx.drawImage(videoRef.current, sx, sy, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        handleInputChange('photoUrl', dataUrl);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentParticipant.name.trim()) {
      setNameError(true);
      return;
    }

    onSave(currentParticipant);
    setIsSavedSuccess(true);

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#065f46'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSavedSuccess(false);
    }, 2800);
  };

  const handleApplyNextRegNo = () => {
    handleInputChange('regNo', nextSuggestedRegNo);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-xl space-y-6"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>অংশগ্রহণকারী নিবন্ধন ফর্ম</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ব্যাচ ৮৮
            </span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            তথ্য পূরণ করলেই পাশের আইডি কার্ড প্রিভিউতে সাথে সাথে দেখতে পাবেন
          </p>
        </div>

        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>নতুন এন্ট্রি</span>
        </button>
      </div>

      {/* Profile Photo Section */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50 space-y-3">
        <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          প্রোফাইল ছবি (Profile Photo) *
        </label>

        {isCameraActive ? (
          <div className="relative rounded-2xl overflow-hidden bg-black flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-h-60 object-cover rounded-xl"
            />
            <div className="absolute bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>ছবি তুলুন</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-2 rounded-xl bg-slate-700/90 hover:bg-slate-700 text-slate-200 text-sm flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>বাতিল</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail Preview */}
            <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500/80 shadow-md flex-shrink-0 bg-slate-800 flex items-center justify-center text-center p-1">
              {currentParticipant.photoUrl ? (
                <img
                  src={currentParticipant.photoUrl}
                  alt={currentParticipant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <User className="w-5 h-5 text-slate-400 mb-0.5" />
                  <span className="text-[10px] text-emerald-400 font-semibold leading-tight">
                    Set image here
                  </span>
                </div>
              )}
            </div>

            {/* Photo Action Buttons */}
            <div className="flex-1 w-full space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-medium text-white transition cursor-pointer shadow-sm"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>গ্যালারি থেকে আপলোড</span>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-medium text-white transition cursor-pointer shadow-sm"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>ক্যামেরা দিয়ে তুলুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange('photoUrl', '/sample-avatar.jpg')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-[11px] font-medium text-emerald-300 transition cursor-pointer"
                  title="ডিজাইনের নমুনা ছবি ব্যবহার করুন"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>নমুনা ছবি লোড</span>
                </button>

                {currentParticipant.photoUrl && (
                  <button
                    type="button"
                    onClick={() => handleInputChange('photoUrl', '')}
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-[11px] font-medium text-rose-300 transition cursor-pointer"
                    title="ছবি রিমুভ করে ডিফল্ট রাখুন"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>ছবি রিমুভ</span>
                  </button>
                )}
              </div>

              {/* Graceful Camera Error Message Banner */}
              {cameraError && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1.5">
                    <p className="font-medium text-amber-200 leading-relaxed">{cameraError}</p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 text-[11px] font-semibold transition cursor-pointer"
                      >
                        ফাইল সিলেক্ট করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraError(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        বন্ধ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                পাসপোর্ট বা পোর্ট্রেট সাইজ ছবি সবচেয়ে সুন্দরভাবে ফ্রেমের মধ্যে প্রদর্শিত হয়।
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Field: Name (নাম) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <User className="w-4 h-4 text-emerald-400" />
          <span>অংশগ্রহণকারীর নাম (Name) *</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={currentParticipant.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="নাম লিখুন"
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/70 border ${
              nameError
                ? 'border-rose-500 ring-2 ring-rose-500/40 text-rose-100'
                : 'border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
            } placeholder-slate-500 focus:outline-none text-sm font-medium transition`}
          />
        </div>
        {nameError && (
          <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>দয়া করে অংশগ্রহণকারীর নাম পূরণ করুন।</span>
          </p>
        )}
      </div>

      {/* Field: School (স্কুল) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>স্কুলের নাম (School Name) *</span>
        </label>
        <input
          type="text"
          required
          value={currentParticipant.school}
          onChange={e => handleInputChange('school', e.target.value)}
          placeholder="স্কুলের নাম লিখুন"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium transition"
        />
      </div>

      {/* Field: Address (ঠিকানা) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>ঠিকানা (Address) *</span>
        </label>
        <input
          type="text"
          required
          value={currentParticipant.address}
          onChange={e => handleInputChange('address', e.target.value)}
          placeholder="ঠিকানা লিখুন"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium transition"
        />
      </div>

      {/* Field: Relation with Alumni (প্রাক্তন শিক্ষার্থীর সাথে সম্পর্ক) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>প্রাক্তন শিক্ষার্থীর সাথে সম্পর্ক (Relation with Alumni) *</span>
          </label>
          <span className="text-[10px] text-amber-400/90 font-mono">
            [শুধুমাত্র QR কোডে এনকোড হবে]
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RELATION_OPTIONS.map(opt => {
            const isSelected = currentParticipant.relation === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleInputChange('relation', opt.value)}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400 shadow-sm'
                    : 'bg-slate-900/50 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">{opt.value}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">{opt.description}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40">
          💡 <strong className="text-emerald-300">লজিক শর্ত:</strong> সম্পর্ক কার্ডের বডিতে প্রিন্ট হবে না, তবে আইডি কার্ডের ডিজিটাল <span className="text-emerald-400 font-semibold">QR কোড</span> স্ক্যান করলেই ভেন্যুর গেটে সঠিক পরিচয় প্রদর্শন করবে।
        </p>
      </div>

      {/* Field: Registration Number & Optional Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Reg No */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-emerald-400" />
              <span>নিবন্ধন নম্বর (৩ ডিজিট)</span>
            </label>
            <button
              type="button"
              onClick={handleApplyNextRegNo}
              className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
            >
              পরবর্তী: {toBengaliNumber(nextSuggestedRegNo)}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={999}
              value={currentParticipant.regNo || ''}
              onChange={e => handleInputChange('regNo', parseInt(e.target.value, 10) || 1)}
              className="w-full px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-bold font-mono transition"
            />
            <div className="px-3 py-2 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 text-sm font-bold whitespace-nowrap">
              বাংলা: {toBengaliNumber(currentParticipant.regNo)}
            </div>
          </div>
        </div>

        {/* Optional Mobile Phone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>মোবাইল নম্বর (ঐচ্ছিক)</span>
          </label>
          <input
            type="tel"
            value={currentParticipant.phone || ''}
            onChange={e => handleInputChange('phone', e.target.value)}
            placeholder="মোবাইল নাম্বার দিন"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium transition"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-900/40 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSavedSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-200 animate-bounce" />
              <span>সফলভাবে কার্ড সংরক্ষিত হয়েছে!</span>
            </>
          ) : (
            <>
              
              <span>আইডি কার্ড সংরক্ষণ ও তালিকাভুক্ত করুন</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
