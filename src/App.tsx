import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AutosInfracaoList } from './components/AutosInfracaoList';
import { AutoInfracaoForm } from './components/AutoInfracaoForm';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'autos-list' | 'autos-form'>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
          <p className="mt-4 text-white font-semibold text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleNavigate = (page: string) => {
    if (page === 'autos-infracao') {
      setCurrentPage('autos-list');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'autos-list':
        return (
          <AutosInfracaoList
            onBack={() => setCurrentPage('dashboard')}
            onNew={() => setCurrentPage('autos-form')}
          />
        );
      case 'autos-form':
        return (
          <AutoInfracaoForm
            onBack={() => setCurrentPage('autos-list')}
          />
        );
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return renderPage();
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
