import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { AutosInfracaoList } from './components/AutosInfracaoList';
import { AutoInfracaoForm } from './components/AutoInfracaoForm';
import { Profile } from './components/Profile';
import { AutoInfracaoView } from './components/AutoInfracaoView';
import { BottomNav } from './components/BottomNav'; // Importe o menu
import { InDevelopment } from './components/InDevelopment'; // Importe a tela placeholder

type StpcPage = 'list' | 'view' | 'form';
type MainTab = 'stpc' | 'taxi' | 'stip' | 'pirataria' | 'perfil';

function AppContent() {
  const { user } = useAuth();
  
  // Controle de Navegação Principal
  const [activeTab, setActiveTab] = useState<MainTab>('stpc');
  
  // Controle de Navegação dentro da aba STPC
  const [stpcPage, setStpcPage] = useState<StpcPage>('list');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setActiveTab('stpc'); // Reseta a aba ao deslogar
      setStpcPage('list');
    }
  }, [user]);
  
  const handleSelectAudit = (auditId: string) => {
    setSelectedAuditId(auditId);
    setStpcPage('view');
  };
  
  const handleEditAudit = (auditId: string) => {
    setSelectedAuditId(auditId);
    setStpcPage('form');
  };
  
  const handleNewAudit = () => {
    setSelectedAuditId(null);
    setStpcPage('form');
  };

  const renderStpcPage = () => {
    switch (stpcPage) {
      case 'view':
        return <AutoInfracaoView auditId={selectedAuditId!} onBack={() => setStpcPage('list')} onEdit={handleEditAudit} />;
      case 'form':
        return <AutoInfracaoForm onBack={() => setStpcPage('list')} auditId={selectedAuditId} />;
      case 'list':
      default:
        return <AutosInfracaoList onBack={() => {}} onNew={handleNewAudit} onSelect={handleSelectAudit} />;
    }
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'stpc':
        return renderStpcPage();
      case 'perfil':
        return <Profile onBack={() => setActiveTab('stpc')} />;
      case 'taxi':
      case 'stip':
      case 'pirataria':
        return <InDevelopment />;
      default:
        return <div />;
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="relative min-h-screen">
      <main className="pb-16">
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