import React, { useState, useEffect } from "react";

const MobileBlocker = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 1024 || window.innerWidth / window.innerHeight < 1
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "20px",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#ffffff",
        }}
      >
        <img
          src="/images/logoblack.png"
          alt="App Logo"
          style={{
            width: "100px",
            height: "auto",
            marginBottom: "20px",
          }}
        />
        <h1 style={{ marginBottom: "20px" }}>Mobile Access Restricted</h1>
        <p>
          We're sorry, but this application is not currently available on mobile
          devices. Please use a desktop or laptop computer to access our
          services.
        </p>
      </div>
    );
  }

  return children;
};

export default MobileBlocker;
