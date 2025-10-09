import { ArrowLeft, User, Mail, Briefcase, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { apiService, FuncionarioDetalhe } from '../service/apiService.ts'; 

interface PerfilProps {
    onBack: () => void;
}

const DataField = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className={`p-3 mr-4 rounded-full bg-blue-100 text-blue-600`}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
            <p className="text-base font-bold text-slate-800 break-words">{value || 'N/A'}</p>
        </div>
    </div>
);

export function Perfil({ onBack }: PerfilProps) {
    const { user, signOut, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [refreshError, setRefreshError] = useState<string | null>(null);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                <p className="text-xl text-red-600 font-semibold mb-4">Erro: Dados do usuário não encontrados.</p>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-slate-700 text-white py-2 px-4 rounded-xl font-semibold transition hover:bg-slate-800"
                >
                    <ArrowLeft className="w-5 h-5" /> Voltar
                </button>
            </div>
        );
    }

    const handleRefreshDetails = async () => {
        setLoading(true);
        setRefreshError(null);
        try {
            const funcDetailsArray: FuncionarioDetalhe[] = await apiService.getFuncionarioDetails(user.id);
            const freshDetails = funcDetailsArray[0];

            if (!freshDetails) {
                 throw new Error("Resposta vazia da API de detalhes do funcionário.");
            }

            const newFullName = freshDetails.NomeFuncionario ? String(freshDetails.NomeFuncionario).trim() : '';

            const updatedUser = {
                ...user,
                full_name: newFullName || user.full_name || 'Nome não preenchido',
            };

            updateUser(updatedUser);

        } catch (e: any) {
            console.error("Falha ao atualizar detalhes:", e);
            setRefreshError("Falha ao carregar dados. Verifique a conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    const displayFullName = user.full_name || 'Nome Completo Não Informado';

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between py-3 sm:py-4">
                        <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition active:scale-95"><ArrowLeft className="w-5 h-5" /></button>
                        <h1 className="text-base sm:text-xl font-semibold text-center">Meu Perfil</h1>
                        <div className="w-9" />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                {/* Cartão de Identificação Principal */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        <User className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">{displayFullName}</h2>
                    <p className="text-sm font-semibold text-slate-600">{user.sigla}</p>

                    {/* Botão de Atualizar Dados */}
                    <button
                        onClick={handleRefreshDetails}
                        disabled={loading}
                        className="mt-4 flex items-center justify-center mx-auto gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Atualizando...' : 'Atualizar'}
                    </button>
                    {refreshError && <p className="text-xs text-red-500 mt-2">{refreshError}</p>}
                </div>

                {/* Seção de Detalhes */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">Detalhes da Conta</h3>

                    <DataField icon={User} label="Nome Completo" value={displayFullName} />
                    <DataField icon={Briefcase} label="Usuário" value={user.sigla} />
                </div>

                {/* Botão de Logout */}
                <button
                    onClick={signOut}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold transition active:scale-95 hover:bg-red-700 mt-6 flex items-center justify-center gap-2"
                >
                    <LogOut className="w-5 h-5" /> Sair
                </button>
            </div>
        </div>
    );
}