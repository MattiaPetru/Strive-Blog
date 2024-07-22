import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (typeof onSearch === 'function') {
      onSearch(value);
    } else {
      console.error('onSearch is not a function');
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Cerca per titolo o autore..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;