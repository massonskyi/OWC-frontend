import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorProvider } from './context/ErrorContext';
import App from './App';

const Root: React.FC = () => {
    return (
        <ErrorProvider>
            <ThemeProvider>
                <AuthProvider>
                    <Router>
                        <App />
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </ErrorProvider>
    );
};

export default Root;
