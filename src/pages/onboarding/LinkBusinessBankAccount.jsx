import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormInput from "../../components/FormInput";

const LinkBusinessBankAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("/api/gocardless/choose-a-bank");
        const bankOptions = response.data.banks.map((bank) => ({
          value: bank.id,
          label: bank.name,
        }));

        // Add SANDBOXFINANCE_SFIN0000 to the list of banks
        bankOptions.unshift({
          value: "SANDBOXFINANCE_SFIN0000",
          label: "Sandbox Finance (Test)",
        });

        setBanks(bankOptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bank list:", error);
        setError("Failed to fetch bank list. Please try again.");
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const handleLinkBank = async () => {
    if (selectedBank) {
      console.log(`Linking bank with ID: ${selectedBank}`);
      navigate("/queued-pos-links", {
        state: {
          selectedPOS: ["gocardless"],
          selectedBank: selectedBank,
        },
      });
    } else {
      setError("Please select a bank before proceeding.");
    }
  };

  const handleSkip = () => {
    navigate("/account-created-success");
  };

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
          Link Your Business Bank Account
        </h2>
        <p
          style={{
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#606060",
            marginBottom: "30px",
          }}
        >
          Connect your business bank account to streamline your financial
          tracking.
        </p>
        {error && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>
        )}
        <FormInput
          label="Bank Account"
          type="select"
          id="bankSelection"
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          required
          hint="Select"
          options={banks}
        />
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={handleLinkBank}
            disabled={loading || !selectedBank}
            style={{
              width: "100%",
              height: "52px",
              backgroundColor: loading || !selectedBank ? "#cccccc" : "#f564a9",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading || !selectedBank ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkBusinessBankAccount;
