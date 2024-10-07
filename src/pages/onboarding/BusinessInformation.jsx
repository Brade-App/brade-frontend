import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormInput from "../../components/FormInput";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";

const BusinessInformation = () => {
  const [loading, setLoading] = useState(true);
  const [salonName, setSalonName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("id");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulating a 2-second loading time

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fullName = localStorage.getItem("fullName");
    const email = localStorage.getItem("email");

    try {
      const response = await axios.post("/api/record_business_information", {
        id: userId,
        full_name: fullName,
        email: email,
        salon_name: salonName,
        business_address: businessAddress,
        postcode: postcode,
        state: state,
        country: country,
      });
      navigate("/link-your-pos"); // Navigate to the new StripeIntegration page
    } catch (error) {
      console.error("Error submitting business information:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return loading ? (
    <div style={{ height: "100vh" }}>
      <LoadingPage />
    </div>
  ) : (
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
            alt="Company Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "24px",
            color: "#222222",
            marginBottom: "10px",
          }}
        >
          Business Information
        </h2>
        <p
          style={{
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#606060",
            marginBottom: "20px",
          }}
        >
          Input your business details below
        </p>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <FormInput
            label="Salon Name"
            type="text"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            required
            hint="e.g Heavens Salon"
          />
          <FormInput
            label="Business Address"
            type="text"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            required
            hint="e.g 10 Alex Avenue"
          />
          <FormInput
            label="Postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            required
            hint="e.g 101 020"
          />
          <FormInput
            label="State"
            type="select"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            hint="Select your state"
            options={[
              { value: "England", label: "England" },
              { value: "Scotland", label: "Scotland" },
              { value: "Wales", label: "Wales" },
              { value: "Northern Ireland", label: "Northern Ireland" },
              // Add more counties as needed
            ]}
          />
          <FormInput
            label="Country"
            type="select"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            hint="Select your country"
            options={[{ value: "United Kingdom", label: "United Kingdom" }]}
          />
          <div style={{ width: "100%", marginTop: "20px" }}>
            <button
              type="submit"
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
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessInformation;
