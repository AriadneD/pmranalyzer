import React from "react";

const ActionableInsightsButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`bg-watermelon px-4 py-2 rounded text-white font-semibold hover:bg-white hover:text-watermelon transition ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-sky-600 hover:bg-sky-700"
      }`}
    >
      {loading ? "Generating Insights..." : "Generate Actionable Insights"}
    </button>
  );
};

export default ActionableInsightsButton;
