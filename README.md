# Cine Universitario

Aplicación React que consume la API REST de Node.js para consultar películas y series y gestionar los módulos de Género, Director, Productora, Tipo y Media.

## Requisitos

- Node.js 22.12 o posterior y npm.
- MariaDB en ejecución. En Windows puedes usar el módulo **MySQL** del panel de XAMPP, que incluye MariaDB.

## 1. Preparar la base de datos

1. Inicia MariaDB. Si usas phpMyAdmin desde XAMPP, inicia también Apache.
2. Para una instalación nueva, importa [base_datos_peliculas_mysql.sql](CreacionBD/base_datos_peliculas_mysql.sql) en phpMyAdmin. El script crea la base `cine_universitario` y carga géneros y tipos de ejemplo.
3. Si ya tienes la base de la EA1, conserva tus datos y ejecuta las migraciones que correspondan desde la pestaña **SQL** de phpMyAdmin.
   - [Estado de Tipo y Media](CreacionBD/migracion_estado_tipo_media.sql) si falta la columna `estado` en ambas tablas. Si solo falta en una, ejecuta el `ALTER TABLE` de esa tabla dentro de `cine_universitario`.
   - [Año de estreno](CreacionBD/migracion_anio_estreno.sql) si `media.anio_estreno` aún es de tipo `YEAR`. Esto permite guardar el año 1900.
4. La API usa `localhost`, el puerto predeterminado `3306`, el usuario `root` y una contraseña vacía. Si tus datos de conexión son distintos, ajusta [conexion.js](multimedia_backend/database/conexion.js).

Puedes revisar los tipos de las columnas en la pestaña **Estructura** de cada tabla. Para instalaciones nuevas usa MariaDB, ya que el índice único de la URL del script supera el límite de InnoDB en MySQL 8. [Manual de MySQL](https://dev.mysql.com/doc/refman/8.0/en/innodb-limits.html)

## 2. Iniciar la API

Abre una terminal en la raíz del repositorio y ejecuta estos comandos. Mantén la terminal abierta mientras uses la aplicación.

```sh
cd multimedia_backend
npm ci
node index.js
```

La API escucha en el puerto `3000`. Abre [el listado de Media](http://localhost:3000/api/media) para comprobar que responde con JSON. En una base nueva, `data` será una lista vacía.

## 3. Iniciar React

Abre una segunda terminal en la raíz del repositorio.

```sh
cd frontend
npm ci
npm run dev
```

Abre [Cine Universitario](http://localhost:5173/). Si Vite muestra otro puerto, usa la dirección de la terminal. Si la API está en otra dirección, copia [`.env.example`](frontend/.env.example) a `frontend/.env`, cambia `VITE_API_URL` y vuelve a iniciar Vite.

## 4. Probar los formularios

1. Haz clic en **Modo administrador** e ingresa `admin123`, la clave predeterminada para la demostración local. Puedes cambiarla con `VITE_ADMIN_PASSWORD` en `frontend/.env` y reiniciar Vite.
2. En **Géneros**, **Directores**, **Productoras** y **Tipos**, usa **Nuevo** para guardar un registro y **Editar** para modificarlo. En una base nueva crea al menos un director y una productora para poder registrar una producción.
3. En la página principal, haz clic en **Nueva producción**, selecciona los catálogos y guarda. Usa **Editar** en su tarjeta para actualizarla. Los seriales nuevos admiten letras sin tilde, números, guiones y guiones bajos. El año de estreno debe estar entre 1900 y el año actual.
4. Haz clic en **Ver** para cargar en la misma pestaña la ruta que se genera a partir del serial, por ejemplo `/media?PELI-001`. La ruta abre el enlace guardado en **URL de la producción** en esa pestaña. En ese campo pega la dirección completa de reproducción, con `https://` o `http://`. Al volver con el botón del navegador, conservas el modo administrador o invitado. Como visitante puedes ver las producciones activas.
