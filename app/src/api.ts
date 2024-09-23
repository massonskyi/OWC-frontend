import axios, { AxiosResponse } from 'axios';

export interface SignUpData {
    name: string;
    surname: string;
    age: string;
    username: string;
    email: string;
    phone: string;
    avatar: File | null, 
    hash_password: string;
}

export interface SignInData {
  username: string;
  hash_password: string;
}

interface ExecCodeData {
  code: string;
  language: string;
}
export interface Workspace {
  id(id: any): void;
  is_active: boolean;
  is_public: boolean;
  name: string;
  description: string;
}
export interface WorkspaceCreateData {
  is_public: any;
  is_active: any;
  name: string;
  description: string;
}
export interface Project {
  id: number;
  name: string;
  language: string;
  description: string;
  
}

export interface ProjectCreateData {
  name: string;
  language: string;
  description: string;
  is_active: boolean;
}
const address = 'http://127.0.0.1:8000';
const SERVER_URL = `${address}/api_version_1`

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const signUp = async (data: SignUpData): Promise<any> => {
  try {
    const url = `${SERVER_URL}/user/sign_up`;

    const params = new URLSearchParams();
    params.append('name', data.name || '');
    params.append('surname', data.surname || '');
    params.append('email', data.email || '');
    params.append('phone', data.phone || '');
    params.append('age', data.age.toString() || '');
    params.append('username', data.username || '');
    params.append('hash_password', data.hash_password || '');

    const formPayload = new FormData();
    if (data.avatar) {
      formPayload.append('avatar', data.avatar);
    }

    const response: AxiosResponse = await axios.post(url, formPayload, {
      params,
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
        'accept': 'application/json'
      },
      withCredentials: true
    });

    return response.data;
  } catch (error: any) {
    console.error('Sign Up Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const signIn = async (data: SignInData): Promise<any> => {
  try {
    const url = `${SERVER_URL}/user/sign_in`;
    console.log('Request URL:', url, data.username, data.hash_password);
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', data.username);
    formData.append('password', data.hash_password);
    formData.append('client_id', "");
    formData.append('client_secret', "");
    const response: AxiosResponse = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Sign In Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteUserProfile = async (userId: string): Promise<void> => {
  try {
    const url = `${SERVER_URL}/profile/${userId}`;
    console.log('Request URL:', url);
    await axios.delete(url, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
  } catch (error: any) {
    console.error('Delete User Profile Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserProfile = async (userId: number) => {
  try {
    const response = await axios.get(`${SERVER_URL}/profile/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Get User Profile Error:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.put(`${SERVER_URL}/profile/${userId}`, data, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error('Update User Profile Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const executeCode = async (data: ExecCodeData): Promise<any> => {
  try {
    console.log(data);

    const formData = new FormData();
    formData.append('code', data.code);
    formData.append('language', data.language);

    const response = await axios.post(`${SERVER_URL}/user/test_code_execute`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    });

    return response.data;
  } catch (error: any) {
    throw new Error(`Error in code execution: ${error.message}`);
  }
};
export const searchUsers = async (query: string): Promise<any> => {
  try {
    const url = `${SERVER_URL}/search/?query=${query}`;
    console.log('Request URL:', url);
    const response: AxiosResponse = await axios.get(url, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    console.log('Response data:', response.data); // Логируем данные ответа для отладки
    return response.data;
  } catch (error: any) {
    console.error('Search Users Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createWorkspace = async (workspaceData: { name: string; description: string; is_active: boolean; is_public: boolean }): Promise<any> => {
  try {
      const url = `${SERVER_URL}/user/workspaces`;

      const params = new URLSearchParams();
      params.append('name', workspaceData.name);
      params.append('description', workspaceData.description || '');
      params.append('is_active', workspaceData.is_active !== undefined ? workspaceData.is_active.toString() : 'true');
      params.append('is_public', workspaceData.is_public !== undefined ? workspaceData.is_public.toString() : 'true');

      console.log('Workspace Data:', params.toString()); // Логируем данные для отладки

      const response: AxiosResponse<any> = await axios.post(url, null, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params,
        withCredentials: true
      });
      return response.data;
  } catch (error: any) {
      console.error('Create Workspace Error:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.detail) {
          console.error('Validation Error Details:', error.response.data.detail);
      }
      throw error;
  }
};

export const getWorkspace = async (workspaceId: string): Promise<Workspace> => {
  try {
      const url = `${SERVER_URL}/user/workspaces/${workspaceId}`;
      const response: AxiosResponse<Workspace> = await axios.get(url, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      return response.data;
  } catch (error: any) {
      console.error('Get Workspace Error:', error.response ? error.response.data : error.message);
      throw error;
  }
};

export const getWorkspacesById= async (user_id: string): Promise<Workspace[]> => {
  try {
      const url = `${SERVER_URL}/user/workspaces`;
      const response: AxiosResponse<Workspace[]> = await axios.get(url, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      return response.data;
  } catch (error: any) {
      console.error('Get Workspaces Error:', error.response ? error.response.data : error.message);
      throw error;
  }
};
export const getWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const url = `${SERVER_URL}/user/workspaces`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workspaces');
    }

    const data = await response.json();
    const workspaces: Workspace[] = data.workspaces; // Извлекаем массив воркспейсов из объекта
    return workspaces; // Возвращаем массив воркспейсов
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
};

export const createProject = async (workspaceName: string, projectData: ProjectCreateData): Promise<Project> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/projects/`;
    const response: AxiosResponse<Project> = await axios.post(url, projectData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Create Project Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getProject = async (workspaceName: string, projectId: number): Promise<Project> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/projects/${projectId}`;
    const response: AxiosResponse<Project> = await axios.get(url, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Get Project Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getProjects = async (workspaceName: string): Promise<Project[]> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/projects/`;
    const response: AxiosResponse<Project[]> = await axios.get(url, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Get Projects Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateProject = async (workspaceName: string, projectId: number, projectData: ProjectCreateData): Promise<Project> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/projects/${projectId}`;
    const response: AxiosResponse<Project> = await axios.put(url, projectData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Update Project Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteProject = async (workspaceName: string, projectId: number): Promise<void> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/projects/${projectId}`;
    await axios.delete(url, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
  } catch (error: any) {
    console.error('Delete Project Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};