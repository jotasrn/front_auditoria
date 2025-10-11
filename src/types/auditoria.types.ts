export type StpcPage = 'list' | 'view' | 'form';
export type MainTab = 'inicio' | 'stpc' | 'taxi' | 'stip' | 'pirataria' | 'perfil';

export interface AutoInfracao {
    id: string;
    numero: string;
    tipo: string;
    ordem_servico: string;
    data_infracao: string;
    hora_infracao: string;
    sigla_operador: string;
    nome_operador: string;
    sigla_servico: string;
    vehicle_id: string;
    numero_veiculo: string;
    placa: string;
    marca_modelo: string;
    cor: string;
    ano_fabricacao: string;
    preposto_id: string;
    nome_preposto: string;
    numero_preposto: string;
    linha_id: string;
    codigo_linha: string;
    denominacao_linha: string;
    regiao_administrativa: string;
    local_infracao: string;
    infracao_id: string;
    descricao_fato: string;
    situacao: string;
    created_at: string;
    attachment_names: string[];
    id_permissao: number;
    id_perm_vei: number;
    id_localidade: number;
    latitude: number;
    longitude: number;
    localidade_descricao: string;
}
