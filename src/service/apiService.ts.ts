import axios, { AxiosResponse } from 'axios';
import MD5 from 'crypto-js/md5';

const BASE_URL = 'http://10.233.144.111:8080';
const BASIC_AUTH_USER = 'LEVEL_33';
const BASIC_AUTH_PASS = 'SEMOB_LEVEL_33_DESEN';
const basicAuthHeader = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASS}`)}`;


export interface FuncionarioDetalhe {
    IdUsuario: number;
    IdFuncionario: number;
    NomeFuncionario: string;
}

export interface Operadora {
    idPermissao: number;
    nomeOperadora: string;
    siglaServico: string
}

export interface Veiculo {
    id: number;
    placa: string;
    numeroVeiculo: string;
    modeloVeiculo: string;
    corVeiculo: string;
    anoVeiculo: number;
}

export interface Linha {
    id: number;
    cdLinha: string;
    denominacaoLinha: string;
}

export interface Preposto {
    id: number;
    nome: string;
    numeroRegPreposto: string;
}

export interface Infracao {
    id: number;
    codigo: string;
    descricao: string;
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
                // Credenciais inválidas ou usuário inativo (mensagem padrão do backend para 401)
                throw new Error('Usuário ou senha inválidos.');
            } else if (status === 403) {
                // Acesso proibido (403)
                throw new Error('Acesso não permitido. Entre em contato com o Administrador.');
            } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                // Erro de tempo limite
                throw new Error('Tempo limite da conexão esgotado. Verifique sua rede.');
            } else if (error.response) {
                // Outro erro de servidor (e.g., 500)
                const apiMessage = error.response.data.message || `Erro no servidor: ${status}`;
                throw new Error(apiMessage);
            } else {
                // Erro de rede ou desconexão (não chegou ao servidor)
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


    /** Busca as Operadoras (Viação) ativas */
    async getOperadoras(date: string = new Date().toISOString().split('T')[0]): Promise<Operadora[]> {
        const url = `${BASE_URL}/operadoras/${date}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data; 
    },

    /** Busca todos os Veículos */
    async getVeiculos(): Promise<Veiculo[]> {
        const url = `${BASE_URL}/veiculo`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** Busca Linhas de uma Operadora para uma data */
    async getLinhas(operadoraSigla: string, date: string = new Date().toISOString().split('T')[0]): Promise<Linha[]> {
        const url = `${BASE_URL}/linhas/${operadoraSigla}/${date}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** Busca Prepostos de uma Operadora */
    async getPrepostos(operadoraSigla: string): Promise<Preposto[]> {
        const url = `${BASE_URL}/preposto/${operadoraSigla}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** Busca todas as Infrações */
    async getInfracoes(): Promise<Infracao[]> {
        const url = `${BASE_URL}/infracao`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** Busca Localidades (Regiões Administrativas) */
    async getLocalidades(): Promise<Localidade[]> {
        const url = `${BASE_URL}/localidades`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    /** Obtém a quantidade de pré-autos de um funcionário */
    async getQuantidadePreAutos(userId: number): Promise<AxiosResponse<any>> {
        const url = `${BASE_URL}/funcionario/preautos/${userId}`;
        return axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
    },

    /** Cria/registra um Auto de Infração no backend, incluindo o arquivo de anexo */
    async createAuto(preAutos: PreAutoData[], documento: DocumentoData, arquivo: File): Promise<AxiosResponse<any>> {
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