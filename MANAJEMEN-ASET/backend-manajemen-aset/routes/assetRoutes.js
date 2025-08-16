const express = require("express");
const router = express.Router();

const {
  getAssets,
  createAsset,
  updateAsset,
  updateAssetStatus,
  updateAssetLocation,
  addAssetHistory,
  getAssetHistoryByAssetId,
} = require("../controllers/assetController");

router.get("/", getAssets);

router.post("/", createAsset);

router.put("/:id/status", updateAssetStatus);

router.put("/:id", updateAsset);

router.patch("/:id/location", updateAssetLocation);

router.post("/:id/history", addAssetHistory);

router.get("/:id/history", getAssetHistoryByAssetId);

module.exports = router;
