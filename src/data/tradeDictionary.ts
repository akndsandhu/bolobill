import { InvoiceItem, PdfLanguage } from '../types';

export interface TermMapping {
  hindi: string[];
  hinglish: string[];
  english: string;
  category: 'electrical' | 'plumbing' | 'carpentry' | 'ac_appliance' | 'general';
  defaultRate?: number;
  defaultUnit?: string;
}

export const TRADE_MAPPINGS: TermMapping[] = [
  // Electrical
  {
    hindi: ['पंखा', 'पंखे', 'छत का पंखा'],
    hinglish: ['pankha', 'pankhe', 'fan', 'ceiling fan'],
    english: 'Ceiling Fan',
    category: 'electrical',
    defaultRate: 350,
    defaultUnit: 'nos',
  },
  {
    hindi: ['फिटिंग', 'लगाना', 'फिक्सिंग', 'इन्स्टॉलेशन'],
    hinglish: ['fitting', 'lagana', 'lagai', 'fixing', 'installation', 'fit'],
    english: 'Installation & Fitting',
    category: 'general',
    defaultRate: 250,
    defaultUnit: 'job',
  },
  {
    hindi: ['तार', 'वायर', 'केबल'],
    hinglish: ['taar', 'tar', 'wire', 'cable', 'wiring'],
    english: 'Electrical Wiring',
    category: 'electrical',
    defaultRate: 450,
    defaultUnit: 'mtr/coil',
  },
  {
    hindi: ['स्विच', 'स्विच बोर्ड', 'बोर्ड', 'प्लग'],
    hinglish: ['switch', 'switch board', 'switchboard', 'board', 'plug', 'socket'],
    english: 'Modular Switch Board',
    category: 'electrical',
    defaultRate: 180,
    defaultUnit: 'nos',
  },
  {
    hindi: ['एमसीबी', 'एमसीबी बॉक्स', 'कट आउट'],
    hinglish: ['mcb', 'mcb box', 'cutout', 'trip switch'],
    english: 'MCB Circuit Breaker',
    category: 'electrical',
    defaultRate: 450,
    defaultUnit: 'nos',
  },
  {
    hindi: ['लाइट', 'बल्ब', 'ट्यूबलाइट', 'एलईडी'],
    hinglish: ['light', 'bulb', 'tubelight', 'led', 'cfl'],
    english: 'LED Fixture & Tubelight',
    category: 'electrical',
    defaultRate: 120,
    defaultUnit: 'nos',
  },

  // Plumbing
  {
    hindi: ['पाइप', 'नल का पाइप', 'पीवीसी पाइप'],
    hinglish: ['pipe', 'pvc pipe', 'cpvc pipe', 'water pipe'],
    english: 'PVC / Copper Piping',
    category: 'plumbing',
    defaultRate: 350,
    defaultUnit: 'ft',
  },
  {
    hindi: ['नल', 'टोटी', 'नलका'],
    hinglish: ['nal', 'toti', 'tap', 'bib cock', 'water tap'],
    english: 'Brass / Chrome Water Tap',
    category: 'plumbing',
    defaultRate: 280,
    defaultUnit: 'nos',
  },
  {
    hindi: ['गीज़र', 'गीजर फिटिंग', 'वाटर हीटर'],
    hinglish: ['geyser', 'geezer', 'water heater', 'geyser fitting'],
    english: 'Water Geyser Installation',
    category: 'plumbing',
    defaultRate: 650,
    defaultUnit: 'job',
  },
  {
    hindi: ['मोटर', 'सबमर्सिबल', 'पंप'],
    hinglish: ['motor', 'submersible', 'water pump', 'tullu motor'],
    english: 'Water Pump Repair & Service',
    category: 'plumbing',
    defaultRate: 500,
    defaultUnit: 'job',
  },
  {
    hindi: ['लीकेज', 'रिसाव', 'टपकना'],
    hinglish: ['leakage', 'leaking', 'tap tapakna', 'seepage'],
    english: 'Leakage Detection & Seal Repair',
    category: 'plumbing',
    defaultRate: 300,
    defaultUnit: 'job',
  },

  // AC & Appliances
  {
    hindi: ['एसी सर्विस', 'एसी गैस', 'एसी रिपेयर'],
    hinglish: ['ac service', 'ac repair', 'ac gas', 'cooling repair'],
    english: 'AC Deep Clean Service & Gas Charge',
    category: 'ac_appliance',
    defaultRate: 850,
    defaultUnit: 'nos',
  },

  // Carpentry
  {
    hindi: ['कब्जा', 'हिंज'],
    hinglish: ['kabja', 'hinge', 'door hinge'],
    english: 'Heavy-Duty Door Hinges',
    category: 'carpentry',
    defaultRate: 150,
    defaultUnit: 'pair',
  },
  {
    hindi: ['ताला', 'हैंडल लॉक', 'लॉक'],
    hinglish: ['tala', 'lock', 'handle lock', 'door lock'],
    english: 'Mortise Handle Lock Fitting',
    category: 'carpentry',
    defaultRate: 400,
    defaultUnit: 'nos',
  },
];

/**
 * Normalizes input text according to the selected language mode.
 */
export function normalizeTradeText(text: string, language: PdfLanguage): string {
  if (!text) return '';
  const lower = text.trim().toLowerCase();

  for (const mapping of TRADE_MAPPINGS) {
    // Check Hindi matches
    for (const h of mapping.hindi) {
      if (lower.includes(h.toLowerCase())) {
        return language === 'ENGLISH' ? mapping.english : mapping.hinglish[0];
      }
    }
    // Check Hinglish matches
    for (const hg of mapping.hinglish) {
      if (lower.includes(hg.toLowerCase())) {
        return language === 'ENGLISH' ? mapping.english : mapping.hinglish[0];
      }
    }
  }

  // If already in English or custom text, capitalize nicely
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Parses spoken Hinglish voice input into structured invoice items.
 * Example input: "1 pankha fitting 350 aur 2 switch board 300 taar 200"
 */
export function parseVoiceInput(spokenTranscript: string, language: PdfLanguage): InvoiceItem[] {
  if (!spokenTranscript.trim()) return [];

  // Split clauses by separators like 'aur', 'and', 'bhi', ',', '+'
  const segments = spokenTranscript
    .toLowerCase()
    .split(/\b(?:aur|and|plus|bhi|\+|,)\b/gi)
    .map(s => s.trim())
    .filter(Boolean);

  const items: InvoiceItem[] = [];

  for (let idx = 0; idx < segments.length; idx++) {
    const segment = segments[idx];
    
    // Extract numbers: quantity (first number if 1-2 digits before item name) and rate/amount
    const numbers = (segment.match(/\d+/g) || []).map(Number);
    let qty = 1;
    let rate = 0;

    if (numbers.length === 1) {
      // Typically rate if > 50, otherwise qty
      if (numbers[0] > 50) {
        rate = numbers[0];
      } else {
        qty = numbers[0];
      }
    } else if (numbers.length >= 2) {
      qty = numbers[0];
      rate = numbers[1];
    }

    // Identify matching item
    let matchedMapping: TermMapping | null = null;
    let matchedSubstr = '';

    for (const mapping of TRADE_MAPPINGS) {
      const allKeywords = [...mapping.hinglish, ...mapping.hindi];
      for (const kw of allKeywords) {
        if (segment.includes(kw.toLowerCase())) {
          matchedMapping = mapping;
          matchedSubstr = kw;
          break;
        }
      }
      if (matchedMapping) break;
    }

    if (matchedMapping) {
      if (rate === 0 && matchedMapping.defaultRate) {
        rate = matchedMapping.defaultRate;
      }
      const englishName = matchedMapping.english;
      const hinglishName = matchedMapping.hinglish[0].toUpperCase() + ' ' + (matchedMapping.category === 'electrical' ? 'Ka Kaam' : '');
      const selectedName = language === 'ENGLISH' ? englishName : hinglishName;

      items.push({
        id: 'item_' + Date.now() + '_' + idx,
        originalText: segment,
        name: selectedName,
        normalizedEnglishName: englishName,
        hinglishName: hinglishName,
        quantity: qty,
        unit: matchedMapping.defaultUnit || 'nos',
        rate: rate || 250,
        amount: qty * (rate || 250),
      });
    } else {
      // Fallback for custom terms
      const cleanName = segment.replace(/\d+/g, '').replace(/ka|ki|ke|fitting|repair|service/gi, '').trim();
      const title = cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : 'Service Work';
      const actualRate = rate > 0 ? rate : 300;
      items.push({
        id: 'item_' + Date.now() + '_' + idx,
        originalText: segment,
        name: title,
        normalizedEnglishName: title,
        hinglishName: title,
        quantity: qty,
        unit: 'nos',
        rate: actualRate,
        amount: qty * actualRate,
      });
    }
  }

  return items;
}
