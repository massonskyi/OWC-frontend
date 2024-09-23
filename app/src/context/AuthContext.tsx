import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserProfile, createWorkspace } from '../api';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';

interface AuthContextType {
  user: any;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  currentUserId: number | null;
  workspaces: Array<{ id: number; name: string; description: string }>;
  fetchUserWorkspaces: () => void;
  addWorkspace: (workspace: { name: string; description: string; is_public: boolean; is_active: boolean }) => void;
  deleteWorkspace: (workspaceId: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [workspaces, setWorkspaces] = useState<Array<{ id: number; name: string; description: string, is_active: boolean, is_public: boolean}>>([]);
  const [isLoading, setIsLoading] = useState(true); // Состояние для отслеживания загрузки

  const login = (userData: any, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('access_token', token);
    fetchUserProfile();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token from localStorage:', token); // Логирование токена
      if (token && token.split('.').length === 3) {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded token:', decodedToken); // Логирование декодированного токена
        const userId = Number(decodedToken.sub);
        if (userId) {
          const userData = await getUserProfile(userId);
          userData.avatar = `data:image/jpeg;base64,${userData.avatar}`
          setUser(userData);
          setCurrentUserId(userId);
          setIsAuthenticated(true);
          setIsLoading(false); // Устанавливаем isLoading в false после загрузки данных
        } else {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      toast.error('Ошибка при загрузке профиля пользователя');
    }
  };

  const fetchUserWorkspaces = () => {
    // Implement the logic to fetch user workspaces
  };

  const addWorkspace = async (workspace: { name: string; description: string; is_public: boolean; is_active: boolean; }) => {
    try {
      const newWorkspace = await createWorkspace(workspace);
      setWorkspaces([...workspaces, newWorkspace]);
      toast.success('Воркспейс успешно создан');
    } catch (error: any) {
      console.error('Error adding workspace:', error);
      if (error.response && error.response.status === 422) {
        console.error('Validation Error:', error.response.data.detail);
        toast.error('Ошибка валидации: ' + JSON.stringify(error.response.data.detail));
      } else {
        toast.error('Ошибка при создании воркспейса');
      }
    }
  };

  const deleteWorkspace = (workspaceId: number) => {
    setWorkspaces(workspaces.filter(workspace => workspace.id !== workspaceId));
    toast.success('Воркспейс успешно удален');
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <Loader />; // Отображаем Loader, пока данные загружаются
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      currentUserId, 
      workspaces, 
      fetchUserWorkspaces, 
      addWorkspace, 
      deleteWorkspace 
    }}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};