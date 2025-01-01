import React from "react";

const RiskMatrix = ({ risks }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2 bg-sky-100">Risk</th>
          <th className="border border-gray-300 px-4 py-2 bg-sky-100">Likelihood</th>
          <th className="border border-gray-300 px-4 py-2 bg-sky-100">Impact</th>
        </tr>
      </thead>
      <tbody>
        {risks.map((risk, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{risk.title}</td>
            <td className="border border-gray-300 px-4 py-2">{risk.likelihood}</td>
            <td className="border border-gray-300 px-4 py-2">{risk.impact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RiskMatrix;
