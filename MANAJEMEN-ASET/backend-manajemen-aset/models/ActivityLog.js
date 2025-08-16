const db = require("../config/db");

const logActivity = (activity, callback) => {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Date()
    .toLocaleDateString("en-GB", options)
    .replace(/ /g, " ");

  const sql = "INSERT INTO activity_logs (activity, date) VALUES (?, ?)";
  db.query(sql, [activity, formattedDate], (err, result) => {
    if (err) {
      console.error("Gagal menyimpan log aktivitas:", err);
      return callback(err);
    }
    callback(null, result);
  });
};

const getActivityLogs = (callback) => {
  const sql = "SELECT activity, date FROM activity_logs ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal mengambil log aktivitas:", err);
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = {
  logActivity,
  getActivityLogs,
};
