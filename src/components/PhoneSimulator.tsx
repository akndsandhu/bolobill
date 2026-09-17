import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  RotateCcw,
  Smartphone,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { Invoice, InvoiceItem } from '../types';
import { BillBuilderScreen } from './BillBuilderScreen';
import { PdfPreviewScreen } from './PdfPreviewScreen';
import { QuickVoiceModal } from './QuickVoiceModal';
import { SAMPLE_INVOICE } from '../data/sampleInvoices';

interface PhoneSimulatorProps {
  invoice: Invoice;
  onUpdateInvoice: (invoice: Invoice) => void;
  onOpenAudit: () => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  invoice,
  onUpdateInvoice,
  onOpenAudit,
}) => {
  const [activeScreen, setActiveScreen] = useState<'BUILDER' | 'PREVIEW'>('BUILDER');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleResetSample = () => {
    onUpdateInvoice({ ...SAMPLE_INVOICE, id: 'inv_' + Date.now() });
  };

  const handleAddVoiceItems = (items: InvoiceItem[]) => {
    const updatedItems = [...invoice.items, ...items];
    const subtotal = updatedItems.reduce((acc, curr) => acc + curr.amount, 0);
    onUpdateInvoice({
      ...invoice,
      items: updatedItems,
      subtotal,
      totalAmount: Math.max(0, subtotal - invoice.discount),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Device Frame Top Bar Controls */}
      <div className="w-full max-w-[420px] mb-3 flex items-center justify-between px-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span>Android 15 Device Emulator (API 35)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSample}
            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-blue-600 transition"
            title="Reset to Sample Quotation"
          >
            <RotateCcw className="w-3 h-3" /> Reset Demo
          </button>
        </div>
      </div>

      {/* Modern Android Phone Bezel Container */}
      <div className="w-full max-w-[420px] h-[780px] sm:h-[820px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
        {/* Android Punch-hole Camera */}
        <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800 z-50 pointer-events-none"></div>

        {/* Screen Bezel Inside */}
        <div className="w-full h-full bg-[#F8FAFC] rounded-[34px] flex flex-col overflow-hidden relative shadow-inner">
          {/* Android Status Bar */}
          <div className="h-7 bg-white/90 backdrop-blur px-5 flex items-center justify-between text-[11px] font-semibold text-slate-800 z-40 select-none shrink-0 border-b border-slate-100">
            <span>10:45 AM</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Active Screen Rendering */}
          <div className="flex-1 overflow-hidden relative">
            {activeScreen === 'BUILDER' ? (
              <BillBuilderScreen
                invoice={invoice}
                onUpdateInvoice={onUpdateInvoice}
                onNavigateToPreview={() => setActiveScreen('PREVIEW')}
                onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              />
            ) : (
              <PdfPreviewScreen
                invoice={invoice}
                onUpdateInvoice={onUpdateInvoice}
                onBack={() => setActiveScreen('BUILDER')}
              />
            )}
          </div>

          {/* Android Gesture Navigation Bar Pill */}
          <div className="h-5 bg-white flex items-center justify-center shrink-0 z-40">
            <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Screen Quick Switcher Tabs */}
      <div className="w-full max-w-[420px] mt-3 flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveScreen('BUILDER')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            activeScreen === 'BUILDER'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          1. Bill Builder Screen
        </button>
        <button
          onClick={() => setActiveScreen('PREVIEW')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            activeScreen === 'PREVIEW'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          2. PDF & Receipt Preview
        </button>
      </div>

      {/* Voice Dictation Modal */}
      <QuickVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        pdfLanguage={invoice.pdfLanguage}
        onAddItems={handleAddVoiceItems}
      />
    </div>
  );
};
