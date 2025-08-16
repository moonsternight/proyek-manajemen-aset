export interface AssetHistory {
  id: number;
  asset_id: number;
  role: string;
  location: string;
  date: string;
}

export interface Asset {
  id: number;
  jenis: string;
  merk: string;
  model: string;
  serialNumber: string;
  kodeLokal: string;
  satuan: "Unit" | "Buah" | "Meter" | "Set";
  status: "Stok" | "Terpasang";
  lokasi: string;
  tanggalInput: string;
  history?: AssetHistory[];
}

export interface AssetInput {
  jenis: string;
  merk: string;
  model: string;
  serialNumber: string;
  kodeLokal: string;
  satuan: "Unit" | "Buah" | "Meter" | "Set";
  lokasi: string;
  tanggalInput: string;
  role?: string;
}

export interface AdminLog {
  type: string;
  description: string;
  timestamp: string;
}
