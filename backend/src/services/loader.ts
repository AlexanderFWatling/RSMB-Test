import fs from "fs";
import csv from "csv-parser";
import type { ProcessedAdData } from "../types";

export const loadData = (filePath: string): Promise<ProcessedAdData[]> => {
  return new Promise((resolve, reject) => {
    const results: ProcessedAdData[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        const impressions = Number(data.impressions) || 0;
        const clicks = Number(data.clicks) || 0;
        const ad_spend = Number(data.ad_spend) || 0;
        const conversions = Number(data.conversions) || 0;
        const revenue = Number(data.revenue) || 0;

        results.push({
          date: data.date,
          platform: data.platform,
          campaign_type: data.campaign_type,
          industry: data.industry,
          country: data.country,
          impressions,
          clicks,
          ad_spend,
          conversions,
          revenue,
          ctr: impressions > 0 ? clicks / impressions : 0,
          cpc: clicks > 0 ? ad_spend / clicks : 0,
          cpa: conversions > 0 ? ad_spend / conversions : 0,
          roas: ad_spend > 0 ? revenue / ad_spend : 0,
        });
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};
