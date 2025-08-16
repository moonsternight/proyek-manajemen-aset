const db = require("../config/db");

const formatToDateOnly = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
};

const getAssets = (req, res) => {
  const sqlAssets = "SELECT * FROM assets";
  const sqlHistory = "SELECT asset_id, date FROM asset_history";

  db.query(sqlAssets, (err, assetResults) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal mengambil data aset", error: err });
    }

    db.query(sqlHistory, (err2, historyResults) => {
      if (err2) {
        return res
          .status(500)
          .json({ message: "Gagal mengambil riwayat aset", error: err2 });
      }

      const latestDates = {};
      historyResults.forEach((h) => {
        const current = latestDates[h.asset_id];
        if (!current || new Date(h.date) > new Date(current)) {
          latestDates[h.asset_id] = h.date;
        }
      });

      const formatted = assetResults.map((asset) => ({
        ...asset,
        latestHistoryDate: latestDates[asset.id] || asset.tanggalInput,
      }));

      res.status(200).json(formatted);
    });
  });
};

const createAsset = (req, res) => {
  const {
    jenis,
    merk,
    model,
    serialNumber,
    kodeLokal,
    satuan,
    lokasi,
    tanggalInput,
    role,
  } = req.body;

  if (
    !jenis ||
    !merk ||
    !model ||
    !serialNumber ||
    !satuan ||
    !lokasi ||
    !tanggalInput
  ) {
    return res.status(400).json({ message: "Field wajib tidak boleh kosong." });
  }

  const status = "Stok";
  const sql = `
    INSERT INTO assets 
    (jenis, merk, model, serialNumber, kodeLokal, satuan, lokasi, tanggalInput, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      jenis,
      merk,
      model,
      serialNumber,
      kodeLokal,
      satuan,
      lokasi,
      tanggalInput,
      status,
    ],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Gagal menambahkan aset", error: err });
      }

      const assetId = result.insertId;
      const safeRole = typeof role === "string" ? role : "Admin";

      const historySql = `
      INSERT INTO asset_history (asset_id, role, location, date)
      VALUES (?, ?, ?, ?)
    `;

      db.query(
        historySql,
        [assetId, safeRole, lokasi, tanggalInput],
        (historyErr) => {
          if (historyErr) {
          }

          res.status(201).json({
            id: assetId,
            jenis,
            merk,
            model,
            serialNumber,
            kodeLokal,
            satuan,
            lokasi,
            tanggalInput,
            status,
            history: [
              {
                id: null,
                role: safeRole,
                location: lokasi,
                date: tanggalInput,
              },
            ],
          });
        }
      );
    }
  );
};

const updateAsset = (req, res) => {
  const assetId = req.params.id;
  const {
    jenis,
    merk,
    model,
    serialNumber,
    kodeLokal,
    satuan,
    lokasi: lokasiBaru,
    tanggalInput: tanggalBaru,
  } = req.body;

  const getOldSql = "SELECT * FROM assets WHERE id = ?";

  db.query(getOldSql, [assetId], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ message: "Aset tidak ditemukan" });
    }

    const asetLama = rows[0];
    const lokasiLama = asetLama.lokasi;
    const tanggalLama = asetLama.tanggalInput;

    const updateSql = `
      UPDATE assets 
      SET jenis = ?, merk = ?, model = ?, serialNumber = ?, kodeLokal = ?, satuan = ?, lokasi = ?, tanggalInput = ?
      WHERE id = ?
    `;

    db.query(
      updateSql,
      [
        jenis,
        merk,
        model,
        serialNumber,
        kodeLokal,
        satuan,
        lokasiBaru,
        tanggalBaru,
        assetId,
      ],
      (updateErr) => {
        if (updateErr) {
          return res
            .status(500)
            .json({ message: "Gagal mengupdate aset", error: updateErr });
        }

        const lokasiBerubah = lokasiBaru.trim() !== lokasiLama.trim();
        const tanggalBerubah =
          formatToDateOnly(tanggalBaru) !== formatToDateOnly(tanggalLama);

        if (!lokasiBerubah && !tanggalBerubah) {
          return res.status(200).json({
            message: "Aset berhasil diupdate (tanpa riwayat)",
            id: Number(assetId),
            jenis,
            merk,
            model,
            serialNumber,
            kodeLokal,
            satuan,
            lokasi: lokasiBaru,
            tanggalInput: tanggalBaru,
          });
        }

        const historySql = `
        INSERT INTO asset_history (asset_id, role, location, date)
        VALUES (?, ?, ?, ?)
      `;

        db.query(
          historySql,
          [
            assetId,
            "Admin",
            lokasiBerubah ? lokasiBaru : lokasiLama,
            tanggalBerubah ? tanggalBaru : tanggalLama,
          ],
          () => {
            res.status(200).json({
              message: "Aset berhasil diupdate (dengan riwayat)",
              id: Number(assetId),
              jenis,
              merk,
              model,
              serialNumber,
              kodeLokal,
              satuan,
              lokasi: lokasiBaru,
              tanggalInput: tanggalBaru,
            });
          }
        );
      }
    );
  });
};

const updateAssetStatus = (req, res) => {
  const assetId = req.params.id;
  const { status } = req.body;

  const sql = `UPDATE assets SET status = ? WHERE id = ?`;

  db.query(sql, [status, assetId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal mengubah status aset", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aset tidak ditemukan" });
    }

    res.status(200).json({
      message: "Status aset berhasil diperbarui",
      assetId: Number(assetId),
      newStatus: status,
    });
  });
};

const updateAssetLocation = (req, res) => {
  const assetId = req.params.id;
  const { lokasi } = req.body;

  if (!lokasi) {
    return res.status(400).json({ message: "Lokasi tidak boleh kosong." });
  }

  const sql = `UPDATE assets SET lokasi = ? WHERE id = ?`;

  db.query(sql, [lokasi, assetId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal update lokasi aset", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aset tidak ditemukan." });
    }

    res.status(200).json({
      message: "Lokasi aset berhasil diperbarui.",
      assetId: Number(assetId),
      lokasiBaru: lokasi,
    });
  });
};

const addAssetHistory = (req, res) => {
  const assetId = parseInt(req.params.id);
  const { location, date, role } = req.body;

  if (!location || !date) {
    return res.status(400).json({ message: "Lokasi dan tanggal wajib diisi." });
  }

  const safeRole = typeof role === "string" ? role : "Admin";
  const sql = `
    INSERT INTO asset_history (asset_id, role, location, date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [assetId, safeRole, location, date], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal menyimpan riwayat aset", error: err });
    }

    res.status(201).json({
      message: "Riwayat aset berhasil ditambahkan.",
      id: result.insertId,
      asset_id: assetId,
      role: safeRole,
      location,
      date,
    });
  });
};

const getAssetHistoryByAssetId = (req, res) => {
  const assetId = req.params.id;

  const sql = `
    SELECT id, asset_id, role, location, date
    FROM asset_history
    WHERE asset_id = ?
  `;

  db.query(sql, [assetId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal mengambil data riwayat", error: err });
    }

    res.status(200).json(results);
  });
};

module.exports = {
  getAssets,
  createAsset,
  updateAsset,
  updateAssetStatus,
  updateAssetLocation,
  addAssetHistory,
  getAssetHistoryByAssetId,
};
