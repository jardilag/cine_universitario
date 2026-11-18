import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';
import { alertaError } from '../utils/alertas';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const esAdmin = usuario?.rol === 'ADMIN';
  const temporizador = useRef();

  const cerrarSesion = useCallback(() => {
    clearTimeout(temporizador.current);
    delete api.defaults.headers.common.Authorization;
    setUsuario(null);
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(undefined, (error) => {
      const autorizacion = error.config?.headers?.get?.('Authorization');
      if (error.response?.status === 401 && autorizacion &&
          autorizacion === api.defaults.headers.common.Authorization) {
        cerrarSesion();
      }
      return Promise.reject(error);
    });
    return () => {
      api.interceptors.response.eject(interceptor);
      clearTimeout(temporizador.current);
      delete api.defaults.headers.common.Authorization;
    };
  }, [cerrarSesion]);

  async function iniciarSesion() {
    const { isConfirmed, value } = await Swal.fire({
      title: 'Iniciar sesión',
      html: `
        <div class="text-start">
          <label class="form-label" for="login-usuario">Usuario</label>
          <input id="login-usuario" class="form-control mb-3" type="text"
            autocomplete="username" autocapitalize="off" maxlength="80" required>
          <label class="form-label" for="login-password">Contraseña</label>
          <input id="login-password" class="form-control" type="password"
            autocomplete="current-password" required>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Entrar',
      cancelButtonText: 'Cancelar',
      didOpen: (popup) => popup.querySelector('#login-usuario').focus(),
      preConfirm: () => {
        const popup = Swal.getPopup();
        const usuario = popup.querySelector('#login-usuario').value.trim();
        const password = popup.querySelector('#login-password').value;
        if (!usuario || !password) {
          Swal.showValidationMessage('Ingresa tu usuario y contraseña');
          return false;
        }
        return { usuario, password };
      },
    });
    if (!isConfirmed) return false;

    try {
      const { data } = await api.post('/auth/login', value);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      clearTimeout(temporizador.current);
      temporizador.current = setTimeout(cerrarSesion, data.expiraEnSegundos * 1000);
      setUsuario(data.usuario);
      return true;
    } catch (error) {
      alertaError(error.response?.data?.message || 'No se pudo iniciar sesión');
      return false;
    }
  }

  return (
    <AdminContext.Provider value={{ usuario, esAdmin, iniciarSesion, cerrarSesion }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
