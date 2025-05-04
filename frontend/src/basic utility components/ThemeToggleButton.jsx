/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AuthContext } from '../context/AuthContext';

const ThemeToggleButton = () => {
  const { themeDark, themeChange } = useContext(AuthContext);

  const handleClick = () => {
    themeChange();
  };

  return (
      <div>
        <IconButton
          onClick={handleClick}
          color="inherit"
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 10000,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
            },
          }}
        >
          {!themeDark ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </div>
  );
};

export default ThemeToggleButton;
