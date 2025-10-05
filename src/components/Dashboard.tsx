import { AlertTriangle, FileEdit as Edit, Car, MessageSquare, Grid2x2 as Grid, User, Lock, ClipboardCheck, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 'autos-infracao', title: 'Autos de Infração', icon: AlertTriangle, gradient: 'from-blue-400 to-blue-600', available: true },
    { id: 'etaf', title: 'eTAF', icon: Edit, gradient: 'from-blue-500 to-blue-700', available: false },
    { id: 'consulta-veiculos', title: 'Consulta Veículos', icon: Car, gradient: 'from-cyan-400 to-blue-600', available: false },
    { id: 'mensagens', title: 'Mensagens', icon: MessageSquare, gradient: 'from-blue-500 to-blue-700', available: false },
    { id: 'tabelas-apoio', title: 'Tabelas de Apoio', icon: Grid, gradient: 'from-blue-400 to-blue-600', available: false },
    { id: 'perfil', title: 'Perfil', icon: User, gradient: 'from-blue-500 to-blue-700', available: false },
    { id: 'alterar-senha', title: 'Alterar Senha', icon: Lock, gradient: 'from-blue-400 to-blue-600', available: false },
    { id: 'vistoria', title: 'Vistoria', icon: ClipboardCheck, gradient: 'from-blue-500 to-blue-700', available: false },
  ];

  const handleMenuClick = (id: string, available: boolean) => {
    if (available) {
      onNavigate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SEMOB</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-gray-100 rounded-lg transition active:scale-95"
                title="Atualizar"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={signOut}
                className="p-2 hover:bg-gray-100 rounded-lg transition active:scale-95"
                title="Sair"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-4 sm:mb-6 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Boa tarde, SEMOB</h2>
          <p className="text-blue-100 text-sm sm:text-base">{user?.sigla || 'Usuário'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.available)}
              className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 sm:hover:scale-105 group ${!item.available ? 'opacity-70' : ''
                }`}
            >
              <div className="flex flex-col items-center justify-center text-white min-h-[120px] sm:min-h-[140px]">
                <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-full mb-3 sm:mb-4 group-hover:bg-white/30 transition">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-center leading-tight px-1">
                  {item.title}
                </h3>
                {!item.available && (
                  <span className="text-[10px] sm:text-xs mt-2 bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                    Em desenvolvimento
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}