import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";
import { addActivityLog } from "../utils/logs";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hasLoggedOut = sessionStorage.getItem("hasLoggedOut");

    if (hasLoggedOut === "true") {
      const user = localStorage.getItem("user");
      const parsed = user ? JSON.parse(user) : null;
      if (parsed?.role === "admin") {
        addActivityLog("LOGOUT");
      }
      sessionStorage.removeItem("hasLoggedOut");
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Email atau password salah");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", user.role);

    const hasLogged = sessionStorage.getItem("hasLogged");
    if (!hasLogged && user.role === "admin") {
      addActivityLog("LOGIN");
      sessionStorage.setItem("hasLogged", "true");
    }

    if (user.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/staff-dashboard");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes rgb-border {
          0% { border-color: red; }
          25% { border-color: orange; }
          50% { border-color: lime; }
          75% { border-color: cyan; }
          100% { border-color: red; }
        }
        input::placeholder {
          color: #e0e0e0;
          opacity: 0.8;
          font-style: italic;
        }
      `}</style>

      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/videoplayback.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={boxWithAnimatedBorder}>
          <div style={{ textAlign: "center" }}>
            <img
              src="/logo-cni.png"
              alt="Logo CNI"
              style={{ height: "95px" }}
            />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
              PT Cyber Network Indonesia
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#60A5FA",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Sistem Informasi Manajemen Aset
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Email</label>
              <div style={inputWrapper}>
                <i className="fas fa-envelope" style={iconStyle} />
                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputField}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Password</label>
              <div style={inputWrapper}>
                <i className="fas fa-lock" style={iconStyle} />
                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputField}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#0369a1")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#0284c7")
              }
            >
              Masuk
            </button>
          </form>

          <p
            style={{
              fontSize: "0.8rem",
              color: "#CBD5E1",
              textAlign: "center",
              marginTop: "1.5rem",
            }}
          >
            Copyright © 2025{" "}
            <a
              href="https://www.cni.net.id/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700, color: "#ffffff" }}
            >
              PT Cyber Network Indonesia
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const boxWithAnimatedBorder: React.CSSProperties = {
  padding: "2.5rem",
  borderRadius: "1rem",
  width: "100%",
  maxWidth: "420px",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  color: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  border: "1.5px solid red",
  animation: "rgb-border 6s linear infinite",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.3rem",
  fontWeight: 600,
  color: "#e2e8f0",
  fontSize: "0.85rem",
};

const inputWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.08)",
  border: "1px solid #CBD5E1",
  borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem",
};

const iconStyle: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: "0.9rem",
  marginRight: "0.6rem",
};

const inputField: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#E5E7EB",
  fontSize: "0.9rem",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#0284c7",
  padding: "0.6rem",
  color: "white",
  fontWeight: 600,
  fontSize: "0.9rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};

export default LoginPage;
