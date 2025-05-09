import apiClient from '../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://unfydcrm.kauveryhospital.com/DoctorsAPI_DEV';

export const authService = {
  // Get Token
  getToken: async () => {
    const tokenData = {
      Username: 'Kauvery',
      Password: 'Kmc@123',
      grant_type: 'password'
    };

    try {
      const response = await fetch(`${BASE_URL}/Token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenData).toString(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get token');
      }

      await AsyncStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      // First get the token
      await authService.getToken();

      // Then attempt login
      const response = await fetch(`${BASE_URL}/LogIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          mobileno:credentials.mobileno
        })
      });
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = JSON.parse(text);
        // throw new Error('Unexpected response format');
      }
      console.log(data)
      // if (!data.Message?.includes('Success')) {
      //   throw new Error(data.Message || 'Invalid credentials');
      // }

      // If login successful, store user data
      await AsyncStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      // If login fails, remove token and throw error
      await AsyncStorage.removeItem('access_token');
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['access_token', 'user']);
    } catch (error) {
      throw error;
    }
  }
}; 