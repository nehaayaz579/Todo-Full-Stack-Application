// frontend/src/components/DeleteTaskButton.js
import React, { useState } from 'react';

const DeleteTaskButton = ({ onDelete, disabled = false }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => {
    if (showConfirmation) {
      // Actually perform the delete
      onDelete();
      setShowConfirmation(false);
    } else {
      // Show confirmation
      setShowConfirmation(true);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <div className="delete-confirmation">
        <span>Are you sure?</span>
        <button onClick={handleDeleteClick} className="confirm-delete">Yes</button>
        <button onClick={handleCancel} className="cancel-delete">No</button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleDeleteClick} 
      disabled={disabled}
      className="delete-button"
    >
      Delete
    </button>
  );
};

export default DeleteTaskButton;