import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Estilos y JavaScript de Bootstrap (el JS hace funcionar el menú colapsable en móviles).
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

import App from './App.jsx';
import { AdminProvider } from './context/AdminContext.jsx';

// Punto de entrada: monta <App /> en el <div id="root"> de index.html.
// - BrowserRouter habilita la navegación por URL (React Router) en toda la aplicación.
// - AdminProvider comparte el estado "modo administrador" con todos los componentes.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <App />
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);
