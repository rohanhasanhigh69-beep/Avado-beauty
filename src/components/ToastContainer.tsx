import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.variant === 'success'
            ? CheckCircle2
            : toast.variant === 'warning'
            ? AlertCircle
            : Info;
        const iconColor =
          toast.variant === 'success'
            ? 'text-emerald-700'
            : toast.variant === 'warning'
            ? 'text-amber-700'
            : 'text-[#9E4D5D]';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 bg-white border border-[#EADEE2] shadow-lg rounded-lg px-4 py-3 text-sm text-[#1F171C]"
          >
            <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} aria-hidden="true" />
            <p className="flex-1 text-[13px] font-medium leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 text-[#5A4A52] hover:text-[#1F171C] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
