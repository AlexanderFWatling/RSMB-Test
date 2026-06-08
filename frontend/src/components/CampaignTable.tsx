import React, { useState, useEffect } from "react";
import { CampaignData } from "../api/client";

export const CampaignTable: React.FC<{ campaigns: CampaignData[] }> = ({
  campaigns,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [campaigns]);

  const totalPages = Math.ceil(campaigns.length / rowsPerPage);
  const displayData = campaigns.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <div className="table-container">
      <h3 className="table-header">Campaign Performance</h3>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Platform</th>
              <th>Campaign Type</th>
              <th>Spend</th>
              <th>Revenue</th>
              <th>ROAS</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.platform}</td>
                <td>{row.campaign_type}</td>
                <td>{formatCurrency(row.ad_spend)}</td>
                <td>{formatCurrency(row.revenue)}</td>
                <td style={{ color: "#10b981", fontWeight: 600 }}>
                  {row.roas.toFixed(2)}
                </td>
              </tr>
            ))}
            {displayData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: "#64748b",
                  }}
                >
                  No campaigns match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            Showing page {currentPage} of {totalPages}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: currentPage === 1 ? "#f1f5f9" : "white",
                color: currentPage === 1 ? "#94a3b8" : "#334155",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor:
                  currentPage === totalPages ? "#f1f5f9" : "white",
                color: currentPage === totalPages ? "#94a3b8" : "#334155",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
