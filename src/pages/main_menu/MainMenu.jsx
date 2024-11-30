import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchEnd - touchStart;
    const isLeftToRight = distance > minSwipeDistance;
    const isRightToLeft = distance < -minSwipeDistance;

    if (isLeftToRight) {
      setIsMenuOpen(true);
    } else if (isRightToLeft && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 1024;

  const getLinkStyle = (path) => ({
    ...linkStyle,
    backgroundColor: selectedLink === path ? "#ffffff" : "transparent",
    border: selectedLink === path ? "1px solid #efefef" : "none",
  });

  return (
    <div
      style={{ display: "flex", minHeight: "100vh" }}
      {...(isMobile && {
        onTouchStart: onTouchStart,
        onTouchMove: onTouchMove,
        onTouchEnd: onTouchEnd,
      })}
    >
      <nav
        style={{
          width: "200px",
          backgroundColor: "#fcfcfc",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          height: "100vh",
          transform: isMobile
            ? isMenuOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)",
          transition: isMobile ? "transform 0.3s ease-in-out" : "none",
          zIndex: 1000,
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
            onClick={() => {
              setSelectedLink("/main-menu/dashboard");
              setIsMenuOpen(false);
            }}
          >
            <img src="/icons/home-07.svg" alt="Dashboard" style={iconStyle} />
            Dashboard
          </Link>
          <Link
            to="/main-menu/reports"
            style={getLinkStyle("/main-menu/reports")}
            onClick={() => {
              setSelectedLink("/main-menu/reports");
              setIsMenuOpen(false);
            }}
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
            onClick={() => {
              setSelectedLink("/main-menu/settings");
              setIsMenuOpen(false);
            }}
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
          onClick={() => {
            setSelectedLink("/main-menu/profile");
            setIsMenuOpen(false);
          }}
        >
          <img
            src={user.profilePhoto}
            alt="User Profile"
            style={profilePhotoStyle}
          />
          <span style={usernameStyle}>{user.fullName}</span>
        </Link>
      </nav>

      {/* Keep the overlay for closing the menu */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            display: "none",
            "@media (max-width: 767px)": {
              display: "block",
            },
          }}
        />
      )}

      {/* Main content area wrapper */}
      <div
        style={{
          marginLeft: isMobile ? 0 : "200px",
          flex: 1,
          backgroundColor: "#fcfcfc",
          overflowY: "auto",
          width: "100%",
          position: "relative",
          "@media (min-width: 768px)": {
            marginLeft: "200px",
            width: "calc(100% - 200px)",
          },
        }}
      >
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 1001,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                // X icon when menu is open
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                // Hamburger icon when menu is closed
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        )}
        <main
          style={{
            margin: "10px",
            padding: "10px",
            backgroundColor: "#ffffff",
            minHeight: "calc(100vh - 20px)",
            boxSizing: "border-box",
            border: "1px solid #efefef",
            borderRadius: "12px",
            "@media (min-width: 768px)": {
              margin: "20px 10px 20px 0px",
              padding: "20px",
            },
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
  "@media (max-width: 767px)": {
    fontSize: "16px", // Larger text on mobile
    padding: "15px", // Larger touch target
  },
};

const iconStyle = {
  width: "20px",
  height: "20px",
  marginRight: "10px",
};

const userProfileStyle = {
  display: "flex",
  alignItems: "center",
  margin: "10px",
  padding: "2px",
  backgroundColor: "#ffffff",
  border: "1px solid #efefef",
  borderRadius: "12px",
  "@media (max-width: 767px)": {
    margin: "10px 15px", // Larger margins on mobile
    padding: "5px",
  },
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
