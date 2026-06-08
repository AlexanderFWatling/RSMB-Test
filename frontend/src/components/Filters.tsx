import React from "react";
import { FilterParams } from "../api/client";

interface FiltersProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="filters-container">
      <select
        name="platform"
        value={filters.platform || ""}
        onChange={handleChange}
        className="filter-select"
      >
        <option value="">All Platforms</option>
        <option value="Google Ads">Google Ads</option>
        <option value="Meta Ads">Meta Ads</option>
        <option value="TikTok Ads">TikTok Ads</option>
      </select>

      <select
        name="country"
        value={filters.country || ""}
        onChange={handleChange}
        className="filter-select"
      >
        <option value="">All Countries</option>
        <option value="UK">UK</option>
        <option value="USA">USA</option>
        <option value="UAE">UAE</option>
        <option value="Germany">Germany</option>
        <option value="Canada">Canada</option>
        <option value="India">India</option>
        <option value="Australia">Australia</option>
      </select>

      <select
        name="industry"
        value={filters.industry || ""}
        onChange={handleChange}
        className="filter-select"
      >
        <option value="">All Industries</option>
        <option value="Fintech">Fintech</option>
        <option value="EdTech">EdTech</option>
        <option value="Healthcare">Healthcare</option>
        <option value="SaaS">SaaS</option>
        <option value="E-commerce">E-commerce</option>
      </select>
    </div>
  );
};
