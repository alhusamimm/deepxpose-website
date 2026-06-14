import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUserProfiles } from '../mock';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication - simulate checking existing session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate checking for existing session
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const savedUser = localStorage.getItem('deepxpose-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find mock user
      const mockUser = mockUserProfiles.find(u => u.email === email);
      if (mockUser) {
        setUser(mockUser);
        localStorage.setItem('deepxpose-user', JSON.stringify(mockUser));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Mock Google login
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockGoogleUser = {
        id: "google_user_001",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "END_USER",
        organization: "Demo User",
        avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzAwNjQ2NiIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5KRDWV4dD48L3N2Zz4=",
        subscription: "TRIAL",
        analyses_remaining: 5,
        last_login: new Date().toISOString()
      };
      
      setUser(mockGoogleUser);
      localStorage.setItem('deepxpose-user', JSON.stringify(mockGoogleUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      // Mock signup
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newUser = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || "END_USER",
        organization: userData.organization || "Individual",
        avatar: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzMxMjI0NCIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0ZGRkZGRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij4ke userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}</text></svg>`,
        subscription: "TRIAL",
        analyses_remaining: 5,
        last_login: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('deepxpose-user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('deepxpose-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithGoogle,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};