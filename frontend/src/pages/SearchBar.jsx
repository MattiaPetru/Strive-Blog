import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Cerca per titolo o autore..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
      <button type="submit" className="search-button">Cerca</button>
    </form>
  );
};

export default SearchBar;