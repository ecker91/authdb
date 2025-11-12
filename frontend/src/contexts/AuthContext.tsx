import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../config/axios';
import type { AuthContextType, User, LoginResponse } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há tokens salvos ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        // Tentar validar o token atual fazendo uma requisição
        // Como não temos endpoint de "me", vamos apenas verificar se os tokens existem
        // Em produção, seria ideal ter um endpoint para validar o token
        try {
          // Se os tokens existem, assumimos que o usuário está autenticado
          // Poderia fazer uma requisição para validar, mas para simplificar
          // vamos apenas verificar se os tokens existem
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post<LoginResponse>('/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Salvar tokens no localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<void> => {
    try {
      await api.post('/register', {
        email,
        password,
        name,
      });
      // Após registrar, fazer login automaticamente
      await login(email, password);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao registrar';
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar tokens independente de sucesso ou erro
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

