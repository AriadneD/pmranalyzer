import React from "react";

const Popup = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-4xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {/* Custom Scrollbar */}
        <div className="scroll-container">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
