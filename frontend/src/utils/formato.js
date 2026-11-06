// Convierte la fecha ISO que envía MySQL/Express (2026-11-06T10:00:00.000Z) en texto local.
export function formatearFecha(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
}
