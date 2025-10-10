import axios, { AxiosResponse } from 'axios';
import MD5 from 'crypto-js/md5';

// Endereço base da sua API
const BASE_URL = 'http://10.233.144.111:8080';
const BASIC_AUTH_USER = 'LEVEL_33';
const BASIC_AUTH_PASS = 'SEMOB_LEVEL_33_DESEN';
const basicAuthHeader = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASS}`)}`;


// --- 1. Interfaces de Dados de Retorno da API (ALINHAMENTO COMPLETO) ---

export interface FuncionarioDetalhe {
    IdUsuario: number;
    IdFuncionario: number;
    NomeFuncionario: string;
    email?: string;
}

export interface Operadora {
    idPermissao: number;
    nomeOperadora: string;
    siglaServico: string;
}

export interface Veiculo {
    id: number; // ID usado como idPermVei
    placa: string;
    numeroVeiculo: string;
    modeloVeiculo: string;
    corVeiculo: string;
    anoVeiculo: number;
}

export interface Linha {
    idLinha: number; // ID da Linha
    nomeOperadora: string;
    codigoLinha: string; // Código da Linha
    denominacaoLinha: string;
}

export interface Preposto {
    idPreposto: number; // ID do Preposto (Usado para filtro)
    NomeOperadora: string; // Nome da Operadora
    NomePreposto: string; // Nome Completo do Preposto
}

export interface Infracao {
    idInfracao: number;
    codigoInfracao: number; 
    descricaoInfracao: string;
}

export interface CreateAutoResponse {
    message: string;
    numeroDocumento: string;
    arquivo: any;
}

export interface Localidade {
    id: number;
    descricao: string;
}

export interface PreAutoData {
    idFuncionario: number;
    idPermissao: number;
    idInfracao: number;
    dataAutuacao: string;
    horaAutuacao: string;
    localAutuacao: string;
    observacao: string;
    dataCadastramentoAuto: string;
    idPreposto: number;
    idLinha: number;
    idPermVei: number;
    serie: string | null;
    idTipoAuto: number | null;
    usuarioWeb: string;
    placa: string;
    numeroVeiculo: string;
    numeroRegPreposto: string;
    nomePreposto: string;
    cdLinha: string;
    denominacaoLinha: string;
    modeloVeiculo: string;
    anoVeiculo: number;
    corVeiculo: string;
    cienciaInfrator: boolean | null;
    idLocalidade: number;
    Latitude: number;
    Longitude: number;
    LatitudeImagem: number;
    LongitudeImagem: number;
}

export interface DocumentoData {
    IdUsuario: number;
    usuarioWeb: string;
}


export const apiService = {
    /** Converte a senha para MD5*/
    convertToMd5Hex(password: string): string {
        return MD5(password).toString().toUpperCase();
    },

    // --- ENDPOINTS DE AUTENTICAÇÃO ---

    async login(username: string, senha: string): Promise<AxiosResponse<any>> {
        const url = `${BASE_URL}/valida-md5/validar`;
        const senhaHasheada = this.convertToMd5Hex(senha);
        try {
            const response = await axios.post(url, { username, senha: senhaHasheada });
            if (response.data.mensagem !== 'Acesso permitido') {
                const apiMessage = response.data.message || 'Credenciais inválidas.';
                throw new Error(apiMessage);
            }

            return response;

        } catch (error: any) {

            const status = error.response?.status;

            if (status === 401) {
                throw new Error('Usuário ou senha inválidos.');
            } else if (status === 403) {
                throw new Error('Acesso não permitido. Entre em contato com o Administrador.');
            } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                throw new Error('Tempo limite da conexão esgotado. Verifique sua rede.');
            } else if (error.response) {
                const apiMessage = error.response.data.message || `Erro no servidor: ${status}`;
                throw new Error(apiMessage);
            } else {
                throw new Error('Erro de conexão: Verifique sua conexão com a internet.');
            }
        }
    },

    async getFuncionarioDetails(userId: number): Promise<FuncionarioDetalhe[]> {
        const url = `${BASE_URL}/funcionario/${userId}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    async updatePassword(username: string, novaSenha: string): Promise<AxiosResponse<any>> {
        const url = `${BASE_URL}/valida-md5/update`;
        return axios.put(url, { username, novaSenha });
    },


    // --- ENDPOINTS DE DADOS DE APOIO ---

    /** BUSCA AS OPERADORAS (VIAÇÃO) ATIVAS */
    async getOperadoras(date: string = new Date().toISOString().split('T')[0]): Promise<Operadora[]> {
        // CORRIGIDO: Voltando à rota plural via path segment, que é o formato mais provável
        // (Apesar de ser inconsistente com a rota singular, falhou menos nos testes)
        const url = `${BASE_URL}/operadoras/${date}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data; 
    },

    /** BUSCA TODOS OS VEÍCULOS */
    async getVeiculos(): Promise<Veiculo[]> {
        const url = `${BASE_URL}/veiculo`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** BUSCA LINHAS DE UMA OPERADORA PARA UMA DATA */
    async getLinhas(operadoraSigla: string, date: string = new Date().toISOString().split('T')[0]): Promise<Linha[]> {
        // CORRIGIDO: Rota via path segment (plural)
        const url = `${BASE_URL}/linhas/${operadoraSigla}/${date}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** BUSCA PREPOSTOS DE UMA OPERADORA */
    async getPrepostos(operadoraSigla: string): Promise<Preposto[]> {
        // CORRIGIDO: Rota via path segment (singular)
        const url = `${BASE_URL}/preposto/${operadoraSigla}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** BUSCA TODAS AS INFRAÇÕES */
    async getInfracoes(): Promise<Infracao[]> {
        const url = `${BASE_URL}/infracao`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** BUSCA LOCALIDADES (REGIÕES ADMINISTRATIVAS) */
    async getLocalidades(): Promise<Localidade[]> {
        // CORRIGIDO: Rota plural (mais segura)
        const url = `${BASE_URL}/localidades`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    // --- ENDPOINTS DE CRIAÇÃO E ENVIO ---

    async getQuantidadePreAutos(userId: number): Promise<AxiosResponse<any>> {
        const url = `${BASE_URL}/funcionario/preautos/${userId}`;
        return axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
    },

    async createAuto(preAutos: PreAutoData[], documento: DocumentoData, arquivo: File): Promise<AxiosResponse<CreateAutoResponse>> {
        const url = `${BASE_URL}/criar/autos`;

        const formData = new FormData();

        formData.append('documento', JSON.stringify(documento));
        formData.append('preAutos', JSON.stringify(preAutos));
        
        formData.append('arquivo', arquivo);

        return axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    /** Envia um auto de infração (ou lote de autos) para o SEI */
    async sendToSEI(idFuncionario: number): Promise<AxiosResponse<any>> {
        const url = `${BASE_URL}/criar/autos/enviar/${idFuncionario}`;
        return axios.post(url, {});
    },
};