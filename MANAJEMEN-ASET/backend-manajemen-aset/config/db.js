const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abcde12345",
  database: "manajemen_aset",
});

connection.connect((err) => {
  if (err) {
    console.error("Gagal konek ke MySQL:", err);
    return;
  }
});

module.exports = connection;
