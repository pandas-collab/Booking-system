const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token, refreshToken = null) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const isTokenExpired = (token = null) => {
  const tokenToCheck = token || getToken();
  
  if (!tokenToCheck) {
    return true;
  }

  try {
    const payload = getTokenPayload(tokenToCheck);
    if (!payload || !payload.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return payload.exp <= currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getTokenPayload = (token = null) => {
  const tokenToDecoded = token || getToken();
  
  if (!tokenToDecoded) {
    return null;
  }

  try {
    const base64Url = tokenToDecoded.split('.')[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token payload:', error);
    return null;
  }
};

export const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken || isTokenExpired(refreshToken)) {
    removeToken();
    throw new Error('No valid refresh token available');
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    
    if (data.token) {
      setToken(data.token, data.refreshToken || refreshToken);
      return data.token;
    } else {
      throw new Error('Invalid token refresh response');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    removeToken();
    throw error;
  }
};

export const getValidToken = async () => {
  const currentToken = getToken();
  
  if (!currentToken) {
    return null;
  }

  if (!isTokenExpired(currentToken)) {
    return currentToken;
  }

  try {
    return await refreshAuthToken();
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};