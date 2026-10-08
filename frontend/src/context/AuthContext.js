import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REFRESH_TOKEN_START: 'REFRESH_TOKEN_START',
  REFRESH_TOKEN_SUCCESS: 'REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_FAILURE: 'REFRESH_TOKEN_FAILURE',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };
    case AUTH_ACTIONS.REFRESH_TOKEN_START:
      return {
        ...state,
        isLoading: true
      };
    case AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken || state.refreshToken,
        isLoading: false,
        error: null
      };
    case AUTH_ACTIONS.REFRESH_TOKEN_FAILURE:
      return {
        ...initialState,
        isLoading: false,
        error: action.payload
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const saveTokensToStorage = useCallback((token, refreshToken) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }, []);

  const clearTokensFromStorage = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  const saveUserToStorage = useCallback((user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user, token, refreshToken } = data;

      saveTokensToStorage(token, refreshToken);
      saveUserToStorage(user);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token, refreshToken }
      });

      return { success: true, user };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  }, [saveTokensToStorage, saveUserToStorage]);

  const logout = useCallback(async () => {
    try {
      const token = state.token || localStorage.getItem('accessToken');
      
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearTokensFromStorage();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, [state.token, clearTokensFromStorage]);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = state.refreshToken || localStorage.getItem('refreshToken');

    if (!refreshToken) {
      dispatch({
        type: AUTH_ACTIONS.REFRESH_TOKEN_FAILURE,
        payload: 'No refresh token available'
      });
      return false;
    }

    dispatch({ type: AUTH_ACTIONS.REFRESH_TOKEN_START });

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      const { token, refreshToken: newRefreshToken } = data;

      saveTokensToStorage(token, newRefreshToken);

      dispatch({
        type: AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS,
        payload: { token, refreshToken: newRefreshToken }
      });

      return true;
    } catch (error) {
      clearTokensFromStorage();
      dispatch({
        type: AUTH_ACTIONS.REFRESH_TOKEN_FAILURE,
        payload: error.message
      });
      return false;
    }
  }, [state.refreshToken, saveTokensToStorage, clearTokensFromStorage]);

  const updateUser = useCallback((userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData
    });
    saveUserToStorage({ ...state.user, ...userData });
  }, [state.user, saveUserToStorage]);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (!token || !refreshToken) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      if (isTokenExpired(token)) {
        const refreshSuccess = await refreshAccessToken();
        if (!refreshSuccess) {
          clearTokensFromStorage();
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          return;
        }
      }

      const user = storedUser ? JSON.parse(storedUser) : null;
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken')
        }
      });
    } catch (error) {
      clearTokensFromStorage();
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, [isTokenExpired, refreshAccessToken, clearTokensFromStorage]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (state.token && isTokenExpired(state.token)) {
      refreshAccessToken();
    }
  }, [state.token, isTokenExpired, refreshAccessToken]);

  const value = {
    ...state,
    login,
    logout,
    refreshAccessToken,
    updateUser,
    clearError,
    isTokenExpired,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, authReducer, AuthContext };