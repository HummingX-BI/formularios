import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró #root');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
