import React from 'react';
import { Link } from 'react-router-dom';
import { modulos } from '../config/modulos';

// Pantalla de bienvenida con accesos directos a cada módulo.
export default function Inicio() {
  return (
    <div>
      <div className="p-5 mb-4 bg-white rounded-3 shadow-sm">
        <h1 className="display-6">Bienvenido a Cine Universitario</h1>
        <p className="lead mb-0">Administra películas, series y los catálogos que las describen.</p>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-3">
        <div className="col">
          <Link to="/media" className="card h-100 text-decoration-none shadow-sm border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">🎞️ Películas y series</h5>
              <p className="card-text text-muted">Producciones registradas.</p>
            </div>
          </Link>
        </div>
        {Object.values(modulos).map((m) => (
          <div className="col" key={m.clave}>
            <Link to={m.ruta} className="card h-100 text-decoration-none shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{m.titulo}</h5>
                <p className="card-text text-muted">Administrar {m.titulo.toLowerCase()}.</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
