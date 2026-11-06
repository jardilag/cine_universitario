import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import CatalogoLista from './components/CatalogoLista';
import CatalogoFormulario from './components/CatalogoFormulario';
import Inicio from './pages/Inicio';
import MediaLista from './pages/MediaLista';
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
          <Route exact path="/" component={Inicio} />

          {/* Media: listado, crear y editar. "nuevo" va antes de "editar/:id". */}
          <Route exact path="/media" component={MediaLista} />
          <Route exact path="/media/nuevo" component={MediaFormulario} />
          <Route exact path="/media/editar/:id" component={MediaFormulario} />

          {/* Para cada módulo catálogo generamos sus 3 rutas con el mismo par de componentes.
              "key" fuerza a React a reiniciar el componente al cambiar de módulo. */}
          {Object.values(modulos).flatMap((m) => [
            <Route key={`${m.clave}-lista`} exact path={m.ruta}>
              <CatalogoLista modulo={m} />
            </Route>,
            <Route key={`${m.clave}-nuevo`} exact path={`${m.ruta}/nuevo`}>
              <CatalogoFormulario modulo={m} />
            </Route>,
            <Route key={`${m.clave}-editar`} exact path={`${m.ruta}/editar/:id`}>
              <CatalogoFormulario modulo={m} />
            </Route>,
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
