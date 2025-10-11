import { HardHat } from 'lucide-react';

export function InDevelopment() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-4">
        <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6">
            <HardHat size={50} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Página em Construção</h1>
        <p className="text-slate-600 mt-2 max-w-sm">
            Esta funcionalidade ainda está em desenvolvimento e estará disponível em breve no protótipo.
        </p>
    </div>
  );
}
