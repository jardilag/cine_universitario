import {
  generoService,
  directorService,
  productoraService,
  tipoService,
} from '../services/servicios';

// Descripción de los 4 módulos "catálogo". En lugar de escribir 4 listas y 4 formularios casi
// idénticos, cada módulo se describe con un objeto y los componentes genéricos
// CatalogoLista y CatalogoFormulario se encargan de dibujarlo.
//
// Propiedades:
//  - clave / titulo / singular : textos y nombre interno del módulo
//  - ruta        : URL en el frontend (React Router)
//  - servicio    : funciones que hablan con la API
//  - idCampo     : nombre de la llave primaria que devuelve el backend
//  - accion      : 'inactivar' (el backend solo cambia estado) o 'eliminar' (borra el registro)
//  - campos      : campos del formulario (tipo, si es obligatorio y longitud máxima)
//  - columnas    : columnas que se muestran en la tabla
export const modulos = {
  genero: {
    clave: 'genero',
    titulo: 'Géneros',
    singular: 'género',
    ruta: '/generos',
    servicio: generoService,
    idCampo: 'id_genero',
    accion: 'inactivar',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true, max: 100 },
      { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
      { nombre: 'estado', etiqueta: 'Estado', tipo: 'estado' },
    ],
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'descripcion', titulo: 'Descripción' },
      { campo: 'estado', titulo: 'Estado', tipo: 'estado' },
      { campo: 'fecha_actualizacion', titulo: 'Actualizado', tipo: 'fecha' },
    ],
  },

  director: {
    clave: 'director',
    titulo: 'Directores',
    singular: 'director',
    ruta: '/directores',
    servicio: directorService,
    idCampo: 'id_director',
    accion: 'inactivar',
    campos: [
      { nombre: 'nombres', etiqueta: 'Nombres', tipo: 'text', requerido: true, max: 180 },
      { nombre: 'estado', etiqueta: 'Estado', tipo: 'estado' },
    ],
    columnas: [
      { campo: 'nombres', titulo: 'Nombres' },
      { campo: 'estado', titulo: 'Estado', tipo: 'estado' },
      { campo: 'fecha_actualizacion', titulo: 'Actualizado', tipo: 'fecha' },
    ],
  },

  productora: {
    clave: 'productora',
    titulo: 'Productoras',
    singular: 'productora',
    ruta: '/productoras',
    servicio: productoraService,
    idCampo: 'id_productora',
    accion: 'inactivar',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true, max: 150 },
      { nombre: 'slogan', etiqueta: 'Slogan', tipo: 'text', max: 255 },
      { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
      { nombre: 'estado', etiqueta: 'Estado', tipo: 'estado' },
    ],
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'slogan', titulo: 'Slogan' },
      { campo: 'estado', titulo: 'Estado', tipo: 'estado' },
      { campo: 'fecha_actualizacion', titulo: 'Actualizado', tipo: 'fecha' },
    ],
  },

  tipo: {
    clave: 'tipo',
    titulo: 'Tipos',
    singular: 'tipo',
    ruta: '/tipos',
    servicio: tipoService,
    idCampo: 'id_tipo',
    accion: 'eliminar', // la tabla tipo no tiene estado, el backend lo borra físicamente
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true, max: 80 },
      { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
    ],
    columnas: [
      { campo: 'nombre', titulo: 'Nombre' },
      { campo: 'descripcion', titulo: 'Descripción' },
      { campo: 'fecha_actualizacion', titulo: 'Actualizado', tipo: 'fecha' },
    ],
  },
};
