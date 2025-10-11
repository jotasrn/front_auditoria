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
    id: number;
    placa: string;
    numeroVeiculo: string;
    modeloVeiculo: string;
    corVeiculo: string;
    anoVeiculo: number;
}

export interface Linha {
    idLinha: number;
    nomeOperadora: string;
    codigoLinha: string;
    denominacaoLinha: string;
}

export interface Preposto {
    idPreposto: number;
    NomeOperadora: string;
    NomePreposto: string;
}

export interface Infracao {
    idInfracao: number;
    codigoInfracao: number;
    descricaoInfracao: string;
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

export interface CreateAutoResponse {
    message: string;
    numeroDocumento: string;
    arquivo: any;
}
