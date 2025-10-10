import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Save, Trash2, Paperclip, Eye, X as CloseIcon, Camera, Image as ImageIcon, FileText, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAuditById, saveAudit } from '../lib/storage';
import { apiService, Veiculo, Linha, Preposto, Infracao, Operadora, PreAutoData, DocumentoData, Localidade } from '../service/apiService.ts'; 
import { ErrorPopup, PopupType } from './ErrorPopup'; 

// --- Interfaces e Tipos ---
type Attachment = { id: string; file: File; preview: string; type: 'image' | 'pdf'; };
interface AutoInfracaoFormProps { onBack: () => void; auditId?: string | null; }

// --- Componente de Seção Reutilizável para o Layout ---
const FormSection = ({ title, children, isLoading = false }: { title: string, children: React.ReactNode, isLoading?: boolean }) => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-3">
            {title} {isLoading && <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800"></span>}
        </h3>
        <div className="space-y-4">{children}</div>
    </div>
);

// --- Componente Principal ---
export function AutoInfracaoForm({ onBack, auditId }: AutoInfracaoFormProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [popup, setPopup] = useState<{ message: string; type: PopupType } | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(false);

    // Estados para dados de apoio
    const [operadoras, setOperadoras] = useState<Operadora[]>([]);
    const [vehicles, setVehicles] = useState<Veiculo[]>([]);
    const [linhas, setLinhas] = useState<Linha[]>([]);
    const [prepostos, setPrepostos] = useState<Preposto[]>([]);
    const [infracoes, setInfracoes] = useState<Infracao[]>([]);
    const [localidades, setLocalidades] = useState<Localidade[]>([]); 

    // Estados para anexos e modais
    const [isAttachModalOpen, setAttachModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    // Valores iniciais vazios, exceto data e hora.
    const initialFormData = {
        id: '', numero: '', 
        tipo: 'STPC', ordem_servico: '', 
        data_infracao: new Date().toISOString().split('T')[0],
        hora_infracao: new Date().toTimeString().slice(0, 5),
        sigla_operador: '', nome_operador: '', sigla_servico: '',
        vehicle_id: '', numero_veiculo: '', placa: '', marca_modelo: '', cor: '', ano_fabricacao: '', 
        preposto_id: '', nome_preposto: '', numero_preposto: '', linha_id: '', codigo_linha: '', denominacao_linha: '',
        regiao_administrativa: '', local_infracao: '', infracao_id: '', descricao_fato: '', situacao: 'Em andamento', 
        created_at: new Date().toISOString(), attachment_names: [] as string[],
        
        // IDs Numéricos para a API
        id_permissao: 0, 
        id_perm_vei: 0, 
        id_localidade: 0,
        latitude: -15.799, 
        longitude: -47.864,
    };
    const [formData, setFormData] = useState(initialFormData);

    // --- Funções de Carregamento de Dados de Apoio ---
    
    // Função para carregar os dados que dependem da Operadora (siglaServico) e da Data
    const loadDependentData = useCallback(async (operadoraSiglaServico: string, dataFiltro: string) => {
        setIsDataLoading(true);
        try {
            const [linhasData, prepostosData] = await Promise.all([
                apiService.getLinhas(operadoraSiglaServico, dataFiltro),
                apiService.getPrepostos(operadoraSiglaServico)

            ]);
            setLinhas(linhasData);
            setPrepostos(prepostosData);
        } catch (error: any) {
            console.error('Erro ao carregar dados dependentes:', error);
            setPopup({ message: `Erro ao carregar Linhas/Prepostos.`, type: 'error' });
            setLinhas([]);
            setPrepostos([]);
        } finally {
            setIsDataLoading(false);
        }
    }, []);

    // Função para carregar dados gerais (Operadoras filtradas por Data + Veículos/Localidades/Infrações)
    const loadSupportData = useCallback(async (dataFiltro: string) => {
        setIsDataLoading(true);
        try {
            // 1. Busca Operadoras FILTRADAS PELA DATA
            const ops = await apiService.getOperadoras(dataFiltro);
            setOperadoras(ops);
            
            // 2. Busca Veículos, Infrações e Localidades
            const [vehiclesData, infracoesData, localidadesData] = await Promise.all([
                apiService.getVeiculos(),
                apiService.getInfracoes(),
                apiService.getLocalidades(),
            ]);
            setVehicles(vehiclesData);
            setInfracoes(infracoesData);
            setLocalidades(localidadesData);

        } catch (error: any) {
             console.error('Erro ao carregar dados de apoio:', error);
             setPopup({ message: 'Erro ao carregar dados de apoio. Tente novamente.', type: 'error' });
             setOperadoras([]);
             setVehicles([]);
        } finally {
            setIsDataLoading(false);
        }
    }, []);

    // --- Efeito Inicial e Carregamento ---
    useEffect(() => {
        loadSupportData(formData.data_infracao); 
        
        if (auditId) {
            setIsNew(false);
            const existingAudit = getAuditById(auditId);
            if (existingAudit) {
                setFormData(prev => ({ ...prev, ...existingAudit }));
                if (existingAudit.sigla_operador) {
                    loadDependentData(existingAudit.sigla_operador, existingAudit.data_infracao);
                }
            }
        } else {
            setIsNew(true);
        }
    }, [auditId, loadSupportData]);


    // --- Handlers de Mudança de Formulário e Filtros ---

    const handleDateChange = (date: string) => {
        // 1. Atualiza a data no formulário e limpa dados dependentes
        setFormData(prev => ({ 
            ...prev, 
            data_infracao: date,
            sigla_operador: '', nome_operador: '', 
            linha_id: '', preposto_id: '', 
            id_permissao: 0, id_perm_vei: 0,
        }));
        // 2. Recarrega as Operadoras filtradas pela nova data
        loadSupportData(date);
    }
    
    // CORREÇÃO: Usa o idPermissao para o valor do select e a siglaServico para o filtro dependente
    const handleOperadoraSelect = (idPermissaoString: string) => {
        const idPermissao = parseInt(idPermissaoString);
        const selectedOp = operadoras.find(o => o.idPermissao === idPermissao);
        
        // 1. Resetar filtros dependentes e setar a Operadora
        setFormData(prev => ({
            ...prev,
            // Usando siglaServico como chave de filtro para dependentes (Linhas, Prepostos)
            sigla_operador: selectedOp?.siglaServico || '', 
            nome_operador: selectedOp?.nomeOperadora || '',
            // Setando o ID da Permissão (ID do Operador/Viação)
            id_permissao: idPermissao,
            linha_id: '', codigo_linha: '', denominacao_linha: '',
            preposto_id: '', nome_preposto: '', numero_preposto: '',
            vehicle_id: '', numero_veiculo: '', placa: '', marca_modelo: '', cor: '', ano_fabricacao: '', id_perm_vei: 0,
        }));
        
        // 2. Carrega dados dependentes, usando siglaServico
        if (selectedOp && selectedOp.siglaServico) {
            loadDependentData(selectedOp.siglaServico, formData.data_infracao); 
        } else {
            setLinhas([]);
            setPrepostos([]);
        }
    }

    const handleVehicleSelect = (id: string) => { 
        const idNum = parseInt(id);
        const v = vehicles.find(i => i.id === idNum); 
        if (v) {
             setFormData(p => ({
                ...p, 
                vehicle_id: id, 
                numero_veiculo: v.numeroVeiculo || '', 
                placa: v.placa || '', 
                marca_modelo: v.modeloVeiculo || '', 
                cor: v.corVeiculo || '', 
                ano_fabricacao: v.anoVeiculo?.toString() || '',
                id_perm_vei: v.id,
            }));
        } else {
             setFormData(p => ({ ...p, vehicle_id: '', numero_veiculo: '', placa: '', marca_modelo: '', cor: '', ano_fabricacao: '', id_perm_vei: 0 }));
        }
    }
    
    const handlePrepostoSelect = (id: string) => { 
        const idNum = parseInt(id);
        const p = prepostos.find(i => i.id === idNum); 
        if (p) {
             setFormData(f => ({
                ...f, 
                preposto_id: id, 
                nome_preposto: p.nome, 
                numero_preposto: p.numeroRegPreposto,
            }));
        } else {
             setFormData(f => ({ ...f, preposto_id: '', nome_preposto: '', numero_preposto: '' }));
        }
    }
    
    const handleLinhaSelect = (id: string) => { 
        const idNum = parseInt(id);
        const l = linhas.find(i => i.id === idNum); 
        if (l) {
             setFormData(p => ({
                ...p, 
                linha_id: id, 
                codigo_linha: l.cdLinha, 
                denominacao_linha: l.denominacaoLinha,
                id_permissao: l.id,
            }));
        } else {
            setFormData(p => ({ ...p, linha_id: '', codigo_linha: '', denominacao_linha: '', id_permissao: 0 }));
        }
    }

    // --- Lógica de Ação (Salvar Local e Enviar para API) ---

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files; if (!files) return;
        
        if (attachments.length + files.length > 1) {
             setPopup({ message: 'Apenas um arquivo pode ser anexado por vez para o envio do auto.', type: 'info' });
        }
        
        const newAttachments: Attachment[] = Array.from(files).slice(0, 1 - attachments.length).map(file => ({
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
    
    const handleAction = async (action: 'save' | 'send') => {
        if (!user) { setPopup({ message: 'Usuário não autenticado.', type: 'error' }); return; }

        if (action === 'save') {
            const dataToSave = { 
                ...formData, 
                id: isNew ? crypto.randomUUID() : formData.id, 
                created_at: isNew ? new Date().toISOString() : formData.created_at, 
                attachment_names: attachments.map(a => a.file.name), 
                situacao: 'Em andamento'
            };
            saveAudit(dataToSave); 
            setPopup({ message: 'Auto salvo localmente com sucesso!', type: 'success' });
            onBack(); 
            return;
        }

        if (attachments.length === 0 || !formData.id_permissao || !formData.id_perm_vei || !formData.infracao_id || !formData.id_localidade) {
             setPopup({ message: 'Preencha todos os campos obrigatórios (Operadora, Veículo, Linha, Infração, Localidade) e anexe um arquivo para enviar.', type: 'info' });
             return;
        }
        
        setLoading(true);

        try {
            const firstAttachment = attachments[0].file;
            const documentoPayload: DocumentoData = { IdUsuario: user.id, usuarioWeb: user.sigla };

            const preAutosPayload: PreAutoData[] = [{
                idFuncionario: user.id,
                idPermissao: formData.id_permissao,
                idInfracao: parseInt(formData.infracao_id),
                dataAutuacao: `${formData.data_infracao}T${formData.hora_infracao}:00Z`, 
                horaAutuacao: `${formData.data_infracao}T${formData.hora_infracao}:00Z`, 
                dataCadastramentoAuto: new Date().toISOString().slice(0, 19) + 'Z',
                localAutuacao: formData.local_infracao || 'DISTRITO FEDERAL',
                observacao: formData.descricao_fato || 'INFORMAÇÃO SEM VALOR',
                idPreposto: parseInt(formData.preposto_id) || 0,
                idLinha: formData.id_permissao, 
                idPermVei: formData.id_perm_vei, 
                usuarioWeb: user.sigla,
                placa: formData.placa,
                numeroVeiculo: formData.numero_veiculo,
                numeroRegPreposto: formData.numero_preposto,
                nomePreposto: formData.nome_preposto,
                cdLinha: formData.codigo_linha,
                denominacaoLinha: formData.denominacao_linha,
                modeloVeiculo: formData.marca_modelo,
                anoVeiculo: parseInt(formData.ano_fabricacao) || 0, 
                corVeiculo: formData.cor,
                serie: null, idTipoAuto: null, cienciaInfrator: null,
                idLocalidade: formData.id_localidade,
                Latitude: formData.latitude, Longitude: formData.longitude,
                LatitudeImagem: formData.latitude, LongitudeImagem: formData.longitude,
            }];

            const createResponse = await apiService.createAuto(preAutosPayload, documentoPayload, firstAttachment);

            const dataToSave = { 
                ...formData, 
                id: isNew ? crypto.randomUUID() : formData.id, 
                created_at: isNew ? new Date().toISOString() : formData.created_at, 
                attachment_names: attachments.map(a => a.file.name), 
                situacao: 'Enviado',
                numero: createResponse.data.numeroAutoGerado || 'N/A', 
            };
            saveAudit(dataToSave);
            
            setPopup({ message: 'Auto enviado e protocolado no SEI com sucesso!', type: 'success' });
            onBack();
            
        } catch (error: any) {
            console.error('Erro ao enviar Auto de Infração:', error.response?.data || error.message);
            const apiError = error.response?.data?.error || error.message || 'Erro ao enviar o auto. Tente novamente.';
            setPopup({ message: apiError, type: 'error' });
        } finally {
            setLoading(false);
        }
    };
    
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
                    {/* Exibir o número do auto gerado/salvo como texto estático (Regra de Negócio) */}
                    {formData.numero && (
                        <p className="text-sm font-semibold text-slate-700">
                            Número do Auto: <span className="font-bold text-slate-900">{formData.numero}</span>
                        </p>
                    )}
                    <input type="text" placeholder="Ordem de Serviço de Auditoria Fiscal" value={formData.ordem_servico} onChange={e => setFormData({ ...formData, ordem_servico: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                </FormSection>

                {/* DADOS TEMPORAIS (Regra: Filtro por data) */}
                <FormSection title="Dados Temporais">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Data da Infração *</label>
                            <input 
                                type="date" 
                                value={formData.data_infracao} 
                                onChange={e => handleDateChange(e.target.value)} // Chama o handler de filtro
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Hora da Infração *</label>
                            <input 
                                type="time" 
                                value={formData.hora_infracao} 
                                onChange={e => setFormData({ ...formData, hora_infracao: e.target.value })} 
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" 
                            />
                        </div>
                    </div>
                </FormSection>

                {/* DADOS DA OPERADORA (Regra: Filtrado pela Data) */}
                <FormSection title="Dados da Operadora (Viação)" isLoading={isDataLoading && operadoras.length === 0}>
                    <select 
                        // O valor do select é o idPermissao (numérico)
                        value={formData.id_permissao || ''} 
                        onChange={e => handleOperadoraSelect(e.target.value)} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                        <option value="">{operadoras.length > 0 ? 'Selecione a Operadora *' : 'Nenhuma Operadora para esta data'}</option>
                        {/* Usamos idPermissao como value e siglaServico para o filtro dependente */}
                        {operadoras.map(op => (
                            <option key={op.idPermissao} value={op.idPermissao}>{op.siglaServico} - {op.nomeOperadora}</option>
                        ))}
                    </select>
                    <input type="text" placeholder="Nome do Operador" value={formData.nome_operador} readOnly disabled className="w-full px-4 py-3 border-2 bg-gray-100 border-gray-200 rounded-xl" />
                    <input type="text" placeholder="Sigla do Serviço" value={formData.sigla_servico} readOnly disabled className="w-full px-4 py-3 border-2 bg-gray-100 border-gray-200 rounded-xl" />
                </FormSection>
                
                <FormSection title="Anexos">
                    <div className="flex gap-4">
                        <button onClick={() => setAttachModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition"><Paperclip className="w-5 h-5" /> Anexar</button>
                        <button onClick={() => setViewModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition"><Eye className="w-5 h-5" /> Visualizar ({attachments.length})</button>
                    </div>
                    {attachments.length > 0 && <p className="text-xs text-green-600 font-medium">1 arquivo anexado e pronto para envio.</p>}
                </FormSection>

                {/* DADOS DO VEÍCULO (Regra: Filtrado pela Operadora) */}
                <FormSection title="Dados do Veículo">
                    <select 
                        value={formData.vehicle_id} 
                        onChange={e => handleVehicleSelect(e.target.value)} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        disabled={!formData.sigla_operador || isDataLoading}
                    >
                        <option value="">{formData.sigla_operador ? 'Selecionar Veículo *' : 'Selecione a Operadora primeiro'}</option>
                        {vehicles.map(v => (<option key={v.id} value={v.id}>{v.placa} - {v.modeloVeiculo}</option>))}
                    </select>
                    {/* Campos de Veículo (mantidos) */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="N° do Veículo" value={formData.numero_veiculo} onChange={e => setFormData({ ...formData, numero_veiculo: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                        <input type="text" placeholder="Placa" value={formData.placa} onChange={e => setFormData({ ...formData, placa: e.target.value.toUpperCase() })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 uppercase" />
                    </div>
                    <input type="text" placeholder="Marca/Modelo do Veículo" value={formData.marca_modelo} onChange={e => setFormData({ ...formData, marca_modelo: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Cor" value={formData.cor} onChange={e => setFormData({ ...formData, cor: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                        <input type="text" placeholder="Ano de Fabricação" value={formData.ano_fabricacao} onChange={e => setFormData({ ...formData, ano_fabricacao: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                </FormSection>

                {/* DADOS DO PREPOSTO (Regra: Filtrado pela Operadora) */}
                <FormSection title="Dados do Preposto">
                    <select 
                        value={formData.preposto_id} 
                        onChange={e => handlePrepostoSelect(e.target.value)} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                         disabled={!formData.sigla_operador || isDataLoading}
                    >
                        <option value="">{formData.sigla_operador ? 'Selecione o Preposto *' : 'Selecione a Operadora primeiro'}</option>
                        {prepostos.map(p => (<option key={p.id} value={p.id}>{p.nome} - {p.numeroRegPreposto}</option>))}
                    </select>
                    {/* Campos de Preposto (mantidos) */}
                    <input type="text" placeholder="Nome do Preposto" value={formData.nome_preposto} onChange={e => setFormData({ ...formData, nome_preposto: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                    <input type="text" placeholder="Número do Preposto" value={formData.numero_preposto} onChange={e => setFormData({ ...formData, numero_preposto: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                </FormSection>
                
                {/* DADOS DA LINHA (Regra: Filtrado pela Operadora e Data) */}
                <FormSection title="Dados da Linha">
                    <select 
                        value={formData.linha_id} 
                        onChange={e => handleLinhaSelect(e.target.value)} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                         disabled={!formData.sigla_operador || isDataLoading}
                    >
                        <option value="">{formData.sigla_operador ? 'Selecione a Linha *' : 'Selecione a Operadora primeiro'}</option>
                        {linhas.map(l => (<option key={l.id} value={l.id}>{l.cdLinha} - {l.denominacaoLinha}</option>))}
                    </select>
                    {/* Campos de Linha (mantidos) */}
                    <input type="text" placeholder="Código da Linha" value={formData.codigo_linha} onChange={e => setFormData({ ...formData, codigo_linha: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                    <input type="text" placeholder="Denominação da Linha" value={formData.denominacao_linha} onChange={e => setFormData({ ...formData, denominacao_linha: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                </FormSection>

                {/* DADOS QUE NÃO DEPENDEM DA OPERADORA */}
                <FormSection title="Local da Infração">
                    <select 
                        value={formData.id_localidade} 
                        onChange={e => setFormData({ ...formData, id_localidade: parseInt(e.target.value) || 0 })} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                        <option value={0}>Região Administrativa (RA) *</option>
                        {localidades.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.descricao}</option>
                        ))}
                    </select>
                    <input type="text" placeholder="Local da Infração (Ponto de Referência)" value={formData.local_infracao} onChange={e => setFormData({ ...formData, local_infracao: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                    <div className="grid md:grid-cols-2 gap-4">
                         <input type="number" placeholder="Latitude" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                        <input type="number" placeholder="Longitude" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                    </div>
                </FormSection>
                
                <FormSection title="Dados da Infração">
                    <select 
                        value={formData.infracao_id} 
                        onChange={e => setFormData({ ...formData, infracao_id: e.target.value })} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                        <option value="">Selecione a Infração *</option>
                        {infracoes.map(i => (<option key={i.id} value={i.id}>{i.codigo} - {i.descricao}</option>))}
                    </select>
                    <textarea placeholder="Descrição do Fato..." value={formData.descricao_fato} onChange={e => setFormData({ ...formData, descricao_fato: e.target.value })} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
                </FormSection>

                {/* --- RODAPÉ COM BOTÕES --- */}
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600">Situação do preenchimento</span>
                        <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">{formData.situacao}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleAction('save')} 
                            disabled={loading} 
                            className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" /> {loading ? 'Aguarde...' : 'Salvar Local'}
                        </button>
                        <button 
                            onClick={() => handleAction('send')} 
                            disabled={loading || attachments.length === 0 || !formData.id_permissao || !formData.id_perm_vei || !formData.infracao_id || !formData.id_localidade} 
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Send className="w-5 h-5" /> {loading ? 'Enviando...' : 'Enviar Auto'}
                        </button>
                    </div>
                    {!isNew && (
                        <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold transition active:scale-95 flex items-center justify-center gap-2">
                            <Trash2 className="w-5 h-5" /> Excluir
                        </button>
                    )}
                </div>
            </div>
            
            {/* --- MODAIS DE ANEXO E VISUALIZAÇÃO --- */}
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
                        <div className="flex-grow overflow-y-auto">
                            {attachments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 py-16"><ImageIcon size={48} className="mb-4" /><p>Nenhum anexo encontrado.</p></div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {attachments.map(att => (
                                        <div key={att.id} className="relative group border rounded-lg overflow-hidden">
                                            {att.type === 'image' ? (
                                                <img src={att.preview} alt={att.file.name} className="w-full h-32 object-cover" />
                                            ) : (
                                                <div className="w-full h-32 bg-gray-100 flex flex-col items-center justify-center p-2">
                                                    <FileText size={40} className="text-gray-400" />
                                                    <p className="text-xs text-center mt-2 truncate w-full">{att.file.name}</p>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                                <button onClick={() => handleDeleteAttachment(att.id)} className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100">
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


            {popup && (
                <ErrorPopup
                    message={popup.message}
                    type={popup.type}
                    onClose={() => setPopup(null)}
                />
            )}
        </div>
    );
}