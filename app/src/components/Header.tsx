import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import SearchComponent from './SearchComponent';
import { useTheme } from '../context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import WorkspacesPage from '../pages/WorkspacesPage';
const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme, isDarkTheme } = useTheme();

  const handleSignInClick = () => {
    navigate('/auth?mode=sign-in'); // Передаем параметр 'sign-in'
  };

  const handleSignUpClick = () => {
    navigate('/auth?mode=sign-up'); // Передаем параметр 'sign-up'
  };
  const handleVoid = () =>{}
  return (
    <AppBar position="static" color='primary' sx={{ flexGrow: 1, background: '#53395AFF' }}>
      <Toolbar>
        <Button color="inherit" onClick={handleVoid} component={Link} to="/">
            OWC
        </Button>

        <Button color="inherit" onClick={handleVoid} component={Link} to="/about">
          <InfoIcon />
        </Button>

        <Button color="inherit" onClick={handleVoid} component={Link} to="/editor">
            <CodeIcon />
        </Button>

        <Button color="inherit" onClick={toggleTheme}>
          {isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />}
        </Button>
        

        <Box sx={{ flexGrow: 1 }} /> {/* Пустой элемент для создания пространства */}
        
        {isAuthenticated ? (
          <>

            <SearchComponent /> <SearchIcon/>

            <Box sx={{ flexGrow: 1 }} /> {/* Пустой элемент для создания пространства */}

            <Button color="inherit" onClick={handleVoid} component={Link} to="/workspace">
              <WorkspacesPage />
            </Button>


            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Avatar alt={user?.name} src={user?.avatar} component={Link} to="/profile" />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Welcome, {user?.name}
              </Typography>
            </Box>

            <Button color="inherit" onClick={logout}>
              <LogoutIcon />
            </Button>

          </>
        ) : (
          <>
            <Button color="inherit" onClick={handleSignInClick}>
              Sign In
            </Button>

            <Button color="inherit" onClick={handleSignUpClick}>
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
