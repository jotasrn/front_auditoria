import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ErrorPopup, PopupType } from './ErrorPopup';
import { Lock, User } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState<{ message: string; type: PopupType } | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    setUsername('DFT_GABRIELV');
    setPassword('123456');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setPopup({ message: 'Por favor, informe o usuário', type: 'error' });
      return;
    }

    if (!password.trim()) {
      setPopup({ message: 'Por favor, informe a senha', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await signIn(username, password);
      setPopup({ message: 'Login realizado com sucesso!', type: 'success' });
    } catch (err: any) {
      setPopup({
        message: err.message || 'Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-xl">
                <div className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">S</div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">SEMOB</h1>
              <p className="text-slate-200 text-sm font-medium">Sistema de Auditoria</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition text-base"
                  required
                  autoComplete="username"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition text-base"
                  required
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white py-4 rounded-xl font-semibold text-base hover:from-slate-800 hover:to-slate-950 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-sm mt-6 font-medium">
          Sistema de Gestão de Auditoria de Trânsito
        </p>
      </div>

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
