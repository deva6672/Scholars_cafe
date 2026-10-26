import React, { useState } from "react";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import "./Admin.css";

export default function AdminApp() {
  const [token, setToken] = useState(() => sessionStorage.getItem("sc_admin_token") || "");

  function handleLogin(newToken) {
    sessionStorage.setItem("sc_admin_token", newToken);
    setToken(newToken);
  }

  function handleLogout() {
    sessionStorage.removeItem("sc_admin_token");
    setToken("");
  }

  return token ? (
    <AdminDashboard token={token} onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}
