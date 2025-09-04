// frontend/src/services/auth.ts
import { apiClient, ApiError } from './api';
import { User, LoginCredentials, AuthToken, UserCreate, UserUpdate } from '../types/user';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthToken> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const token = await apiClient.postForm<AuthToken>('/auth/login', formData);
    apiClient.setToken(token.access_token);
    return token;
  }

  static async logout(): Promise<void> {
    apiClient.clearToken();
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      return await apiClient.get<User>('/auth/me');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        this.logout();
        return null;
      }
      throw error;
    }
  }

  static async createUser(userData: UserCreate): Promise<User> {
    return apiClient.post<User>('/auth/register', userData);
  }

  static async updateUser(userId: number, userData: UserUpdate): Promise<User> {
    return apiClient.put<User>(`/auth/users/${userId}`, userData);
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

