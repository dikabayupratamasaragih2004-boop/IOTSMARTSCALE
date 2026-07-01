import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: 'check_circle',
  error:   'cancel',
  warning: 'warning',
  info:    'info',
};

const STYLES = {
  success: 'bg-white border-l-4 border-green-500 text-green-800',
  error:   'bg-white border-l-4 border-status-error text-red-800',
  warning: 'bg-white border-l-4 border-status-warning text-yellow-800',
  info:    'bg-white border-l-4 border-accent-blue text-blue-800',
};

const ICON_STYLES = {
  success: 'text-green-500',
  error:   'text-status-error',
  warning: 'text-status-warning',
  info:    'text-accent-blue',
};

function ToastItem({ toast, onRemove }) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg w-full
                  animate-[slideIn_0.25s_ease-out] ${STYLES[toast.type]}`}
      style={{ minWidth: 280, maxWidth: 360 }}
    >
      <span className={`material-symbols-outlined text-xl flex-shrink-0 mt-0.5 ${ICON_STYLES[toast.type]}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>
        {ICONS[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-bold text-sm leading-tight">{toast.title}</p>
        )}
        <p className="text-sm leading-snug opacity-80">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-current opacity-40 hover:opacity-70 transition-opacity flex-shrink-0 mt-0.5"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id]);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type, message, title = '', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message, title }]);
    timers.current[id] = setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const toast = {
    success: (message, title = 'Berhasil') => show('success', message, title),
    error:   (message, title = 'Gagal')    => show('error',   message, title),
    warning: (message, title = '')         => show('warning', message, title),
    info:    (message, title = '')         => show('info',    message, title),
  };



  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast container — top-right desktop, top-center mobile */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4
                      z-[9999] flex flex-col gap-2 items-center sm:items-end w-[calc(100vw-32px)] sm:w-auto">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
