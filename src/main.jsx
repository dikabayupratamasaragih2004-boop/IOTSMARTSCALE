import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DialogProvider } from './context/DialogContext';
import { ToastProvider } from './context/ToastContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DialogProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </DialogProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
