import React from "react";

function UserMapButton({ onClick }) {
  return (
    <button onClick={onClick} style={{ marginTop: "20px" }}>
      Generate User Map
    </button>
  );
}

export default UserMapButton;
