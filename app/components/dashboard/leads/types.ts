export type LeadFit = {
  label: string;
  level: string;
};

export type Lead = {
  id: number;
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
};

export type FilterOption = {
  label: string;
  checked: boolean;
};
