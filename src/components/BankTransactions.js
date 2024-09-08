import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BankTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { accountId } = useParams();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/gocardless/list-transactions/${accountId}`
        );
        setTransactions(response.data.transactions);
        console.log(response.data.transactions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions. Please try again.");
        setLoading(false);
      }
    };

    if (accountId) {
      fetchTransactions();
    } else {
      setError("No account ID provided.");
      setLoading(false);
    }
  }, [accountId]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Bank Account Transactions</h1>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.transactions.booked.map((transaction, index) => (
            <li key={index}>
              {transaction.debtorName}: {transaction.transactionAmount.amount}{" "}
              {transaction.transactionAmount.currency}
              (Date: {transaction.bookingDate})
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default BankTransactions;
