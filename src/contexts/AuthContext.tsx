import { createContext, useContext, useState, ReactNode } from 'react';
import { getUser, saveUser } from '../lib/storage'; // Importa as novas funções

interface User {
  id: string;
  email: string;
  full_name: string;
  sigla: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (user: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>; // Nova função para atualizar o perfil
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUser()); // Carrega o usuário do cache
  const [loading, setLoading] = useState(false);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const storedUser = getUser();
        if (username === storedUser.sigla && password === '123456') { // Login simples
          setUser(storedUser);
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error('Usuário ou senha incorretos'));
        }
      }, 1000);
    });
  };

  const signOut = async () => {
    setUser(null); // Para o protótipo, apenas desloga
  };

  const updateUser = async (userData: User) => {
    saveUser(userData); // Salva no cache
    setUser(userData); // Atualiza o estado global
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}