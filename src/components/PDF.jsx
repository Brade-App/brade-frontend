const generatePDF = (
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
  const titleText = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  doc.text(titleText, pageWidth - 18, 25, { align: "right" });

  // Reset text color for the rest of the document
  doc.setTextColor(0, 0, 0);

  // Add content
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Report to`, 15, 55);
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`${streetAddress ?? "123 Business Street"}`, 15, 61);
  doc.text(
    `${city ?? "City"}, ${state ?? "State"}, ${postalCode ?? "12345"}`,
    15,
    66
  );

  doc.setTextColor(0, 0, 0);
  const amount = pageWidth - 18;
  doc.text(`Period`, amount - 30, 61, { align: "right" });
  doc.setTextColor(80, 80, 80);
  doc.text(`${month}`, amount, 61, { align: "right" });

  // Add table
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");

  const startY = 80;
  const headers = ["Description", "Amount"];
  const data =
    activeTab === "expense"
      ? [
          {
            description: "Payroll",
            amount: "£1000.00",
            subtext: "",
          },
          {
            description: "Rent",
            amount: "£200.00",
            subtext: "",
          },
          {
            description: "Utilities",
            amount: "£3000.00",
            subtext: "",
          },
          {
            description: "Others",
            amount: "£500.00",
            subtext: "",
          },
        ]
      : [
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
        ];

  // Table headers
  headers.forEach((header, i) => {
    doc.text(header, i === 0 ? 15 : pageWidth - 35, startY + 10);
  });
  doc.setDrawColor(230, 230, 230);
  doc.line(10, startY + 15, pageWidth - 10, startY + 15);

  // Table rows
  doc.setFont("helvetica", "normal");
  let y = startY + 25;
  data.forEach((row, i) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(row.description, 15, y);
    doc.text(row.amount, pageWidth - 35, y);

    // Add subtext
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(row.subtext, 15, y + 5);

    if (i < data.length - 1) {
      // Don't draw line after the last row
      doc.line(10, y + 15, pageWidth - 10, y + 15);
    }
    y += 25; // Increased spacing between rows
  });

  // Calculate total
  const total = data.reduce(
    (sum, row) => sum + parseFloat(row.amount.replace("£", "")),
    0
  );

  // Add total text
  const lastRowY = y - 25;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const amountX = pageWidth - 17.5;
  const totalY = lastRowY + 20; // Adjust this value as needed
  doc.text("Total", amountX - 20, totalY, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(`£${total.toFixed(2)}`, amountX, totalY, { align: "right" });

  // Add footer
  const footerHeight = 20;
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

  // Generate PDF as Blob
  const pdfBlob = doc.output("blob");

  // Create a URL for the Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Open PDF in a new tab
  window.open(pdfUrl, "_blank");
};
