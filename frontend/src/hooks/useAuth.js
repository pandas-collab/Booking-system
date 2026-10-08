import { useState, useEffect, useContext, createContext, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getStoredToken = useCallback(() => {
    return localStorage.getItem('accessToken');
  }, []);

  const getStoredRefreshToken = useCallback(() => {
    return localStorage.getItem('refreshToken');
  }, []);

  const setTokens = useCallback((accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    const token = getStoredToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          const newToken = getStoredToken();
          const retryResponse = await fetch(url, {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`
            }
          });
          return retryResponse;
        } else {
          throw new Error('Authentication failed');
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }, [getStoredToken]);

  const refreshToken = useCallback(async () => {
    const refreshTokenValue = getStoredRefreshToken();
    
    if (!refreshTokenValue) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue })
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.accessToken, data.refreshToken);
        return true;
      } else {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, [getStoredRefreshToken, setTokens, clearTokens, API_BASE_URL]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        setTokens(data.accessToken, data.refreshToken);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [setTokens, API_BASE_URL]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setTokens(data.accessToken, data.refreshToken);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [setTokens, API_BASE_URL]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const refreshTokenValue = getStoredRefreshToken();
      
      if (refreshTokenValue) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: refreshTokenValue })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [clearTokens, getStoredRefreshToken, API_BASE_URL]);

  const getCurrentUser = useCallback(async () => {
    const token = getStoredToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/me`);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [getStoredToken, makeAuthenticatedRequest, clearTokens, API_BASE_URL]);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest, API_BASE_URL]);

  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest, API_BASE_URL]);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset request failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    const setupTokenRefresh = () => {
      const token = getStoredToken();
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        const refreshTime = timeUntilExpiry - 60000; // Refresh 1 minute before expiry

        if (refreshTime > 0) {
          const timeoutId = setTimeout(() => {
            refreshToken();
          }, refreshTime);

          return () => clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('Token parsing error:', error);
      }
    };

    return setupTokenRefresh();
  }, [getStoredToken, refreshToken, user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    clearError,
    makeAuthenticatedRequest
  };

  return (
    <AuthContext.Provider value={value}>
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