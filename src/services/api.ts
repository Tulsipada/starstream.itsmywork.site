import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: number;
  email: string;
  mobile?: string;
  roleId: number;
  uuid?: string;
  profile?: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface LoginRequest {
  identifier: string;
  password: string;
  type: 'email' | 'phone';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  otpCode: string;
  mobile?: string;
  agreement?: number;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  mobile?: string;
  roleId: number;
  uuid: string;
  profile: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface SendOtpRequest {
  identifier: string;
  type: 'email' | 'phone';
  purpose: 'registration' | 'forgot_password' | 'verification';
}

export interface UserProfile {
  user: {
    id: number;
    email: string;
    mobile?: string;
    uuid: string;
    roleId: number;
    status: number;
  };
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    createdAt: number;
    updatedAt: number;
  };
}

export interface VerifyOtpRequest {
  identifier: string;
  type: 'email' | 'phone';
  otpCode: string;
  purpose?: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  type: 'email' | 'phone';
  otpCode: string;
  newPassword: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async sendOtp(otpData: SendOtpRequest): Promise<ApiResponse> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  }

  async resetPassword(resetData: ResetPasswordRequest): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  }

  async getUserProfile(userId: number): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(`/auth/profile/${userId}`, {
      method: 'GET',
    });
  }

  async updateUserProfile(userId: number, profileData: {
    firstName: string;
    lastName: string;
    email?: string;
    mobile?: string;
  }): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>(`/auth/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // OTP APIs
  async generateOtp(otpData: SendOtpRequest): Promise<ApiResponse> {
    return this.request('/otp/generate', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  }

  async verifyOtp(otpData: VerifyOtpRequest): Promise<ApiResponse> {
    return this.request('/otp/verify', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  }

  async checkOtp(otpData: VerifyOtpRequest): Promise<ApiResponse<{ isValid: boolean }>> {
    return this.request<{ isValid: boolean }>('/otp/check', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  }

  // Utility method to get auth headers
  getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
}

export const apiService = new ApiService();
export default apiService;
