import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

// Igual que <Route>, pero solo deja entrar si el modo administrador está activo.
// Si no lo está, redirige al inicio. Así nadie puede agregar/editar escribiendo la URL a mano.
export default function RutaAdmin({ children, ...propsRuta }) {
  const { esAdmin } = useAdmin();
  return <Route {...propsRuta}>{esAdmin ? children : <Redirect to="/" />}</Route>;
}
