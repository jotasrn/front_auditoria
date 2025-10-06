import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { AutosInfracaoList } from './components/AutosInfracaoList';
import { AutoInfracaoForm } from './components/AutoInfracaoForm';
import { Profile } from './components/Profile';
import { AutoInfracaoView } from './components/AutoInfracaoView';
import { BottomNav } from './components/BottomNav';
import { InDevelopment } from './components/InDevelopment';
import { Dashboard } from './components/Dashboard'; // Importe o Dashboard

type StpcPage = 'list' | 'view' | 'form';
type MainTab = 'inicio' | 'stpc' | 'taxi' | 'stip' | 'pirataria' | 'perfil';

function AppContent() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<MainTab>('inicio'); // Padrão para 'inicio'
  const [stpcPage, setStpcPage] = useState<StpcPage>('list');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setActiveTab('inicio');
      setStpcPage('list');
    }
  }, [user]);
  
  const handleSelectAudit = (auditId: string) => { setSelectedAuditId(auditId); setStpcPage('view'); };
  const handleEditAudit = (auditId: string) => { setSelectedAuditId(auditId); setStpcPage('form'); };
  const handleNewAudit = () => { setSelectedAuditId(null); setStpcPage('form'); };

  const renderStpcPage = () => {
    switch (stpcPage) {
      case 'view':
        return <AutoInfracaoView auditId={selectedAuditId!} onBack={() => setStpcPage('list')} onEdit={handleEditAudit} />;
      case 'form':
        return <AutoInfracaoForm onBack={() => setStpcPage('list')} auditId={selectedAuditId} />;
      case 'list':
      default:
        // O onBack da lista agora leva para o início (Dashboard)
        return <AutosInfracaoList onBack={() => setActiveTab('inicio')} onNew={handleNewAudit} onSelect={handleSelectAudit} />;
    }
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'inicio':
        // A prop onNavigate agora é a função que muda a aba principal
        return <Dashboard onNavigate={(tab) => setActiveTab(tab as MainTab)} />;
      case 'stpc':
        return renderStpcPage();
      case 'perfil':
        // O onBack do perfil agora leva para o início
        return <Profile onBack={() => setActiveTab('inicio')} />;
      case 'taxi':
      case 'stip':
      case 'pirataria':
        return <InDevelopment />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab as MainTab)} />;
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="relative min-h-screen">
      <main className="pb-20"> {/* Aumenta o padding para garantir espaço */}
        {renderMainContent()}
      </main>
      <BottomNav activeTab={activeTab} onNavigate={(tab) => setActiveTab(tab as MainTab)} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;