import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineGraph = ({ data }) => {
  const canvasRef = useRef(null);

  console.log("LineGraph received data:", data); // Verify data here

  useEffect(() => {
    if (!data) {
      console.error("No data provided to LineGraph.");
      return;
    }

    const ctx = canvasRef.current.getContext("2d");

    // Create the line chart
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((point) => point.year),
        datasets: [
          {
            label: "Market Size (TAM)",
            data: data.map((point) => point.size),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: true,
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
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Market Size (Millions of Dollars)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Year",
            },
          },
        },
      },
    });

    return () => {
      chart.destroy(); // Clean up on component unmount
    };
  }, [data]);

  return <canvas ref={canvasRef}></canvas>;
};

export default LineGraph;
