import { aggregateMetrics, calculateDerived } from "./metrics";
import { ProcessedAdData } from "../types";

describe("Metrics Business Logic", () => {
  const mockData = [
    {
      platform: "Google",
      ad_spend: 100,
      revenue: 300,
      conversions: 10,
      impressions: 1000,
      clicks: 50,
      date: "2023-01-01",
      campaign_type: "Search",
      country: "UK",
      industry: "Tech",
    },
    {
      platform: "Meta",
      ad_spend: 50,
      revenue: 0,
      conversions: 0,
      impressions: 500,
      clicks: 10,
      date: "2023-01-01",
      campaign_type: "Social",
      country: "UK",
      industry: "Tech",
    },
  ] as ProcessedAdData[];

  it("correctly aggregates base metrics", () => {
    const result = aggregateMetrics(mockData);
    expect(result.total_spend).toBe(150);
    expect(result.total_revenue).toBe(300);
    expect(result.total_impressions).toBe(1500);
  });

  it("safely calculates derived metrics (ROAS, CTR, CPC, CPA)", () => {
    const agg = aggregateMetrics(mockData);
    const derived = calculateDerived(agg);

    expect(derived.average_roas).toBe(2); // 300 / 150
    expect(derived.average_cpc).toBe(2.5); // 150 / 60
    expect(derived.average_ctr).toBe(0.04); // 60 / 1500
  });

  it("handles division by zero safely when arrays are empty", () => {
    const emptyAgg = aggregateMetrics([]);
    const derived = calculateDerived(emptyAgg);

    expect(derived.average_roas).toBe(0);
    expect(derived.average_ctr).toBe(0);
    expect(derived.average_cpc).toBe(0);
    expect(derived.average_cpa).toBe(0);
  });
});
