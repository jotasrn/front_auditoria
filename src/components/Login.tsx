import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User } from 'lucide-react';
import logoSemob from '../assets/images/logo.png';

export function Login() {
  const [username, setUsername] = useState('DFT_GABRIELV'); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {

      await signIn(username, password);
    } catch (err: any) {
      alert(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-8 text-center">
            <img 
              src={logoSemob} 
              alt="Logo SEMOB" 
              className="w-24 h-auto mx-auto mb-4" 
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
                  required
                  placeholder="Digite seu usuário"
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
                  required
                  placeholder="Digite sua senha"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white py-4 rounded-xl font-semibold hover:from-slate-800 transition active:scale-95 shadow-lg disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}