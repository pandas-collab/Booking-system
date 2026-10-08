const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }
};

// API endpoints
export const destinationsAPI = {
  getAll: () => apiClient.get('/destinations'),
  getById: (id) => apiClient.get(`/destinations/${id}`),
};

export const packagesAPI = {
  getAll: () => apiClient.get('/packages'),
  getById: (id) => apiClient.get(`/packages/${id}`),
  search: (params) => apiClient.post('/packages/search', params),
};

export const searchAPI = {
  searchAll: (query) => apiClient.post('/search', { query }),
};
