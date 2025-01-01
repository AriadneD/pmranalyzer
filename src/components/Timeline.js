import React from "react";

const Timeline = ({ milestones }) => {
  return (
    <div className="border-l-4 border-sky-600 pl-4 space-y-4">
      {milestones.map((milestone, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-2 top-0 w-4 h-4 bg-sky-600 rounded-full"></div>
          <p className="text-gray-800 font-bold">{milestone.title}</p>
          <p className="text-gray-600">{milestone.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
