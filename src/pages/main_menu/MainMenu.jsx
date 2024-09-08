import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainMenu = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Navigation bar */}
      <nav
        style={{
          width: "200px",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>
        <Link to="/reports" style={linkStyle}>
          Reports
        </Link>
        <Link to="/preferences" style={linkStyle}>
          Preferences
        </Link>
      </nav>

      {/* Main content area */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

const linkStyle = {
  color: "#333",
  textDecoration: "none",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  transition: "background-color 0.3s",
};

export default MainMenu;
