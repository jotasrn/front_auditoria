import { createContext, useContext, useState, ReactNode } from 'react';
import { getUser, saveUser, clearUser } from '../lib/storage';
import { LoginService } from '../service/Loginservice';

interface User {
  id: number;
  username: string;
  full_name: string;
  sigla: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUser());
  const [loading, setLoading] = useState(false);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const result = await LoginService.login(username, password);

      if (result.success && result.data) {
        const data = result.data;

        const loggedUser: User = {
          id: data.id_usuario,
          username: data.username,
          full_name: data.nome_completo || 'Usuário SEMOB',
          sigla: data.sigla || data.username,
        };

        saveUser(loggedUser);
        setUser(loggedUser);
      } else {
        throw new Error(result.error || 'Falha ao autenticar. Tente novamente.');
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      throw new Error(error.message || 'Erro inesperado ao tentar login.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    clearUser();
    LoginService.logout();
    setUser(null);
  };

  const updateUser = async (userData: User) => {
    saveUser(userData);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
