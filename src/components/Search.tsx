import { TextField } from '@mui/material';
import React, { useState } from 'react';

import { Box } from '@mui/material';

interface SearchProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  setSearchQuery: (value: string) => void;
  resetSearch: () => void;
}

const Search = ({
  searchQuery,
  onSearch,
  setSearchQuery,
  resetSearch,
}: SearchProps): JSX.Element => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value === '') {
      resetSearch();
    }
  };

  const handleSearch = (): void => {
    if (!searchQuery.trim()) {
      resetSearch();
      return;
    }
    onSearch(searchQuery.trim());
  };

  return (
    <Box>
      <TextField
        sx={{
          backgroundColor: 'white',
          borderRadius: '5px',
          '& .MuiInputBase-root': {
            height: '36px', // Устанавливаем высоту самого поля
          },
          '& .MuiInputLabel-root': {
            transform: 'translate(14px, 7px) scale(1)', // Лейбл ниже
          },
          '& .MuiInputLabel-shrink': {
            transform: 'translate(14px, -4px) scale(0.75)', // Лейбл при фокусе
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '5px', // Радиус границы
          },
        }}
        label='Поиск'
        variant='outlined'
        type='search'
        placeholder='Введите задачу...'
        value={searchQuery}
        onChange={handleInputChange}
        onInput={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
    </Box>
  );
};

export default Search;
