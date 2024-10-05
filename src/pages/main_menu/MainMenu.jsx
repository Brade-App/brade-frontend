import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Profile from "./Profile";

const MainMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLink, setSelectedLink] = useState(location.pathname);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    profilePhoto: "/images/profileplaceholder.png",
    salonName: "",
    businessAddress: "",
    postcode: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    if (
      location.pathname === "/main-menu" ||
      location.pathname === "/main-menu/"
    ) {
      navigate("/main-menu/dashboard");
      setSelectedLink("/main-menu/dashboard");
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }

      try {
        const response = await axios.get(
          `/api/database/get-user-details/${userId}`
        );
        setUser({
          fullName: response.data.full_name,
          email: response.data.email,
          profilePhoto:
            response.data.profile_photo || "/images/profileplaceholder.png",
          salonName: response.data.salon_name,
          businessAddress: response.data.business_address,
          postcode: response.data.postcode,
          state: response.data.state,
          country: response.data.country,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();

    // Add event listener for userDetailsUpdated
    const handleUserDetailsUpdate = () => {
      fetchUserDetails();
    };

    window.addEventListener("userDetailsUpdated", handleUserDetailsUpdate);

    // Clean up the event listener
    return () => {
      window.removeEventListener("userDetailsUpdated", handleUserDetailsUpdate);
    };
  }, []);

  const getLinkStyle = (path) => ({
    ...linkStyle,
    backgroundColor: selectedLink === path ? "#ffffff" : "transparent",
    border: selectedLink === path ? "1px solid #efefef" : "none",
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <nav
        style={{
          width: "200px",
          backgroundColor: "#fcfcfc",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          height: "100vh",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <img
              src="/images/logoblack.png"
              alt="Company Logo"
              style={{ width: "100px", height: "auto" }}
            />
            <h2
              style={{
                marginTop: "20px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#606060",
                fontFamily: "Inter, sans-serif",
              }}
            >
              MAIN MENU
            </h2>
          </div>
          <Link
            to="/main-menu/dashboard"
            style={getLinkStyle("/main-menu/dashboard")}
            onClick={() => setSelectedLink("/main-menu/dashboard")}
          >
            <img src="/icons/home-07.svg" alt="Dashboard" style={iconStyle} />
            Dashboard
          </Link>
          <Link
            to="/main-menu/reports"
            style={getLinkStyle("/main-menu/reports")}
            onClick={() => setSelectedLink("/main-menu/reports")}
          >
            <img
              src="/icons/waterfall-up-02.svg"
              alt="Reports"
              style={iconStyle}
            />
            Reports
          </Link>
          <Link
            to="/main-menu/settings"
            style={getLinkStyle("/main-menu/settings")}
            onClick={() => setSelectedLink("/main-menu/settings")}
          >
            <img
              src="/icons/cpu-settings.svg"
              alt="Settings"
              style={iconStyle}
            />
            Settings
          </Link>
        </div>

        {/* User profile section */}
        <Link
          to="/main-menu/profile"
          state={{ user: user }}
          style={{
            ...userProfileStyle,
            ...getLinkStyle("/main-menu/profile"),
            textDecoration: "none",
          }}
          onClick={() => setSelectedLink("/main-menu/profile")}
        >
          <img
            src={user.profilePhoto}
            alt="User Profile"
            style={profilePhotoStyle}
          />
          <span style={usernameStyle}>{user.fullName}</span>
        </Link>
      </nav>

      {/* Main content area wrapper */}
      <div
        style={{
          marginLeft: "200px",
          flex: 1,
          backgroundColor: "#fcfcfc",
          overflowY: "auto",
        }}
      >
        {/* Actual main content with margins */}
        <main
          style={{
            margin: "20px 10px 20px 0px",
            padding: "10px 20px",
            backgroundColor: "#ffffff",
            minHeight: "calc(100vh - 40px)", // Subtract top and bottom margins
            boxSizing: "border-box",
            border: "1px solid #efefef",
            borderRadius: "12px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const linkStyle = {
  color: "#606060",
  textDecoration: "none",
  marginBottom: "18px",
  borderRadius: "10px",
  transition: "background-color 0.3s, color 0.3s",
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  fontWeight: 500,
  padding: "10px",
};

const iconStyle = {
  width: "20px",
  height: "20px",
  marginRight: "10px",
};

const userProfileStyle = {
  display: "flex",
  alignItems: "center",
  margin: "10px 20px",
  padding: "2px",
  backgroundColor: "#ffffff",
  border: "1px solid #efefef",
  borderRadius: "12px",
};

const profilePhotoStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "9px",
  marginRight: "10px",
};

const usernameStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#333",
  fontFamily: "Inter, sans-serif",
};

export default MainMenu;
