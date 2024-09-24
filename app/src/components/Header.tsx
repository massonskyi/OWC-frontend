import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Drawer, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import SearchComponent from './SearchComponent';
import { useTheme } from '../context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import SettingsIcon from '@mui/icons-material/Settings';
import { SelectChangeEvent } from '@mui/material';
import { SpaceBar } from '@mui/icons-material';
  
const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme, isDarkTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSize + 'px');
    document.documentElement.style.setProperty('--font-family', fontFamily);
  }, [fontSize, fontFamily]);

  const handleSignInClick = () => {
    navigate('/auth?mode=sign-in');
  };

  const handleSignUpClick = () => {
    navigate('/auth?mode=sign-up');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(event.target.value);
    document.documentElement.style.setProperty('--font-size', event.target.value + 'px');
  };


  const handleFontFamilyChange = (event: SelectChangeEvent<string>) => {
    setFontFamily(event.target.value as string);
    document.documentElement.style.setProperty('--font-family', event.target.value as string);
  };

  return (
    <AppBar position="static" color='primary' sx={{ flexGrow: 1, background: isDarkTheme ? '#333333' : '#ffffff', padding: '0 20px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="settings" onClick={toggleDrawer}>
            <SettingsIcon />
          </IconButton>
          <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: isDarkTheme ? '#ffffff' : '#333333' }}>
            OWC
          </Button>

          <Button color="inherit"  component={Link} to="/about" sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
            <InfoIcon />
          </Button>

          <Button color="inherit" component={Link} to="/test-editor" sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
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
              <Button color="inherit"  component={Link} to="/workspace" sx={{ marginLeft: '10px', color: isDarkTheme ? '#ffffff' : '#333333' }}>
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
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6">Настройки шрифта</Typography>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id="font-family-label">Шрифт</InputLabel>
            <Select
              labelId="font-family-label"
              id="font-family"
              value={fontFamily}
              label="Шрифт"
              onChange={handleFontFamilyChange}
            >
              <MenuItem value="Arial">Arial</MenuItem>
              <MenuItem value="Courier New">Courier New</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              <MenuItem value="Verdana">Verdana</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel htmlFor="font-size">Размер шрифта</InputLabel>
            <input
              id="font-size"
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
              style={{ width: '100%', marginTop: '10px' }}
            />
          </FormControl>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;