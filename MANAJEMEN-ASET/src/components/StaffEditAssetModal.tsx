import React, { useState, useEffect } from "react";
import { Asset } from "../types";
import { FaExchangeAlt } from "react-icons/fa";

interface StaffEditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  onUpdateStatus: (id: number, newStatus: "Stok" | "Terpasang") => void;
  refreshAssets: () => Promise<void>;
}

const StaffEditAssetModal: React.FC<StaffEditAssetModalProps> = ({
  isOpen,
  onClose,
  asset,
  onUpdateStatus,
  refreshAssets,
}) => {
  const [lokasiBaru, setLokasiBaru] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLokasiBaru("");
      setTanggal("");
    }
  }, [isOpen]);

  const handleUbahStatus = async () => {
    if (!lokasiBaru || !tanggal) {
      alert("Lokasi dan Tanggal harus diisi.");
      return;
    }

    setLoading(true);
    try {
      const lokasiRes = await fetch(
        `http://localhost:5000/api/assets/${asset.id}/location`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lokasi: lokasiBaru }),
        }
      );
      if (!lokasiRes.ok) throw new Error("Gagal update lokasi aset");

      const riwayatRes = await fetch(
        `http://localhost:5000/api/assets/${asset.id}/history`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "Staff",
            location: lokasiBaru,
            date: tanggal,
          }),
        }
      );
      if (!riwayatRes.ok) throw new Error("Gagal menyimpan riwayat pemindahan");

      const newStatus = asset.status === "Stok" ? "Terpasang" : "Stok";
      const statusRes = await fetch(
        `http://localhost:5000/api/assets/${asset.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!statusRes.ok) throw new Error("Gagal mengubah status aset");

      onUpdateStatus(asset.id, newStatus);
      await refreshAssets();
      onClose();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan perubahan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <FaExchangeAlt size={20} color="#0F172A" />
          <h3
            style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A" }}
          >
            Pemindahan Aset
          </h3>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label style={labelStyle}>Lokasi</label>
            <input
              type="text"
              value={lokasiBaru}
              onChange={(e) => setLokasiBaru(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={footerStyle}>
          <button onClick={onClose} style={cancelBtn}>
            Batal
          </button>
          <button
            onClick={handleUbahStatus}
            style={submitBtn}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Ubah Status"}
          </button>
        </div>
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
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "550px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: 600,
  color: "#1E293B",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  backgroundColor: "#F8FAFC",
  fontSize: "0.925rem",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "1rem",
  marginTop: "2rem",
};

const cancelBtn: React.CSSProperties = {
  backgroundColor: "#E2E8F0",
  color: "#0F172A",
  padding: "0.5rem 0.9rem",
  borderRadius: "8px",
  border: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  cursor: "pointer",
};

const submitBtn: React.CSSProperties = {
  backgroundColor: "#0284c7",
  color: "white",
  padding: "0.5rem 0.9rem",
  borderRadius: "8px",
  border: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  cursor: "pointer",
};

export default StaffEditAssetModal;
