import { createContext, useContext, useState, ReactNode } from 'react';
import { mockUser } from '../lib/mock-data';

// Simulando a estrutura do objeto User do Supabase
interface MockUser {
  id: string;
  email: string;
  full_name: string;
  sigla: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (user: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(false); // Inicia como false, pois não há verificação de sessão

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    // Simula uma chamada de API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Lógica de login simples para o protótipo
        if (username === 'DFT_GABRIELV' && password === '123456') {
          setUser(mockUser);
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error('Usuário ou senha incorretos'));
        }
      }, 1000); // Atraso de 1 segundo para simular a rede
    });
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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