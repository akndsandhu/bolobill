import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Share2,
  CheckCircle,
  Clock,
  QrCode,
  Download,
  ShieldCheck,
  Check,
  Printer,
  Sparkles,
  CheckCircle2,
  Copy,
  FileCheck,
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Invoice } from '../types';

interface PdfPreviewScreenProps {
  invoice: Invoice;
  onUpdateInvoice: (updated: Invoice) => void;
  onBack: () => void;
}

export const PdfPreviewScreen: React.FC<PdfPreviewScreenProps> = ({
  invoice,
  onUpdateInvoice,
  onBack,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedMsg, setCopiedMsg] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic WhatsApp Intent Text based on paid status (Feature 4)
  const getWhatsAppMessage = (isPaid: boolean) => {
    const formattedAmount = Number(invoice.totalAmount).toFixed(0);
    if (isPaid) {
      return `नमस्ते ${invoice.clientName} जी, आपके काम का कुल भुगतान ₹${formattedAmount} प्राप्त हो गया है। रसीद संलग्न है। धन्यवाद!`;
    } else {
      return `नमस्ते ${invoice.clientName} जी, आपके काम का बिल ₹${formattedAmount} है। कृपया संलग्न PDF में दिए गए UPI QR कोड से भुगतान करें। धन्यवाद!`;
    }
  };

  const whatsappMessage = getWhatsAppMessage(invoice.isPaid);

  // Generate UPI QR Code URL when unpaid
  useEffect(() => {
    if (!invoice.isPaid) {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(invoice.technicianUpiId)}&pn=${encodeURIComponent(
        invoice.technicianName
      )}&am=${invoice.totalAmount}&cu=INR&tn=Invoice%20${invoice.invoiceNumber}`;

      QRCode.toDataURL(upiUrl, {
        margin: 1,
        width: 140,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => setQrCodeDataUrl(''));
    }
  }, [invoice.isPaid, invoice.technicianUpiId, invoice.technicianName, invoice.totalAmount, invoice.invoiceNumber]);

  // Handle 1-Tap Mark as Paid toggle
  const handleTogglePaid = (checked: boolean) => {
    if (checked && !invoice.isPaid) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16A34A', '#22C55E', '#86EFAC', '#3B82F6'],
      });
    }

    onUpdateInvoice({
      ...invoice,
      isPaid: checked,
      paidDate: checked ? (invoice.paidDate || Date.now()) : null,
    });
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    const cleanPhone = invoice.clientPhone.replace(/\D/g, '');
    const url = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(invoice.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const clearanceDate = invoice.paidDate
    ? new Date(invoice.paidDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : formattedDate;

  return (
    <div className="flex flex-col h-full bg-[#F1F5F9] text-[#0F172A] overflow-y-auto">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 transition active:scale-95 text-slate-600"
            title="Back to Editor"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">
              {invoice.isPaid ? 'Payment Receipt (रसीद)' : 'A4 Invoice Preview'}
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">#{invoice.invoiceNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Print / Save PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="p-3.5 space-y-3.5 pb-28">
        {/* FEATURE 4: 1-Tap "Mark as Paid" Instant Receipt Toggle Card */}
        <section
          className={`rounded-xl p-3.5 border transition shadow-xs ${
            invoice.isPaid
              ? 'bg-emerald-50/90 border-emerald-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  invoice.isPaid
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {invoice.isPaid ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-xs font-bold ${
                      invoice.isPaid ? 'text-emerald-900' : 'text-slate-800'
                    }`}
                  >
                    {invoice.isPaid
                      ? 'Receipt Mode: Paid (पूर्ण भुगतान प्राप्त)'
                      : 'Invoice Mode: Payment Pending'}
                  </h3>
                  {invoice.isPaid && (
                    <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                      CLEAR
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">
                  {invoice.isPaid
                    ? `Cleared on ${clearanceDate} • Green watermark active • QR suppressed`
                    : '1-Tap to mark as paid & turn invoice into an official receipt'}
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={invoice.isPaid}
                onChange={(e) => handleTogglePaid(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </section>

        {/* WhatsApp Intent Message Preview Card */}
        <section className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200 text-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                ShareableIntentHelper • WhatsApp Dynamic Message
              </span>
            </div>
            <button
              onClick={handleCopyMessage}
              className="text-[10px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
            >
              {copiedMsg ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Text
                </>
              )}
            </button>
          </div>
          <div className="bg-white/90 p-2 rounded-lg border border-emerald-100 text-xs text-slate-700 leading-relaxed font-sans shadow-2xs">
            {whatsappMessage}
          </div>
          <div className="flex items-center justify-between text-[10px] text-emerald-700 pt-0.5">
            <span className="flex items-center gap-1">
              <FileCheck className="w-3 h-3 text-emerald-600" /> FileProvider URI: <code className="bg-emerald-100/70 px-1 py-0.5 rounded font-mono text-[9px]">{`content://com.bolobill.app.fileprovider/cache/invoices/${invoice.invoiceNumber}.pdf`}</code>
            </span>
            <span className="font-medium text-emerald-800">Target: com.whatsapp / w4b</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* A4 CANVAS PDF DOCUMENT RENDERER (Matching PdfGenerator.kt) */}
        {/* ========================================================= */}
        <div className="relative bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden font-sans select-none print:shadow-none print:border-0 print:m-0">
          {/* Top Blue Bar */}
          <div className="h-2 bg-blue-600 w-full"></div>

          {/* Diagonal Semi-Transparent Green "PAID" Watermark (Feature 4 with subtle stamp entry animation) */}
          {invoice.isPaid && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10 overflow-hidden">
              <div className="animate-stamp-impact-preview border-4 border-emerald-600/35 rounded-2xl px-7 py-3.5 flex flex-col items-center justify-center bg-emerald-500/10 backdrop-blur-[0.5px] shadow-sm">
                <span className="text-4xl font-extrabold tracking-widest text-emerald-600/40 font-mono">
                  PAID
                </span>
                <span className="text-xs font-bold text-emerald-700/45 tracking-wider mt-0.5">
                  पूर्ण भुगतान प्राप्त
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-700/45 mt-0.5">
                  DATE: {clearanceDate}
                </span>
              </div>
            </div>
          )}

          <div className="p-5 space-y-4 text-slate-800">
            {/* Header: Title + Technician Info */}
            <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  BOLOBILL INVOICE
                </h2>
                <p className="text-[10px] text-slate-500 font-mono">
                  Invoice #: <span className="font-semibold text-slate-700">{invoice.invoiceNumber}</span>
                </p>
                <p className="text-[10px] text-slate-500">Date: {formattedDate}</p>
                <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                  Mode: {invoice.pdfLanguage === 'ENGLISH' ? 'Professional English' : 'Hinglish'}
                </span>
              </div>

              <div className="text-right bg-slate-50 p-2 rounded-lg border border-slate-100 min-w-[140px]">
                <p className="text-xs font-bold text-slate-900">{invoice.technicianName}</p>
                <p className="text-[10px] text-slate-500">{invoice.technicianTrade}</p>
                <p className="text-[10px] font-mono text-blue-700 font-semibold mt-0.5">
                  UPI: {invoice.technicianUpiId}
                </p>
              </div>
            </div>

            {/* Billed To Box */}
            <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/70 text-xs">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Billed To / सेवा प्राप्तकर्ता
              </span>
              <p className="font-bold text-slate-900 mt-0.5">{invoice.clientName}</p>
              <p className="text-[11px] text-slate-600">
                {invoice.clientPhone} • {invoice.clientAddress}
              </p>
            </div>

            {/* Items Table */}
            <div>
              <div className="grid grid-cols-12 bg-slate-100 px-2.5 py-1.5 rounded text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <span className="col-span-1">#</span>
                <span className="col-span-6">Description / विवरण</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-3 text-right">Amount (₹)</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {invoice.items.map((item, idx) => (
                  <div key={item.id} className="grid grid-cols-12 px-2.5 py-1.5 items-center">
                    <span className="col-span-1 font-mono text-slate-400 text-[10px]">{idx + 1}</span>
                    <div className="col-span-6">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <span className="block text-[9px] text-slate-400">
                        ₹{item.rate} / {item.unit}
                      </span>
                    </div>
                    <span className="col-span-2 text-center text-slate-600 font-mono text-[11px]">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="col-span-3 text-right font-mono font-bold text-slate-900">
                      ₹{item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section + Circular Warranty Stamp (Feature 2) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              {/* FEATURE 2: Circular Vector Warranty Stamp Badge */}
              <div className="flex items-center">
                {invoice.warrantyTerm !== 'NO_WARRANTY' ? (
                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-cyan-600 p-1 flex flex-col items-center justify-center text-center bg-cyan-50/50 transform -rotate-3">
                    <div className="w-20 h-20 rounded-full border border-cyan-500 flex flex-col items-center justify-center p-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-700 mb-0.5" />
                      <span className="text-[7px] font-bold tracking-widest text-cyan-800 uppercase leading-none">
                        BOLOBILL
                      </span>
                      <span className="text-sm font-extrabold text-cyan-700 font-mono leading-none my-0.5">
                        {invoice.warrantyTerm === '15_DAYS'
                          ? '15'
                          : invoice.warrantyTerm === '90_DAYS'
                          ? '90'
                          : '30'}
                      </span>
                      <span className="text-[7px] font-bold text-cyan-900 uppercase leading-none">
                        DAYS WARRANTY
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 italic">No warranty selected</div>
                )}
              </div>

              {/* Subtotal & Total Payable */}
              <div className="text-right space-y-1">
                <div className="text-[11px] text-slate-500 flex justify-end gap-3">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-700">₹{invoice.subtotal}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="text-[11px] text-rose-600 flex justify-end gap-3">
                    <span>Discount:</span>
                    <span className="font-mono">- ₹{invoice.discount}</span>
                  </div>
                )}
                <div className="text-sm font-extrabold flex justify-end gap-3 pt-1 border-t border-slate-200 text-slate-900">
                  <span>Total Payable:</span>
                  <span className="font-mono text-base text-emerald-700">₹{invoice.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* FEATURE 1: Before & After Work Proof Photos (Embedded side-by-side) */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Verified Work Proof / कार्य प्रमाण फोटो (120x90dp Target):
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Work Before Thumbnail */}
                <div className="border border-slate-200 rounded-lg p-1 bg-slate-50/50 flex flex-col items-center">
                  <div className="w-full h-20 rounded bg-slate-200 overflow-hidden flex items-center justify-center">
                    {invoice.beforePhotoUri ? (
                      <img
                        src={invoice.beforePhotoUri}
                        alt="Work Before"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No Before Photo</span>
                    )}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-600 mt-1">
                    Work Before / कार्य से पहले
                  </span>
                </div>

                {/* Work After Thumbnail */}
                <div className="border border-slate-200 rounded-lg p-1 bg-slate-50/50 flex flex-col items-center">
                  <div className="w-full h-20 rounded bg-slate-200 overflow-hidden flex items-center justify-center">
                    {invoice.afterPhotoUri ? (
                      <img
                        src={invoice.afterPhotoUri}
                        alt="Work Completed"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No After Photo</span>
                    )}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-600 mt-1">
                    Work Completed / कार्य सम्पन्न
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Section: UPI QR Code OR Payment Clearance Box (Feature 4) */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[10px] text-slate-500 max-w-[200px]">
                {invoice.notes || 'Thank you for your business! For any issues, contact technician directly.'}
              </div>

              {/* Conditional Rendering for Payment Clearance vs UPI QR */}
              <div>
                {invoice.isPaid ? (
                  // PAYMENT CLEARED BOX (UPI QR Code Suppressed per specification)
                  <div className="border-2 border-emerald-500 bg-emerald-50 p-2.5 rounded-lg text-center w-36 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-0.5" />
                    <p className="text-[10px] font-extrabold text-emerald-900 leading-tight">
                      PAYMENT CLEARED
                    </p>
                    <p className="text-[8px] text-emerald-700 font-semibold">पूर्ण भुगतान प्राप्त</p>
                    <p className="text-[9px] font-mono text-emerald-800 mt-1 font-bold">
                      {clearanceDate}
                    </p>
                  </div>
                ) : (
                  // UPI QR CODE ACTIVE
                  <div className="border border-slate-200 bg-slate-50 p-1.5 rounded-lg text-center w-36">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="UPI QR Code"
                        className="w-24 h-24 mx-auto object-contain rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto flex items-center justify-center bg-slate-200 rounded text-slate-400">
                        <QrCode className="w-8 h-8" />
                      </div>
                    )}
                    <p className="text-[9px] font-bold text-slate-800 uppercase mt-0.5">SCAN TO PAY</p>
                    <p className="text-[8px] text-slate-500">Google Pay • PhonePe • Paytm</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur border-t border-slate-200 p-3 flex items-center gap-3 z-30 shadow-lg">
        <button
          onClick={handleShareWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition active:scale-95 shadow-md"
        >
          <Share2 className="w-4 h-4" />
          <span>{invoice.isPaid ? 'WhatsApp Payment Receipt' : 'WhatsApp Invoice & UPI'}</span>
        </button>
      </footer>
    </div>
  );
};
