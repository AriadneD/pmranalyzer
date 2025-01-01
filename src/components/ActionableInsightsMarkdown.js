import React from "react";

const ActionableInsightsMarkdown = ({ suggestions }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2 className="text-lg font-bold mb-4">Actionable Insights: Features/Products You Can Build to Address Pain Points</h2>
      {suggestions.map((item, index) => (
        <div key={index} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>{item.name}</h3>
          <p>
            <strong>Description:</strong> {item.description}
          </p>
          <p>
            <strong>Problem it addresses:</strong> {item.problem}
          </p>
          <p>
            <strong>Market trends to consider:</strong> {item.marketTrends}
          </p>
          <p>
            <strong>Prototype:</strong> {item.prototype}
          </p>
          <p>
            <strong>Tech stack:</strong> {item.techStack}
          </p>
          <p>
            <strong>Validation:</strong> {item.validation}
          </p>
          <p>
            <strong>Competitors:</strong> {item.competitors}
          </p>
          <p>
            <strong>Pricing:</strong> {item.pricing}
          </p>
          <p>
            <strong>Go-to-market strategy:</strong> {item.goToMarket}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ActionableInsightsMarkdown;
