// components/Loader.jsx
import React from "react";
import "./Loader.css"; // optional styling

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
