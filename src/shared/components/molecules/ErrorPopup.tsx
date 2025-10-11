import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export type PopupType = 'error' | 'success' | 'info';

interface ErrorPopupProps {
  message: string;
  type?: PopupType;
  onClose: () => void;
  duration?: number;
}

export function ErrorPopup({ message, type = 'error', onClose, duration = 5000 }: ErrorPopupProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50', border: 'border-green-600', text: 'text-green-800',
          icon: CheckCircle, iconColor: 'text-green-600',
        };
      case 'info':
        return {
          bg: 'bg-blue-50', border: 'border-blue-600', text: 'text-blue-800',
          icon: Info, iconColor: 'text-blue-600',
        };
      default:
        return {
          bg: 'bg-red-50', border: 'border-red-600', text: 'text-red-800',
          icon: AlertCircle, iconColor: 'text-red-600',
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[99999] animate-fadeIn">
      <div
        className={`${styles.bg} border-l-4 ${styles.border} rounded-xl shadow-2xl max-w-md w-full mx-4 p-5 animate-slideUp`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 ${styles.iconColor} mt-1`} />
          <p className={`${styles.text} font-medium text-base flex-1`}>{message}</p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
