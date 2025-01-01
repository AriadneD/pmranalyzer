import React from "react";
import html2pdf from "html2pdf.js";
import Timeline from "./Timeline";
import RiskMatrix from "./RiskMatrix";
import Chart from "chart.js/auto";
import CompetitiveLandscape from "./CompetitiveLandscape";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const InfographicDisplay = ({ data, onRegenerate }) => {
  const canvasRef = React.useRef(null);
  const exportRef = React.useRef(null); // Reference for PDF export

  React.useEffect(() => {
    if (!data.marketTrends || data.marketTrends.length === 0) {
      console.warn("No marketTrends data provided.");
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.marketTrends.map((item) => item.year), // Years as labels
        datasets: [
          {
            label: "Market Size",
            data: data.marketTrends.map((item) => item.size), // Market sizes
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
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
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Year",
            },
          },
          y: {
            title: {
              display: true,
              text: "Market Size",
            },
          },
        },
      },
    });

    return () => {
      chart.destroy(); // Clean up chart instance when the component unmounts
    };
  }, [data.marketTrends]);

  const exportToPDF = () => {
    if (!exportRef.current) {
      console.error("Export reference is not set");
      return;
    }

    const opt = {
      margin: 0.5, // inches
      filename: `${data.title}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    // Call html2pdf
    html2pdf().set(opt).from(exportRef.current).save();
  };

  const downloadChartAsPng = () => {
    const chartElement = canvasRef.current;
    chartElement.toBlob((blob) => {
      saveAs(blob, "line_graph.png");
    });
  };

  const downloadDataAsExcel = () => {
    const excelData = data.marketTrends.map((item) => ({
      Year: item.year,
      "Market Size (Millions)": item.size,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Market Trends");
    XLSX.writeFile(workbook, "market_trends_data.xlsx");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg" ref={exportRef}>
      {/* Title and Subtitle */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{data.title}</h2>
      <p className="text-lg text-gray-600 mb-6">{data.subtitle}</p>

      {/* Key Trends */}
      <div className="mb-8 exportable-section">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Trends</h3>
        {/* Line Chart */}
        <canvas ref={canvasRef}></canvas>
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

        {/* Trend Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {data.trendCards && data.trendCards.length > 0 ? (
            data.trendCards.map((card, index) => (
              <div key={index} className="p-4 bg-sky-100 rounded shadow">
                <i className={`fa-solid ${card.icon} text-sky-600 text-3xl mb-2`} />
                <h4 className="font-bold text-gray-800">{card.title}</h4>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No trend cards available.</p>
          )}
        </div>
      </div>

      {/* Opportunities */}
      <div className="mb-8 exportable-section">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Opportunities</h3>
        <Timeline milestones={data.milestones} />
      </div>

      {/* Challenges or Threats */}
      <div className="mb-8 exportable-section">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Challenges or Threats</h3>
        <RiskMatrix risks={data.risks} />
      </div>

      {/* Competitive Landscape */}
      {data.competitiveLandscape && (
        <div className="mb-8 exportable-section page-break">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Competitive Landscape</h3>
          <CompetitiveLandscape data={data.competitiveLandscape} />
        </div>
      )}

      {/* Buttons */}
      <div className="flex mt-6">
        <button
          onClick={exportToPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition mr-4"
        >
          Export as PDF
        </button>
        <button
          onClick={onRegenerate}
          className="bg-watermelon text-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-watermelon transition"
        >
          Generate Again
        </button>
      </div>
    </div>
  );
};

export default InfographicDisplay;
