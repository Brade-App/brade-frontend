import React, { useState, useEffect } from "react";
import axios from "axios";
import RevenueChart from "../../components/RevenueChart";
import ExpensesChart from "../../components/ExpensesChart";
import BradeBot from "../../components/BradeBot";

const Dashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyRevenues, setMonthlyRevenues] = useState([]);
  const [financialGoals, setFinancialGoals] = useState({
    marginGoal: 8,
    revenueTarget: 6000,
    retentionRate: 15,
  });
  const [monthlyRevenueData, setMonthlyRevenueData] = useState({
    value: 0,
    percentageChange: 0,
  });
  const [monthlyExpenseData, setMonthlyExpenseData] = useState({
    value: 0,
    percentageChange: 0,
  });
  const [revenuePerClient, setRevenuePerClient] = useState({
    value: 0,
    percentageChange: 0,
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const userId = localStorage.getItem("id");

    const fetchFinancialGoals = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-financial-goals/${userId}`
        );
        setFinancialGoals(response.data.financial_goals);
      } catch (error) {
        console.error("Error fetching financial goals:", error);
      }
    };

    const fetchMonthlyExpenses = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-monthly-expenses/${userId}`
        );
        setMonthlyExpenses(response.data.monthly_expenses);
      } catch (error) {
        console.error("Error fetching monthly expenses:", error);
      }
    };

    const fetchMonthlyRevenues = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-monthly-sales/${userId}`
        );
        setMonthlyRevenues(response.data.monthly_sales);
      } catch (error) {
        console.error("Error fetching monthly revenues:", error);
      }
    };

    const fetchMonthlyRevenueData = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-current-month-sales-total/${userId}`
        );
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
          `/api/database/get-current-month-expenses-total/${userId}`
        );
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

    const fetchRevenuePerClientData = async () => {
      try {
        const response = await axios.get(
          `/api/database/get-current-month-revenue-per-client/${userId}`
        );
        setRevenuePerClient({
          value: response.data.value,
          percentageChange: response.data.percent_change,
        });
      } catch (error) {
        console.error("Error fetching revenue per client data:", error);
        setRevenuePerClient({
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
    fetchRevenuePerClientData();
  }, []);

  const getButtonStyle = (isMobile) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "25px 12px",
    backgroundColor: "#ffffff",
    border: "1px solid rgba(96, 96, 96, 0.2)",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    width: isMobile ? "100%" : "calc(33.33% - 10px)",
    textAlign: "left",
    boxSizing: "border-box",
  });

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
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          marginTop: "20px",
          gap: isMobile ? "15px" : "10px",
        }}
      >
        <button style={getButtonStyle(isMobile)}>
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
                {monthlyRevenueData.percentageChange > 0 ? "+" : ""}
                {monthlyRevenueData.percentageChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </button>
        <button style={getButtonStyle(isMobile)}>
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
        <button style={getButtonStyle(isMobile)}>
          <img
            src="/icons/revenueperclient.svg"
            alt="Revenue per Client"
            style={iconStyle}
          />
          <div style={contentStyle}>
            <span style={titleStyle}>Revenue per Client</span>
            <div style={dataContainer}>
              <span style={dataStyle}>
                £{revenuePerClient.value.toLocaleString()}
              </span>
              <span
                style={percentageStyle(revenuePerClient.percentageChange >= 0)}
              >
                {revenuePerClient.percentageChange > 0 ? "+" : ""}
                {revenuePerClient.percentageChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </button>
      </div>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap: isMobile ? "30px" : "0",
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "48%",
            height: "400px",
          }}
        >
          <RevenueChart revenues={monthlyRevenues} />
        </div>
        <div
          style={{
            width: isMobile ? "100%" : "48%",
            height: "400px",
          }}
        >
          <ExpensesChart expenses={monthlyExpenses} />
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        <BradeBot
          expenses={monthlyExpenses}
          revenues={monthlyRevenues}
          financialGoals={financialGoals}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
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
