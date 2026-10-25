import React, { useState, useEffect } from 'react';
import { Participant, AlumniRelation } from './types';
import { INITIAL_PARTICIPANTS, toBengaliNumber } from './utils/bengali';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RegistrationForm } from './components/RegistrationForm';
import { IdCardPreview } from './components/IdCardPreview';
import { AttendeeList } from './components/AttendeeList';
import { BatchPrintModal } from './components/BatchPrintModal';
import { QrScannerModal } from './components/QrScannerModal';
import {
  CreditCard,
  UserPlus,
  Users,
  QrCode,
  Printer,
  Sparkles,
  Info,
} from 'lucide-react';

const STORAGE_KEY = 'ssc88_reunion_participants_v1';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load participants from localStorage:', e);
    }
    return INITIAL_PARTICIPANTS;
  });

  // Calculate next suggested 3-digit registration number
  const nextSuggestedRegNo = React.useMemo(() => {
    if (participants.length === 0) return 1;
    const max = Math.max(...participants.map(p => p.regNo || 0));
    return max + 1;
  }, [participants]);

  // Active participant for the form and ID Card Preview
  const [currentParticipant, setCurrentParticipant] = useState<Participant>(() => {
    return participants[0] || INITIAL_PARTICIPANTS[0];
  });

  // Modals state
  const [isBatchPrintOpen, setIsBatchPrintOpen] = useState(false);
  const [isQrVerifierOpen, setIsQrVerifierOpen] = useState(false);

  // Mobile active tab ('form' | 'preview' | 'list')
  const [mobileTab, setMobileTab] = useState<'form' | 'preview' | 'list'>('form');

  // Save participants to localStorage whenever they update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [participants]);

  const handleSaveParticipant = (participant: Participant) => {
    setParticipants(prev => {
      const existsIndex = prev.findIndex(p => p.id === participant.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = participant;
        return updated;
      } else {
        return [participant, ...prev];
      }
    });
    // Switch to preview tab on mobile to let user admire their new card!
    if (window.innerWidth < 1024) {
      setMobileTab('preview');
    }
  };

  const handleCreateNew = () => {
    const newEntry: Participant = {
      id: `reg-${Date.now()}`,
      regNo: nextSuggestedRegNo,
      name: '',
      school: '',
      address: '',
      relation: 'নিজে',
      photoUrl: '',
      createdAt: new Date().toISOString(),
    };
    setCurrentParticipant(newEntry);
    setMobileTab('form');
  };

  const handleSelectParticipant = (participant: Participant) => {
    setCurrentParticipant(participant);
    if (window.innerWidth < 1024) {
      setMobileTab('preview');
    }
  };

  const handleEditParticipant = (participant: Participant) => {
    setCurrentParticipant(participant);
    setMobileTab('form');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleDeleteParticipant = (id: string) => {
    setParticipants(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (currentParticipant.id === id && remaining.length > 0) {
        setCurrentParticipant(remaining[0]);
      }
      return remaining;
    });
  };

  const handleLoadSampleData = () => {
    setParticipants(INITIAL_PARTICIPANTS);
    setCurrentParticipant(INITIAL_PARTICIPANTS[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Event Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Top Control Bar / Quick Tools */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                আইডি কার্ড জেনারেশন ও রেজিস্ট্রেশন ড্যাশবোর্ড
              </h2>
              <p className="text-xs text-slate-400">
                স্বয়ংক্রিয় ৩ ডিজিট নিবন্ধন নং ও কিউআর কোড নিরাপত্তা সহ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQrVerifierOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>গেটে QR ভেরিফায়ার</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBatchPrintOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-900/30 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>ব্যাচ প্রিন্ট ({toBengaliNumber(participants.length, 1)})</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden no-print grid grid-cols-3 gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMobileTab('form')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'form'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>নিবন্ধন ফর্ম</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'preview'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>আইডি কার্ড</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'list'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>তালিকা ({toBengaliNumber(participants.length, 1)})</span>
          </button>
        </div>

        {/* Desktop Split View / Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Registration Form */}
          <div
            className={`lg:col-span-7 space-y-6 ${
              mobileTab !== 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            <RegistrationForm
              currentParticipant={currentParticipant}
              onChange={setCurrentParticipant}
              onSave={handleSaveParticipant}
              onNew={handleCreateNew}
              nextSuggestedRegNo={nextSuggestedRegNo}
            />
          </div>

          {/* Right Column: Live ID Card Preview (Sticky on desktop) */}
          <div
            className={`lg:col-span-5 lg:sticky lg:top-6 flex flex-col items-center justify-center ${
              mobileTab !== 'preview' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <IdCardPreview
              participant={currentParticipant}
              onOpenVerifier={() => setIsQrVerifierOpen(true)}
            />
          </div>
        </div>

        {/* Bottom Section: Registered Attendees Management */}
        <div className={`mt-8 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <AttendeeList
            participants={participants}
            selectedId={currentParticipant.id}
            onSelect={handleSelectParticipant}
            onEdit={handleEditParticipant}
            onDelete={handleDeleteParticipant}
            onOpenBatchPrint={() => setIsBatchPrintOpen(true)}
            onLoadSampleData={handleLoadSampleData}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Batch Print Modal */}
      <BatchPrintModal
        isOpen={isBatchPrintOpen}
        onClose={() => setIsBatchPrintOpen(false)}
        participants={participants}
      />

      {/* Gate Entrance QR Code Verifier Modal */}
      <QrScannerModal
        isOpen={isQrVerifierOpen}
        onClose={() => setIsQrVerifierOpen(false)}
        participants={participants}
        currentParticipant={currentParticipant}
      />
    </div>
  );
}
