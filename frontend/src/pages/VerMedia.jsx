import React, { useEffect, useState } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import Cargando from '../components/Cargando';
import { useAdmin } from '../context/AdminContext';
import { mediaService } from '../services/servicios';
import { mensajeDeError } from '../utils/alertas';

function enlaceDeReproduccion(url) {
  try {
    const destino = new URL(url);
    if (destino.protocol !== 'http:' && destino.protocol !== 'https:') return null;
    if (destino.origin === window.location.origin && /^\/media(?:\/|$)/i.test(destino.pathname)) return null;
    return destino.href;
  } catch {
    return null;
  }
}

function AbrirProduccion({ serial, esAdmin }) {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let vigente = true;

    async function abrir() {
      try {
        const produccion = await mediaService.obtener(serial);
        if (!vigente) return;
        if ((produccion.estado ?? 'Activo') !== 'Activo' && !esAdmin) {
          setMensaje('Esta producción no está disponible.');
          return;
        }

        const enlace = enlaceDeReproduccion(produccion.url);
        if (enlace) {
          window.location.replace(enlace);
          return;
        }
        setMensaje('Esta producción todavía no tiene un enlace de reproducción válido.');
      } catch (error) {
        if (vigente) setMensaje(mensajeDeError(error));
      }
    }

    abrir();
    return () => { vigente = false; };
  }, [serial, esAdmin]);

  if (!mensaje) return <Cargando />;

  return (
    <div className="py-4">
      <p className="alert alert-warning" role="status">{mensaje}</p>
      <Link className="btn btn-outline-secondary" to="/">Volver al catálogo</Link>
    </div>
  );
}

export default function VerMedia() {
  const { search } = useLocation();
  const { esAdmin } = useAdmin();
  let serial;
  try {
    serial = decodeURIComponent(search.slice(1));
  } catch {
    return <Redirect to="/" />;
  }

  if (!serial) return <Redirect to="/" />;
  return <AbrirProduccion key={`${esAdmin}:${serial}`} serial={serial} esAdmin={esAdmin} />;
}
