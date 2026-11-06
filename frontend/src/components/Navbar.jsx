import React from 'react';
import { NavLink } from 'react-router-dom';
import { modulos } from '../config/modulos';

// Barra de navegación superior. NavLink funciona como <a> pero sin recargar la página
// y añade la clase "active" al enlace de la ruta actual.
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/" exact>
          🎬 Cine Universitario
        </NavLink>

        {/* Botón "hamburguesa" que aparece en pantallas pequeñas (lo controla bootstrap.bundle.js) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Mostrar menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/media">
                Películas y series
              </NavLink>
            </li>
            {/* Un enlace por cada módulo definido en config/modulos.js */}
            {Object.values(modulos).map((m) => (
              <li className="nav-item" key={m.clave}>
                <NavLink className="nav-link" to={m.ruta}>
                  {m.titulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
