import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";

const LinkYourPOS = () => {
  const navigate = useNavigate();
  const [selectedPOS, setSelectedPOS] = useState([]);

  const handlePOSSelection = () => {
    if (selectedPOS.length > 0) {
      navigate("/queued-pos-links", { state: { selectedPOS } });
    }
  };

  useEffect(() => {
    localStorage.removeItem("onboarding_state");
  }, []);

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
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="/images/logoblack.png"
            alt="Brade Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "24px",
            color: "#222222",
            marginBottom: "20px",
          }}
        >
          Link Your POS
        </h2>
        <p
          style={{
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "18px",
            fontWeight: 500,
            color: "#5C5C5C",
            marginBottom: "30px",
          }}
        >
          Select your payment processors from the options below:
        </p>
        <FormInput
          label="Payment Processors (e.g. Stripe)"
          type="multiselect"
          id="posSelection"
          value={selectedPOS}
          onChange={(e) => setSelectedPOS(e.target.value)}
          required
          hint="Select"
          options={[
            { value: "stripe", label: "Stripe" },
            { value: "square", label: "Square" },
            { value: "sumup", label: "SumUp" },
          ]}
          multiple
        />
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={handlePOSSelection}
            disabled={selectedPOS.length === 0}
            style={{
              width: "100%",
              height: "52px",
              backgroundColor: selectedPOS.length === 0 ? "#cccccc" : "#f564a9",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: selectedPOS.length === 0 ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkYourPOS;
