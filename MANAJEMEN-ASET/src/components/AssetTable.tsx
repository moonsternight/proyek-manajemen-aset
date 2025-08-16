import React, { useState } from "react";
import { Asset } from "../types";
import { Table } from "lucide-react";

interface AssetTableProps {
  assets: Asset[];
  onView: (id: number) => void;
  onEdit: (asset: Asset & { latestHistoryDate?: string }) => void;
  onAddAsset: () => void;
}

const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  onView,
  onEdit,
  onAddAsset,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(assets.length / itemsPerPage);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const paginatedAssets = assets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Table size={20} color="#1D4ED8" />
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#1D4ED8",
              margin: 0,
            }}
          >
            Manajemen Aset
          </h3>
        </div>
        <button
          onClick={onAddAsset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#22C55E",
            border: "none",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.755rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tambah
        </button>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#F1F5F9" }}>
            <th style={thStyle}>Jenis</th>
            <th style={thStyle}>Merk</th>
            <th style={thStyle}>Model</th>
            <th style={thStyle}>Satuan</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Lokasi</th>
            <th style={thStyle}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAssets.length === 0 ? (
            <tr>
              <td colSpan={7} style={emptyRowStyle}>
                Data aset tidak tersedia.
              </td>
            </tr>
          ) : (
            paginatedAssets.map((asset, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;

              const latestHistoryDate = asset.history
                ?.slice()
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )[asset.history.length - 1]?.date;

              return (
                <tr
                  key={asset.id}
                  style={{
                    backgroundColor:
                      globalIndex % 2 === 1 ? "#F1F5F9" : "white",
                  }}
                >
                  <td style={tdStyle}>{asset.jenis}</td>
                  <td style={tdStyle}>{asset.merk}</td>
                  <td style={tdStyle}>{asset.model}</td>
                  <td style={tdStyle}>{asset.satuan}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        backgroundColor:
                          asset.status === "Stok" ? "#22C55E" : "#F97316",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        borderRadius: "999px",
                        padding: "0.25rem 0.75rem",
                      }}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{asset.lokasi}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button style={viewBtn} onClick={() => onView(asset.id)}>
                        <i className="fas fa-eye"></i> Lihat
                      </button>
                      <button
                        style={editBtn}
                        onClick={() => {
                          onEdit({ ...asset, latestHistoryDate });
                        }}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "0.75rem",
          paddingTop: "0.5rem",
          borderTop: "1px solid #E2E8F0",
        }}
      >
        <label
          style={{
            fontSize: "0.85rem",
            color: "#475569",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Tampilkan
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid #CBD5E1",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              outlineColor: "#0284c7",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1rem 1rem",
              paddingRight: "2.2rem",
              backgroundColor: "#fff",
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </label>

        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={navBtn(currentPage === 1)}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={assets.length <= itemsPerPage || currentPage === totalPages}
          style={navBtn(
            assets.length <= itemsPerPage || currentPage === totalPages
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.85rem",
  color: "#475569",
  fontWeight: 800,
  borderBottom: "1px solid #E2E8F0",
  textAlign: "left",
  verticalAlign: "middle",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  color: "#0F172A",
  textAlign: "left",
  verticalAlign: "middle",
};

const emptyRowStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "1.5rem",
  color: "#94A3B8",
  fontStyle: "italic",
};

const btnBase: React.CSSProperties = {
  border: "none",
  padding: "0.4rem 0.75rem",
  borderRadius: "8px",
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  cursor: "pointer",
};

const viewBtn: React.CSSProperties = {
  ...btnBase,
  backgroundColor: "#3B82F6",
};

const editBtn: React.CSSProperties = {
  ...btnBase,
  backgroundColor: "#F59E0B",
};

const navBtn = (disabled: boolean): React.CSSProperties => ({
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  border: "1px solid #CBD5E1",
  backgroundColor: disabled ? "#E5E7EB" : "white",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "0.8rem",
});

export default AssetTable;
