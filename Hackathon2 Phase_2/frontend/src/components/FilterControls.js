// frontend/src/components/FilterControls.js
import React from 'react';

const FilterControls = ({ 
  onFilterChange, 
  currentFilters,
  availableTags 
}) => {
  const handlePriorityChange = (e) => {
    const priority = e.target.value || null;
    onFilterChange({ ...currentFilters, priority });
  };

  const handleCompletionChange = (e) => {
    const completedValue = e.target.value;
    let completed = null;
    if (completedValue === 'true') completed = true;
    if (completedValue === 'false') completed = false;
    
    onFilterChange({ ...currentFilters, completed });
  };

  const handleTagChange = (e) => {
    const tag = e.target.value || null;
    onFilterChange({ ...currentFilters, tag });
  };

  return (
    <div className="filter-controls">
      <h4>Filters</h4>
      
      <div className="filter-group">
        <label htmlFor="priority-filter">Priority:</label>
        <select 
          id="priority-filter"
          value={currentFilters.priority || ''}
          onChange={handlePriorityChange}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="completion-filter">Completion:</label>
        <select 
          id="completion-filter"
          value={currentFilters.completed === null ? '' : currentFilters.completed.toString()}
          onChange={handleCompletionChange}
        >
          <option value="">All Statuses</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="tag-filter">Tag:</label>
        <select 
          id="tag-filter"
          value={currentFilters.tag || ''}
          onChange={handleTagChange}
        >
          <option value="">All Tags</option>
          {availableTags.map((tag, index) => (
            <option key={index} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;