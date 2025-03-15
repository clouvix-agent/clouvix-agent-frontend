interface User {
  username: string;
  email: string;
  name: string;
  organization: string;
  id: number;
  disabled: boolean;
  verified: boolean;
  is_admin: boolean;
}

export const setAuthTokens = (accessToken: string, tokenType: string) => {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('token_type', tokenType);
  document.cookie = `token=${accessToken}; path=/`;
};

export const clearAuth = async () => {
  const token = localStorage.getItem('token');
  console.log('Starting logout process...');
  
  // Clear local storage and cookies first
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    console.log('Local storage and cookies cleared successfully');
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }

  // Then try to notify the server
  if (token) {
    try {
      console.log('Attempting to notify server about logout...');
      const response = await fetch('https://backend.clouvix.com/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Server logout failed:', data.detail || 'Unknown error');
      } else {
        console.log('Server logout successful');
      }
    } catch (error) {
      console.error('Error during server logout:', error);
    }
  }
  console.log('Logout process completed');
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    'Authorization': `Bearer ${token}`
  } : {};
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
}; 