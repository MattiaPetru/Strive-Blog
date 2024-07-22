import React, { useState } from 'react';

const SearchBar = (props) => {
  console.log("SearchBar props:", props); // Aggiungi questo log

  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("Search term:", value);
    console.log("onSearch type:", typeof props.onSearch); // Aggiungi questo log
    if (typeof props.onSearch === 'function') {
      props.onSearch(value);
    } else {
      console.error('onSearch is not a function', props.onSearch);
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