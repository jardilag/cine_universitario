import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import RutaAdmin from './components/RutaAdmin';
import CatalogoLista from './components/CatalogoLista';
import CatalogoFormulario from './components/CatalogoFormulario';
import Inicio from './pages/Inicio';
import MediaFormulario from './pages/MediaFormulario';
import { modulos } from './config/modulos';

// Componente raíz: navbar fija + zona central donde React Router (v5) elige qué pantalla mostrar.
// <Switch> renderiza solo la PRIMERA <Route> cuya ruta coincida con la URL.
export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Switch>
          {/* Página principal PÚBLICA: muestra las películas y series (solo lectura). */}
          <Route exact path="/" component={Inicio} />
          <Redirect exact from="/media" to="/" />

          {/* Todo lo siguiente es SOLO para el modo administrador (RutaAdmin).
              "nuevo" va antes de "editar/:id". */}
          <RutaAdmin exact path="/media/nuevo">
            <MediaFormulario />
          </RutaAdmin>
          <RutaAdmin exact path="/media/editar/:id">
            <MediaFormulario />
          </RutaAdmin>

          {/* Para cada módulo catálogo generamos sus 3 rutas con el mismo par de componentes.
              "key" fuerza a React a reiniciar el componente al cambiar de módulo. */}
          {Object.values(modulos).flatMap((m) => [
            <RutaAdmin key={`${m.clave}-lista`} exact path={m.ruta}>
              <CatalogoLista modulo={m} />
            </RutaAdmin>,
            <RutaAdmin key={`${m.clave}-nuevo`} exact path={`${m.ruta}/nuevo`}>
              <CatalogoFormulario modulo={m} />
            </RutaAdmin>,
            <RutaAdmin key={`${m.clave}-editar`} exact path={`${m.ruta}/editar/:id`}>
              <CatalogoFormulario modulo={m} />
            </RutaAdmin>,
          ])}

          {/* Ruta sin "path": atrapa cualquier URL desconocida (error 404). */}
          <Route>
            <div className="text-center py-5">
              <h2>Página no encontrada</h2>
              <Link to="/">Volver al inicio</Link>
            </div>
          </Route>
        </Switch>
      </main>
    </>
  );
}
