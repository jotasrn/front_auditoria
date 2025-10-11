import {
  AlertTriangle,
  File as Edit,
  Car,
  User,
  Lock,
  MessageSquare,
  Grid2x2 as Grid,
  ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'stpc', title: 'Autos de Infração', icon: AlertTriangle, color: 'text-blue-600', available: true },
    { id: 'perfil', title: 'Meu Perfil', icon: User, color: 'text-slate-600', available: true },
    { id: 'mensagens', title: 'Mensagens', icon: MessageSquare, color: 'text-indigo-600', available: false },
    { id: 'tabelas-apoio', title: 'Tabelas de Apoio', icon: Grid, color: 'text-amber-600', available: false },
    { id: 'vistoria', title: 'Vistoria', icon: ClipboardCheck, color: 'text-teal-600', available: false },
    { id: 'etaf', title: 'eTAF', icon: Edit, color: 'text-cyan-600', available: false },
    { id: 'consulta-veiculos', title: 'Consulta Veículos', icon: Car, color: 'text-emerald-600', available: false },
    { id: 'alterar-senha', title: 'Alterar Senha', icon: Lock, color: 'text-rose-600', available: false },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Função para obter apenas o primeiro nome de forma segura
  const getFirstName = () => {
    // user?.full_name? -> garante que user E full_name existem antes de chamar split()
    return user?.full_name?.split(' ')[0] || user?.sigla || 'Usuário';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-1">
              {getGreeting()}, {getFirstName()}
            </h2>
            <p className="text-slate-200 font-medium">{user?.sigla || 'Usuário'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.available && onNavigate(item.id)}
              className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-slate-200 transition-all duration-300 transform active:scale-95 sm:hover:-translate-y-1 group ${!item.available ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className={`bg-slate-100 p-4 rounded-full mb-4 transition-colors group-hover:bg-slate-200`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  {item.title}
                </h3>
                {!item.available && (
                  <span className="text-xs mt-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
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