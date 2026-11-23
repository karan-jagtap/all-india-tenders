import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider, AuthProvider } from './context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
