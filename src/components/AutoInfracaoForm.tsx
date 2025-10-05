import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Paperclip, Eye, Mic, X, Camera, Image as ImageIcon, FileText, Trash2 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockVehicles, mockLinhas, mockPrepostos, mockInfracoes } from '../lib/mock-data';

// Definindo um tipo para os anexos para melhor organização
type Attachment = {
  id: string; // ID único para a chave do map e para exclusão
  file: File;
  preview: string; // URL de pré-visualização (para imagens)
  type: 'image' | 'pdf';
};

interface AutoInfracaoFormProps {
  onBack: () => void;
}

export function AutoInfracaoForm({ onBack }: AutoInfracaoFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [linhas, setLinhas] = useState<any[]>([]);
  const [prepostos, setPrepostos] = useState<any[]>([]);
  const [infracoes, setInfracoes] = useState<any[]>([]);

  // --- NOVOS ESTADOS PARA OS MODAIS E ANEXOS ---
  const [isAttachModalOpen, setAttachModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // --- REFS PARA OS INPUTS DE ARQUIVO OCULTOS ---
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    numero: '',
    tipo: 'STPC',
    ordem_servico: '',
    data_infracao: new Date().toISOString().split('T')[0],
    hora_infracao: new Date().toTimeString().slice(0, 5),
    sigla_operador: '',
    nome_operador: '',
    sigla_servico: '',
    vehicle_id: '',
    numero_veiculo: '',
    placa: '',
    marca_modelo: '',
    cor: '',
    ano_fabricacao: '',
    preposto_id: '',
    nome_preposto: '',
    numero_preposto: '',
    linha_id: '',
    codigo_linha: '',
    denominacao_linha: '',
    regiao_administrativa: '',
    local_infracao: '',
    infracao_id: '',
    descricao_fato: '',
    situacao: 'Em andamento',
  });

  useEffect(() => {
    setVehicles(mockVehicles);
    setLinhas(mockLinhas);
    setPrepostos(mockPrepostos);
    setInfracoes(mockInfracoes);
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome_operador: user.full_name || '',
        sigla_operador: user.sigla || '',
      }));
    }
  }, [user]);

  // --- NOVAS FUNÇÕES PARA MANIPULAR ANEXOS ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
      return {
        id: crypto.randomUUID(),
        file: file,
        preview: URL.createObjectURL(file),
        type: fileType,
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    setAttachModalOpen(false);
  };

  const handleDeleteAttachment = (idToDelete: string) => {
    const attachmentToDelete = attachments.find(att => att.id === idToDelete);
    if (attachmentToDelete) {
      URL.revokeObjectURL(attachmentToDelete.preview);
    }
    setAttachments(prev => prev.filter(att => att.id !== idToDelete));
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setFormData(prev => ({
        ...prev,
        vehicle_id: vehicleId,
        numero_veiculo: vehicle.numero_veiculo || '',
        placa: vehicle.placa || '',
        marca_modelo: vehicle.marca_modelo || '',
        cor: vehicle.cor || '',
        ano_fabricacao: vehicle.ano_fabricacao || '',
      }));
    }
  };

  const handleLinhaSelect = (linhaId: string) => {
    const linha = linhas.find(l => l.id === linhaId);
    if (linha) {
      setFormData(prev => ({
        ...prev,
        linha_id: linhaId,
        codigo_linha: linha.codigo || '',
        denominacao_linha: linha.denominacao || '',
      }));
    }
  };

  const handlePrepostoSelect = (prepostoId: string) => {
    const preposto = prepostos.find(p => p.id === prepostoId);
    if (preposto) {
      setFormData(prev => ({
        ...prev,
        preposto_id: prepostoId,
        nome_preposto: preposto.nome || '',
        numero_preposto: preposto.numero || '',
      }));
    }
  };

  const handleSubmit = async (action: 'save' | 'send') => {
    setLoading(true);
    setTimeout(() => {
      console.log('Dados a serem enviados (simulação):', {
        ...formData,
        attachments: attachments.map(a => a.file.name),
        situacao: action === 'send' ? 'Enviado' : formData.situacao,
        user_id: user?.id,
      });
      setLoading(false);
      alert(action === 'save' ? 'Auto salvo com sucesso! (Simulação)' : 'Auto enviado com sucesso! (Simulação)');
      onBack();
    }, 1500);
  };

  const handleDelete = () => {
    if (confirm('Deseja excluir este auto? (Simulação)')) {
      alert('Auto excluído! (Simulação)');
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 py-3 sm:py-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-blue-700 rounded-lg transition active:scale-95 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base md:text-lg font-semibold">Edição: Auto de infração - STPC</h1>
          </div>
        </div>
      </div>

      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="user" onChange={handleFileChange} />
      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
      <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf" multiple onChange={handleFileChange} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600">Anexos:</span>
            <div className="flex gap-2">
              <button onClick={() => setAttachModalOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm active:scale-95">
                <Paperclip className="w-4 h-4" />
                <span className="hidden sm:inline">Anexar</span>
              </button>
              <button onClick={() => setViewModalOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm active:scale-95">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Visualizar</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">Auto de Infração - STPC</h2>
            <input type="text" placeholder="Número" value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base bg-white" />
          </div>

          <div>
            <input type="text" placeholder="Ordem de Serviço de Auditoria Fiscal" value={formData.ordem_servico} onChange={(e) => setFormData({ ...formData, ordem_servico: e.target.value })} className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base" />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">Dados Temporais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Data da infração</label>
                <input type="date" value={formData.data_infracao} onChange={(e) => setFormData({ ...formData, data_infracao: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Hora da infração</label>
                <input type="time" value={formData.hora_infracao} onChange={(e) => setFormData({ ...formData, hora_infracao: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">Dados do Operador</h3>
            <div className="space-y-3">
              <select value={formData.sigla_operador} onChange={(e) => setFormData({ ...formData, sigla_operador: e.target.value })} className="w-full px-3 py-2.5 bg-gray-100 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" disabled >
                <option value="">Sigla do Operador - Nome do operador</option>
                <option value={formData.sigla_operador}>{formData.sigla_operador} - {formData.nome_operador}</option>
              </select>
              <input type="text" placeholder="Sigla do Serviço" value={formData.sigla_servico} onChange={(e) => setFormData({ ...formData, sigla_servico: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">Dados do Veículo</h3>
            <div className="space-y-3">
              <select value={formData.vehicle_id} onChange={(e) => handleVehicleSelect(e.target.value)} className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" >
                <option value="">Selecionar Veículo</option>
                {vehicles.map(v => (<option key={v.id} value={v.id}>{v.placa} - {v.marca_modelo}</option>))}
              </select>
              <input type="text" placeholder="N° do Veículo" value={formData.numero_veiculo} onChange={(e) => setFormData({ ...formData, numero_veiculo: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              <input type="text" placeholder="Placa" value={formData.placa} onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm uppercase" />
              <div className="relative">
                <input type="text" placeholder="Marca/Modelo do Veículo" value={formData.marca_modelo} onChange={(e) => setFormData({ ...formData, marca_modelo: e.target.value })} className="w-full px-3 py-2.5 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Mic className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <input type="text" placeholder="Cor" value={formData.cor} onChange={(e) => setFormData({ ...formData, cor: e.target.value })} className="w-full px-3 py-2.5 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><Mic className="w-4 h-4" /></button>
                </div>
                <input type="text" placeholder="Ano de Fabricação" value={formData.ano_fabricacao} onChange={(e) => setFormData({ ...formData, ano_fabricacao: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">Dados do Preposto</h3>
            <div className="space-y-3">
              <select value={formData.preposto_id} onChange={(e) => handlePrepostoSelect(e.target.value)} className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" >
                <option value="">Selecione o Preposto</option>
                {prepostos.map(p => (<option key={p.id} value={p.id}>{p.nome} - {p.numero}</option>))}
              </select>
              <input type="text" placeholder="Nome do Preposto" value={formData.nome_preposto} onChange={(e) => setFormData({ ...formData, nome_preposto: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              <input type="text" placeholder="Número do Preposto" value={formData.numero_preposto} onChange={(e) => setFormData({ ...formData, numero_preposto: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">Dados da Linha</h3>
            <div className="space-y-3">
              <select value={formData.linha_id} onChange={(e) => handleLinhaSelect(e.target.value)} className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" >
                <option value="">Selecionar a Linha</option>
                {linhas.map(l => (<option key={l.id} value={l.id}>{l.codigo} - {l.denominacao}</option>))}
              </select>
              <input type="text" placeholder="Código da Linha" value={formData.codigo_linha} onChange={(e) => setFormData({ ...formData, codigo_linha: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              <input type="text" placeholder="Denominação da Linha" value={formData.denominacao_linha} onChange={(e) => setFormData({ ...formData, denominacao_linha: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">Local da Infração</h3>
            <div className="space-y-3">
              <select value={formData.regiao_administrativa} onChange={(e) => setFormData({ ...formData, regiao_administrativa: e.target.value })} className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" >
                <option value="">Região Administrativa (RA)</option>
                <option value="RA I">RA I - Brasília</option>
                <option value="RA II">RA II - Gama</option>
                <option value="RA III">RA III - Taguatinga</option>
              </select>
              <input type="text" placeholder="Local da Infração" value={formData.local_infracao} onChange={(e) => setFormData({ ...formData, local_infracao: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-4">Dados da Infração</h3>
            <div className="space-y-3">
              <select value={formData.infracao_id} onChange={(e) => setFormData({ ...formData, infracao_id: e.target.value })} className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" >
                <option value="">Infração</option>
                {infracoes.map(i => (<option key={i.id} value={i.id}>{i.codigo} - {i.descricao}</option>))}
              </select>
              <div className="relative">
                <textarea placeholder="Descrição do Fato" value={formData.descricao_fato} onChange={(e) => setFormData({ ...formData, descricao_fato: e.target.value })} rows={4} className="w-full px-3 py-2.5 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm" />
                <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"><Mic className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Situação do preenchimento</span>
              <span className="text-sm text-gray-600 font-medium">{formData.situacao}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button onClick={() => handleSubmit('save')} disabled={loading} className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-600 transition active:scale-95 disabled:opacity-50 text-sm sm:text-base">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={handleDelete} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold hover:bg-red-700 transition active:scale-95 text-sm sm:text-base">
              Excluir
            </button>
          </div>
          <button onClick={() => handleSubmit('send')} disabled={loading} className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition active:scale-95 disabled:opacity-50 text-sm sm:text-base">
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>

      {isAttachModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-6 m-4 w-full max-w-xs shadow-xl">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Escolha uma opção</h2>
            <div className="flex justify-around">
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><Camera size={32} /></div>
                <span className="font-medium">Câmera</span>
              </button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><ImageIcon size={32} /></div>
                <span className="font-medium">Galeria</span>
              </button>
              <button onClick={() => pdfInputRef.current?.click()} className="flex flex-col items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><FileText size={32} /></div>
                <span className="font-medium">PDF</span>
              </button>
            </div>
            <button onClick={() => setAttachModalOpen(false)} className="w-full mt-8 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-4 sm:p-6 m-4 w-full max-w-lg shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-semibold text-gray-800">Galeria de Fotos</h2>
              <button onClick={() => setViewModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={24} className="text-gray-600" /></button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {attachments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 py-16">
                  <Camera size={48} className="mb-4" />
                  <p className="font-medium">Nenhuma imagem encontrada para este STPC.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {attachments.map(att => (
                    <div key={att.id} className="relative group border rounded-lg overflow-hidden">
                      {att.type === 'image' ? (
                        <img src={att.preview} alt={att.file.name} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 flex flex-col items-center justify-center p-2">
                          <FileText size={40} className="text-gray-400" />
                          <p className="text-xs text-center text-gray-600 mt-2 truncate w-full">{att.file.name}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                        <button onClick={() => handleDeleteAttachment(att.id)} className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}