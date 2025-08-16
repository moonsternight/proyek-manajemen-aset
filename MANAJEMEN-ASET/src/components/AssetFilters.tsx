import React from "react";
import { Filter } from "lucide-react";
import { Asset } from "../types";

interface AssetFiltersProps {
  allAssets: Asset[];
  currentFilters: {
    jenis: string;
    merk: string;
    model: string;
  };
  onFilterChange: (filters: {
    jenis: string;
    merk: string;
    model: string;
  }) => void;
}

const AssetFilters: React.FC<AssetFiltersProps> = ({
  allAssets,
  currentFilters,
  onFilterChange,
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
    const field = id.replace("adminFilter", "").toLowerCase();

    let newFilters = { ...currentFilters, [field]: value };

    if (field === "jenis") {
      newFilters = { ...newFilters, merk: "", model: "" };
    } else if (field === "merk") {
      newFilters = { ...newFilters, model: "" };
    }

    onFilterChange(newFilters);
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
      {/* Judul */}
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

      {/* Grid */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {/* Jenis */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="adminFilterJenis" style={labelStyle}>
            Jenis
          </label>
          <select
            id="adminFilterJenis"
            value={currentFilters.jenis}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">Semua</option>
            {jenisOptions.map((jenis) => (
              <option key={jenis} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
        </div>

        {/* Merk */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="adminFilterMerk" style={labelStyle}>
            Merk
          </label>
          <select
            id="adminFilterMerk"
            value={currentFilters.merk}
            onChange={handleChange}
            style={selectStyle}
            disabled={!currentFilters.jenis}
          >
            <option value="">Semua</option>
            {merkOptions.map((merk) => (
              <option key={merk} value={merk}>
                {merk}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="adminFilterModel" style={labelStyle}>
            Model
          </label>
          <select
            id="adminFilterModel"
            value={currentFilters.model}
            onChange={handleChange}
            style={selectStyle}
            disabled={!currentFilters.jenis || !currentFilters.merk}
          >
            <option value="">Semua</option>
            {modelOptions.map((model) => (
              <option key={model} value={model}>
                {model}
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

export default AssetFilters;
