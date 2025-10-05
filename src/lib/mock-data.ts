// Dados falsos para simular o banco de dados

export const mockUser = {
  id: 'user-123',
  email: 'dft_gabrielv@semob.com',
  full_name: 'Gabriel V.',
  sigla: 'DFT_GABRIELV'
};

export const mockVehicles = [
  { id: 'vec-001', numero_veiculo: '1001', placa: 'ABC1234', marca_modelo: 'Marcopolo/Torino', cor: 'Azul', ano_fabricacao: '2020' },
  { id: 'vec-002', numero_veiculo: '1002', placa: 'DEF5678', marca_modelo: 'Caio/Apache', cor: 'Branco', ano_fabricacao: '2021' },
  { id: 'vec-003', numero_veiculo: '1003', placa: 'GHI9012', marca_modelo: 'Mascarello/Gran Via', cor: 'Prata', ano_fabricacao: '2019' },
];

export const mockLinhas = [
  { id: 'lin-01', codigo: '0.102', denominacao: 'Rodoviária do Plano Piloto / Aeroporto' },
  { id: 'lin-02', codigo: '0.103', denominacao: 'W3 Sul-Norte / L2 Sul-Norte' },
  { id: 'lin-03', codigo: '0.337', denominacao: 'Taguatinga Centro / P Sul' },
];

export const mockPrepostos = [
  { id: 'prep-01', nome: 'João da Silva', numero: 'P001' },
  { id: 'prep-02', nome: 'Maria Oliveira', numero: 'P002' },
  { id: 'prep-03', nome: 'Carlos Souza', numero: 'P003' },
];

export const mockInfracoes = [
  { id: 'inf-01', codigo: '501-0', descricao: 'Excesso de velocidade' },
  { id: 'inf-02', codigo: '502-0', descricao: 'Não cumprir o horário da tabela' },
  { id: 'inf-03', codigo: '603-1', descricao: 'Veículo em mau estado de conservação' },
];

export const mockAutos = [
  {
    id: 'auto-1',
    numero: '2025001',
    situacao: 'Enviado',
    vehicles: { placa: 'ABC1234', marca_modelo: 'Marcopolo/Torino' },
    local_infracao: 'Eixo Monumental, próximo à Catedral',
    data_infracao: '2025-10-03T10:00:00.000Z',
    hora_infracao: '10:00',
    created_at: '2025-10-03T10:05:00.000Z',
  },
  {
    id: 'auto-2',
    numero: '2025002',
    situacao: 'Em andamento',
    vehicles: { placa: 'DEF5678', marca_modelo: 'Caio/Apache' },
    local_infracao: 'Terminal de Taguatinga Sul',
    data_infracao: '2025-10-04T14:30:00.000Z',
    hora_infracao: '14:30',
    created_at: '2025-10-04T14:35:00.000Z',
  },
];