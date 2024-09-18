import React, { useState, useEffect } from "react";
import axios from "axios";
import RevenueChart from "../../components/RevenueChart";
import ExpensesChart from "../../components/ExpensesChart";
import BradeBot from "../../components/BradeBot";

const Dashboard = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyRevenues, setMonthlyRevenues] = useState([]);
  const [financialGoals, setFinancialGoals] = useState(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState({
    value: 0,
    percentageChange: 0,
  });
  const [monthlyExpenseData, setMonthlyExpenseData] = useState({
    value: 0,
    percentageChange: 0,
  });

  // Mock data for fallback
  const mockMonthlyExpenses = [
    { month: "Jan", amount: 15000 },
    { month: "Feb", amount: 16000 },
    { month: "Mar", amount: 15500 },
    { month: "Apr", amount: 17000 },
    { month: "May", amount: 16500 },
    { month: "Jun", amount: 18000 },
    { month: "Jul", amount: 19000 },
    { month: "Aug", amount: 18500 },
    { month: "Sep", amount: 19500 },
    { month: "Oct", amount: 20000 },
  ];

  const mockMonthlyRevenues = [
    { month: "Jan", amount: 20000 },
    { month: "Feb", amount: 22000 },
    { month: "Mar", amount: 21000 },
    { month: "Apr", amount: 23000 },
    { month: "May", amount: 22500 },
    { month: "Jun", amount: 24000 },
    { month: "Jul", amount: 25000 },
    { month: "Aug", amount: 26000 },
    { month: "Sep", amount: 27000 },
    { month: "Oct", amount: 28000 },
  ];

  useEffect(() => {
    const userId = localStorage.getItem("id");

    const fetchFinancialGoals = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-financial-goals/${userId}`
        );
        console.log("Financial goals:", response.data.financial_goals);
        setFinancialGoals(response.data.financial_goals);
      } catch (error) {
        console.error("Error fetching financial goals:", error);
        // You might want to set some default values here
        setFinancialGoals({
          marginGoal: 8,
          revenueTarget: 6000,
          retentionRate: 15,
        });
      }
    };

    const fetchMonthlyExpenses = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-monthly-expenses/${userId}`
        );
        console.log("Monthly expenses:", response.data);
        setMonthlyExpenses(response.data.monthly_expenses);
      } catch (error) {
        console.error("Error fetching monthly expenses:", error);
        setMonthlyExpenses(mockMonthlyExpenses);
      }
    };

    const fetchMonthlyRevenues = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-monthly-sales/${userId}`
        );
        console.log("Monthly revenues:", response.data);
        setMonthlyRevenues(response.data.monthly_sales);
      } catch (error) {
        console.error("Error fetching monthly revenues:", error);
        setMonthlyRevenues(mockMonthlyRevenues);
      }
    };

    const fetchMonthlyRevenueData = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-average-monthly-sales/${userId}`
        );
        console.log("Monthly revenue data:", response.data);
        setMonthlyRevenueData({
          value: response.data.value,
          percentageChange: response.data.percent_change,
        });
      } catch (error) {
        console.error("Error fetching monthly revenue data:", error);
        // Set some default values or handle the error as needed
        setMonthlyRevenueData({
          value: 0,
          percentageChange: 0,
        });
      }
    };

    const fetchMonthlyExpenseData = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-average-monthly-expense/${userId}`
        );
        console.log("Monthly expense data:", response.data);
        setMonthlyExpenseData({
          value: response.data.value,
          percentageChange: response.data.percent_change,
        });
      } catch (error) {
        console.error("Error fetching monthly expense data:", error);
        // Set some default values or handle the error as needed
        setMonthlyExpenseData({
          value: 0,
          percentageChange: 0,
        });
      }
    };

    fetchFinancialGoals();
    fetchMonthlyExpenses();
    fetchMonthlyRevenues();
    fetchMonthlyRevenueData();
    fetchMonthlyExpenseData();
  }, []);

  return (
    <div>
      <h1
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "18px",
          color: "#222222",
        }}
      >
        Overview
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button style={buttonStyle}>
          <img
            src="/icons/monthlyrevenue.svg"
            alt="Monthly Revenue"
            style={iconStyle}
          />
          <div style={contentStyle}>
            <span style={titleStyle}>Monthly Revenue</span>
            <div style={dataContainer}>
              <span style={dataStyle}>
                £{monthlyRevenueData.value.toLocaleString()}
              </span>
              <span
                style={percentageStyle(
                  monthlyRevenueData.percentageChange >= 0
                )}
              >
                {monthlyRevenueData.percentageChange >= 0 ? "+" : ""}
                {monthlyRevenueData.percentageChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </button>
        <button style={buttonStyle}>
          <img
            src="/icons/monthlyexpenses.svg"
            alt="Monthly Expenses"
            style={iconStyle}
          />
          <div style={contentStyle}>
            <span style={titleStyle}>Monthly Expenses</span>
            <div style={dataContainer}>
              <span style={dataStyle}>
                £{monthlyExpenseData.value.toLocaleString()}
              </span>
              <span
                style={percentageStyle(
                  monthlyExpenseData.percentageChange <= 0
                )}
              >
                {monthlyExpenseData.percentageChange <= 0 ? "" : "+"}
                {monthlyExpenseData.percentageChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </button>
        <button style={buttonStyle}>
          <img
            src="/icons/revenueperclient.svg"
            alt="Revenue per Client"
            style={iconStyle}
          />
          <div style={contentStyle}>
            <span style={titleStyle}>Revenue per Client</span>
            <div style={dataContainer}>
              <span style={dataStyle}>£1,200</span>
              <span style={percentageStyle(true)}>+3.7%</span>
            </div>
          </div>
        </button>
      </div>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "48%", height: "400px" }}>
          <RevenueChart revenues={monthlyRevenues} />
        </div>
        <div style={{ width: "48%", height: "400px" }}>
          <ExpensesChart expenses={monthlyExpenses} />
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        <BradeBot
          expenses={monthlyExpenses}
          revenues={monthlyRevenues}
          financialGoals={financialGoals}
        />
      </div>
    </div>
  );
};

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "25px 12px",
  backgroundColor: "#ffffff",
  border: "1px solid rgba(96, 96, 96, 0.2)",
  borderRadius: "25px", // Updated to 25px
  fontSize: "14px",
  fontWeight: 500,
  color: "#333",
  fontFamily: "Inter, sans-serif",
  cursor: "pointer",
  width: "calc(33.33% - 10px)",
  textAlign: "left",
  boxSizing: "border-box",
};

const iconStyle = {
  width: "auto",
  height: "100%",
  marginRight: "15px",
};

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "70px", // Set this to match the icon height
};

const titleStyle = {
  display: "block",
  fontSize: "16px",
  fontWeight: 400,
  color: "#333",
  marginBottom: "4px",
};

const dataContainer = {
  display: "flex",
  alignItems: "baseline",
};

const dataStyle = {
  display: "inline-block",
  fontFamily: "Inter, sans-serif",
  fontSize: "20px",
  fontWeight: 600,
  color: "#222222",
};

const percentageStyle = (isPositive) => ({
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontWeight: 500,
  color: isPositive ? "#4CAF50" : "#F44336",
  marginLeft: "8px",
});

export default Dashboard;
