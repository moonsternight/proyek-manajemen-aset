import React from "react";
import { Filter } from "lucide-react";
import { Asset } from "../types";

interface StaffAssetFiltersProps {
  allAssets: Asset[];
  onFilterChange: (filters: {
    jenis: string;
    merk: string;
    model: string;
  }) => void;
  currentFilters: { jenis: string; merk: string; model: string };
}

const StaffAssetFilters: React.FC<StaffAssetFiltersProps> = ({
  allAssets,
  onFilterChange,
  currentFilters,
}) => {
  const jenisOptions = [...new Set(allAssets.map((a) => a.jenis))];

  const merkOptions = currentFilters.jenis
    ? [
        ...new Set(
          allAssets
            .filter((a) => a.jenis === currentFilters.jenis)
            .map((a) => a.merk)
        ),
      ]
    : [];

  const modelOptions =
    currentFilters.jenis && currentFilters.merk
      ? [
          ...new Set(
            allAssets
              .filter(
                (a) =>
                  a.jenis === currentFilters.jenis &&
                  a.merk === currentFilters.merk
              )
              .map((a) => a.model)
          ),
        ]
      : [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    const field = id.replace("staffFilter", "").toLowerCase();

    let updated = { ...currentFilters, [field]: value };

    if (field === "jenis") {
      updated = { ...updated, merk: "", model: "" };
    } else if (field === "merk") {
      updated = { ...updated, model: "" };
    }

    onFilterChange(updated);
  };

  return (
    <div
      style={{
        backgroundColor: "#F8FAFC",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <Filter size={20} color="#1D4ED8" />
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#1D4ED8",
          }}
        >
          Filter Aset
        </h3>
      </div>

      {/* Grid Filter */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {/* Jenis */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="staffFilterJenis" style={labelStyle}>
            Jenis
          </label>
          <select
            id="staffFilterJenis"
            value={currentFilters.jenis}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">Semua</option>
            {jenisOptions.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Merk */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="staffFilterMerk" style={labelStyle}>
            Merk
          </label>
          <select
            id="staffFilterMerk"
            value={currentFilters.merk}
            onChange={handleChange}
            style={selectStyle}
            disabled={!currentFilters.jenis}
          >
            <option value="">Semua</option>
            {merkOptions.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="staffFilterModel" style={labelStyle}>
            Model
          </label>
          <select
            id="staffFilterModel"
            value={currentFilters.model}
            onChange={handleChange}
            style={selectStyle}
            disabled={!currentFilters.jenis || !currentFilters.merk}
          >
            <option value="">Semua</option>
            {modelOptions.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#334155",
  marginBottom: "0.25rem",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  paddingRight: "2.2rem",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  backgroundColor: "#FFFFFF",
  fontSize: "0.875rem",
  color: "#0F172A",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "1rem 1rem",
};

export default StaffAssetFilters;
