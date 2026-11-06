import React from 'react';

// Etiqueta verde (Activo) o gris (Inactivo).
export default function BadgeEstado({ estado }) {
  const clase = estado === 'Activo' ? 'bg-success' : 'bg-secondary';
  return <span className={`badge ${clase}`}>{estado}</span>;
}
