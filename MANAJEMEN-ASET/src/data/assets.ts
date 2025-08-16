import API from "../utils/api";

export const getAssets = async () => {
  const response = await API.get("/assets");
  return response.data;
};

export const createAsset = async (data: { name: string; status: string }) => {
  const response = await API.post("/assets", data);
  return response.data;
};
