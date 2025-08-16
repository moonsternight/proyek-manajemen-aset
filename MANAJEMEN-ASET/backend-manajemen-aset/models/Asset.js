// models/Asset.js
const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  jenis: { type: String, required: true },
  merk: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true },
  satuan: { type: String, required: true },
  kodeLokasi: { type: String, required: true },
  lokasi: { type: String, required: true },
  tanggalInput: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Stok", "Terpasang"],
    default: "Stok",
    required: true,
  },
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
