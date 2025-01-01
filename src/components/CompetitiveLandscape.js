import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const CompetitiveLandscape = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !data.quadrants || data.quadrants.length === 0) {
      console.warn("No competitive landscape data provided.");
      return;
    }

    const ctx = canvasRef.current.getContext("2d");

    const datasets = data.quadrants.map((quadrant, index) => ({
      label: quadrant.name,
      data: [{ x: quadrant.x, y: quadrant.y }],
      backgroundColor: quadrant.color,
    }));

    const chart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw.x}, ${context.raw.y}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Price (Low to High)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Market Share (Low to High)",
            },
          },
        },
      },
    });

    return () => chart.destroy(); // Clean up
  }, [data]);

  const downloadChartAsPng = () => {
    const chartElement = canvasRef.current;
    chartElement.toBlob((blob) => {
      saveAs(blob, "competitive_landscape.png");
    });
  };

  const downloadDataAsExcel = () => {
    const excelData = data.quadrants.map((quadrant) => ({
      Name: quadrant.name,
      X: quadrant.x,
      Y: quadrant.y,
      Color: quadrant.color,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Competitive Landscape");
    XLSX.writeFile(workbook, "competitive_landscape_data.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Competitive Landscape</h3>
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

export default CompetitiveLandscape;
