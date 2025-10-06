import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Trash2, Paperclip, Eye, X as CloseIcon, Camera, Image as ImageIcon, FileText, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAuditById, saveAudit } from '../lib/storage';
import { mockVehicles, mockLinhas, mockPrepostos, mockInfracoes } from '../lib/mock-data';

// --- Interfaces e Tipos ---
type Attachment = { id: string; file: File; preview: string; type: 'image' | 'pdf'; };
interface AutoInfracaoFormProps { onBack: () => void; auditId?: string | null; }

// --- Componente de Seção Reutilizável para o Layout ---
const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-3">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

export function AutoInfracaoForm({ onBack, auditId }: AutoInfracaoFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // Estados para dropdowns
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [linhas, setLinhas] = useState<any[]>([]);
  const [prepostos, setPrepostos] = useState<any[]>([]);
  const [infracoes, setInfracoes] = useState<any[]>([]);

  // Estados para anexos e modais
  const [isAttachModalOpen, setAttachModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: '', numero: '', tipo: 'STPC', ordem_servico: '',
    data_infracao: new Date().toISOString().split('T')[0],
    hora_infracao: new Date().toTimeString().slice(0, 5),
    sigla_operador: '', nome_operador: '', sigla_servico: '',
    vehicle_id: '', numero_veiculo: '', placa: '', marca_modelo: '', cor: '', ano_fabricacao: '', 
    preposto_id: '', nome_preposto: '', numero_preposto: '', linha_id: '', codigo_linha: '', denominacao_linha: '',
    regiao_administrativa: '', local_infracao: '', infracao_id: '', descricao_fato: '', situacao: 'Em andamento',
    created_at: new Date().toISOString(), attachment_names: [] as string[],
  });

  useEffect(() => {
    setVehicles(mockVehicles); setLinhas(mockLinhas); setPrepostos(mockPrepostos); setInfracoes(mockInfracoes);
    if (auditId) {
      setIsNew(false);
      const existingAudit = getAuditById(auditId);
      if (existingAudit) setFormData(existingAudit);
    } else {
      setIsNew(true);
      if (user) setFormData(prev => ({ ...prev, nome_operador: user.full_name || '', sigla_operador: user.sigla || '' }));
    }
  }, [auditId, user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; if (!files) return;
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(), file, preview: URL.createObjectURL(file), type: file.type.startsWith('image/') ? 'image' : 'pdf',
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    setAttachModalOpen(false);
  };

  const handleDeleteAttachment = (idToDelete: string) => {
    const attachmentToDelete = attachments.find(att => att.id === idToDelete);
    if (attachmentToDelete) URL.revokeObjectURL(attachmentToDelete.preview);
    setAttachments(prev => prev.filter(att => att.id !== idToDelete));
  };
  
  const handleAction = (action: 'save' | 'send') => {
    setLoading(true);
    const newSituacao = action === 'send' ? 'Enviado' : 'Em andamento';
    const dataToSave = { ...formData, id: isNew ? crypto.randomUUID() : formData.id, created_at: isNew ? new Date().toISOString() : formData.created_at, attachment_names: attachments.map(a => a.file.name), situacao: newSituacao };
    setTimeout(() => { saveAudit(dataToSave); setLoading(false); alert(`Auto ${action === 'send' ? 'enviado' : 'salvo'} com sucesso!`); onBack(); }, 1000);
  };
  
  const handleVehicleSelect = (id: string) => { const v = vehicles.find(i=>i.id===id); if(v) setFormData(p=>({...p, vehicle_id:id, numero_veiculo:v.numero_veiculo||'', placa:v.placa||'', marca_modelo:v.marca_modelo||'', cor:v.cor||'', ano_fabricacao:v.ano_fabricacao||''}))}
  const handlePrepostoSelect = (id: string) => { const p = prepostos.find(i=>i.id===id); if(p) setFormData(f=>({...f, preposto_id:id, nome_preposto:p.nome, numero_preposto:p.numero}))}
  const handleLinhaSelect = (id: string) => { const l = linhas.find(i=>i.id===id); if(l) setFormData(p=>({...p, linha_id:id, codigo_linha:l.codigo, denominacao_linha:l.denominacao}))}

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition active:scale-95"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-base sm:text-xl font-semibold text-center">{isNew ? 'Novo Auto de Infração' : `Editando Auto Nº ${formData.numero}`}</h1>
            <div className="w-9" />
          </div>
        </div>
      </div>
      
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="user" onChange={handleFileChange} />
      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
      <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf" multiple onChange={handleFileChange} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        <FormSection title="Auto de Infração – STPC">
          <input type="text" placeholder="Número do Auto" value={formData.numero} onChange={e => setFormData({ ...formData, numero: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
          <input type="text" placeholder="Ordem de Serviço de Auditoria Fiscal" value={formData.ordem_servico} onChange={e => setFormData({ ...formData, ordem_servico: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
        </FormSection>
        
        <FormSection title="Anexos">
            <div className="flex gap-4"><button onClick={() => setAttachModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition"><Paperclip className="w-5 h-5" /> Anexar</button><button onClick={() => setViewModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition"><Eye className="w-5 h-5" /> Visualizar ({attachments.length})</button></div>
        </FormSection>

        <FormSection title="Dados Temporais">
          <div className="grid md:grid-cols-2 gap-4"><div><label className="text-sm font-semibold text-gray-700 mb-1 block">Data da Infração</label><input type="date" value={formData.data_infracao} onChange={e => setFormData({ ...formData, data_infracao: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" /></div><div><label className="text-sm font-semibold text-gray-700 mb-1 block">Hora da Infração</label><input type="time" value={formData.hora_infracao} onChange={e => setFormData({ ...formData, hora_infracao: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" /></div></div>
        </FormSection>

        <FormSection title="Dados do Operador">
          <select value={formData.sigla_operador} className="w-full px-4 py-3 border-2 bg-slate-100 border-gray-200 rounded-xl" disabled><option>{formData.sigla_operador} - {formData.nome_operador}</option></select>
          <input type="text" placeholder="Sigla do Serviço" value={formData.sigla_servico} onChange={e => setFormData({ ...formData, sigla_servico: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
        </FormSection>

        <FormSection title="Dados do Veículo">
          <select value={formData.vehicle_id} onChange={e => handleVehicleSelect(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"><option value="">Selecionar Veículo</option>{vehicles.map(v => (<option key={v.id} value={v.id}>{v.placa} - {v.marca_modelo}</option>))}</select>
          <div className="grid md:grid-cols-2 gap-4"><input type="text" placeholder="N° do Veículo" value={formData.numero_veiculo} onChange={e => setFormData({ ...formData, numero_veiculo: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" /><input type="text" placeholder="Placa" value={formData.placa} onChange={e => setFormData({ ...formData, placa: e.target.value.toUpperCase() })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 uppercase" /></div>
          <input type="text" placeholder="Marca/Modelo do Veículo" value={formData.marca_modelo} onChange={e => setFormData({ ...formData, marca_modelo: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
          <div className="grid md:grid-cols-2 gap-4"><input type="text" placeholder="Cor" value={formData.cor} onChange={e => setFormData({ ...formData, cor: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" /><input type="text" placeholder="Ano de Fabricação" value={formData.ano_fabricacao} onChange={e => setFormData({ ...formData, ano_fabricacao: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" /></div>
        </FormSection>

        <FormSection title="Dados do Preposto">
          <select value={formData.preposto_id} onChange={e => handlePrepostoSelect(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"><option value="">Selecione o Preposto</option>{prepostos.map(p => (<option key={p.id} value={p.id}>{p.nome} - {p.numero}</option>))}</select>
          <input type="text" placeholder="Nome do Preposto" value={formData.nome_preposto} onChange={e => setFormData({ ...formData, nome_preposto: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
          <input type="text" placeholder="Número do Preposto" value={formData.numero_preposto} onChange={e => setFormData({ ...formData, numero_preposto: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
        </FormSection>
        
        <FormSection title="Dados da Linha">
          <select value={formData.linha_id} onChange={e => handleLinhaSelect(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"><option value="">Selecione a Linha</option>{linhas.map(l => (<option key={l.id} value={l.id}>{l.codigo} - {l.denominacao}</option>))}</select>
          <input type="text" placeholder="Código da Linha" value={formData.codigo_linha} onChange={e => setFormData({ ...formData, codigo_linha: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
          <input type="text" placeholder="Denominação da Linha" value={formData.denominacao_linha} onChange={e => setFormData({ ...formData, denominacao_linha: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
        </FormSection>

        <FormSection title="Local da Infração">
          <select value={formData.regiao_administrativa} onChange={e => setFormData({ ...formData, regiao_administrativa: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"><option value="">Região Administrativa (RA)</option><option value="RA I">RA I - Brasília</option><option value="RA II">RA II - Gama</option></select>
          <input type="text" placeholder="Local da Infração" value={formData.local_infracao} onChange={e => setFormData({ ...formData, local_infracao: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
        </FormSection>
        
        <FormSection title="Dados da Infração">
          <select value={formData.infracao_id} onChange={e => setFormData({ ...formData, infracao_id: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"><option value="">Selecione a Infração</option>{infracoes.map(i => (<option key={i.id} value={i.id}>{i.codigo} - {i.descricao}</option>))}</select>
          <textarea placeholder="Descrição do Fato..." value={formData.descricao_fato} onChange={e => setFormData({ ...formData, descricao_fato: e.target.value })} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
        </FormSection>

        {/* Rodapé com botões, agora como a última seção do conteúdo */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 space-y-4">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-600">Situação do preenchimento</span><span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">{formData.situacao}</span></div>
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleAction('save')} disabled={loading} className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"><Save className="w-5 h-5" /> Salvar</button>
                <button onClick={() => handleAction('send')} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"><Send className="w-5 h-5" /> Enviar</button>
            </div>
            {!isNew && (
                <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold transition active:scale-95 flex items-center justify-center gap-2">
                    <Trash2 className="w-5 h-5" /> Excluir
                </button>
            )}
        </div>
      </div>
      
      {isAttachModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-6 m-4 w-full max-w-xs shadow-xl">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Escolha uma opção</h2>
            <div className="flex justify-around">
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2 text-blue-600"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><Camera size={32} /></div><span>Câmera</span></button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2 text-blue-600"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><ImageIcon size={32} /></div><span>Galeria</span></button>
              <button onClick={() => pdfInputRef.current?.click()} className="flex flex-col items-center gap-2 text-blue-600"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><FileText size={32} /></div><span>PDF</span></button>
            </div>
            <button onClick={() => setAttachModalOpen(false)} className="w-full mt-8 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold">Cancelar</button>
          </div>
        </div>
      )}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-4 sm:p-6 m-4 w-full max-w-lg shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4 border-b pb-3"><h2 className="text-xl font-semibold">Galeria de Anexos</h2><button onClick={() => setViewModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><CloseIcon size={24} /></button></div>
            <div className="flex-grow overflow-y-auto">{attachments.length === 0 ? (<div className="flex flex-col items-center justify-center text-center text-gray-500 py-16"><ImageIcon size={48} className="mb-4" /><p>Nenhum anexo encontrado.</p></div>) : (<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{attachments.map(att => (<div key={att.id} className="relative group border rounded-lg overflow-hidden">{att.type === 'image' ? (<img src={att.preview} alt={att.file.name} className="w-full h-32 object-cover" />) : (<div className="w-full h-32 bg-gray-100 flex flex-col items-center justify-center p-2"><FileText size={40} className="text-gray-400" /><p className="text-xs text-center mt-2 truncate w-full">{att.file.name}</p></div>)}<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center"><button onClick={() => handleDeleteAttachment(att.id)} className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button></div></div>))}</div>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}