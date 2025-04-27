import React, { useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  
  // Use useRef to ensure the alert is shown only once
  const hasAlerted = useRef(false);

  if (!token) {
    if (!hasAlerted.current) {
      alert("Please Log In First");
      hasAlerted.current = true; // Prevents alert from showing again
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return element;
};

export default ProtectedRoute;
