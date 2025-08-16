const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const assetRoutes = require("./routes/assetRoutes");
const activityRoutes = require("./routes/activityRoutes");

app.use("/api/assets", assetRoutes);
app.use("/api/activity-logs", activityRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend Manajemen Aset Aktif & Berjalan");
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Terjadi error:", err.stack);
  res.status(500).json({ message: "Terjadi kesalahan server" });
});

app.listen(PORT);
