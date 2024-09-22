import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton, Collapse } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const SearchComponent: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        const inputElement = document.querySelector('input');
        if (inputElement) {
          inputElement.focus();
        }
      }, 300);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
      <Collapse in={isExpanded}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: '8px' }}
        />
      </Collapse>
      <IconButton
        type="button"
        onClick={handleToggle}
        color="primary"
        style={{ marginRight: '8px' }}
      >
        {isExpanded ? <CloseIcon /> : <SearchIcon />}
      </IconButton>
    </form>
  );
};

export default SearchComponent;
