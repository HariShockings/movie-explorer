import React, { useState, useContext } from 'react';
import { Autocomplete, TextField, Button, Box } from '@mui/material';
import { MovieContext } from '../../context/MovieContext';

function SearchBar({ onSearch }) {
  const { lastSearches, setLastSearch } = useContext(MovieContext);
  const [query, setQuery] = useState('');

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setLastSearch(searchQuery); // Update context with new search
      setQuery(''); // Clear input after search
    }
  };

  const handleSelect = (event, newValue) => {
    if (newValue) {
      setQuery(newValue);
      handleSearch(newValue); // Trigger search on selection
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
      <Autocomplete
        freeSolo
        options={lastSearches}
        inputValue={query}
        onInputChange={(event, newInputValue) => setQuery(newInputValue)}
        onChange={handleSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Search Movies"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '4px',
              },
            }}
          />
        )}
        sx={{ flex: 1 }}
        ListboxProps={{
          sx: {
            maxHeight: '200px',
            '& .MuiAutocomplete-option': {
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: '#e50914', // Netflix-like red
                color: '#fff',
              },
            },
          },
        }}
      />
      <Button
        variant="contained"
        onClick={() => handleSearch()}
        sx={{
          backgroundColor: '#e50914',
          '&:hover': {
            backgroundColor: '#b20710',
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
}

export default SearchBar;