// frontend/src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search tasks..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Also trigger search as user types (optional - can be debounced for performance)
    // onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
        />
        <button type="submit">Search</button>
        {searchTerm && (
          <button type="button" onClick={handleClear}>Clear</button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;