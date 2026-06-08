import React, { useState, useEffect } from "react";
import "./App.css";

import { Filters } from "./components/Filters";
import { KPIGrid } from "./components/KPIGrid";
import { PerformanceChart } from "./components/PerformanceChart";
import { TrendChart } from "./components/TrendChart";
import { CampaignTable } from "./components/CampaignTable";

import {
  FilterParams,
  fetchSummary,
  fetchCampaigns,
  SummaryMetrics,
  CampaignData,
} from "./api/client";

function App() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [summaryData, campaignData] = await Promise.all([
          fetchSummary(filters),
          fetchCampaigns(filters),
        ]);
        setSummary(summaryData);
        setCampaigns(campaignData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>RSMB Analytics</h1>
        <p>Global Ad Performance Dashboard</p>
      </header>

      <Filters
        filters={filters}
        onFilterChange={setFilters}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px", color: "#64748b" }}>
          Aggregating data...
        </div>
      ) : (
        <div>
          <KPIGrid summary={summary} />

          <div className="charts-grid">
            <PerformanceChart filters={filters} />
            <TrendChart filters={filters} />
          </div>

          <CampaignTable campaigns={campaigns} />
        </div>
      )}
    </div>
  );
}

export default App;
