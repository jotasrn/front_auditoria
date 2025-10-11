import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Paperclip } from 'lucide-react';
import { getAuditById } from '../lib/storage';

interface AutoInfracaoViewProps {
  auditId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

// Componente auxiliar para seções organizadas
const ViewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
    <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">{children}</div>
  </div>
);

export function AutoInfracaoView({ auditId, onBack, onEdit }: AutoInfracaoViewProps) {
  const [audit, setAudit] = useState<any | null>(null);

  useEffect(() => {
    setAudit(getAuditById(auditId));
  }, [auditId]);

  if (!audit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando dados da auditoria...</p>
      </div>
    );
  }

  const display = (value: string | undefined | null) =>
    value || <span className="text-gray-400">Não informado</span>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-700 rounded-lg transition active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-xl font-semibold">
              Auto de Infração Nº {audit.numero}
            </h1>
            <button
              onClick={() => onEdit(audit.id)}
              className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition active:scale-95"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Informações Gerais */}
        <ViewSection title="Informações Gerais">
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">
              Ordem de Serviço:
            </strong>
            {display(audit.ordem_servico)}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Data/Hora:</strong>
            {new Date(audit.data_infracao).toLocaleDateString('pt-BR')} às {audit.hora_infracao}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Operador:</strong>
            {display(audit.nome_operador)}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Serviço:</strong>
            {display(audit.sigla_servico)}
          </p>
        </ViewSection>

        {/* Dados do Veículo */}
        <ViewSection title="Dados do Veículo">
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Nº do Veículo:</strong>
            {display(audit.numero_veiculo)}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Placa:</strong>
            {display(audit.placa)}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Marca/Modelo:</strong>
            {display(audit.marca_modelo)}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Cor:</strong>
            {display(audit.cor)}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Ano Fabricação:</strong>
            {display(audit.ano_fabricacao)}
          </p>
        </ViewSection>

        {/* Dados do Preposto */}
        <ViewSection title="Dados do Preposto">
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Nome:</strong>
            {display(audit.nome_preposto)}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Nº do Preposto:</strong>
            {display(audit.numero_preposto)}
          </p>
        </ViewSection>

        {/* Dados da Linha */}
        <ViewSection title="Dados da Linha">
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Código da Linha:</strong>
            {display(audit.codigo_linha)}
          </p>
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Denominação:</strong>
            {display(audit.denominacao_linha)}
          </p>
        </ViewSection>

        {/* Local da Infração */}
        <ViewSection title="Local da Infração">
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">
              Região Administrativa:
            </strong>
            {display(audit.regiao_administrativa)}
          </p>
          <p className="col-span-full">
            <strong className="font-semibold text-gray-600 w-40 inline-block">
              Local Exato:
            </strong>
            {display(audit.local_infracao)}
          </p>
        </ViewSection>

        {/* Dados da Infração */}
        <ViewSection title="Dados da Infração">
          <p>
            <strong className="font-semibold text-gray-600 w-40 inline-block">Infração:</strong>
            {display(audit.infracao)}
          </p>
          <p className="col-span-full">
            <strong className="font-semibold text-gray-600 w-40 inline-block">
              Descrição do Fato:
            </strong>
            {display(audit.descricao_fato)}
          </p>
        </ViewSection>

        {/* Anexos */}
        <ViewSection title="Anexos">
          {audit.attachment_names && audit.attachment_names.length > 0 ? (
            audit.attachment_names.map((name: string, i: number) => (
              <div
                key={i}
                className="col-span-1 flex items-center gap-2 bg-slate-100 p-2 rounded-lg truncate"
              >
                <Paperclip className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700 font-medium">{name}</span>
              </div>
            ))
          ) : (
            <p className="col-span-full text-slate-500">Nenhum arquivo anexado.</p>
          )}
        </ViewSection>
      </div>
    </div>
  );
}
