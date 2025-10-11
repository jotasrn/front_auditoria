import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, AlertTriangle } from 'lucide-react';
import { getAudits } from '../../../shared/utils/storage';

interface AutosInfracaoListProps {
  onBack: () => void;
  onNew: () => void;
  onSelect: (auditId: string) => void;
}

export function AutosInfracaoList({ onBack, onNew, onSelect }: AutosInfracaoListProps) {
  const [autos, setAutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAutos();
  }, []);

  const loadAutos = () => {
    setLoading(true);
    setTimeout(() => {
      const storedAutos = getAudits();
      setAutos(storedAutos);
      setLoading(false);
    }, 500);
  };

  const filteredAutos = autos.filter(auto =>
    auto.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auto.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auto.local_infracao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Em andamento':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Enviado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition active:scale-95 flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-xl font-semibold truncate">Autos de Infração</h1>
            </div>
            <button onClick={onNew} className="flex items-center gap-1 sm:gap-2 bg-white text-slate-800 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition active:scale-95 flex-shrink-0 text-sm sm:text-base shadow-md">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Novo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Buscar por número, placa ou local..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition text-sm sm:text-base" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-800"></div>
              <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Carregando autos...</p>
            </div>
          ) : filteredAutos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4 text-base font-medium">
                {searchTerm ? 'Nenhum auto encontrado' : 'Nenhum auto de infração cadastrado'}
              </p>
              {!searchTerm && (
                <button onClick={onNew} className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:from-slate-800 hover:to-slate-950 transition active:scale-95 text-sm sm:text-base shadow-lg">
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
                  className="border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-slate-300 transition cursor-pointer active:scale-[0.98] bg-gradient-to-br from-white to-gray-50"
                  onClick={() => onSelect(auto.id)}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg">Auto Nº {auto.numero || 'S/N'}</h3>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 flex-shrink-0 ${getSituacaoColor(auto.situacao || 'Em andamento')}`}>{auto.situacao || 'Em andamento'}</span>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                      <p className="flex items-start gap-2"><span className="font-semibold min-w-[70px] text-gray-700">Veículo:</span><span className="flex-1 text-gray-900">{auto.placa || 'N/A'} - {auto.marca_modelo || 'N/A'}</span></p>
                      <p className="flex items-start gap-2"><span className="font-semibold min-w-[70px] text-gray-700">Local:</span><span className="flex-1">{auto.local_infracao || 'N/A'}</span></p>
                      <p className="flex items-start gap-2"><span className="font-semibold min-w-[70px] text-gray-700">Data:</span><span className="flex-1">{new Date(auto.data_infracao).toLocaleDateString('pt-BR')}{auto.hora_infracao && ` às ${auto.hora_infracao}`}</span></p>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">Criado em {new Date(auto.created_at).toLocaleDateString('pt-BR')}</div>
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
