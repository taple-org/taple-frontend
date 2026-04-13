export type LeadFit = {
  label: string;
  level: string;
};

export type LeadBranch = {
  id: string;
  name?: string | null;
  fullAddress?: string | null;
  isActive: boolean;
  rating?: number | null;
  reviewCount?: number | null;
};

export type Lead = {
  id: string;
  score: number;
  title: string;
  subtitle: string;
  tags: string[];
  address: string;
  phone: string;
  openStatus: string;
  contacts: string[];
  email: string;
  locationShort: string;
  fitScores: LeadFit[];
  reasons: string[];
  freshness: string;
  branches: LeadBranch[];
};

export type FilterOption = {
  label: string;
  checked: boolean;
};
