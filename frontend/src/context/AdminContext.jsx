import React, { createContext, useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { alertaError } from '../utils/alertas';

// Contraseña del modo administrador. Se puede cambiar con VITE_ADMIN_PASSWORD en el archivo .env.
// IMPORTANTE: esto solo oculta/bloquea la interfaz; no es seguridad real, porque la API
// no pide autenticación. Sirve para esta actividad académica.
const CLAVE_ADMIN = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const LLAVE_STORAGE = 'modoAdmin';

// Un Contexto de React permite compartir un valor (aquí: "¿estoy en modo admin?")
// con cualquier componente sin pasarlo por props manualmente.
const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // sessionStorage conserva el modo admin al recargar la página, pero se pierde al cerrar la pestaña.
  const [esAdmin, setEsAdmin] = useState(() => sessionStorage.getItem(LLAVE_STORAGE) === 'true');

  // Pide la contraseña con SweetAlert2 y, si es correcta, activa el modo admin.
  async function activarAdmin() {
    const { isConfirmed, value } = await Swal.fire({
      title: 'Modo administrador',
      input: 'password',
      inputLabel: 'Ingresa la contraseña',
      inputAttributes: { autocapitalize: 'off', autocomplete: 'off' },
      showCancelButton: true,
      confirmButtonText: 'Entrar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return false;

    if (value !== CLAVE_ADMIN) {
      alertaError('Contraseña incorrecta.');
      return false;
    }
    sessionStorage.setItem(LLAVE_STORAGE, 'true');
    setEsAdmin(true);
    return true;
  }

  function desactivarAdmin() {
    sessionStorage.removeItem(LLAVE_STORAGE);
    setEsAdmin(false);
  }

  return (
    <AdminContext.Provider value={{ esAdmin, activarAdmin, desactivarAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook para leer el contexto: const { esAdmin } = useAdmin();
export function useAdmin() {
  return useContext(AdminContext);
}
