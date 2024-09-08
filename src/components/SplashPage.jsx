import React from "react";

const SplashPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#222222",
      }}
    >
      <img
        src="/images/logowhite.png"
        alt="Company Logo"
        style={{ width: "100px", height: "auto" }}
      />
    </div>
  );
};

export default SplashPage;
