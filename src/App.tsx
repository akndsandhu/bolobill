import React, { useState } from 'react';
import {
  Smartphone,
  Code,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Languages,
  ImageIcon,
  Share2,
  Sparkles,
  Layers,
  Download,
  ExternalLink,
  ChevronRight,
  Info,
  BadgeCheck,
} from 'lucide-react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeInspector } from './components/CodeInspector';
import { PlayStoreAuditModal } from './components/PlayStoreAuditModal';
import { SAMPLE_INVOICE } from './data/sampleInvoices';
import { Invoice } from './types';

export default function App() {
  const [invoice, setInvoice] = useState<Invoice>(SAMPLE_INVOICE);
  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'CODE'>('SIMULATOR');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/40">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-white tracking-tight leading-tight">
                  BoloBill
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Target SDK 35
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30 hidden sm:inline-block">
                  Jetpack Compose
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Voice-to-Quotation & UPI Invoice • Principal Android Architecture
              </p>
            </div>
          </div>

          {/* Center Tabs: Simulator vs Code */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('SIMULATOR')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'SIMULATOR'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Live Android Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('CODE')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'CODE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Kotlin Architecture (.kt)</span>
            </button>
          </div>

          {/* Right Action: Play Store Audit Button */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600/15 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/25 transition text-xs font-semibold shadow-xs active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Play Console Policy Audit</span>
            <span className="sm:hidden">Audit</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </div>
      </header>

      {/* Feature Pills Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 text-xs overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
            <span className="font-semibold text-slate-300">4 New Play-Compliant Features:</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
              <ImageIcon className="w-3 h-3 text-blue-400" />
              <span>1. Before & After Photo Picker</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>2. Warranty Stamp Badge (15/30/90 Days)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
              <Languages className="w-3 h-3 text-amber-400" />
              <span>3. Offline TradeDictionary Normalizer</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>4. Instant Receipt Mode (Watermark & Clear Date)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col min-h-0">
        {activeTab === 'SIMULATOR' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Side: Phone Simulator */}
            <div className="lg:col-span-6 flex justify-center">
              <PhoneSimulator
                invoice={invoice}
                onUpdateInvoice={setInvoice}
                onOpenAudit={() => setIsAuditModalOpen(true)}
              />
            </div>

            {/* Right Side: Architecture & Feature Highlights Control Panel */}
            <div className="lg:col-span-6 space-y-4">
              {/* Feature 1: Work Proof Photos Detail */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Feature 1: Before & After Work Proof Photos</h3>
                      <p className="text-[10px] text-slate-400">Native Photo Picker without storage permissions</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PickVisualMedia()
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Technicians tap "Before Work" and "After Work" thumbnail slots to capture or select job site photos. The image is compressed and downsampled to <strong className="text-white">120x90dp</strong> on the native A4 PDF canvas, guarding against <strong className="text-amber-300">OutOfMemory (OOM)</strong> exceptions.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">BEFORE PHOTO URI</span>
                    <span className="text-blue-400 truncate block">
                      {invoice.beforePhotoUri ? 'content://cached/work_before.jpg' : 'Not set (tap in phone)'}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">AFTER PHOTO URI</span>
                    <span className="text-emerald-400 truncate block">
                      {invoice.afterPhotoUri ? 'content://cached/work_after.jpg' : 'Not set (tap in phone)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 2: Service Guarantee Stamp Detail */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Feature 2: Service Guarantee / Warranty Stamp</h3>
                      <p className="text-[10px] text-slate-400">Circular vector badge on PDF canvas</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {invoice.warrantyTerm}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Single-choice horizontal chip group on BillBuilderScreen. If selected, <code className="text-cyan-300">PdfGenerator.kt</code> executes canvas arc text paths drawing: <em className="text-white">"BOLOBILL VERIFIED • [X] DAYS SERVICE GUARANTEE"</em> with an inner shield emblem.
                </p>
              </div>

              {/* Feature 3: Offline TradeDictionary Normalizer Detail */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Feature 3: Offline Hinglish-to-English Normalizer</h3>
                      <p className="text-[10px] text-slate-400">TradeDictionary.kt offline token mapper</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = invoice.pdfLanguage === 'ENGLISH' ? 'HINGLISH' : 'ENGLISH';
                      setInvoice({ ...invoice, pdfLanguage: next });
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition"
                  >
                    Current: {invoice.pdfLanguage} (Click to Toggle)
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  100% offline regex mapping converts spoken terms like <span className="text-amber-300">"पंखा / pankha"</span> → <strong className="text-white">"Ceiling Fan"</strong>, <span className="text-amber-300">"तार / taar"</span> → <strong className="text-white">"Electrical Wiring"</strong>, and <span className="text-amber-300">"स्विच / switch board"</span> → <strong className="text-white">"Modular Switch Board"</strong>.
                </p>
              </div>

              {/* Feature 4: Instant Receipt Mode Detail */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Feature 4: 1-Tap "Payment Receipt" Mode (Mark as Paid)</h3>
                      <p className="text-[10px] text-slate-400">Watermark, QR suppression & dynamic WhatsApp intent</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    invoice.isPaid
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {invoice.isPaid ? 'PAID (रसीद)' : 'PENDING'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When <code className="text-emerald-400">isPaid = true</code>:
                </p>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Canvas renders diagonal semi-transparent green watermark: <strong className="text-emerald-400">"PAID / पूर्ण भुगतान प्राप्त"</strong> across center.</li>
                  <li>Suppresses UPI QR Code and displays transaction clearance date.</li>
                  <li>Updates WhatsApp message: <em className="text-slate-400">"नमस्ते [Name] जी, आपके काम का कुल भुगतान ₹{invoice.totalAmount} प्राप्त हो गया है। रसीद संलग्न है। धन्यवाद!"</em></li>
                </ul>
              </div>

              {/* View Full Codebase Shortcut Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Review Full Android Jetpack Compose Codebase</h4>
                  <p className="text-[11px] text-blue-200">
                    Pristine Kotlin & Android architecture with ShareableIntentHelper and zero placeholders.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('CODE')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Code className="w-3.5 h-3.5" /> Open Code Inspector
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-[640px] flex flex-col">
            <CodeInspector />
          </div>
        )}
      </main>

      {/* Google Play Store Policy Audit Modal */}
      <PlayStoreAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}
