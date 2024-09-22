import React, { StrictMode } from 'react';  // Убедитесь, что StrictMode импортирован
import { Container, Typography, Box, Grid, Paper, Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme, Theme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TSPR from '../components/BackgroundParticles';  // Импортируем TSPR компонент

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a',
    },
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920, // Ensure 'xl' is defined
    },
  },

});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
    background: 'linear-gradient(to right, #4C4F5727, #1e3a8a)',
    color: '#fff',
    position:'relative',
    minHeight: '100vh',
    zIndex:100,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(8),
    zIndex:100,
  },
  section: {
    marginBottom: theme.spacing(4),
    zIndex:100,
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
    zIndex:100,
  },
  paper: {
    padding: theme.spacing(4),
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.spacing(2),
    zIndex:100,
  },
}));

const AboutPage: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
    <StrictMode>
    <TSPR />
    </StrictMode>
    <Container className={classes.root} maxWidth="xl">

      <Typography variant="h2" className={classes.title} align="center">
        About Us
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper} elevation={6}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1">
              Our mission is to provide the best online text editor experience for developers around the world. We strive to make coding accessible and enjoyable for everyone, regardless of their skill level.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper} elevation={6}>
            <Typography variant="h4" gutterBottom>
              Our Team
            </Typography>
            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
              <Avatar alt="massonskyi" src="/path/to/avatar.jpg" className={classes.avatar} />
              <Box ml={isMobile ? 0 : 4}>
                <Typography variant="h5">massonskyi</Typography>
                <Typography variant="body1">Founder & CEO</Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center" mt={4}>
              <Avatar alt="massonskyi" src="/path/to/avatar.jpg" className={classes.avatar} />
              <Box ml={isMobile ? 0 : 4}>
                <Typography variant="h5">massonskyi</Typography>
                <Typography variant="body1">Lead Developer</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={6}>
            <Typography variant="h4" gutterBottom>
              Our Vision
            </Typography>
            <Typography variant="body1">
              Our vision is to create a future where coding is as intuitive and natural as writing. We believe that everyone should have the opportunity to learn and create with code, and we are dedicated to building the tools and resources to make that possible.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AboutPage />
    </ThemeProvider>
  );
};

export default App;
