import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import SidebarLayoutAdmin from "./components/SidebarLayoutAdmin";
import SidebarLayoutStaff from "./components/SidebarLayoutStaff";

import LoginPage from "./pages/LoginPage";
import AssetManagementPage from "./pages/AssetManagementPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import LogActivityPage from "./pages/LogActivityPage";

const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const userRole = localStorage.getItem("userRole");

  if (!userRole && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Routes>
          {/* Admin Routes */}
          {userRole === "admin" && (
            <>
              <Route
                path="/admin-dashboard"
                element={
                  <SidebarLayoutAdmin>
                    <AssetManagementPage />
                  </SidebarLayoutAdmin>
                }
              />
              <Route
                path="/logs"
                element={
                  <SidebarLayoutAdmin>
                    <LogActivityPage />
                  </SidebarLayoutAdmin>
                }
              />
            </>
          )}

          {/* Staff Routes */}
          {userRole === "staff" && (
            <>
              <Route
                path="/staff-dashboard"
                element={
                  <SidebarLayoutStaff>
                    <StaffDashboardPage />
                  </SidebarLayoutStaff>
                }
              />
              {/* ❌ StaffLogActivityPage route dihapus */}
            </>
          )}

          {/* Redirect root to respective dashboard */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  userRole === "admin" ? "/admin-dashboard" : "/staff-dashboard"
                }
                replace
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
};

export default App;
