import React, { useState, useMemo } from 'react';
import { Participant, AlumniRelation } from '../types';
import { toBengaliNumber, RELATION_OPTIONS } from '../utils/bengali';
import { downloadCardAsPng } from '../utils/canvasRenderer';
import {
  Search,
  Printer,
  Download,
  Trash2,
  Edit,
  Eye,
  FileSpreadsheet,
  FileJson,
  UserPlus,
  Users,
  Filter,
} from 'lucide-react';

interface AttendeeListProps {
  participants: Participant[];
  selectedId: string;
  onSelect: (participant: Participant) => void;
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
  onOpenBatchPrint: () => void;
  onLoadSampleData: () => void;
}

export const AttendeeList: React.FC<AttendeeListProps> = ({
  participants,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onOpenBatchPrint,
  onLoadSampleData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelationFilter, setSelectedRelationFilter] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.regNo).includes(searchQuery) ||
        toBengaliNumber(p.regNo).includes(searchQuery);

      const matchRelation =
        selectedRelationFilter === 'all' || p.relation === selectedRelationFilter;

      return matchSearch && matchRelation;
    });
  }, [participants, searchQuery, selectedRelationFilter]);

  const handleDownloadSingle = async (e: React.MouseEvent, participant: Participant) => {
    e.stopPropagation();
    try {
      setDownloadingId(participant.id);
      await downloadCardAsPng(participant);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrintSingle = (e: React.MouseEvent, participant: Participant) => {
    e.stopPropagation();
    onSelect(participant);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const exportToJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(participants, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `SSC88_Participants_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  };

  const exportToCsv = () => {
    const headers = ['Registration No', 'Name', 'School', 'Address', 'Relation', 'Phone'];
    const rows = participants.map(p => [
      toBengaliNumber(p.regNo),
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.school.replace(/"/g, '""')}"`,
      `"${p.address.replace(/"/g, '""')}"`,
      `"${p.relation}"`,
      `"${p.phone || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSC88_Participants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Relation statistics
  const relationStats = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.relation] = (counts[p.relation] || 0) + 1;
    });
    return counts;
  }, [participants]);

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-xl space-y-5">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>নিবন্ধিত অংশগ্রহণকারী তালিকা</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              মোট: {toBengaliNumber(participants.length, 1)} জন
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            যেকোনো কার্ডে ক্লিক করে লাইভ প্রিভিউ দেখুন, সিঙ্গেল বা একসাথে সব কার্ড প্রিন্ট করুন
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenBatchPrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md active:scale-95 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>সব কার্ড ব্যাচ প্রিন্ট</span>
          </button>

          <button
            type="button"
            onClick={exportToCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition cursor-pointer"
            title="CSV এক্সেল শীট হিসেবে সংরক্ষণ"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV এক্সপোর্ট</span>
          </button>

          <button
            type="button"
            onClick={exportToJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition cursor-pointer"
            title="JSON ব্যাকআপ"
          >
            <FileJson className="w-3.5 h-3.5 text-emerald-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Relation Quick Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedRelationFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
            selectedRelationFilter === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
          }`}
        >
          সবাই ({toBengaliNumber(participants.length, 1)})
        </button>

        {RELATION_OPTIONS.map(opt => {
          const count = relationStats[opt.value] || 0;
          const isSelected = selectedRelationFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedRelationFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {opt.value} ({toBengaliNumber(count, 1)})
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="নাম, স্কুল, ঠিকানা অথবা নিবন্ধন নং দিয়ে খুঁজুন..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/70 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-white absolute right-3.5 top-1/2 -translate-y-1/2"
          >
            ক্লিয়ার
          </button>
        )}
      </div>

      {/* Participants List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700/80 space-y-3">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">
              {searchQuery
                ? 'অনুসন্ধানের সাথে মিলে এমন কোনো অংশগ্রহণকারী পাওয়া যায়নি।'
                : 'এখনো কোনো অংশগ্রহণকারী নিবন্ধিত হয়নি।'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={onLoadSampleData}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>নমুনা ডেমো তথ্য লোড করুন</span>
              </button>
            )}
          </div>
        ) : (
          filteredParticipants.map(participant => {
            const isSelected = participant.id === selectedId;
            return (
              <div
                key={participant.id}
                onClick={() => onSelect(participant)}
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/50 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/80 bg-slate-800 flex-shrink-0">
                    <img
                      src={participant.photoUrl || '/sample-avatar.jpg'}
                      alt={participant.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = '/sample-avatar.jpg';
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">
                        {participant.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-[11px] font-mono border border-emerald-600/30 whitespace-nowrap">
                        নং: {toBengaliNumber(participant.regNo)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {participant.school} • {participant.address}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block px-2 py-0.2 rounded-full bg-slate-800 text-[10px] text-amber-300 border border-amber-500/30">
                        সম্পর্ক: {participant.relation}
                      </span>
                      {participant.phone && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {participant.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 flex-shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onSelect(participant);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="কার্ড দেখুন"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={e => handlePrintSingle(e, participant)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="প্রিন্ট করুন"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  </button>

                  <button
                    type="button"
                    onClick={e => handleDownloadSingle(e, participant)}
                    disabled={downloadingId === participant.id}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-50"
                    title="PNG ডাউনলোড"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onEdit(participant);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="তথ্য পরিবর্তন করুন"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-400" />
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      if (confirm(`আপনি কি "${participant.name}" এর নিবন্ধন মুছে ফেলতে চান?`)) {
                        onDelete(participant.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
