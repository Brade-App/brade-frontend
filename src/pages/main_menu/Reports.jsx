import React, { useState } from "react";
import axios from "axios";
import BradeBot from "../../components/BradeBot";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");

  const tabStyle = (isActive) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    backgroundColor: isActive ? "#222222" : "#f1f2f3",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: isActive ? "#ffffff" : "#222222",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    textAlign: "center",
    boxSizing: "border-box",
    marginRight: "10px",
  });

  const actionButtonStyle = {
    padding: "8px 12px",
    backgroundColor: "#f1f2f3",
    color: "#222222",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    marginRight: "10px",
    marginTop: "10px",
    marginBottom: "10px",
  };

  const monthTitleStyle = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "14px",
    color: "#222222",
    marginTop: "20px",
    marginBottom: "10px",
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const generatePDF = async (month, activeTab) => {
    try {
      const response = await axios.post(
        "/api/reports/generate_pdf",
        {
          user_id: localStorage.getItem("id"),
          month: month,
          year: currentYear,
          activeTab: activeTab, // This should be the array of report data items
        },
        {
          responseType: "blob", // Important: This tells axios to expect binary data
        }
      );

      // Create a Blob from the PDF Stream
      const file = new Blob([response.data], { type: "application/pdf" });

      // Create a link element, hide it, direct it towards the blob, and then trigger it.
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "report.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const downloadCSV = (month) => {
    console.log(`Downloading CSV for ${activeTab} report - ${month}`);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  console.log(currentDate);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "18px",
            color: "#222222",
          }}
        >
          Reports
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            color: "#222222",
            marginBottom: "20px",
          }}
        >
          Generate and Export Detailed Reports
        </p>
        <div style={{ marginBottom: "20px" }}>
          <button
            style={tabStyle(activeTab === "sales")}
            onClick={() => handleTabClick("sales")}
          >
            Sales Report
          </button>
          <button
            style={tabStyle(activeTab === "expense")}
            onClick={() => handleTabClick("expense")}
          >
            Expense Report
          </button>
          <button
            style={tabStyle(activeTab === "income")}
            onClick={() => handleTabClick("income")}
          >
            Income Statement
          </button>
        </div>
        <div
          style={{
            maxHeight: "400px",
            maxWidth: "400px",
            overflowY: "auto",
            paddingRight: "10px",
            border: "1.3px solid #efefef",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {months
            .slice(0, currentMonth + 1)
            .reverse()
            .map((month, index) => {
              const monthDate = new Date(currentYear, currentMonth - index, 1);
              const monthYear = monthDate.getFullYear();
              return (
                <div key={month}>
                  <h2 style={monthTitleStyle}>
                    {month} {monthYear}
                  </h2>
                  <button
                    style={actionButtonStyle}
                    onClick={() =>
                      generatePDF(currentMonth + 1 - index, activeTab)
                    }
                  >
                    Generate PDF
                  </button>
                  <button
                    style={actionButtonStyle}
                    onClick={() => downloadCSV(month)}
                  >
                    Download CSV
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "80px", right: "40px" }}>
        <BradeBot transactions={[]} />
      </div>
    </div>
  );
};

export default Reports;
