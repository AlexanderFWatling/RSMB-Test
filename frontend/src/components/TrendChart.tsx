import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchTrends, FilterParams } from "../api/client";

export const TrendChart: React.FC<{ filters: FilterParams }> = ({
  filters,
}) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchTrends(filters)
      .then((rawData) => {
        const monthlyData = rawData.reduce(
          (acc, row) => {
            const date = new Date(row.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            const display = date.toLocaleDateString("en-US", {
              month: "short",
              year: "2-digit",
            });

            if (!acc[monthKey]) {
              acc[monthKey] = {
                sortKey: monthKey,
                displayDate: display,
                spend: 0,
                revenue: 0,
              };
            }
            acc[monthKey].spend += row.spend;
            acc[monthKey].revenue += row.revenue;
            return acc;
          },
          {} as Record<string, any>,
        );

        const sorted = Object.values(monthlyData).sort((a, b) =>
          a.sortKey.localeCompare(b.sortKey),
        );
        setData(sorted);
      })
      .catch(console.error);
  }, [filters]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Spend vs Revenue (Monthly Trend)</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="displayDate"
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
              labelStyle={{ color: "#0f172a" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="spend"
              name="Spend"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
