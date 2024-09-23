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
import WorkspacesIcon from '@mui/icons-material/Workspaces'; // Импортируем иконку Workspaces

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

  const handleVoid = () => {};

  return (
    <AppBar position="static" color='primary' sx={{ flexGrow: 1, background: isDarkTheme ? '#333333' : '#ffffff', padding: '0 20px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" onClick={handleVoid} component={Link} to="/" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: isDarkTheme ? '#ffffff' : '#333333' }}>
            OWC
          </Button>

          <Button color="inherit" onClick={handleVoid} component={Link} to="/about" sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
            <InfoIcon />
          </Button>

          <Button color="inherit" onClick={handleVoid} component={Link} to="/editor" sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
            <CodeIcon />
          </Button>

          <Button color="inherit" onClick={toggleTheme} sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
            {isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <SearchComponent />
              <Button color="inherit" onClick={handleVoid} component={Link} to="/workspace" sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
                <WorkspacesIcon />
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                <Avatar alt={user?.name} src={user?.avatar} component={Link} to="/profile" sx={{ marginRight: '10px' }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: isDarkTheme ? '#ffffff' : '#333333' }}>
                  Welcome, {user?.name}
                </Typography>
              </Box>

              <Button color="inherit" onClick={logout} sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
                <LogoutIcon />
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleSignInClick} sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
                Sign In
              </Button>

              <Button color="inherit" onClick={handleSignUpClick} sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;