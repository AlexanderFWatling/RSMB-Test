import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchPlatforms, FilterParams, PlatformData } from "../api/client";

export const PerformanceChart: React.FC<{ filters: FilterParams }> = ({
  filters,
}) => {
  const [data, setData] = useState<PlatformData[]>([]);

  useEffect(() => {
    fetchPlatforms(filters).then(setData).catch(console.error);
  }, [filters]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Spend vs Revenue by Platform</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="platform"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#6366f1"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#10b981"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              formatter={(value: any) => `$${Number(value).toFixed(2)}`}
              cursor={{ fill: "#f8fafc" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              yAxisId="left"
              dataKey="total_spend"
              name="Spend"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="total_revenue"
              name="Revenue"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
