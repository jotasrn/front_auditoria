import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './app/providers/AuthContext';
import { Login } from './features/auditoria/pages/Login';
import { AutosInfracaoList } from './features/auditoria/components/AutosInfracaoList';
import { AutoInfracaoForm } from './features/auditoria/components/AutoInfracaoForm';
import { Perfil } from './features/perfil/pages/Perfil';
import { AutoInfracaoView } from './features/auditoria/components/AutoInfracaoView';
import { BottomNav } from './shared/components/organisms/BottomNav';
import { InDevelopment } from './shared/components/organisms/InDevelopment';
import { Dashboard } from './shared/components/organisms/Dashboard';
import type { StpcPage, MainTab } from './types';

function AppContent() {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<MainTab>('inicio'); 
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
                return <AutosInfracaoList onBack={() => setActiveTab('inicio')} onNew={handleNewAudit} onSelect={handleSelectAudit} />;
        }
    }

    const renderMainContent = () => {
        switch (activeTab) {
            case 'inicio':
                return <Dashboard onNavigate={(tab) => setActiveTab(tab as MainTab)} />;
            case 'stpc':
                return renderStpcPage();
            case 'perfil':
                return <Perfil onBack={() => setActiveTab('inicio')} />;
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
            <main className="pb-20">
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