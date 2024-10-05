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
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ExpensesChart = ({ expenses }) => {
  const months = expenses.map((expense) => expense.month);
  const amounts = expenses.map((expense) => expense.amount);

  const data = {
    labels: months,
    datasets: [
      {
        label: "Expenses",
        data: amounts,
        borderColor: "rgba(24, 20, 243, 1)",
        borderWidth: 3,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(45, 96, 255, 0.25)");
          gradient.addColorStop(1, "rgba(45, 96, 255, 0)");
          return gradient;
        },
        pointRadius: 0,
        tension: 0.4,
        fill: true,
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
        text: "Expenses",
        font: {
          size: 16,
          weight: "bold",
          family: "Inter, sans-serif",
        },
        color: "#222222",
        padding: {
          bottom: 20,
        },
        align: "start",
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ExpensesChart;
