import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Authenticator } from './features/auth/Authenticator';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Authenticator>
        <App />
      </Authenticator>
    </HashRouter>
  </StrictMode>,
);

