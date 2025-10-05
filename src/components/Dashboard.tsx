import { AlertTriangle, File as Edit, Car, MessageSquare, Grid2x2 as Grid, User, Lock, ClipboardCheck, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 'autos-infracao', title: 'Autos de Infração', icon: AlertTriangle, color: 'text-blue-600', available: true },
    { id: 'etaf', title: 'eTAF', icon: Edit, color: 'text-cyan-600', available: false },
    { id: 'consulta-veiculos', title: 'Consulta Veículos', icon: Car, color: 'text-emerald-600', available: false },
    { id: 'mensagens', title: 'Mensagens', icon: MessageSquare, color: 'text-indigo-600', available: false },
    { id: 'tabelas-apoio', title: 'Tabelas de Apoio', icon: Grid, color: 'text-amber-600', available: false },
    { id: 'perfil', title: 'Meu Perfil', icon: User, color: 'text-slate-600', available: true },
    { id: 'alterar-senha', title: 'Alterar Senha', icon: Lock, color: 'text-rose-600', available: false },
    { id: 'vistoria', title: 'Vistoria', icon: ClipboardCheck, color: 'text-teal-600', available: false },
  ];

  const handleMenuClick = (id: string, available: boolean) => {
    if (available) onNavigate(id);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ... Header (pode permanecer o mesmo) ... */}
       <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SEMOB</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-100 rounded-lg transition active:scale-95" title="Atualizar"><RefreshCw className="w-5 h-5 text-gray-600" /></button>
              <button onClick={signOut} className="p-2 hover:bg-gray-100 rounded-lg transition active:scale-95" title="Sair"><LogOut className="w-5 h-5 text-gray-600" /></button>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-4 sm:mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
          <div className="relative">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">{getGreeting()}, {user?.full_name.split(' ')[0] || 'Usuário'}</h2>
            <p className="text-slate-200 text-sm sm:text-base font-medium">{user?.sigla || 'Usuário'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.available)}
              className={`relative bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-slate-200 transition-all duration-300 transform active:scale-95 sm:hover:-translate-y-1 group ${!item.available ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className={`bg-slate-100 p-4 rounded-full mb-4 transition-colors group-hover:bg-slate-200`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                  {item.title}
                </h3>
                {!item.available && (
                  <span className="text-[10px] sm:text-xs mt-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                    Em breve
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