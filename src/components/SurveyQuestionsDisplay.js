import React from "react";

const SurveyQuestionsDisplay = ({ questions, onRegenerate, loading }) => {

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Survey Questions</h3>
      <ul className="list-disc pl-5 space-y-2">
        {questions.map((question, index) => (
          <li key={index} className="text-gray-700">
            {question}
          </li>
        ))}
      </ul>
      <button
        onClick={onRegenerate}
        disabled={loading}
        className={`mt-6 px-4 py-2 rounded font-semibold transition ${
          loading
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-watermelon text-white hover:bg-white hover:text-watermelon"
        }`}
      >
        {loading ? "Generating..." : "Generate Again"}
      </button>
    </div>
  );
};

export default SurveyQuestionsDisplay;
