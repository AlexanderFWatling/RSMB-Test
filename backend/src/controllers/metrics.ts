import { Request, Response } from "express";
import { getAllData, getFilteredData } from "../services/store";
import { ProcessedAdData } from "../types";

export const aggregateMetrics = (data: ProcessedAdData[]) => {
  return data.reduce(
    (acc, row) => {
      acc.total_spend += row.ad_spend;
      acc.total_revenue += row.revenue;
      acc.total_conversions += row.conversions;
      acc.total_impressions += row.impressions;
      acc.total_clicks += row.clicks;
      return acc;
    },
    {
      total_spend: 0,
      total_revenue: 0,
      total_conversions: 0,
      total_impressions: 0,
      total_clicks: 0,
    },
  );
};

export const calculateDerived = (agg: ReturnType<typeof aggregateMetrics>) => ({
  ...agg,
  average_roas: agg.total_spend > 0 ? agg.total_revenue / agg.total_spend : 0,
  average_ctr:
    agg.total_impressions > 0 ? agg.total_clicks / agg.total_impressions : 0,
  average_cpc: agg.total_clicks > 0 ? agg.total_spend / agg.total_clicks : 0,
  average_cpa:
    agg.total_conversions > 0 ? agg.total_spend / agg.total_conversions : 0,
});

export const getSummaryMetrics = (req: Request, res: Response) => {
  const data = getFilteredData(req.query);
  const aggregates = aggregateMetrics(data);
  res.json(calculateDerived(aggregates));
};

export const getCampaigns = (req: Request, res: Response) => {
  const data = getFilteredData(req.query);
  res.json(data);
};

export const getPlatforms = (req: Request, res: Response) => {
  const data = getFilteredData(req.query);

  const grouped = data.reduce(
    (acc, row) => {
      if (!acc[row.platform]) acc[row.platform] = [];
      acc[row.platform].push(row);
      return acc;
    },
    {} as Record<string, ProcessedAdData[]>,
  );

  const result = Object.entries(grouped).map(([platform, rows]) => ({
    platform,
    ...calculateDerived(aggregateMetrics(rows)),
  }));

  res.json(result);
};

export const getTrends = (req: Request, res: Response) => {
  const data = getFilteredData(req.query);

  const grouped = data.reduce(
    (acc, row) => {
      if (!acc[row.date]) acc[row.date] = [];
      acc[row.date].push(row);
      return acc;
    },
    {} as Record<string, ProcessedAdData[]>,
  );

  const result = Object.entries(grouped)
    .map(([date, rows]) => {
      const agg = aggregateMetrics(rows);
      return {
        date,
        spend: agg.total_spend,
        revenue: agg.total_revenue,
        roas: agg.total_spend > 0 ? agg.total_revenue / agg.total_spend : 0,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  res.json(result);
};
