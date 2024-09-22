import axios, { AxiosResponse } from 'axios';

export interface SignInData {
    username: string;
    hash_password: string;
  }
  
const address = "localhost"
const SERVER_URL = `http://${address}:8000`

// Example token for authorization
const AUTH_TOKEN = 'YOUR_ACCESS_TOKEN';
export interface SignInData {
  username: string;
  hash_password: string;
}

// Helper fnction to get headers
const getHeaders = () => ({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
    }
});

// Function to fetch user by ID
export const getUserById = (id: string) => {
    return axios.get(`${SERVER_URL}/api/admin/admin/get_user/${id}`, getHeaders());
};

// Function to create a new user
export const createUser = (user: any) => {
    return axios.post(`${SERVER_URL}/api/admin/admin/create_user`, user, getHeaders());
};

// Function to update an existing user
export const updateUser = (id: string, user: any) => {
    return axios.put(`${SERVER_URL}/api/admin/admin/update_user/${id}`, user, getHeaders());
};

// Function to delete a user by ID
export const deleteUserById = (id: number) => {
    return axios.delete(`${SERVER_URL}/api/admin/admin/delete_user/${id}`, getHeaders());
};

// Function to fetch all users
export const getAllUsers = () => {
    return axios.get(`${SERVER_URL}/api/admin/admin/get_users`, getHeaders());
};


export const signIn = async (data: SignInData): Promise<any> => {
    try {
      const url = `${SERVER_URL}/api/user/auth/sign_in`;
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