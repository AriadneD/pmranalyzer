import React from "react";

const GenerateInfographicButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`bg-watermelon px-4 py-2 rounded text-white font-semibold hover:bg-white hover:text-watermelon transition ${
        loading ? "bg-gray-400 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Generating Infographic..." : "Generate Infographic"}
    </button>
  );
};

export default GenerateInfographicButton;
