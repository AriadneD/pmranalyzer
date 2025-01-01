import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Register components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ActionableInsightsGraph = ({ painPoints }) => {
  const chartRef = useRef(null); // Ref to hold the Chart.js instance
  const canvasRef = useRef(null); // Ref for the canvas element

  useEffect(() => {
    if (!painPoints || painPoints.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");

    // Destroy existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new chart instance
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: painPoints.map((point) => point.name),
        datasets: [
          {
            label: "Pain Points",
            data: painPoints.map((point) => point.percentage),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });

    // Save the chart instance
    chartRef.current = chart;

    return () => {
      // Clean up the chart instance on component unmount
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [painPoints]);

  const downloadChartAsPng = () => {
    const chartElement = canvasRef.current;
    chartElement.toBlob((blob) => {
      saveAs(blob, "chart.png");
    });
  };

  const downloadDataAsExcel = () => {
    const data = painPoints.map((point) => ({
      Name: point.name,
      Percentage: point.percentage,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pain Points");
    XLSX.writeFile(workbook, "pain_points_data.xlsx");
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4">Your Users' Top 5 Pain Points</h2>
      <canvas ref={canvasRef} />
      <div className="mt-4 flex space-x-4">
        <button
          onClick={downloadChartAsPng}
          className="bg-sky text-white px-4 py-2 rounded hover:bg-lightsky transition"
        >
          Download Chart as PNG
        </button>
        <button
          onClick={downloadDataAsExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Download Data as Excel
        </button>
      </div>
    </div>
  );
};

export default ActionableInsightsGraph;
