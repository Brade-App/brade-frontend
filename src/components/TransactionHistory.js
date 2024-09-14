import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get the code from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  const fetchTransactions = async () => {
    if (!code) {
      setError(
        "No authorization code found. Please connect your account again."
      );
      setTimeout(() => setLoading(false), 3000); // 1 second delay
      return;
    }

    try {
      const response = await axios.post("/api/sumup/list-transactions", {
        code,
      });
      setTransactions(response.data.transactions.items);
      setError(null);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      // Add a delay before setting loading to false
      setTimeout(() => setLoading(false), 3000); // 1 second delay
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshTransactions = () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    fetchTransactions();
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Transaction History</h1>
      {message && <p>{message}</p>}

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              {transaction.description}: {transaction.amount}{" "}
              {transaction.currency}
              (Status: {transaction.status}, Date:{" "}
              {new Date(transaction.date * 1000).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}
      <button onClick={refreshTransactions}>Refresh Transactions</button>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default TransactionHistory;
