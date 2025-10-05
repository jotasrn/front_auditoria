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
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          text: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          text: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-500'
        };
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-800',
          icon: AlertCircle,
          iconColor: 'text-red-500'
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className={`${styles.bg} border-l-4 ${styles.border} rounded-lg shadow-2xl max-w-md w-full p-5 animate-slideUp`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`${styles.text} font-medium text-base leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${styles.text} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
