import { ArrowLeft, User, Mail, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    if (confirm('Você tem certeza que deseja sair da sua conta?')) {
      signOut();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition active:scale-95">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-xl font-semibold">Meu Perfil</h1>
            <div className="w-9"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-100 to-blue-50 p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-slate-700 to-slate-900 rounded-full mb-4 shadow-xl">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user?.full_name || 'Nome não encontrado'}
            </h2>
            <p className="text-gray-600 font-medium">{user?.sigla || 'Sigla não encontrada'}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">Nome Completo</p>
              <p className="text-base text-gray-900">{user?.full_name}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">Matrícula / Sigla</p>
              <p className="text-base text-gray-900">{user?.sigla}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
            <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto bg-red-100 text-red-700 py-3.5 rounded-xl font-semibold hover:bg-red-200 transition active:scale-95"
            >
                <LogOut className="w-5 h-5" />
                Sair da Conta
            </button>
        </div>
      </div>
    </div>
  );
}