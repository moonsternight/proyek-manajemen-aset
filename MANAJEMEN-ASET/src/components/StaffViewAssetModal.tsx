import React, { useEffect, useState } from "react";
import { Asset, AssetHistory } from "../types";
import { X } from "lucide-react";
import { formatDate } from "../utils/helpers";
import { getAssetHistory } from "../utils/api";

interface StaffViewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
}

const StaffViewAssetModal: React.FC<StaffViewAssetModalProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
  const [activeTab, setActiveTab] = useState("detail");
  const [history, setHistory] = useState<AssetHistory[]>([]);

  const displayStatus = asset.status === "Terpasang" ? "Masuk" : "Keluar";
  const badgeColor = asset.status === "Terpasang" ? "#22C55E" : "#EF4444";

  useEffect(() => {
    if (isOpen) setActiveTab("detail");
  }, [isOpen, asset]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen && activeTab === "history") {
        try {
          const data = await getAssetHistory(asset.id);
          setHistory(data);
        } catch (err) {
          console.error("Gagal ambil riwayat aset:", err);
        }
      }
    };
    fetchHistory();
  }, [isOpen, activeTab, asset.id]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Tombol Close */}
        <button onClick={onClose} style={closeBtnStyle}>
          <X size={18} color="#0F172A" />
        </button>

        {/* Judul */}
        <h2 style={titleStyle}>
          <i className="fas fa-info-circle"></i>
          Informasi Aset
        </h2>

        {/* Tab */}
        <div style={tabContainerStyle}>
          <button
            onClick={() => setActiveTab("detail")}
            style={{
              ...tabButtonStyle,
              backgroundColor: activeTab === "detail" ? "#E2E8F0" : "#F8FAFC",
              border: activeTab === "detail" ? "1px solid #CBD5E1" : "none",
            }}
          >
            Detail Aset
          </button>
          <button
            onClick={() => setActiveTab("history")}
            style={{
              ...tabButtonStyle,
              backgroundColor: activeTab === "history" ? "#E2E8F0" : "#F8FAFC",
              border: activeTab === "history" ? "1px solid #CBD5E1" : "none",
            }}
          >
            Riwayat Aset
          </button>
        </div>

        {/* Detail Aset */}
        {activeTab === "detail" && (
          <div style={detailGridStyle}>
            {[
              ["Jenis", asset.jenis],
              ["Merk", asset.merk],
              ["Model", asset.model],
              ["Serial Number", asset.serialNumber],
              ["Satuan", asset.satuan],
              ["Kode Lokal", asset.kodeLokal],
              [
                "Status",
                <span
                  style={{
                    backgroundColor: badgeColor,
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.75rem",
                    borderRadius: "999px",
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  {displayStatus}
                </span>,
              ],
              ["Lokasi", asset.lokasi],
              ["Tanggal Input", formatDate(asset.tanggalInput)],
            ].map(([label, value]) => (
              <div key={label as string} style={cardStyle}>
                <div style={cardLabelStyle}>{label}</div>
                <div style={cardValueStyle}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Riwayat Aset */}
        {activeTab === "history" && (
          <div
            className="scroll-hidden"
            style={{
              marginTop: "1rem",
              maxHeight: history.length > 5 ? "300px" : "auto",
              overflowY: history.length > 5 ? "auto" : "visible",
            }}
          >
            {history.length === 0 ? (
              <p style={{ color: "#64748B", fontStyle: "italic" }}>
                Tidak ada riwayat aset.
              </p>
            ) : (
              <table style={tableStyle}>
                <thead style={theadStyle}>
                  <tr>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Lokasi</th>
                    <th style={thStyle}>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr
                      key={h.id}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                      }}
                    >
                      <td style={tdStyle}>
                        {h.role.charAt(0).toUpperCase() + h.role.slice(1)}
                      </td>
                      <td style={tdStyle}>{h.location}</td>
                      <td style={tdStyle}>{formatDate(h.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "720px",
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "1.5rem",
  right: "1.5rem",
  width: "32px",
  height: "32px",
  backgroundColor: "#E2E8F0",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: "#1f2937",
  marginBottom: "1.25rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const tabContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
};

const tabButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  fontWeight: 600,
  color: "#1f2937",
  cursor: "pointer",
};

const detailGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "0.75rem",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#F8FAFC",
  padding: "1rem",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
};

const cardLabelStyle: React.CSSProperties = {
  fontWeight: 500,
  color: "#64748B",
  fontSize: "0.8rem",
};

const cardValueStyle: React.CSSProperties = {
  fontWeight: 500,
  color: "#0F172A",
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const theadStyle: React.CSSProperties = {
  backgroundColor: "#F1F5F9",
};

const thStyle: React.CSSProperties = {
  padding: "0.75rem",
  fontSize: "0.85rem",
  color: "#334155",
  fontWeight: 700,
  borderBottom: "1px solid #E2E8F0",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem",
  fontSize: "0.85rem",
  color: "#0F172A",
  borderBottom: "1px solid #E2E8F0",
  verticalAlign: "middle",
};

export default StaffViewAssetModal;
