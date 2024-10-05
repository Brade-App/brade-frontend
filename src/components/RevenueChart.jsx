import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ revenues }) => {
  const months = revenues.map((revenue) => revenue.month);
  const amounts = revenues.map((revenue) => revenue.amount);

  const data = {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: amounts,
        borderColor: "#EDA10D",
        backgroundColor: "#EDA10D",
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#EDA10D",
        pointBorderWidth: 3,
        pointRadius: 6,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#222222",
          font: {
            family: "Inter, sans-serif",
            size: 13,
            weight: 400,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `£${value.toLocaleString()}`,
          color: "#222222",
          font: {
            family: "Inter, sans-serif",
            size: 13,
            weight: 400,
          },
        },
        grid: {
          color: "#DFE5EE",
          lineWidth: 1,
          borderDash: [5, 5],
        },
        border: {
          display: false,
          dash: [5, 5],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Revenue",
        font: {
          size: 16,
          weight: "bold",
          family: "Inter, sans-serif",
        },
        color: "#222222",
        padding: {
          bottom: 20,
        },
        align: "start", // This aligns the title to the left
      },
    },
    layout: {
      padding: {
        left: 10, // Add some left padding to prevent the title from touching the edge
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default RevenueChart;
