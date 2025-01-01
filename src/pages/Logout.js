import React from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleHomeRedirect = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4">
        <button
          onClick={handleHomeRedirect}
          className="text-sky-600 hover:text-sky-800 font-semibold"
        >
          &larr; Back to Home
        </button>
      </div>

      {/* Logout Content */}
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">You’ve logged out!</h1>
        <p className="text-gray-600 mb-6">Want to log back in?</p>
        <button
          onClick={handleLoginRedirect}
          className="px-6 py-2 bg-sky text-white font-semibold rounded-lg shadow-md hover:bg-lightsky transition"
        >
          Log back in
        </button>
      </div>
    </div>
  );
}

export default Logout;
