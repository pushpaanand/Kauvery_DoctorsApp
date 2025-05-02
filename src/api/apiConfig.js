import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://unfydcrm.kauveryhospital.com/DoctorsAPI_DEV';

const apiClient = {
  async request(endpoint, options = {}) {
    try {
      const token = await AsyncStorage.getItem('access_token');
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  get: async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiClient.request(url, { method: 'GET' });
  },

  post: async (endpoint, data, options = {}) => {
    return apiClient.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },

  // Add other methods (PUT, DELETE, etc.) as needed
};

export default apiClient; 