import { useState } from 'react';
import { ArrowLeft, User, Mail, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: user?.id || '',
    full_name: user?.full_name || '',
    email: user?.email || '',
    sigla: user?.sigla || '',
  });

  const handleSave = async () => {
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.sigla.trim()) {
      alert('Todos os campos são obrigatórios.');
      return;
    }
    await updateUser(formData);
    alert('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      id: user?.id || '',
      full_name: user?.full_name || '',
      email: user?.email || '',
      sigla: user?.sigla || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-700 rounded-lg transition active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-xl font-semibold">Meu Perfil</h1>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition active:scale-95"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-100 to-blue-50 p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-slate-700 to-slate-900 rounded-full mb-4 shadow-xl">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {formData.full_name || 'Usuário'}
            </h2>
            <p className="text-gray-600 font-medium">{formData.sigla || 'N/A'}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition text-base ${isEditing ? 'border-gray-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white' : 'border-gray-100 bg-gray-50 text-gray-700'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition text-base ${isEditing ? 'border-gray-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white' : 'border-gray-100 bg-gray-50 text-gray-700'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sigla do Operador</label>
              <div className="relative">
                <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.sigla}
                  onChange={(e) => setFormData({ ...formData, sigla: e.target.value.toUpperCase() })}
                  disabled={!isEditing}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl outline-none transition text-base uppercase ${isEditing ? 'border-gray-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white' : 'border-gray-100 bg-gray-50 text-gray-700'}`}
                />
              </div>
            </div>

            {isEditing && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition active:scale-95"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white py-3.5 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-950 transition active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  Salvar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}