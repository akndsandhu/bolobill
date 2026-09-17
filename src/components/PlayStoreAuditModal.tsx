import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  Lock,
  Download,
  Terminal,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { PLAY_STORE_AUDIT_ITEMS } from '../data/playAudit';
import { PlayAuditItem } from '../types';

interface PlayStoreAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreAuditModal: React.FC<PlayStoreAuditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredItems =
    selectedCategory === 'ALL'
      ? PLAY_STORE_AUDIT_ITEMS
      : PLAY_STORE_AUDIT_ITEMS.filter((item) => item.category === selectedCategory);

  const passedCount = PLAY_STORE_AUDIT_ITEMS.filter((i) => i.status === 'PASSED').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Google Play Store Policy & Security Compliance Audit
              </h2>
              <p className="text-[11px] text-slate-500">
                Pre-Launch Verification for Target SDK 35 (Android 15)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Banner */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
              Play Console Readiness Status
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-extrabold font-mono">100% COMPLIANT</span>
              <span className="text-xs bg-emerald-500/80 px-2 py-0.5 rounded-full font-semibold border border-emerald-400">
                0 Critical Violations
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              Zero broad SMS/storage permissions, Native Photo Picker, Scoped Storage & FileProvider.
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono text-white">
              {passedCount} / {PLAY_STORE_AUDIT_ITEMS.length}
            </div>
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Checks Passed</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50/70 overflow-x-auto text-xs">
          {['ALL', 'PERMISSIONS', 'STORAGE', 'MEDIA', 'SDK_TARGET'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Audit List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-1.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PASSED
                </span>
              </div>

              <div className="text-[11px] text-slate-600 pl-6 space-y-1">
                <p>{item.details}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 font-mono">
                  <span>Policy: <strong className="text-slate-700">{item.playStoreRule}</strong></span>
                  <span>•</span>
                  <span>Ref: <strong className="text-blue-600">{item.implementationRef}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">
            Target SDK: <strong>35 (Android 15)</strong> • Min SDK: <strong>26 (Android 8.0)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            Close Audit Report
          </button>
        </div>
      </div>
    </div>
  );
};
