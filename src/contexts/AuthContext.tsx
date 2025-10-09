import { createContext, useContext, useState, ReactNode } from 'react';
import { getUser, saveUser, clearUser } from '../lib/storage';
import { apiService, FuncionarioDetalhe } from '../service/apiService.ts';

// --- Interfaces de Tipagem ---
interface User {
    id: number;
    full_name: string;
    sigla: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (user: string, pass: string) => Promise<void>;
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
            const loginResponse = await apiService.login(username, password);
            const userId = loginResponse.data.id_usuario;
            const funcDetailsArray = await apiService.getFuncionarioDetails(userId);
            const funcDetails = funcDetailsArray[0];
            if (!funcDetails) {
                 throw new Error(`Detalhes do funcionário não encontrados.`);
            }

            const nomeCompleto = funcDetails.NomeFuncionario ? String(funcDetails.NomeFuncionario).trim() : '';
            const newUser: User = {
                id: userId,
                full_name: nomeCompleto, 
                sigla: username, 
            };

            saveUser(newUser); 
            setUser(newUser);
            
        } catch (error: any) {
            const errorMessage = error.message || 'Erro desconhecido.';
            console.error('Erro no login:', errorMessage, error.response?.data);
            throw new Error(errorMessage);
            
        } finally {
            setLoading(false);
        }
    };

    /** Realiza o logout: limpa o estado e o cache local. */
    const signOut = async () => {
        setUser(null);
        clearUser();
    };

    /** Atualiza o objeto do usuário no contexto e no cache. */
    const updateUser = async (userData: User) => {
        saveUser(userData);
        setUser(userData);
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
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}