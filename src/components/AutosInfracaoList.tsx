import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockAutos } from '../lib/mock-data';

interface AutosInfracaoListProps {
  onBack: () => void;
  onNew: () => void;
}

export function AutosInfracaoList({ onBack, onNew }: AutosInfracaoListProps) {
  const { user } = useAuth();
  const [autos, setAutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAutos();
  }, [user]);

  const loadAutos = () => {
    if (!user) return;

    setLoading(true);
    // Simula o carregamento dos dados
    setTimeout(() => {
      setAutos(mockAutos);
      setLoading(false);
    }, 1000);
  };

  const filteredAutos = autos.filter(auto =>
    auto.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auto.vehicles?.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auto.local_infracao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Enviado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button
                onClick={onBack}
                className="p-2 hover:bg-blue-700 rounded-lg transition active:scale-95 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-xl font-semibold truncate">Autos de Infração</h1>
            </div>
            <button
              onClick={onNew}
              className="flex items-center gap-1 sm:gap-2 bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition active:scale-95 flex-shrink-0 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Novo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número, placa ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
              <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Carregando...</p>
            </div>
          ) : filteredAutos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {searchTerm ? 'Nenhum auto encontrado' : 'Nenhum auto de infração cadastrado'}
              </p>
              {!searchTerm && (
                <button
                  onClick={onNew}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition active:scale-95 text-sm sm:text-base"
                >
                  <Plus className="w-5 h-5" />
                  Criar primeiro auto
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredAutos.map((auto) => (
                <div
                  key={auto.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition cursor-pointer active:scale-[0.98]"
                  onClick={onNew} // Ação de clique vai para a tela de novo formulário, como no original
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                        Auto Nº {auto.numero || 'S/N'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getSituacaoColor(auto.situacao || 'Em andamento')}`}>
                        {auto.situacao || 'Em andamento'}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                      {auto.vehicles?.placa && (
                        <p className="flex items-start gap-1">
                          <span className="font-semibold min-w-[60px]">Veículo:</span>
                          <span className="flex-1">{auto.vehicles.placa} - {auto.vehicles.marca_modelo}</span>
                        </p>
                      )}
                      {auto.local_infracao && (
                        <p className="flex items-start gap-1">
                          <span className="font-semibold min-w-[60px]">Local:</span>
                          <span className="flex-1">{auto.local_infracao}</span>
                        </p>
                      )}
                      {auto.data_infracao && (
                        <p className="flex items-start gap-1">
                          <span className="font-semibold min-w-[60px]">Data:</span>
                          <span className="flex-1">
                            {new Date(auto.data_infracao).toLocaleDateString('pt-BR')}
                            {auto.hora_infracao && ` às ${auto.hora_infracao}`}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                      Criado em {new Date(auto.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}