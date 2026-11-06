import Swal from 'sweetalert2';

// Envoltorios de SweetAlert2 para tener alertas con el mismo estilo en toda la app.

export const alertaExito = (mensaje) =>
  Swal.fire({ icon: 'success', title: '¡Listo!', text: mensaje, timer: 2000, showConfirmButton: false });

export const alertaError = (mensaje) =>
  Swal.fire({ icon: 'error', title: 'Ocurrió un problema', text: mensaje });

export const alertaAdvertencia = (mensaje) =>
  Swal.fire({ icon: 'warning', title: 'Revisa el formulario', text: mensaje });

// Pregunta de confirmación. Devuelve true solo si el usuario pulsa el botón de confirmar.
export async function confirmar(titulo, texto, textoBoton = 'Sí, continuar') {
  const resultado = await Swal.fire({
    icon: 'question',
    title: titulo,
    text: texto,
    showCancelButton: true,
    confirmButtonText: textoBoton,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
  });
  return resultado.isConfirmed;
}

// Extrae un mensaje legible de un error de Axios:
//  - si el backend respondió (400, 404, 409...) usamos su "message";
//  - si no hubo respuesta, el servidor está apagado o inalcanzable.
export function mensajeDeError(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.request) return 'No se pudo conectar con el servidor. ¿Está encendida la API en el puerto 3000?';
  return error.message || 'Error desconocido';
}
