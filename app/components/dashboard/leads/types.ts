export interface FilterOption {
  label: string;
  checked: boolean;
  value?: string;
}

// ─── Congestion (загруженность по часам) ──────────────────────────────────────
export interface CongestionLevelEntry {
  level: number;
  days: Record<string, number[]>; // "Mon" | "Tue" | ... → hours[]
}

export interface Congestion {
  present: boolean;
  peak_level: number;
  avg_level: number;
  peak_hours_count: number;
  evening_peak: boolean;
  weekend_peak: boolean;
  levels: CongestionLevelEntry[];
}

// ─── Branch ──────────────────────────────────────────────────────────────────
export interface LeadBranch {
  id: string;
  name: string;
  fullAddress: string;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  congestion?: Congestion; // mapped from branch.signals.congestion
}

// ─── Signals (сигналы точки) ──────────────────────────────────────────────────
export interface LeadSignals {
  rating?: number;
  reviewCount?: number;
  hasDelivery?: boolean;
  is24x7?: boolean;
  hasCongestion?: boolean;
  nearestStationDistance?: number; // metres
  nearestParkingCount?: number;
}

// ─── KGD Tax payments ────────────────────────────────────────────────────────
export interface TaxPaymentItem {
  type: "firstType" | "secondType" | "thirdType";
  amount: number;
}

export interface TaxPaymentYear {
  year: number;
  items: TaxPaymentItem[];
}

// ─── KGD SUR data ─────────────────────────────────────────────────────────────
export interface KgdSur {
  taxMode: string | null;
  taxDebt: number | null;
  vatRegistered: boolean | null;
  statistics: Array<{
    year: number;
    taxPaid: number;
    workersCount: number;
    vatPaid: number;
  }>;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────
export interface Lead {
  id: string;
  openStatus: string;
  score: number;

  // Display
  title: string;
  subtitle: string;
  tags: string[];

  // Contact
  contacts: string[];
  email: string;
  phone: string;

  // Location
  address: string;
  locationShort: string;

  // Scoring
  fitScores: LeadFit[];
  reasons: string[];
  freshness: string;

  // Raw scores (0–1) from API — used for score bars
  fitScore?: number;
  priorityScore?: number;
  freshnessScore?: number;
  contactabilityScore?: number;
  businessPotentialScore?: number;

  // Branches
  branches: LeadBranch[];

  // NEW: signals, tax, KGD
  signals?: LeadSignals;
  taxPayments?: TaxPaymentYear[];
  kgdSur?: KgdSur;
}

export interface LeadFit {
  label: string;
  level: string;
}

export type Branch = LeadBranch;
