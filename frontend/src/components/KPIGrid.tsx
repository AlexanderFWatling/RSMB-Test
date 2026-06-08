import React from "react";
import { SummaryMetrics } from "../api/client";
import {
  DollarSign,
  MousePointerClick,
  TrendingUp,
  Activity,
} from "lucide-react";

export const KPIGrid: React.FC<{ summary: SummaryMetrics | null }> = ({
  summary,
}) => {
  if (!summary) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  const formatPercent = (val: number) => (val * 100).toFixed(2) + "%";

  const kpis = [
    {
      label: "Total Spend",
      value: formatCurrency(summary.total_spend),
      icon: DollarSign,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(summary.total_revenue),
      icon: TrendingUp,
    },
    {
      label: "Avg ROAS",
      value: summary.average_roas.toFixed(2),
      icon: Activity,
    },
    {
      label: "Avg CTR",
      value: formatPercent(summary.average_ctr),
      icon: MousePointerClick,
    },
  ];

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <div
            key={i}
            className="kpi-card"
          >
            <div className="kpi-icon-wrapper">
              <Icon size={24} />
            </div>
            <div>
              <p className="kpi-label">{kpi.label}</p>
              <p className="kpi-value">{kpi.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
