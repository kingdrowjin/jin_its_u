import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN, REGISTER } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';

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

  // Get current user
  const { data: meData, loading: meLoading, error: meError } = useQuery(GET_ME, {
    skip: !localStorage.getItem('token'),
    onCompleted: (data) => {
      setUser(data.me);
      setLoading(false);
    },
    onError: () => {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  });

  // Login mutation
  const [loginMutation] = useMutation(LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      setUser(data.login.user);
    }
  });

  // Register mutation
  const [registerMutation] = useMutation(REGISTER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.register.token);
      setUser(data.register.user);
    }
  });

  const login = async (email, password) => {
    try {
      await loginMutation({ variables: { email, password } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password, role = 'EMPLOYEE') => {
    try {
      await registerMutation({ variables: { username, email, password, role } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isEmployee = () => user?.role === 'EMPLOYEE';

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading: loading || meLoading,
    isAuthenticated: !!user,
    isAdmin,
    isEmployee
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
