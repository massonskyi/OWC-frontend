import React from 'react';
import { ThemeProvider, CssBaseline, Container, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar';
import Users from './components/users';
import ProtectedRoute from './Routing/Router';
import UserForm from './components/user_form';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Container>
            <Routes>
              <Route path="/" element={<Users />} />
              <Route path="/create-user" element={<ProtectedRoute element={<UserForm />} />} />
              <Route path="/edit-user/:id" element={<ProtectedRoute element={<UserForm />} />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
