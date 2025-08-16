import React, { useEffect, useState } from "react";

interface ActivityLogItem {
  activity: string;
  date: string;
}

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/activity-logs");
        if (!res.ok) throw new Error("Gagal mengambil data log");
        const data: ActivityLogItem[] = await res.json();
        setLogs(data.reverse());
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div
      className="activity-log"
      style={{
        background: "white",
        padding: "1.5rem",
        borderRadius: "1rem",
        minHeight: "200px",
      }}
    >
      <h3 style={{ color: "#1e40af", marginBottom: "1rem" }}>
        <i className="fas fa-history" style={{ marginRight: "0.5rem" }}></i>
        Riwayat Aktivitas Admin
      </h3>

      {loading ? (
        <p style={{ color: "#64748b" }}>Memuat log aktivitas...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : logs.length === 0 ? (
        <p style={{ color: "#64748b", fontStyle: "italic" }}>
          Tidak ada riwayat aktivitas Admin.
        </p>
      ) : (
        <table
          className="log-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={thStyle}>Aktivitas</th>
              <th style={thStyle}>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td style={tdStyle}>{capitalize(log.activity)}</td>
                <td style={tdStyle}>{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const thStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.85rem",
  color: "#475569",
  fontWeight: 700,
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  color: "#0f172a",
  borderBottom: "1px solid #f1f5f9",
};

export default ActivityLog;
