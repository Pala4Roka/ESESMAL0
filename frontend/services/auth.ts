import api from './api';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '../constants/config';

export interface User {
  id: string;
  username: string;
  clearance_level: number;
  created_at: string;
  is_active: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, {
      username,
      password,
    });
    
    // Save token
    await SecureStore.setItemAsync('userToken', response.data.access_token);
    
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>(API_ENDPOINTS.ME);
    return response.data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('userToken');
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('userToken');
  },
};
