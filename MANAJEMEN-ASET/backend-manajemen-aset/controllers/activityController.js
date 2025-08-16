const ActivityLog = require("../models/ActivityLog");

const getActivityLogsHandler = (req, res) => {
  ActivityLog.getActivityLogs((err, logs) => {
    if (err)
      return res.status(500).json({ message: "Gagal ambil log aktivitas" });
    res.json(logs);
  });
};

const logActivityHandler = (req, res) => {
  const { activity } = req.body;
  if (!activity)
    return res.status(400).json({ message: "Activity harus diisi" });

  ActivityLog.logActivity(activity, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal simpan aktivitas" });
    res.status(201).json({ message: "Aktivitas dicatat" });
  });
};

module.exports = {
  getActivityLogsHandler,
  logActivityHandler,
};
