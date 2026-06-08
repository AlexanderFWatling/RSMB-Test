export interface FilterParams {
  platform?: string;
  country?: string;
  industry?: string;
}

export interface SummaryMetrics {
  total_spend: number;
  total_revenue: number;
  total_conversions: number;
  total_impressions: number;
  total_clicks: number;
  average_roas: number;
  average_ctr: number;
  average_cpc: number;
  average_cpa: number;
}

export interface TrendData {
  date: string;
  spend: number;
  revenue: number;
  roas: number;
}

export interface PlatformData extends SummaryMetrics {
  platform: string;
}

export interface CampaignData {
  date: string;
  platform: string;
  campaign_type: string;
  industry: string;
  country: string;
  impressions: number;
  clicks: number;
  ad_spend: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const buildQueryString = (filters?: FilterParams) => {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const fetchSummary = async (
  filters?: FilterParams,
): Promise<SummaryMetrics> => {
  const res = await fetch(
    `${API_BASE}/metrics/summary${buildQueryString(filters)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
};

export const fetchTrends = async (
  filters?: FilterParams,
): Promise<TrendData[]> => {
  const res = await fetch(
    `${API_BASE}/metrics/trends${buildQueryString(filters)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch trends");
  return res.json();
};

export const fetchPlatforms = async (
  filters?: FilterParams,
): Promise<PlatformData[]> => {
  const res = await fetch(`${API_BASE}/platforms${buildQueryString(filters)}`);
  if (!res.ok) throw new Error("Failed to fetch platforms");
  return res.json();
};

export const fetchCampaigns = async (
  filters?: FilterParams,
): Promise<CampaignData[]> => {
  const res = await fetch(`${API_BASE}/campaigns${buildQueryString(filters)}`);
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
};
