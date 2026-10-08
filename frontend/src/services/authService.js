const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.refreshTokenKey = 'refresh_token';
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem(this.tokenKey, data.token);
        if (data.refreshToken) {
          localStorage.setItem(this.refreshTokenKey, data.refreshToken);
        }
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.token) {
        localStorage.setItem(this.tokenKey, data.token);
        if (data.refreshToken) {
          localStorage.setItem(this.refreshTokenKey, data.refreshToken);
        }
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(this.refreshTokenKey);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.clearStoredToken();
        throw new Error(data.message || 'Token refresh failed');
      }

      if (data.token) {
        localStorage.setItem(this.tokenKey, data.token);
        if (data.refreshToken) {
          localStorage.setItem(this.refreshTokenKey, data.refreshToken);
        }
      }

      return data;
    } catch (error) {
      this.clearStoredToken();
      throw new Error(error.message || 'Token refresh failed');
    }
  }

  async logout() {
    try {
      const token = this.getStoredToken();
      
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error.message);
    } finally {
      this.clearStoredToken();
    }
  }

  async validateToken(token = null) {
    try {
      const tokenToValidate = token || this.getStoredToken();
      
      if (!tokenToValidate) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          try {
            await this.refreshToken();
            return true;
          } catch (refreshError) {
            return false;
          }
        }
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Token validation failed:', error.message);
      return false;
    }
  }

  getStoredToken() {
    return localStorage.getItem(this.tokenKey);
  }

  clearStoredToken() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

const authService = new AuthService();

export const login = (email, password) => authService.login(email, password);
export const register = (userData) => authService.register(userData);
export const refreshToken = () => authService.refreshToken();
export const logout = () => authService.logout();
export const validateToken = (token) => authService.validateToken(token);
export const getStoredToken = () => authService.getStoredToken();
export const clearStoredToken = () => authService.clearStoredToken();

export default authService;