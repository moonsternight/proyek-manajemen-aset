import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AssetInput, Asset } from "../types";
import { createAsset } from "../utils/api";
import { addActivityLog } from "../utils/logs";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (newAsset: Asset) => void;
}

const normalizeDateInput = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
};

const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  onAddAsset,
}) => {
  const [form, setForm] = useState<AssetInput>({
    jenis: "",
    merk: "",
    model: "",
    serialNumber: "",
    kodeLokal: "",
    satuan: "Unit",
    lokasi: "",
    tanggalInput: "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        jenis: "",
        merk: "",
        model: "",
        serialNumber: "",
        kodeLokal: "",
        satuan: "Unit",
        lokasi: "",
        tanggalInput: "",
      });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.jenis ||
      !form.merk ||
      !form.model ||
      !form.serialNumber ||
      !form.kodeLokal ||
      !form.satuan ||
      !form.lokasi ||
      !form.tanggalInput
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const role = localStorage.getItem("userRole") || "Unknown";
      const payload = {
        ...form,
        tanggalInput: normalizeDateInput(form.tanggalInput),
        role,
      };

      const newAsset = await createAsset(payload);
      onAddAsset(newAsset);

      if (role === "admin") {
        await addActivityLog("TAMBAH");
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      alert(
        `Gagal menambahkan aset: ${
          err?.response?.data?.message || "Terjadi kesalahan server"
        }`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>
          <X size={18} color="#0F172A" />
        </button>

        <h3 style={titleStyle}>
          <i className="fas fa-plus-circle" style={{ marginRight: "0.5rem" }} />
          Tambah Aset
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <Field
              label="Jenis"
              name="jenis"
              value={form.jenis}
              onChange={handleChange}
            />
            <Field
              label="Merk"
              name="merk"
              value={form.merk}
              onChange={handleChange}
            />
            <Field
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
            />
            <Field
              label="Serial Number"
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
            />
            <div>
              <label style={labelStyle}>Satuan</label>
              <select
                name="satuan"
                value={form.satuan}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="Unit">Unit</option>
                <option value="Pcs">Pcs</option>
                <option value="Meter">Meter</option>
                <option value="Batang">Batang</option>
              </select>
            </div>
            <Field
              label="Kode Lokal"
              name="kodeLokal"
              value={form.kodeLokal}
              onChange={handleChange}
            />
            <Field
              label="Lokasi"
              name="lokasi"
              value={form.lokasi}
              onChange={handleChange}
            />
            <Field
              label="Tanggal Input"
              name="tanggalInput"
              value={form.tanggalInput}
              onChange={handleChange}
              type="date"
            />
          </div>

          <div style={actionStyle}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>
              Batal
            </button>
            <button type="submit" style={submitBtnStyle}>
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      style={inputStyle}
      required
    />
  </div>
);

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
  maxWidth: "520px",
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
const titleStyle = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: "#1f2937",
  marginBottom: "1.25rem",
};
const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
  marginBottom: "1rem",
};
const labelStyle = {
  display: "block",
  marginBottom: "0.3rem",
  fontWeight: 600,
  color: "#334155",
  fontSize: "0.9rem",
};
const inputStyle = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: "1px solid #cbd5e1",
  borderRadius: "0.5rem",
  fontSize: "0.9rem",
  outlineColor: "#0284c7",
};
const actionStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  marginTop: "1rem",
};
const cancelBtnStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#e5e7eb",
  color: "#1f2937",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: 500,
};
const submitBtnStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#0284c7",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  fontWeight: 600,
  cursor: "pointer",
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
  backgroundColor: "#fff",
};

export default AddAssetModal;
