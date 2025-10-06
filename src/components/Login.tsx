import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User } from 'lucide-react';
import logoSemob from '../assets/images/logo.png';

type PopupType = 'error' | 'success';

interface PopupProps {
  message: string;
  type: PopupType;
  onClose: () => void;
}

function Popup({ message, type, onClose }: PopupProps) {
  return (
    <div
      className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg text-white z-50 transition transform ${type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">X</button>
      </div>
    </div>
  );
}

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{ message: string; type: PopupType } | null>(null);

  const { signIn } = useAuth();

  useEffect(() => {
    setUsername('DFT_GABRIELV'); // valor default
    setPassword('123456');        // valor default
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
        message: err.message || 'Usuário ou senha incorretos.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-8 text-center relative">
            <img
              src={logoSemob}
              alt="Logo SEMOB"
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <h1 className="text-3xl font-bold text-white mb-2">SEMOB</h1>
            <p className="text-slate-200 text-sm font-medium">Sistema de Auditoria</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                  placeholder="Digite seu usuário"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white py-4 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-950 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95 flex justify-center items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      {popup && <Popup message={popup.message} type={popup.type} onClose={() => setPopup(null)} />}
    </div>
  );
}
