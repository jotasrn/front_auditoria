import axios, { AxiosResponse } from 'axios';
import MD5 from 'crypto-js/md5';
import type {
  FuncionarioDetalhe,
  Operadora,
  Veiculo,
  Linha,
  Preposto,
  Infracao,
  Localidade,
  PreAutoData,
  DocumentoData,
  CreateAutoResponse
} from '../../types';

const BASE_URL = 'http://10.233.144.111:8080';
const BASIC_AUTH_USER = 'LEVEL_33';
const BASIC_AUTH_PASS = 'SEMOB_LEVEL_33_DESEN';
const basicAuthHeader = `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASS}`)}`;

export const apiService = {
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

    async getOperadoras(date: string = new Date().toISOString().split('T')[0]): Promise<Operadora[]> {
        const url = `${BASE_URL}/operadoras/${date}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    async getVeiculos(): Promise<Veiculo[]> {
        const url = `${BASE_URL}/veiculo`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    async getLinhas(operadoraSigla: string, date: string = new Date().toISOString().split('T')[0]): Promise<Linha[]> {
        const url = `${BASE_URL}/linhas/${operadoraSigla}/${date}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    async getPrepostos(operadoraSigla: string): Promise<Preposto[]> {
        const url = `${BASE_URL}/preposto/${operadoraSigla}`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    async getInfracoes(): Promise<Infracao[]> {
        const url = `${BASE_URL}/infracao`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

    async getLocalidades(): Promise<Localidade[]> {
        const url = `${BASE_URL}/localidades`;
        const response = await axios.get(url, { headers: { 'Authorization': basicAuthHeader } });
        return response.data;
    },

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

    async sendToSEI(idFuncionario: number): Promise<AxiosResponse<any>> {
        const url = `${BASE_URL}/criar/autos/enviar/${idFuncionario}`;
        return axios.post(url, {});
    },
};
