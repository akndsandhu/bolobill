import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, X, Check, Volume2 } from 'lucide-react';
import { InvoiceItem, PdfLanguage } from '../types';
import { parseVoiceInput } from '../data/tradeDictionary';

interface QuickVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfLanguage: PdfLanguage;
  onAddItems: (items: InvoiceItem[]) => void;
}

const PRESET_SPEECH_EXAMPLES = [
  {
    title: 'Electrician (पंखा + स्विच + तार)',
    text: '2 pankha fitting 350 aur 3 switch board 250 aur 1 coil taar 450',
  },
  {
    title: 'Plumber (नल + पाइप + लीकेज)',
    text: '2 nal tap fitting 280 aur 10 ft pvc pipe 350 aur leakage repair 300',
  },
  {
    title: 'Carpenter (ताला + कब्जा)',
    text: '1 mortise handle lock 450 aur 4 kabja hinge fitting 150',
  },
  {
    title: 'AC Technician (सर्विस + गैस)',
    text: '1 AC deep clean service 850 aur wiring repair 350',
  },
];

export const QuickVoiceModal: React.FC<QuickVoiceModalProps> = ({
  isOpen,
  onClose,
  pdfLanguage,
  onAddItems,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  useEffect(() => {
    // Check Speech Recognition support in browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Indian Hindi / Hinglish

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript + ' ';
        }
        setTranscript(current.trim());
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
    } else {
      setSpeechSupported(false);
    }
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionInstance) return;

    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      try {
        recognitionInstance.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleApplyTranscript = (textToUse?: string) => {
    const final = textToUse || transcript;
    if (!final.trim()) return;

    const parsed = parseVoiceInput(final, pdfLanguage);
    if (parsed.length > 0) {
      onAddItems(parsed);
      onClose();
      setTranscript('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Bolo Bill (Voice Dictation)</h3>
            <p className="text-[11px] text-slate-500">
              Speak in Hindi or Hinglish • Offline Trade Dictionary will auto-normalize
            </p>
          </div>
        </div>

        {/* Live Mic Animation & Control */}
        <div className="flex flex-col items-center justify-center my-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition transform active:scale-95 shadow-lg ${
              isListening
                ? 'bg-rose-600 ring-4 ring-rose-300 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title={isListening ? 'Stop Recording' : 'Start Recording'}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <span className="text-xs font-semibold text-slate-700 mt-2.5">
            {isListening ? 'Listening... Speak items with price' : 'Tap to start speaking'}
          </span>
          <span className="text-[10px] text-slate-400">
            e.g., "1 pankha fitting 350 aur 2 switch board 200"
          </span>
        </div>

        {/* Live Transcript Box */}
        <div className="mb-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Spoken Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken words appear here... or type custom items"
            rows={2}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
          />
        </div>

        {/* Quick Technician Voice Presets */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Or Click a Sample Spoken Quote:
          </span>
          <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {PRESET_SPEECH_EXAMPLES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTranscript(item.text);
                  handleApplyTranscript(item.text);
                }}
                className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition flex items-center justify-between group"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-[11px] font-semibold text-slate-800 block truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono truncate block">
                    "{item.text}"
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  Use +
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={() => handleApplyTranscript()}
            disabled={!transcript.trim()}
            className="flex-1 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" /> Parse & Add Items
          </button>
        </div>
      </div>
    </div>
  );
};
