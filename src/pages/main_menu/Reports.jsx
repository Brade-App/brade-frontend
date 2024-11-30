import React, { useState, useEffect } from "react";
import axios from "axios";
import BradeBot from "../../components/BradeBot";
import jsPDF from "jspdf";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userDetails, setUserDetails] = useState({
    businessAddress: "",
    city: "",
    state: "",
    postcode: "",
  });
  const [allExpenses, setAllExpenses] = useState([]);
  const [allSales, setAllSales] = useState([]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 1024;

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
    const monthDate = new Date(currentYear, month - 1, 1);
    const monthName = monthDate.toLocaleString("default", { month: "long" });

    try {
      const expenses = await fetchMonthlyExpenses(month, currentYear);
      const sales = await fetchMonthlySales(month, currentYear);

      generatePDFContent(
        monthName,
        userDetails.businessAddress,
        userDetails.state,
        userDetails.country,
        userDetails.postcode,
        activeTab,
        expenses,
        sales,
        isMobile
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const downloadCSV = async (month, activeTab) => {
    const monthDate = new Date(currentYear, month - 1, 1);
    const monthName = monthDate.toLocaleString("default", { month: "long" });
    const yearString = monthDate.getFullYear().toString();

    try {
      const expenses = await fetchMonthlyExpenses(month, currentYear);
      const sales = await fetchMonthlySales(month, currentYear);

      generateCSVContent(monthName, yearString, activeTab, expenses, sales);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
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
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const fetchMonthlyExpenses = async (month, year) => {
    try {
      const userId = localStorage.getItem("id");
      const response = await axios.post(
        `/api/database/get-expenses-for-month/${userId}`,
        {
          month: month,
          year: year,
        }
      );
      return response.data.expenses;
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
      return [];
    }
  };

  const fetchMonthlySales = async (month, year) => {
    try {
      const userId = localStorage.getItem("id");
      const response = await axios.post(
        `/api/database/get-sales-for-month/${userId}`,
        {
          month: month,
          year: year,
        }
      );
      return response.data.sales;
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
      return [];
    }
  };

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      const response = await axios.get(
        `/api/database/get-user-details/${userId}`
      );
      setUserDetails({
        businessAddress: response.data.business_address,
        country: response.data.country,
        state: response.data.state,
        postcode: response.data.postcode,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchAllExpenses = async () => {
    try {
      const userId = localStorage.getItem("id");
      const response = await axios.get(
        `/api/database/get-all-expenses/${userId}`
      );
      setAllExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching all expenses:", error);
      setAllExpenses([]);
    }
  };

  const fetchAllSales = async () => {
    try {
      const userId = localStorage.getItem("id");
      const response = await axios.get(`/api/database/get-all-sales/${userId}`);
      setAllSales(response.data.sales);
    } catch (error) {
      console.error("Error fetching all sales:", error);
      setAllSales([]);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchAllExpenses();
    fetchAllSales();
  }, []);

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
            .slice(0, currentMonth)
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
                    onClick={() => generatePDF(currentMonth - index, activeTab)}
                  >
                    View PDF
                  </button>
                  <button
                    style={actionButtonStyle}
                    onClick={() => downloadCSV(currentMonth - index, activeTab)}
                  >
                    Download CSV
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        <BradeBot
          expenses={allExpenses}
          revenues={allSales}
          report={true}
          isMobile={isMobile}
        />
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
  activeTab,
  monthlyExpenses,
  monthlySales,
  isMobile
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
    activeTab,
    monthlyExpenses
  ) => {
    // Add dark header
    doc.setFillColor(34, 34, 34);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Add white logo
    doc.addImage("/images/logowhite.png", "PNG", 15, 10, 30, 7);

    // Add company information in white text

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("Email: hello@bradehq.com", 15, 23);
    /*
    doc.text("Phone: +1 234 567 8900", 15, 28);
    doc.text("123 Business Street, City, Country", 15, 33);
    */

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
    return 40; // Return a new starting y-position for content on the new page
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
  const data = getDataForActiveTab(activeTab, monthlyExpenses, monthlySales);

  // Table headers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  if (activeTab !== "income") {
    headers.forEach((header, i) => {
      doc.text(header, i === 0 ? 15 : pageWidth - 35, startY + 10);
    });
    doc.setDrawColor(230, 230, 230);
    doc.line(10, startY + 15, pageWidth - 10, startY + 15);
  }

  // Table rows
  doc.setFont("helvetica", "normal");
  let y = activeTab === "income" ? startY + 5 : startY + 25;

  data.forEach((row, i) => {
    if (y > maxY) {
      y = addNewPage();
    }

    if (row.isHeader) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(row.description, 15, y);
      if (activeTab === "income") {
        y += 10;
        headers.forEach((header, i) => {
          doc.text(header, i === 0 ? 15 : pageWidth - 35, y);
        });
        y -= 5;
      }
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      if (row.subtext) {
        if (y + 5 > maxY) {
          y = addNewPage();
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

      doc.text(row.description, 15, y);
      doc.text(row.amount, pageWidth - 35, y);

      if (row.isTotal || row.isNetIncome) {
        doc.setDrawColor(0, 0, 0);
        doc.line(10, y - 10, pageWidth - 10, y - 10);
      }
    }

    // Draw a line after every row, including the last one
    if (!row.isHeader) {
      doc.setDrawColor(230, 230, 230);
    } else {
      doc.setDrawColor(0, 0, 0);
    }
    if (!row.isTotal && !row.isNetIncome) {
      doc.line(10, y + 10, pageWidth - 10, y + 10);
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
  const pdfUrl = URL.createObjectURL(pdfBlob);

  try {
    if (isMobile) {
      // For mobile devices, use a more reliable download method
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = pdfUrl;
      link.download = `${activeTab}_report_${month}.pdf`;

      // Cleanup function
      const cleanup = () => {
        try {
          document.body.removeChild(link);
          URL.revokeObjectURL(pdfUrl);
        } catch (e) {
          console.warn("Cleanup error:", e);
        }
      };

      // Add to DOM
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Clean up after a short delay
      setTimeout(cleanup, 1000);
    } else {
      // Desktop behavior remains the same
      const newWindow = window.open(pdfUrl, "_blank");
      if (newWindow) {
        newWindow.onbeforeunload = () => {
          URL.revokeObjectURL(pdfUrl);
        };
      }
    }
  } catch (error) {
    console.error("PDF generation error:", error);
    // Ensure URL is always cleaned up even if there's an error
    setTimeout(() => {
      try {
        URL.revokeObjectURL(pdfUrl);
      } catch (e) {
        console.warn("URL cleanup error:", e);
      }
    }, 1000);
  }
};

const getDataForActiveTab = (activeTab, monthlyExpenses, monthlySales) => {
  if (activeTab === "expense") {
    return monthlyExpenses.map((expense) => ({
      description: expense.description,
      amount: `£${expense.amount.toFixed(2)}`,
      subtext: "",
    }));
  } else if (activeTab === "sales") {
    return monthlySales.map((sale) => ({
      description: sale.description,
      amount: `£${sale.amount.toFixed(2)}`,
      subtext: sale.subtext || "",
    }));
  } else {
    // Income statement
    const expenses = monthlyExpenses.map((expense) => ({
      description: expense.description,
      amount: `£${expense.amount.toFixed(2)}`,
      subtext: "",
    }));

    const totalRevenue = monthlySales.reduce(
      (sum, sale) => sum + sale.amount,
      0
    );
    const totalExpenses = monthlyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return [
      { description: "Revenue", amount: "", isHeader: true },
      ...monthlySales.map((sale) => ({
        description: sale.description,
        amount: `£${sale.amount.toFixed(2)}`,
        subtext: sale.subtext || "",
      })),
      {
        description: "Total Revenue",
        amount: `£${totalRevenue.toFixed(2)}`,
        isTotal: true,
      },
      { description: "Expenses", amount: "", isHeader: true },
      ...expenses,
      {
        description: "Total Expenses",
        amount: `£${totalExpenses.toFixed(2)}`,
        isTotal: true,
      },
      {
        description: "Net Income",
        amount: `£${(totalRevenue - totalExpenses).toFixed(2)}`,
        isNetIncome: true,
      },
    ];
  }
};

const generateCSVContent = (
  month,
  year,
  activeTab,
  monthlyExpenses,
  monthlySales
) => {
  const data = getDataForActiveTab(activeTab, monthlyExpenses, monthlySales);

  // Convert data to CSV string
  let csvContent = "Description,Amount\n";

  data.forEach((row) => {
    if (row.isHeader) {
      csvContent += `${row.description},,\n`;
    } else {
      csvContent += `"${row.description}",${row.amount}\n`;
    }
    if (row.subtext) {
      csvContent += `"${row.subtext}",,\n`;
    }
  });

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
