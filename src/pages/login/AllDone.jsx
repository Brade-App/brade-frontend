import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import LoadingPage from "../../components/LoadingPage";

const AllDone = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <img
            src="/images/logoblack.png"
            alt="Company Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
        <h2
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "24px",
            color: "#222222",
            marginBottom: "16px",
          }}
        >
          All done!
        </h2>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#5C5C5C",
            marginBottom: "20px",
          }}
        >
          Your password has been reset.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "#f564a9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HiOutlineArrowLeft style={{ marginRight: "8px" }} />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default AllDone;
