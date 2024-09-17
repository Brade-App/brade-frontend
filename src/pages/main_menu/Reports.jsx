import React, { useState } from "react";
import axios from "axios";
import BradeBot from "../../components/BradeBot";
import jsPDF from "jspdf";

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

  const generatePDF = (month, activeTab) => {
    const monthDate = new Date(currentYear, month - 1, 1);
    const monthName = monthDate.toLocaleString("default", { month: "long" });
    const yearString = monthDate.getFullYear().toString();

    generatePDFContent(
      monthName,
      "123 Business Street", // Replace with actual address
      "City", // Replace with actual city
      "State", // Replace with actual state
      "12345", // Replace with actual postal code
      activeTab
    );
  };

  const downloadCSV = (month, activeTab) => {
    const monthDate = new Date(currentYear, month - 1, 1);
    const monthName = monthDate.toLocaleString("default", { month: "long" });
    const yearString = monthDate.getFullYear().toString();

    generateCSVContent(monthName, yearString, activeTab);
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
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For Internet Explorer and Edge
            "&::-webkit-scrollbar": {
              display: "none", // For Chrome, Safari, and Opera
            },
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
                    View PDF
                  </button>
                  <button
                    style={actionButtonStyle}
                    onClick={() =>
                      downloadCSV(currentMonth + 1 - index, activeTab)
                    }
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

const generatePDFContent = (
  month,
  streetAddress,
  city,
  state,
  postalCode,
  activeTab
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const footerHeight = 20;
  const pageMargin = 20;
  const startY = 80;
  const maxY = pageHeight - footerHeight - pageMargin;

  const addInitialPageContent = (
    doc,
    pageWidth,
    month,
    streetAddress,
    city,
    state,
    postalCode,
    activeTab
  ) => {
    // Add dark header
    doc.setFillColor(34, 34, 34);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Add white logo
    doc.addImage("/images/logowhite.png", "PNG", 15, 10, 30, 7);

    // Add company information in white text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("123 Business Street, City, Country", 15, 23);
    doc.text("Phone: +1 234 567 8900", 15, 28);
    doc.text("Email: hello@bradehq.com", 15, 33);

    // Add title aligned to the right
    doc.setFontSize(40);
    doc.setFont("helvetica", "normal");
    const titleText = `${
      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    }`;
    doc.text(titleText, pageWidth - 18, 25, { align: "right" });

    // Reset text color for the rest of the document
    doc.setTextColor(0, 0, 0);

    // Add content
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Report to`, 15, 55);
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`${streetAddress}`, 15, 61);
    doc.text(`${city}, ${state}, ${postalCode}`, 15, 66);

    doc.setTextColor(0, 0, 0);
    const amount = pageWidth - 18;
    doc.text(`Period`, amount - 30, 61, { align: "right" });
    doc.setTextColor(80, 80, 80);
    doc.text(`${month}`, amount, 61, { align: "right" });
  };

  // Function to add a new page
  const addNewPage = () => {
    doc.addPage();
    addFooter(doc, pageWidth, pageHeight, footerHeight);
  };

  // Add initial page content
  addInitialPageContent(
    doc,
    pageWidth,
    month,
    streetAddress,
    city,
    state,
    postalCode,
    activeTab
  );

  // Add footer to the first page
  addFooter(doc, pageWidth, pageHeight, footerHeight);

  const headers = ["Description", "Amount"];
  const data = getDataForActiveTab(activeTab);

  // Table headers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  headers.forEach((header, i) => {
    doc.text(header, i === 0 ? 15 : pageWidth - 35, startY + 10);
  });
  doc.setDrawColor(230, 230, 230);
  doc.line(10, startY + 15, pageWidth - 10, startY + 15);

  // Table rows
  doc.setFont("helvetica", "normal");
  let y = startY + 25;

  data.forEach((row, i) => {
    if (y > maxY) {
      addNewPage();
      y = startY;
    }

    if (row.isHeader) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(row.description, 15, y);
    } else {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(row.description, 15, y);
      doc.text(row.amount, pageWidth - 35, y);

      if (row.subtext) {
        if (y + 5 > maxY) {
          addNewPage();
          y = startY;
        }
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(row.subtext, 15, y + 5);
      }

      if (row.isTotal || row.isNetIncome) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }

      if (row.isNetIncome) {
        doc.setDrawColor(0, 0, 0);
        doc.line(10, y - 5, pageWidth - 10, y - 5);
      }
    }

    if (
      i < data.length - 1 &&
      !row.isHeader &&
      !row.isTotal &&
      !data[i + 1].isHeader
    ) {
      doc.setDrawColor(230, 230, 230);
      doc.line(10, y - 10, pageWidth - 10, y - 10);
    }

    y += row.subtext ? 25 : row.isHeader ? 15 : 20;
  });

  // Calculate and display total only for expense and sales reports
  if (activeTab !== "income") {
    // Calculate total
    const total = data.reduce((sum, row) => {
      if (row.amount && !row.isHeader && !row.isTotal && !row.isNetIncome) {
        return sum + parseFloat(row.amount.replace("£", ""));
      }
      return sum;
    }, 0);

    // Add total text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const totalY = y + 10;
    doc.text("Total", 15, totalY);
    doc.text(`£${total.toFixed(2)}`, pageWidth - 35, totalY);
  }

  // Generate PDF as Blob
  const pdfBlob = doc.output("blob");

  // Create a URL for the Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Open PDF in a new tab
  window.open(pdfUrl, "_blank");
};

const getDataForActiveTab = (activeTab) => {
  // Define the data based on the active tab
  return activeTab === "expense"
    ? [
        { description: "Payroll", amount: "£1000.00", subtext: "" },
        { description: "Rent", amount: "£200.00", subtext: "" },
        { description: "Utilities", amount: "£3000.00", subtext: "" },
        { description: "Others", amount: "£500.00", subtext: "" },
      ]
    : activeTab === "sales"
    ? [
        {
          description: "Online Revenue",
          amount: "£100.00",
          subtext: "(from online booking system e.g. deposits)",
        },
        {
          description: "In-store Revenue",
          amount: "£200.00",
          subtext:
            "(from card readers/devices as payment services & treatments)",
        },
        {
          description: "Average Revenue per customer",
          amount: "£300.00",
          subtext: "(ARPU)",
        },
        {
          description: "Total VAT",
          amount: "£400.00",
          subtext: "(20% of each service aggregated to produce total VAT)",
        },
      ]
    : [
        { description: "Revenue", amount: "", isHeader: true },
        {
          description: "Online Revenue",
          amount: "£100.00",
          subtext: "(from online booking system e.g. deposits)",
        },
        {
          description: "In-store Revenue",
          amount: "£200.00",
          subtext:
            "(from card readers/devices as payment services & treatments)",
        },
        { description: "Total Revenue", amount: "£300.00", isTotal: true },
        { description: "Expenses", amount: "", isHeader: true },
        { description: "Payroll", amount: "£1000.00", subtext: "" },
        { description: "Rent", amount: "£200.00", subtext: "" },
        { description: "Utilities", amount: "£3000.00", subtext: "" },
        { description: "Others", amount: "£500.00", subtext: "" },
        { description: "Total Expenses", amount: "£4700.00", isTotal: true },
        { description: "Net Income", amount: "£-4400.00", isNetIncome: true },
      ];
};

const generateCSVContent = (month, year, activeTab) => {
  // Define the data based on the active tab
  const data =
    activeTab === "expense"
      ? [
          { description: "Payroll", amount: 1000.0 },
          { description: "Rent", amount: 200.0 },
          { description: "Utilities", amount: 3000.0 },
          { description: "Others", amount: 500.0 },
        ]
      : activeTab === "sales"
      ? [
          { description: "Online Revenue", amount: 100.0 },
          { description: "In-store Revenue", amount: 200.0 },
          { description: "Average Revenue per customer", amount: 300.0 },
          { description: "Total VAT", amount: 400.0 },
        ]
      : [
          { description: "Online Revenue", amount: 100.0 },
          { description: "In-store Revenue", amount: 200.0 },
          { description: "Total Revenue", amount: 300.0 },
          { description: "Payroll", amount: 1000.0 },
          { description: "Rent", amount: 200.0 },
          { description: "Utilities", amount: 3000.0 },
          { description: "Others", amount: 500.0 },
          { description: "Total Expenses", amount: 4700.0 },
          { description: "Net Income", amount: -4400.0 },
        ];

  // Calculate total
  const total = data.reduce((sum, row) => sum + row.amount, 0);

  // Add total row
  data.push({ description: "Total", amount: total });

  // Convert data to CSV string
  let csvContent = "Description,Amount\n";
  csvContent += data
    .map((row) => `"${row.description}",${row.amount.toFixed(2)}`)
    .join("\n");

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a download link
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTab}_report_${month}_${year}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const addFooter = (doc, pageWidth, pageHeight, footerHeight) => {
  const footerY = pageHeight - footerHeight;
  const curveHeight = 10;

  // Draw the curved top border
  doc.setDrawColor(34, 34, 34);
  doc.setFillColor(34, 34, 34);
  doc.moveTo(0, footerY);

  // Approximate the curve with a series of lines
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * pageWidth;
    const y = footerY - Math.sin((Math.PI * i) / steps) * curveHeight;
    doc.lineTo(x, y);
  }

  doc.lineTo(pageWidth, pageHeight);
  doc.lineTo(0, pageHeight);
  doc.fill();

  // Add content to the footer if needed
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(
    "© 2024 BradeHQ. All rights reserved.",
    pageWidth / 2,
    footerY + 10,
    { align: "center" }
  );
};

export default Reports;
