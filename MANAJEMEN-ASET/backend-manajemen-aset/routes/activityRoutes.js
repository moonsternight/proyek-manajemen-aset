const express = require("express");
const router = express.Router();
const {
  getActivityLogsHandler,
  logActivityHandler,
} = require("../controllers/activityController");

router.get("/", getActivityLogsHandler);
router.post("/", logActivityHandler);

module.exports = router;
