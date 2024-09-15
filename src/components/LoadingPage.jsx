import React from "react";

const LoadingPage = ({ color = "#f564a9", backgroundColor = "#f9f9f9" }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: backgroundColor,
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #d9d9d9",
          borderTop: `5px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
