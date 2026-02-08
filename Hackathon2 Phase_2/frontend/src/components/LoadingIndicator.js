// frontend/src/components/LoadingIndicator.js
import React from 'react';

const LoadingIndicator = ({ message = "Loading...", show = true }) => {
  if (!show) return null;

  return (
    <div className="loading-indicator">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingIndicator;