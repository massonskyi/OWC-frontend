import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserProfile, getWorkspaces } from '../api'; // Предполагается, что у вас есть этот API
import { Workspace } from '../types'; // Импортируйте интерфейс для Workspace

interface AuthContextType {
  user: any;
  workspaces: Workspace[]; // Добавлено
  login: (userData: any) => void;
  logout: () => void;
  addWorkspace: (workspace: Workspace) => void; // Добавлено
  deleteWorkspace: (workspaceId: number) => void; // Добавлено
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]); // Добавлено
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setWorkspaces([]); // Очистить воркспейсы при выходе
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
        if (userId) {
          const userData = await getUserProfile(userId);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('User data:', userData);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsAuthenticated(false);
    }
  };

  const fetchUserWorkspaces = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
  
        // Проверяем, что userId не undefined
        if (typeof userId === 'string') {
          const workspacesData = await getWorkspaces(userId); // Получение воркспейсов
          setWorkspaces(workspacesData);
        } else {
          console.error('User ID is not a valid string:', userId);
        }
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const addWorkspace = async (workspace: Workspace) => {
    // Логика добавления нового воркспейса
    try {
      const updatedWorkspaces = [...workspaces, workspace];
      setWorkspaces(updatedWorkspaces);
      // Дополнительные действия, например, вызов API
    } catch (error) {
      console.error('Error adding workspace:', error);
    }
  };

  const deleteWorkspace = async (workspaceId: number) => {
    // Логика удаления воркспейса
    try {
      const updatedWorkspaces = workspaces.filter(ws => ws.id !== workspaceId);
      setWorkspaces(updatedWorkspaces);
      // Дополнительные действия, например, вызов API
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserWorkspaces(); // Получаем воркспейсы при загрузке
  }, []);

  return (
    <AuthContext.Provider value={{ user, workspaces, login, logout, addWorkspace, deleteWorkspace, isAuthenticated }}>
      {children}
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
