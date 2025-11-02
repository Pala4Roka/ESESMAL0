import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

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

class AuthService {
  /**
   * Login user
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', {
        username,
        password,
      });

      // Save token and user data
      await AsyncStorage.setItem('auth_token', response.data.access_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Ошибка входа');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  /**
   * Get stored user data
   */
  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Get current user from API
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/api/auth/me');
      // Update stored user data
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error.response?.data || error.message);
      throw new Error('Не удалось получить данные пользователя');
    }
  }
}

export default new AuthService();
