import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TransactionChatbot from "./TransactionChatbot";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const accountId = location.state?.accountId;

  const fetchTransactions = async () => {
    console.log("Fetching transactions for account ID:", accountId);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/get-transactions?account_id=${accountId}`
      );
      setTransactions(response.data.transactions);
      setMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again.");
      setLoading(false);
    }
  };

  const mockTransactions = [
    {
      id: 1,
      description: "Grocery Store",
      amount: -50.0,
      currency: "USD",
      status: "completed",
      date: Date.now() / 1000,
    },
  ];

  useEffect(() => {
    if (!accountId) {
      navigate("/");
      return;
    }

    //fetchTransactions();
    setTransactions(mockTransactions);
    setLoading(false);
  }, [accountId, navigate]);

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
        <p>
          No transactions found. This could be due to:
          <ul>
            <li>The connected account is new or has no recent activity</li>
            <li>
              Transactions haven't been synced yet (it may take a few minutes)
            </li>
            <li>
              The account doesn't have any transactions in the date range Stripe
              can access
            </li>
          </ul>
        </p>
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
      <h2>Transaction Analysis Chatbot</h2>
      <TransactionChatbot transactions={transactions} />
      <button onClick={refreshTransactions}>Refresh Transactions</button>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default TransactionHistory;
