import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ActivityLog {
  activity: string;
  date: string;
}

const LogActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/activity-logs");
        const data: ActivityLog[] = await res.json();
        setLogs(data.reverse());
      } catch (err) {
        console.error("Gagal mengambil log aktivitas:", err);
      }
    };

    fetchLogs();
  }, []);

  const formatAktivitas = (activity: string) => {
    const lower = activity.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          padding: "1.25rem",
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <Clock size={18} color="#1D4ED8" />
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: "bold",
              color: "#1D4ED8",
              margin: 0,
            }}
          >
            Log Aktivitas
          </h3>
        </div>

        {/* Table */}
        <div
          style={
            logs.length >= 10
              ? { maxHeight: "380px", overflowY: "auto" }
              : { overflowY: "visible" }
          }
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.825rem",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#F1F5F9",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <th style={headerCell}>Aktivitas</th>
                <th style={headerCell}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={2}>
                    <p
                      style={{
                        padding: "0.8rem 1rem",
                        fontStyle: "italic",
                        color: "#64748b",
                      }}
                    >
                      Tidak ada aktivitas riwayat Admin.
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    <td style={rowCell}>{formatAktivitas(log.activity)}</td>
                    <td style={rowCell}>{log.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const headerCell: React.CSSProperties = {
  padding: "0.6rem 0.75rem",
  textAlign: "left",
  fontWeight: 800,
  color: "#334155",
  borderBottom: "1px solid #E2E8F0",
  backgroundColor: "#F1F5F9",
};

const rowCell: React.CSSProperties = {
  padding: "0.55rem 0.75rem",
  color: "#0F172A",
  verticalAlign: "middle",
};

export default LogActivityPage;
