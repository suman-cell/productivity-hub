// client/src/components/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    // start hiding animation
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, visible: false } : t)
    );
    // remove after transition
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 320);
  }, []);

  const show = useCallback((message, type = "info", timeout = 3500) => {
    const id = Math.random().toString(36).slice(2);
    const toast = { id, message, type, visible: false };
    setToasts(prev => [...prev, toast]);

    // enter animation
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: true } : t));
    }, 10);

    // auto-dismiss after timeout
    const hideAfter = Math.max(500, timeout - 300);
    setTimeout(() => dismiss(id), hideAfter + 10);
  }, [dismiss]);

  const value = { show, dismiss };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => {
          const classes = ['toast', t.type];
          if (t.visible) classes.push('show');
          else classes.push('hiding');
          return (
            <div key={t.id} className={classes.join(' ')} role="status">
              {t.message}
              <button
                className="toast-close"
                onClick={() => dismiss(t.id)}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
