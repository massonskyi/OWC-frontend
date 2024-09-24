// import { getWorkspace } from './api'; // Remove this line as it causes a conflict
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
  files: any;
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

// Интерфейс для запросов на создание файла или папки
export interface CreateRequest {
  name: string; // Имя файла или папки
}

// Интерфейс для ответа на создание файла или папки
export interface CreateResponse {
  message: string; // Сообщение об успешном создании
  success: boolean; // Успех операции
}

// Интерфейс для запросов на копирование файла или папки
export interface CopyRequest {
  src: string; // Исходный путь файла или папки
  dst: string; // Назначение копии (путь)
}

// Интерфейс для ответа на копирование файла или папки
export interface CopyResponse {
  message: string; // Сообщение об успешном копировании
  success: boolean; // Успех операции
}

// Интерфейс для запросов на удаление файла или папки
export interface DeleteRequest {
  path: string; // Путь к файлу или папке для удаления
}

// Интерфейс для ответа на удаление файла или папки
export interface DeleteResponse {
  message: string; // Сообщение об успешном удалении
  success: boolean; // Успех операции
}

// Интерфейс для запросов на переименование файла или папки
export interface RenameRequest {
  old_name: string; // Старое имя файла или папки
  new_name: string; // Новое имя файла или папки
}

// Интерфейс для ответа на переименование файла или папки
export interface RenameResponse {
  message: string; // Сообщение об успешном переименовании
  success: boolean; // Успех операции
}

// Интерфейс для запросов на редактирование файла
export interface EditFileRequest {
  name: string; // Имя файла
  content: string; // Новое содержимое файла
}

// Интерфейс для ответа на редактирование файла
export interface EditFileResponse {
  message: string; // Сообщение об успешном редактировании
  success: boolean; // Успех операции
}

// Общий интерфейс ответа для всех операций (например, копирование, удаление, переименование)
export interface GenericResponse {
  message: string; // Сообщение о результате операции
  success: boolean; // Успех операции
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
      const url = `${SERVER_URL}/user/workspaces/create`;

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



export const getWorkspaceByName = async (workspaceName: string): Promise<Workspace> => {
  try{
    const url = `${SERVER_URL}/user/workspaces/name/${workspaceName}`;
    const response: AxiosResponse<Workspace> = await axios.get(url, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    console.log(response.data)
    return response.data; 
  }catch(error: any){
    console.error('Get Workspace By Name Error:', error.response ? error.response.data : error.message);
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


    const response: AxiosResponse<{ workspaces: Workspace[]; message: string }> = await axios.get(
      url,
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );

    const data = response.data;
    const workspaces: Workspace[] = data.workspaces; // Извлекаем массив воркспейсов из объекта
    return workspaces; // Возвращаем массив воркспейсов
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
};
// Функция для создания файла в рабочей области
export const createFile = async (workspaceName: string, fileName: string): Promise<CreateResponse> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/file`;
    const requestData: CreateRequest = {
      name: fileName,
    };
    const response: AxiosResponse<CreateResponse> = await axios.post(url, requestData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Create File Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Функция для создания папки в рабочей области
export const createFolder = async (workspaceName: string, folderName: string): Promise<CreateResponse> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/folder`;
    const requestData: CreateRequest = {
      name: folderName,
    };
    const response: AxiosResponse<CreateResponse> = await axios.post(url, requestData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Create Folder Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Функция для копирования файла или папки в рабочей области
export const copyItem = async (workspaceName: string, src: string, dst: string): Promise<GenericResponse> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/copy`;
    const requestData: CopyRequest = {
      src,
      dst,
    };
    const response: AxiosResponse<GenericResponse> = await axios.post(url, requestData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Copy Item Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Функция для удаления файла или папки в рабочей области
export const deleteItem = async (workspaceName: string, path: string): Promise<GenericResponse> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/item`;
    const requestData: DeleteRequest = {
      path,
    };
    const response: AxiosResponse<GenericResponse> = await axios.delete(url, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      data: requestData,
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Delete Item Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Функция для переименования файла или папки в рабочей области
export const renameItem = async (workspaceName: string, oldName: string, newName: string): Promise<GenericResponse> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/rename`;
    const requestData: RenameRequest = {
      old_name: oldName,
      new_name: newName,
    };
    const response: AxiosResponse<GenericResponse> = await axios.put(url, requestData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Rename Item Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Функция для редактирования содержимого файла в рабочей области
export const editFile = async (workspaceName: string, fileName: string, content: string): Promise<GenericResponse> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/file`;
    const requestData: EditFileRequest = {
      name: fileName,
      content,
    };
    const response: AxiosResponse<GenericResponse> = await axios.put(url, requestData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error('Edit File Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};
// Функция для открытия файла в рабочей области
export const openFile = async (workspaceName: string, fileName: string): Promise<string> => {
  try {
    const url = `${SERVER_URL}/user/workspaces/${workspaceName}/file/${fileName}`;
    const response: AxiosResponse<{ contents: string }> = await axios.get(url, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data.contents;
  } catch (error: any) {
    console.error('Open File Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};