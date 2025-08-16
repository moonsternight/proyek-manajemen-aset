import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, LogOut } from "lucide-react";

const SidebarLayoutStaff: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    sessionStorage.removeItem("hasLoggedOut");
    sessionStorage.removeItem("hasLogged");

    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside
        style={{
          width: "260px",
          backgroundColor: "#002E5A",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1.5rem 1rem",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo dan Judul */}
        <div>
          <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
            <img
              src="/logo-cni.png"
              alt="Logo CNI"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "contain",
                marginBottom: "0.6rem",
              }}
            />
            <h2
              style={{
                fontSize: "1em",
                fontWeight: "bold",
                lineHeight: "1.2",
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              PT Cyber Network Indonesia
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#e2e8f0",
                marginTop: "0.3rem",
                marginBottom: 0,
                fontStyle: "italic",
              }}
            >
              Sistem Informasi Manajemen Aset
            </p>
          </div>

          {/* Navigasi Staff */}
          <nav
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <Link
              to="/staff-dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                background: isActive("/staff-dashboard")
                  ? "#2563EB"
                  : "transparent",
                color: isActive("/staff-dashboard") ? "white" : "#cbd5e1",
                fontSize: "0.85rem",
                fontWeight: isActive("/staff-dashboard") ? "bold" : "normal",
                textDecoration: "none",
              }}
            >
              <ClipboardList size={18} />
              Manajemen Aset
            </Link>
          </nav>
        </div>

        {/* Tombol Logout */}
        <div style={{ padding: "1rem 0" }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#DC2626",
              border: "none",
              color: "white",
              width: "100%",
              padding: "0.55rem 1rem",
              borderRadius: "10px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#b91c1c")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#DC2626")
            }
          >
            <LogOut size={18} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          background: "#F3F4F6",
          padding: "2rem",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default SidebarLayoutStaff;
