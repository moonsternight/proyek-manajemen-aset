import React, { useState, useEffect } from "react";
import { Asset } from "../types";
import { X } from "lucide-react";
import { addActivityLog } from "../utils/logs";
import { updateAsset } from "../utils/api";

const toLocalDateInput = (value: string): string => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
};

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  onEditAsset: (updatedAsset: Asset) => void;
  latestHistoryDate?: string;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({
  isOpen,
  onClose,
  asset,
  onEditAsset,
  latestHistoryDate,
}) => {
  const [editedAsset, setEditedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (isOpen && asset) {
      const storageKey = `lastEditDate-${asset.id}`;
      const storedDate = localStorage.getItem(storageKey);
      const fallback = latestHistoryDate || asset.tanggalInput || "";
      const finalDate = storedDate || fallback;

      const cleanDate = toLocalDateInput(finalDate);
      localStorage.setItem(storageKey, cleanDate);

      setEditedAsset({
        ...asset,
        tanggalInput: cleanDate,
      });
    }
  }, [isOpen, asset, latestHistoryDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const key =
      id.replace("edit", "").charAt(0).toLowerCase() +
      id.replace("edit", "").slice(1);
    setEditedAsset((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const formatToDateOnly = (value: string) => {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedAsset) return;

    const {
      jenis,
      merk,
      model,
      serialNumber,
      satuan,
      lokasi,
      tanggalInput,
      kodeLokal,
    } = editedAsset;

    if (
      !jenis ||
      !merk ||
      !model ||
      !serialNumber ||
      !satuan ||
      !lokasi ||
      !tanggalInput
    ) {
      alert("Mohon lengkapi semua data wajib.");
      return;
    }

    try {
      const newTanggal = formatToDateOnly(tanggalInput);

      const updated = await updateAsset(asset.id, {
        jenis,
        merk,
        model,
        serialNumber,
        satuan,
        lokasi,
        tanggalInput: newTanggal,
        kodeLokal,
      });

      const storageKey = `lastEditDate-${asset.id}`;
      localStorage.setItem(storageKey, newTanggal);
      onEditAsset(updated);

      await addActivityLog("EDIT");

      onClose();
    } catch (err: any) {
      console.error("❌ Gagal update aset:", err);
      alert(
        `Gagal mengupdate aset: ${
          err?.response?.data?.message || "Terjadi kesalahan server"
        }`
      );
    }
  };

  if (!isOpen || !editedAsset) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>
          <X size={18} color="#0F172A" />
        </button>

        <h3 style={titleStyle}>
          <i className="fas fa-edit" style={{ marginRight: "0.5rem" }}></i>
          Edit Aset
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            {[
              ["Jenis", "editJenis", editedAsset.jenis],
              ["Merk", "editMerk", editedAsset.merk],
              ["Model", "editModel", editedAsset.model],
              ["Serial Number", "editSerialNumber", editedAsset.serialNumber],
              ["Satuan", "editSatuan", editedAsset.satuan],
              ["Kode Lokal", "editKodeLokal", editedAsset.kodeLokal],
              ["Lokasi", "editLokasi", editedAsset.lokasi],
              ["Tanggal Input", "editTanggalInput", editedAsset.tanggalInput],
            ].map(([label, id, value]) => (
              <div key={id}>
                <label htmlFor={id} style={labelStyle}>
                  {label}
                </label>
                {id === "editSatuan" ? (
                  <select
                    id={id}
                    value={value}
                    onChange={handleChange}
                    style={selectStyle}
                    required
                  >
                    <option value="Unit">Unit</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Meter">Meter</option>
                    <option value="Batang">Batang</option>
                  </select>
                ) : (
                  <input
                    id={id}
                    type={id === "editTanggalInput" ? "date" : "text"}
                    value={
                      id === "editTanggalInput"
                        ? toLocalDateInput(value)
                        : value
                    }
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div style={actionStyle}>
            <button type="button" onClick={onClose} style={buttonSecondary}>
              Batal
            </button>
            <button type="submit" style={buttonPrimary}>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "1rem",
  width: "90%",
  maxWidth: "640px",
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
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
  marginBottom: "1rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.3rem",
  fontWeight: 600,
  color: "#334155",
  fontSize: "0.9rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #cbd5e1",
  borderRadius: "0.5rem",
  fontSize: "0.9rem",
  outlineColor: "#0284c7",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #cbd5e1",
  borderRadius: "0.5rem",
  fontSize: "0.9rem",
  outlineColor: "#0284c7",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "1rem 1rem",
  paddingRight: "2.2rem",
};

const actionStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  marginTop: "1.25rem",
};

const buttonSecondary: React.CSSProperties = {
  padding: "0.5rem 1rem",
  backgroundColor: "#e5e7eb",
  color: "#1f2937",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: 500,
};

const buttonPrimary: React.CSSProperties = {
  padding: "0.5rem 1rem",
  backgroundColor: "#0284c7",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  fontWeight: 600,
  cursor: "pointer",
};

export default EditAssetModal;
