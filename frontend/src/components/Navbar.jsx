import React from 'react';
import { NavLink } from 'react-router-dom';
import { modulos } from '../config/modulos';
import { useAdmin } from '../context/AdminContext';

// Barra de navegación superior. NavLink funciona como <a> pero sin recargar la página
// y añade la clase "active" al enlace de la ruta actual.
export default function Navbar() {
  const { esAdmin, activarAdmin, desactivarAdmin } = useAdmin();

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
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" exact>
                Películas y series
              </NavLink>
            </li>

            {/* Los módulos de administración solo se muestran si el modo admin está activo */}
            {esAdmin &&
              Object.values(modulos).map((m) => (
                <li className="nav-item" key={m.clave}>
                  <NavLink className="nav-link" to={m.ruta}>
                    {m.titulo}
                  </NavLink>
                </li>
              ))}

            <li className="nav-item ms-lg-3">
              {esAdmin ? (
                <button className="btn btn-sm btn-warning" onClick={desactivarAdmin}>
                  Salir del modo admin
                </button>
              ) : (
                <button className="btn btn-sm btn-outline-light" onClick={activarAdmin}>
                  🔒 Modo administrador
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
