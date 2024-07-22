import React from 'react';

const SearchBar = ({ onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Cerca per titolo o autore..."
        onChange={handleInputChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;