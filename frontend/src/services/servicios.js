import api from './api';

// Fábrica de servicios CRUD. Recibe la ruta del recurso (por ejemplo '/generos')
// y devuelve las 5 operaciones que expone cada módulo del backend.
// Todas las respuestas del backend vienen como { message, data }, por eso en
// listar/obtener devolvemos solo "data" y en el resto devolvemos el cuerpo completo.
function crearServicio(endpoint) {
  return {
    // GET /endpoint -> arreglo con todos los registros
    listar: async () => (await api.get(endpoint)).data.data,
    // GET /endpoint/:id -> un solo registro
    obtener: async (id) => (await api.get(`${endpoint}/${id}`)).data.data,
    // POST /endpoint -> crea un registro
    crear: async (datos) => (await api.post(endpoint, datos)).data,
    // PUT /endpoint/:id -> actualiza un registro
    actualizar: async (id, datos) => (await api.put(`${endpoint}/${id}`, datos)).data,
    // DELETE /endpoint/:id -> inactiva (género, director, productora) o elimina (tipo, media)
    eliminar: async (id) => (await api.delete(`${endpoint}/${id}`)).data,
  };
}

export const generoService = crearServicio('/generos');
export const directorService = crearServicio('/directores');
export const productoraService = crearServicio('/productoras');
export const tipoService = crearServicio('/tipos');
export const mediaService = crearServicio('/media');
