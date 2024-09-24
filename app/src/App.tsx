import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { HomePage } from './pages/HomePage';
import { useAuth } from './context/AuthContext';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/Routing/ProtectedRoute';
import PublicRoute from './components/Routing/PublicRoute';
import AboutPage from './pages/AboutPage';
import EditorPage from './pages/EditorPage';
import SearchResults from './pages/SearchResult';
import WorkspacesPage from './pages/WorkspacesPage';
import NotFoundPage from './components/NotFoundPage';
import Loader from './components/Loader';
import AuthPage from './pages/AuthPage';
import './styles/App.css';
import UserWorkspacePage from './pages/UserWorkspacePage';
import { Toaster } from 'react-hot-toast';
const App: React.FC = () => {
    const { user } = useAuth() || {}; // Предположим, вы добавили workspaces и методы
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Toaster />
            <Header />
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/test-editor" element={<EditorPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/workspace" element={<WorkspacesPage user={user}  />} />
                    <Route path="/workspaces/:workspaceName/editor" element={<UserWorkspacePage />} />
                    <Route path="/profile" element={<UserProfile 
                        user={user} 
                    />} />

                </Route>
                <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
        </>
    );
};

export default App;
