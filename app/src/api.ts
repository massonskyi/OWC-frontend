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
  id: number;
  name: string;
  description: string;
}
export interface WorkspaceCreateData {
  name: string;
  description: string;
}
export interface Project {
  id: number;
  name: string;
  language: string;
  description: string;
}
const SERVER_URL = `/api_version_1`



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
    await axios.delete(url, { withCredentials: true });
  } catch (error: any) {
    console.error('Delete User Profile Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// api.ts
export const getUserProfile = async (userId: string): Promise<any> => {
  try{
    const url = `${SERVER_URL}/profile/${userId}`;
    console.log('Request URL:', url);
    const response: AxiosResponse = await axios.get(url, { withCredentials: true });
    console.log('Response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get User Profile Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.put(`${SERVER_URL}/profile/${userId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Update User Profile Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const executeCode = async (data: ExecCodeData): Promise<any> => {
  try {
    const response = await axios.post(`${SERVER_URL}/workspaces/exec`, data);
    return response.data;
  } catch (error: any) {
    throw new Error('Error: ' + error.message);
  }
};

// New function to search users
export const searchUsers = async (query: string): Promise<any> => {
  try {
    const url = `${SERVER_URL}/search/?query=${query}`;
    console.log('Request URL:', url);
    const response: AxiosResponse = await axios.get(url, { withCredentials: true });
    console.log('Response data:', response.data); // Логируем данные ответа для отладки
    return response.data;
  } catch (error: any) {
    console.error('Search Users Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createWorkspace = async (workspaceData: WorkspaceCreateData): Promise<Workspace> => {
  try {
      const url = `${SERVER_URL}/workspaces`;
      const response: AxiosResponse<Workspace> = await axios.post(url, workspaceData, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      console.error('Create Workspace Error:', error.response ? error.response.data : error.message);
      throw error;
  }
};

export const getWorkspace = async (workspaceId: string): Promise<Workspace> => {
  try {
      const url = `${SERVER_URL}/workspaces/${workspaceId}`;
      const response: AxiosResponse<Workspace> = await axios.get(url, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      console.error('Get Workspace Error:', error.response ? error.response.data : error.message);
      throw error;
  }
};

export const getWorkspaces = async (user_id: string): Promise<Workspace[]> => {
  try {
      const url = `${SERVER_URL}/workspaces`;
      const response: AxiosResponse<Workspace[]> = await axios.get(url, { withCredentials: true });
      return response.data;
  } catch (error: any) {
      console.error('Get Workspaces Error:', error.response ? error.response.data : error.message);
      throw error;
  }
};

export const deleteWorkspace = async (workspaceId: number): Promise<void> => {
  try {
      const url = `${SERVER_URL}/workspaces/${workspaceId}`;
      await axios.delete(url, { withCredentials: true });
  } catch (error: any) {
      console.error('Delete Workspace Error:', error.response ? error.response.data : error.message);
      throw error;
  }
};