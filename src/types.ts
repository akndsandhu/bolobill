export type WarrantyTerm = 'NO_WARRANTY' | '15_DAYS' | '30_DAYS' | '90_DAYS';

export type PdfLanguage = 'HINGLISH' | 'ENGLISH';

export interface InvoiceItem {
  id: string;
  originalText: string;
  name: string;
  normalizedEnglishName: string;
  hinglishName: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  technicianName: string;
  technicianTrade: string;
  technicianUpiId: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  createdAt: number;
  isPaid: boolean;
  paidDate?: number | null;
  paymentMode?: string;
  beforePhotoUri?: string | null;
  afterPhotoUri?: string | null;
  warrantyTerm: WarrantyTerm;
  pdfLanguage: PdfLanguage;
  notes?: string;
}

export interface PlayAuditItem {
  id: string;
  category: 'PERMISSIONS' | 'STORAGE' | 'MEDIA' | 'SDK_TARGET';
  title: string;
  playStoreRule: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  details: string;
  implementationRef: string;
}

export interface KotlinFileEntry {
  id: string;
  filename: string;
  path: string;
  description: string;
  badge: string;
  code: string;
}
