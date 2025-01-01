import React from "react";

const UserPersonas = ({ personas }) => {
  return (
    <div className="user-personas-container mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">User Personas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona, index) => (
          <div
            key={index}
            className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <h4 className="text-lg font-semibold text-sky-700 mb-2">
              {persona.name}
            </h4>
            <div>
              <strong>Demographics:</strong> <p>{persona.persona.Demographics}</p>
            </div>
            <div>
              <strong>Background:</strong> <p>{persona.persona.Background}</p>
            </div>
            <div>
              <strong>Goals:</strong> <p>{persona.persona.Goals}</p>
            </div>
            <div>
              <strong>Challenges:</strong> <p>{persona.persona.Challenges}</p>
            </div>
            <div>
              <strong>Behaviors:</strong> <p>{persona.persona.Behaviors}</p>
            </div>
            <div>
              <strong>Motivations:</strong> <p>{persona.persona.Motivations}</p>
            </div>
            <div>
              <strong>Psychographics:</strong> <p>{persona.persona.Psychographics}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPersonas;
