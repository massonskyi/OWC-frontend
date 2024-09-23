import React, { useState, FormEvent, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../api'; // Импортируем функции из API
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { TextField, Button, Box, Container, Typography, Grid } from '@mui/material';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Для переключения между входом и регистрацией
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Получаем объект location
  const { login } = useAuth();
  const { isDarkTheme } = useTheme();

  const [loginData, setLoginData] = useState({
    username: '',
    hash_password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    age: '',
    username: '',
    hash_password: '',
    avatar: null as File | null, // Изменено: avatar может быть типом File или null
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    setIsLogin(mode !== 'sign-up'); // Устанавливаем режим в зависимости от параметра 'mode'
  }, [location.search]);
  
  // Переключение между формами
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  // Обработка изменения полей для входа
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Обработка изменения полей для регистрации
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: name === 'age' ? (value ? parseInt(value, 10) : 0) : value,
    });
  };

  // Обработка изменения файла для регистрации
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setRegisterData({ ...registerData, avatar: e.target.files[0] });
    }
  };

  // Отправка формы для входа
  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await signIn(loginData);
      login(response.UserProfile, response.token);
      navigate('/'); // Перенаправление на главную страницу
    } catch (error) {
      alert('Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Отправка формы для регистрации
  const handleRegisterSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await signUp(registerData);
      login(response.user, response.token);
      navigate('/'); // Перенаправление на главную страницу после успешной регистрации
    } catch (error) {
      alert('Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" className={isDarkTheme ? 'dark-theme' : 'light-theme'}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography component="h1" variant="h5">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Typography>

        {/* Форма входа */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} style={{ width: '100%', marginTop: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="hash_password"
              label="Password"
              name="hash_password"
              type="password"
              value={loginData.hash_password}
              onChange={handleLoginChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>
        ) : (
          /* Форма регистрации */
          <form onSubmit={handleRegisterSubmit} style={{ width: '100%', marginTop: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="surname"
              label="Surname"
              name="surname"
              value={registerData.surname}
              onChange={handleRegisterChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone"
              name="phone"
              value={registerData.phone}
              onChange={handleRegisterChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="age"
              label="Age"
              name="age"
              type="number"
              value={registerData.age}
              onChange={handleRegisterChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="avatar"
              name="avatar"
              type="file"
              onChange={handleFileChange}
              InputProps={{
                style: {
                  backgroundColor: isDarkTheme ? '#333333' : '#ffffff',
                  color: isDarkTheme ? '#ffffff' : '#333333',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Sign Up'}
            </Button>
          </form>
        )}

        {/* Переключение между входом и регистрацией */}
        <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
          <Grid item>
            <Button onClick={toggleAuthMode}>
              {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AuthPage;