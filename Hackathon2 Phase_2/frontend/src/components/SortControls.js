// frontend/src/components/SortControls.js
import React from 'react';

const SortControls = ({ onSortChange, currentSort, currentOrder }) => {
  const handleSortFieldChange = (e) => {
    const sortField = e.target.value;
    onSortChange(sortField, currentOrder);
  };

  const handleSortOrderChange = (e) => {
    const sortOrder = e.target.value;
    onSortChange(currentSort, sortOrder);
  };

  return (
    <div className="sort-controls">
      <h4>Sort By</h4>
      
      <div className="sort-group">
        <label htmlFor="sort-field">Field:</label>
        <select 
          id="sort-field"
          value={currentSort}
          onChange={handleSortFieldChange}
        >
          <option value="created_at">Creation Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      
      <div className="sort-group">
        <label htmlFor="sort-order">Order:</label>
        <select 
          id="sort-order"
          value={currentOrder}
          onChange={handleSortOrderChange}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default SortControls;