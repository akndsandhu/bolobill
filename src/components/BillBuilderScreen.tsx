import React, { useState, useRef } from 'react';
import {
  Mic,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Sparkles,
  Volume2,
  FileText,
  Upload,
  X,
  Languages,
  Check,
  Clock,
} from 'lucide-react';
import { Invoice, InvoiceItem, WarrantyTerm, PdfLanguage } from '../types';
import { normalizeTradeText, parseVoiceInput, TRADE_MAPPINGS } from '../data/tradeDictionary';

interface BillBuilderScreenProps {
  invoice: Invoice;
  onUpdateInvoice: (updated: Invoice) => void;
  onNavigateToPreview: () => void;
  onOpenVoiceModal: () => void;
}

const PRESET_WORK_PHOTOS = [
  {
    type: 'before',
    url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=500&auto=format&fit=crop&q=80',
    label: 'Damaged Switch & Wires',
  },
  {
    type: 'after',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    label: 'Clean Modular Board Fitted',
  },
];

export const BillBuilderScreen: React.FC<BillBuilderScreenProps> = ({
  invoice,
  onUpdateInvoice,
  onNavigateToPreview,
  onOpenVoiceModal,
}) => {
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemRate, setNewItemRate] = useState(250);
  const [newItemUnit, setNewItemUnit] = useState('nos');

  const handleLanguageToggle = () => {
    const nextLang: PdfLanguage = invoice.pdfLanguage === 'ENGLISH' ? 'HINGLISH' : 'ENGLISH';
    const updatedItems = invoice.items.map((item) => {
      const normalized = item.normalizedEnglishName || item.name;
      const hinglish = item.hinglishName || item.name;
      return {
        ...item,
        name: nextLang === 'ENGLISH' ? normalized : hinglish,
      };
    });

    onUpdateInvoice({
      ...invoice,
      pdfLanguage: nextLang,
      items: updatedItems,
    });
  };

  const handleWarrantyChange = (term: WarrantyTerm) => {
    onUpdateInvoice({
      ...invoice,
      warrantyTerm: term,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'before') {
          onUpdateInvoice({ ...invoice, beforePhotoUri: reader.result });
        } else {
          onUpdateInvoice({ ...invoice, afterPhotoUri: reader.result });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const rate = Number(newItemRate) || 100;
    const qty = Number(newItemQty) || 1;
    const englishName = normalizeTradeText(newItemName, 'ENGLISH');
    const hinglishName = normalizeTradeText(newItemName, 'HINGLISH');

    const item: InvoiceItem = {
      id: 'item_' + Date.now(),
      originalText: newItemName,
      name: invoice.pdfLanguage === 'ENGLISH' ? englishName : hinglishName,
      normalizedEnglishName: englishName,
      hinglishName: hinglishName,
      quantity: qty,
      unit: newItemUnit,
      rate: rate,
      amount: qty * rate,
    };

    const newItems = [...invoice.items, item];
    const subtotal = newItems.reduce((acc, curr) => acc + curr.amount, 0);

    onUpdateInvoice({
      ...invoice,
      items: newItems,
      subtotal,
      totalAmount: Math.max(0, subtotal - invoice.discount),
    });

    setNewItemName('');
    setNewItemQty(1);
    setNewItemRate(250);
  };

  const handleRemoveItem = (id: string) => {
    const newItems = invoice.items.filter((i) => i.id !== id);
    const subtotal = newItems.reduce((acc, curr) => acc + curr.amount, 0);
    onUpdateInvoice({
      ...invoice,
      items: newItems,
      subtotal,
      totalAmount: Math.max(0, subtotal - invoice.discount),
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-[#0F172A] overflow-y-auto">
      {/* Hidden file inputs for photo picker simulation */}
      <input
        type="file"
        ref={beforeFileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'before')}
      />
      <input
        type="file"
        ref={afterFileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'after')}
      />

      {/* Top App Bar with Material 3 styling */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h1 className="font-bold text-base text-slate-900 leading-tight">BoloBill Builder</h1>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Language: <span className="font-semibold text-blue-600">{invoice.pdfLanguage === 'ENGLISH' ? 'Professional English' : 'Hinglish (बोलचाल)'}</span>
          </p>
        </div>

        {/* Language Switch Toggle (Feature 3) */}
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition active:scale-95 border border-slate-300"
          title="Toggle Bill Language"
        >
          <Languages className="w-3.5 h-3.5 text-blue-600" />
          <span>{invoice.pdfLanguage === 'ENGLISH' ? 'English (EN)' : 'Hinglish (HI)'}</span>
        </button>
      </header>

      <div className="p-4 space-y-4 pb-28">
        {/* Customer Information Card */}
        <section className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer Details</h2>
            <span className="text-[11px] font-mono text-slate-400">#{invoice.invoiceNumber}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Customer Name</label>
              <input
                type="text"
                value={invoice.clientName}
                onChange={(e) => onUpdateInvoice({ ...invoice, clientName: e.target.value })}
                placeholder="e.g., Rahul Sharma"
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">WhatsApp Number</label>
              <input
                type="text"
                value={invoice.clientPhone}
                onChange={(e) => onUpdateInvoice({ ...invoice, clientPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
          </div>
        </section>

        {/* FEATURE 1: Before & After Work Proof Photos (Native Photo Picker Mock) */}
        <section className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Work Proof Photos (Before & After)</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Zero Storage Permission
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Tapping opens Android Photo Picker. Images are downsampled to 120x90dp and embedded at bottom of PDF.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Before Work Slot */}
            <div className="relative group">
              <div
                onClick={() => beforeFileInputRef.current?.click()}
                className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center cursor-pointer transition overflow-hidden ${
                  invoice.beforePhotoUri
                    ? 'border-blue-400 bg-blue-50/30'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20'
                }`}
              >
                {invoice.beforePhotoUri ? (
                  <div className="relative w-full h-full">
                    <img
                      src={invoice.beforePhotoUri}
                      alt="Work Before"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      Before Work
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700">Before Work</span>
                    <span className="text-[10px] text-slate-400">Tap to choose</span>
                  </div>
                )}
              </div>
              {invoice.beforePhotoUri && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateInvoice({ ...invoice, beforePhotoUri: null });
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-700 transition"
                  title="Remove Photo"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* After Work Slot */}
            <div className="relative group">
              <div
                onClick={() => afterFileInputRef.current?.click()}
                className={`h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center cursor-pointer transition overflow-hidden ${
                  invoice.afterPhotoUri
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/20'
                }`}
              >
                {invoice.afterPhotoUri ? (
                  <div className="relative w-full h-full">
                    <img
                      src={invoice.afterPhotoUri}
                      alt="Work Completed"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      After Work
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-700">After Work</span>
                    <span className="text-[10px] text-slate-400">Tap to choose</span>
                  </div>
                )}
              </div>
              {invoice.afterPhotoUri && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateInvoice({ ...invoice, afterPhotoUri: null });
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-700 transition"
                  title="Remove Photo"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* FEATURE 2: Service Guarantee / Warranty Horizontal Chip Group */}
        <section className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Service Guarantee Badge</h2>
            </div>
            {invoice.warrantyTerm !== 'NO_WARRANTY' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Circular Stamp Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Draws an official circular vector warranty stamp on the generated A4 PDF canvas.
          </p>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(
              [
                { term: 'NO_WARRANTY', label: 'No Warranty' },
                { term: '15_DAYS', label: '15 Days' },
                { term: '30_DAYS', label: '30 Days Guarantee' },
                { term: '90_DAYS', label: '90 Days Service' },
              ] as const
            ).map((chip) => {
              const isSelected = invoice.warrantyTerm === chip.term;
              return (
                <button
                  key={chip.term}
                  type="button"
                  onClick={() => handleWarrantyChange(chip.term)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {chip.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Bill Items Section */}
        <section className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Quotation Line Items ({invoice.items.length})
            </h2>
            <button
              onClick={onOpenVoiceModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition"
            >
              <Mic className="w-3.5 h-3.5 text-blue-600" />
              <span>Bolo Bill (Voice)</span>
            </button>
          </div>

          {/* Quick Voice Prompt Suggestions */}
          <div className="bg-blue-50/50 rounded-lg p-2.5 border border-blue-100 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600">
              <span className="font-semibold text-blue-900">Try Voice or Quick Add:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[
                  '1 पंखा fitting 350',
                  '2 switch board 300',
                  'taar wiring 450',
                  'नल tap fitting 250',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const items = parseVoiceInput(sample, invoice.pdfLanguage);
                      if (items.length > 0) {
                        const newItems = [...invoice.items, ...items];
                        const subtotal = newItems.reduce((acc, curr) => acc + curr.amount, 0);
                        onUpdateInvoice({
                          ...invoice,
                          items: newItems,
                          subtotal,
                          totalAmount: Math.max(0, subtotal - invoice.discount),
                        });
                      }
                    }}
                    className="text-[10px] bg-white text-slate-700 hover:text-blue-700 px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-mono font-medium"
                  >
                    + {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            {invoice.items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 font-bold">{index + 1}.</span>
                    <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 pl-4">
                    ₹{item.rate} × {item.quantity} {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900 font-mono">₹{item.amount}</span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Manual Add Line Item Form */}
          <form onSubmit={handleAddItem} className="pt-2 border-t border-slate-200/80 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name (e.g. पंखा / switch / fitting)"
                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
              />
              <input
                type="number"
                min="1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(Number(e.target.value))}
                placeholder="Qty"
                className="w-14 text-xs px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 text-center bg-white"
              />
              <input
                type="number"
                min="10"
                step="10"
                value={newItemRate}
                onChange={(e) => setNewItemRate(Number(e.target.value))}
                placeholder="₹ Rate"
                className="w-20 text-xs px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 text-center bg-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </form>
        </section>

        {/* Total Summary Breakdown */}
        <section className="bg-slate-900 text-white rounded-xl p-3.5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Total Quotation</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-mono text-white">₹{invoice.totalAmount}</span>
              {invoice.discount > 0 && (
                <span className="text-[11px] text-emerald-400 font-medium line-through">
                  ₹{invoice.subtotal}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">UPI Payee ID</span>
            <span className="text-xs font-mono font-semibold text-blue-300">{invoice.technicianUpiId}</span>
          </div>
        </section>

        {/* FEATURE 4: 1-Tap Payment Receipt Mode (Mark as Paid) Toggle */}
        <section
          className={`rounded-2xl p-3.5 border transition-all duration-300 ${
            invoice.isPaid
              ? 'bg-emerald-50/90 border-emerald-300 shadow-sm'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  invoice.isPaid
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {invoice.isPaid ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`text-xs font-bold ${
                      invoice.isPaid ? 'text-emerald-900' : 'text-slate-800'
                    }`}
                  >
                    {invoice.isPaid ? 'Marked as Paid (रसीद मोड)' : 'Mark as Paid / Receipt Mode'}
                  </h3>
                  {invoice.isPaid && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold tracking-wider uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {invoice.isPaid
                    ? 'Applies subtle stamp entry animation to preview & suppresses QR'
                    : 'Toggle to apply animated PAID stamp watermark and receipt header'}
                </p>
              </div>
            </div>

            {/* Custom Interactive Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={invoice.isPaid}
              onClick={() => {
                const nextPaid = !invoice.isPaid;
                onUpdateInvoice({
                  ...invoice,
                  isPaid: nextPaid,
                  paidDate: nextPaid ? invoice.paidDate || Date.now() : undefined,
                });
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                invoice.isPaid ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  invoice.isPaid ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {invoice.isPaid && <Check className="w-3 h-3 text-emerald-600" />}
              </span>
            </button>
          </div>
        </section>

        {/* Invoice Live Preview with animateFloatAsState-equivalent Subtle Stamp Animation */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Invoice Preview / बिल पूर्वावलोकन</span>
            </h3>
            {invoice.isPaid && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Watermark Stamp Active
              </span>
            )}
          </div>

          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden select-none">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

            {/* Subtle Stamp Entry Watermark Animation (Matching animateFloatAsState in Compose) */}
            {invoice.isPaid && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10 overflow-hidden">
                <div className="animate-stamp-impact border-3 border-emerald-600 rounded-xl px-5 py-2.5 flex flex-col items-center justify-center bg-emerald-500/10 backdrop-blur-[0.5px] shadow-sm">
                  <span className="text-3xl font-black tracking-widest text-emerald-600 font-mono">
                    PAID
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 tracking-wide mt-0.5">
                    पूर्ण भुगतान प्राप्त
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-emerald-800/80 mt-0.5">
                    DATE: {new Date(invoice.paidDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )}

            {/* Simulated Invoice Canvas Elements */}
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">BOLOBILL INVOICE</h4>
                  <p className="text-[10px] text-slate-400 font-mono">#{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{invoice.technicianName}</p>
                  <p className="text-[10px] text-slate-500">{invoice.technicianTrade}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-600">
                <span className="font-medium text-slate-900 truncate max-w-[180px]">
                  To: {invoice.clientName || 'Customer Name'}
                </span>
                <span className="font-mono text-slate-500">{invoice.clientPhone}</span>
              </div>

              {/* Items Summary Table */}
              <div className="space-y-1 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                {invoice.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between text-[11px]">
                    <span className="text-slate-700 truncate max-w-[200px]">• {item.name}</span>
                    <span className="font-mono font-semibold text-slate-900">₹{item.amount}</span>
                  </div>
                ))}
                {invoice.items.length > 3 && (
                  <p className="text-[10px] text-slate-400 italic pt-0.5">
                    + {invoice.items.length - 3} more items...
                  </p>
                )}
              </div>

              {/* Footer Total */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                    Total Amount
                  </span>
                  <span className="text-sm font-extrabold font-mono text-slate-900">
                    ₹{invoice.totalAmount}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Guarantee</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {invoice.warrantyTerm ? invoice.warrantyTerm.replace('_', ' ') : 'NO WARRANTY'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur border-t border-slate-200 p-3 flex items-center gap-3 z-30 shadow-lg">
        <button
          onClick={onOpenVoiceModal}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-300 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition active:scale-95 shadow-2xs"
        >
          <Mic className="w-4 h-4 text-blue-600 animate-pulse" />
          <span>Bolo Voice Bill</span>
        </button>

        <button
          onClick={onNavigateToPreview}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition active:scale-95 shadow-md"
        >
          <FileText className="w-4 h-4" />
          <span>Generate A4 PDF</span>
        </button>
      </footer>
    </div>
  );
};
