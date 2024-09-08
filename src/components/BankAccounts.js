import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const requisition_id = localStorage.getItem("requisistion_id");
        const response = await axios.get(
          `http://localhost:5000/api/gocardless/list-accounts/${requisition_id}`
        );
        setAccounts(response.data.accounts.accounts);
        console.log(response.data.accounts.accounts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch accounts. Please try again.");
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountSelection = (accountId) => {
    navigate(`/bank-transactions/${accountId}`);
  };

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Your Bank Accounts</h1>
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <ul>
          {accounts.map((account) => (
            <li key={account}>
              <button onClick={() => handleAccountSelection(account)}>
                {account}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default BankAccounts;
