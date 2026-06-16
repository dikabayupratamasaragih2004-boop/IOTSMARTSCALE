import { createContext, useContext, useState, useCallback } from 'react';

const DialogContext = createContext(null);

const TYPE_CONFIG = {
  success: {
    icon: 'check_circle',
    iconColor: 'text-green-500',
    iconBg:    'bg-green-50',
    btnClass:  'bg-primary hover:bg-[#005a3e] text-white',
  },
  error: {
    icon: 'cancel',
    iconColor: 'text-status-error',
    iconBg:    'bg-red-50',
    btnClass:  'bg-status-error hover:bg-red-600 text-white',
  },
  warning: {
    icon: 'warning',
    iconColor: 'text-status-warning',
    iconBg:    'bg-yellow-50',
    btnClass:  'bg-status-warning hover:bg-yellow-500 text-white',
  },
  info: {
    icon: 'info',
    iconColor: 'text-accent-blue',
    iconBg:    'bg-blue-50',
    btnClass:  'bg-accent-blue hover:bg-blue-700 text-white',
  },
};

function Backdrop({ children }) {
  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay terpisah agar blur merata ke seluruh layar */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Konten di atas overlay */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="animate-[fadeScale_0.2s_ease-out] w-full flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

function AlertDialogUI({ type, title, message, onClose }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  return (
    <Backdrop>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className={`h-14 w-14 rounded-2xl ${cfg.iconBg} flex items-center justify-center mx-auto mb-4`}>
            <span
              className={`material-symbols-outlined text-3xl ${cfg.iconColor}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {cfg.icon}
            </span>
          </div>
          {title && <h3 className="font-bold text-text-main text-lg mb-2">{title}</h3>}
          <p className="text-text-secondary text-sm leading-relaxed">{message}</p>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            autoFocus
            className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${cfg.btnClass}`}
          >
            OK
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

function ConfirmDialogUI({ title, message, confirmLabel, cancelLabel, confirmStyle, onConfirm, onCancel }) {
  const btnClass = confirmStyle === 'danger'
    ? 'bg-status-error hover:bg-red-600 text-white'
    : 'bg-primary hover:bg-[#005a3e] text-white';

  const iconColor = confirmStyle === 'danger' ? 'text-status-error' : 'text-status-warning';
  const iconBg    = confirmStyle === 'danger' ? 'bg-red-50' : 'bg-yellow-50';
  const icon      = confirmStyle === 'danger' ? 'delete_forever' : 'help';

  return (
    <Backdrop>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className={`h-14 w-14 rounded-2xl ${iconBg} flex items-center justify-center mx-auto mb-4`}>
            <span
              className={`material-symbols-outlined text-3xl ${iconColor}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>
          {title && <h3 className="font-bold text-text-main text-lg mb-2">{title}</h3>}
          <p className="text-text-secondary text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-surface-container text-text-secondary
                       rounded-xl font-bold text-sm hover:bg-surface-container transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

export function DialogProvider({ children }) {
  const [alertState,   setAlertState]   = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  // Returns a Promise that resolves when user clicks OK
  const alert = useCallback((type, message, title = '') => {
    return new Promise((resolve) => {
      setAlertState({ type, title, message, resolve });
    });
  }, []);

  // Returns a Promise<boolean> — true if confirmed, false if cancelled
  const confirm = useCallback(({
    title        = '',
    message      = '',
    confirmLabel = 'Ya',
    cancelLabel  = 'Batal',
    confirmStyle = 'danger',
  } = {}) => {
    return new Promise((resolve) => {
      setConfirmState({ title, message, confirmLabel, cancelLabel, confirmStyle, resolve });
    });
  }, []);

  const dialog = {
    alert,
    confirm,
    success: (message, title = 'Berhasil') => alert('success', message, title),
    error:   (message, title = 'Gagal')    => alert('error',   message, title),
    warning: (message, title = '')         => alert('warning', message, title),
    info:    (message, title = '')         => alert('info',    message, title),
  };

  function closeAlert() {
    const resolve = alertState?.resolve;
    setAlertState(null);
    resolve?.();
  }

  function closeConfirm(result) {
    const resolve = confirmState?.resolve;
    setConfirmState(null);
    resolve?.(result);
  }

  return (
    <DialogContext.Provider value={dialog}>
      {children}

      {alertState && (
        <AlertDialogUI
          type={alertState.type}
          title={alertState.title}
          message={alertState.message}
          onClose={closeAlert}
        />
      )}

      {confirmState && (
        <ConfirmDialogUI
          title={confirmState.title}
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          cancelLabel={confirmState.cancelLabel}
          confirmStyle={confirmState.confirmStyle}
          onConfirm={() => closeConfirm(true)}
          onCancel={() => closeConfirm(false)}
        />
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used inside DialogProvider');
  return ctx;
}
