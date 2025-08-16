import axios from "axios";
import { Asset, AssetInput, AssetHistory } from "../types";

const stripTime = (dateStr: string) => {
  if (!dateStr) return dateStr;
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
};

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createAsset = async (data: AssetInput & { role: string }) => {
  const cleanData = {
    ...data,
    tanggalInput: stripTime(data.tanggalInput),
  };
  const response = await API.post("/assets", cleanData);
  return response.data;
};

export const getAssets = async (): Promise<Asset[]> => {
  const response = await API.get("/assets");
  return response.data;
};

export const updateAsset = async (id: number, data: Partial<Asset>) => {
  const response = await API.put(`/assets/${id}`, {
    ...data,
    tanggalInput: stripTime(data.tanggalInput || ""),
  });
  return response.data;
};

export const updateAssetStatus = async (
  id: number,
  status: "Stok" | "Terpasang"
) => {
  const response = await API.put(`/assets/${id}/status`, { status });
  return response.data;
};

export const addAssetHistory = async (
  assetId: number,
  data: { role: string; location: string; date: string }
) => {
  const response = await API.post(`/assets/${assetId}/history`, {
    ...data,
    date: stripTime(data.date),
  });
  return response.data;
};

export const getAssetHistory = async (
  assetId: number
): Promise<AssetHistory[]> => {
  const response = await API.get(`/assets/${assetId}/history`);
  return response.data;
};

export default API;
