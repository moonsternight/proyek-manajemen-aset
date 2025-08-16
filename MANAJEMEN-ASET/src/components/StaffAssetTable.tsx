import React, { useState } from "react";
import { Table } from "lucide-react";
import { Asset } from "../types";
import StaffEditAssetModal from "./StaffEditAssetModal";

interface StaffAssetTableProps {
  assets: Asset[];
  onView: (id: number) => void;
  refreshAssets: () => Promise<void>;
  onUpdateStatus: (id: number, newStatus: "Stok" | "Terpasang") => void;
}

const StaffAssetTable: React.FC<StaffAssetTableProps> = ({
  assets,
  onView,
  refreshAssets,
  onUpdateStatus,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const totalPages = Math.ceil(assets.length / itemsPerPage);

  const paginatedAssets = assets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const translateStatus = (status: string) => {
    if (status === "Stok") return "Keluar";
    if (status === "Terpasang") return "Masuk";
    return status;
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowEditModal(true);
  };

  const handleModalClose = async () => {
    setShowEditModal(false);
    setSelectedAsset(null);
    await refreshAssets();
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Table size={20} color="#1D4ED8" />
          <h3 style={titleStyle}>Manajemen Aset</h3>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#F1F5F9", textAlign: "left" }}>
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
              <td colSpan={7} style={emptyStyle}>
                Data aset tidak tersedia.
              </td>
            </tr>
          ) : (
            paginatedAssets.map((asset, index) => (
              <tr
                key={asset.id}
                style={{
                  backgroundColor: index % 2 === 1 ? "#F1F5F9" : "white",
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
                        translateStatus(asset.status) === "Masuk"
                          ? "#22C55E"
                          : "#EF4444",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      borderRadius: "999px",
                      padding: "0.25rem 0.75rem",
                    }}
                  >
                    {translateStatus(asset.status)}
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
                      onClick={() => handleEditClick(asset)}
                    >
                      <i className="fas fa-exchange-alt"></i> Pemindahan
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showEditModal && selectedAsset && (
        <StaffEditAssetModal
          asset={selectedAsset}
          onClose={handleModalClose}
          refreshAssets={refreshAssets}
          onUpdateStatus={onUpdateStatus}
          isOpen={showEditModal}
        />
      )}

      <div style={paginationContainer}>
        <label style={paginationLabel}>
          Tampilkan
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            style={paginationSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </label>

        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={navBtnStyle(currentPage === 1)}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={totalPages <= 1 || currentPage === totalPages}
          style={navBtnStyle(totalPages <= 1 || currentPage === totalPages)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  backgroundColor: "#F8FAFC",
  borderRadius: "16px",
  padding: "1.5rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  marginBottom: "2rem",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
};

const titleStyle = {
  fontSize: "1rem",
  fontWeight: "bold",
  color: "#1D4ED8",
  margin: 0,
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

const emptyStyle = {
  textAlign: "center" as const,
  padding: "1.5rem",
  color: "#94A3B8",
  fontStyle: "italic",
};

const btnBase = {
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

const viewBtn = {
  ...btnBase,
  backgroundColor: "#3B82F6",
};

const editBtn = {
  ...btnBase,
  backgroundColor: "#F59E0B",
};

const paginationContainer: React.CSSProperties = {
  marginTop: "1rem",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "0.75rem",
  paddingTop: "0.5rem",
  borderTop: "1px solid #E2E8F0",
};

const paginationLabel: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#475569",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const paginationSelect: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #cbd5e1",
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
};

const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: "0.5rem 0.75rem",
  borderRadius: "6px",
  border: "1px solid #CBD5E1",
  backgroundColor: disabled ? "#E5E7EB" : "white",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "0.8rem",
});

export default StaffAssetTable;
