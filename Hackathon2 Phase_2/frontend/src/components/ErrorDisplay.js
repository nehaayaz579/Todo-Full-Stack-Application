// frontend/src/components/ErrorDisplay.js
import React from 'react';

const ErrorDisplay = ({ error, onClose }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="error-display">
      <div className="error-content">
        <span className="error-message">{error}</span>
        {onClose && (
          <button className="close-error" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;