import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const GoCardlessBanks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const banks = location.state?.banks || [];

  const handleBankSelection = async (bankId) => {
    // Here you would typically make an API call to initiate the bank connection
    console.log(`Selected bank with ID: ${bankId}`);
    try {
      const response = await axios.post("/api/gocardless/build-a-link", {
        institution_id: bankId,
      });
      console.log(response.data.requisition);
      window.location.href = response.data.requisition.link;
      localStorage.setItem("requisistion_id", response.data.requisition.id);
    } catch (error) {
      console.error("Error getting GoCardless banks:", error);
    }
    // For now, let's just navigate back to the main page
  };

  return (
    <div>
      <h1>Select Your Bank</h1>
      {banks.length === 0 ? (
        <p>No banks available. Please try again later.</p>
      ) : (
        <ul>
          {banks.map((bank) => (
            <li key={bank.id}>
              <button onClick={() => handleBankSelection(bank.id)}>
                {bank.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default GoCardlessBanks;
