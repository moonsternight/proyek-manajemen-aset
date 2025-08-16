import React from "react";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../utils/helpers";

interface HeaderProps {
  username: string;
  loginTime: Date;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, loginTime, onLogout }) => {
  const navigate = useNavigate();

  const datePart = loginTime.toISOString().split("T")[0];
  const timePart = loginTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedLoginTime = `${formatDate(datePart)} ${timePart}`;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    onLogout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="logo-section">
        <div className="logo">
          <i className="fas fa-network-wired"></i>
        </div>
        <div className="header-text">
          <h1>SIMA - PT Cyber Network Indonesia</h1>
          <p>Sistem Informasi Manajemen Aset</p>
        </div>
      </div>
      <div className="user-info">
        <div className="user-avatar">
          <i className="fas fa-user-shield"></i>
        </div>
        <div className="user-details">
          <h3>{username}</h3>
          <p>Login: {formattedLoginTime}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
