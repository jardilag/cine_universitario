import React from 'react';

// Spinner de Bootstrap que se muestra mientras llegan los datos de la API.
export default function Cargando() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}
