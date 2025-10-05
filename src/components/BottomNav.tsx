import { FileText, Car, Ban, User, AlertTriangle } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const navItems = [
  { id: 'stpc', label: 'STPC', icon: AlertTriangle },
  { id: 'taxi', label: 'Táxi', icon: Car },
  { id: 'stip', label: 'STIP', icon: FileText },
  { id: 'pirataria', label: 'Pirataria', icon: Ban },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-top border-t border-slate-200 z-50">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-full h-16 transition-colors ${
                isActive ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-xs font-semibold ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}