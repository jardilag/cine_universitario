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
4. Copia [`.env.example`](multimedia_backend/.env.example) a `multimedia_backend/.env` y configura ahí tus valores `DB_*`. Configura `ADMIN_JWT_SECRET` con una clave aleatoria de 64 caracteres hexadecimales. Genera la clave con `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
5. Para habilitar la gestión del catálogo, la tabla `usuario` debe contener una cuenta activa con rol `ADMIN` y un hash bcrypt en `password_hash`. El script inicial crea la tabla vacía. Si ya tienes cuentas, consérvalas al importar la base de datos.

Puedes revisar los tipos de las columnas en la pestaña **Estructura** de cada tabla. La URL de reproducción admite hasta 768 caracteres.

## 2. Iniciar la API

Abre una terminal en la raíz del repositorio y ejecuta estos comandos. Mantén la terminal abierta mientras uses la aplicación.

```sh
cd multimedia_backend
npm ci
npm start
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

1. Haz clic en **Iniciar sesión** e ingresa el usuario y la contraseña de tu cuenta. La API consulta la tabla `usuario` y devuelve el rol de la cuenta. El rol `ADMIN` habilita la gestión del catálogo. La sesión termina a los 30 minutos o al recargar la página.
2. En **Géneros**, **Directores**, **Productoras** y **Tipos**, usa **Nuevo** para guardar un registro y **Editar** para modificarlo. En una base nueva crea al menos un director y una productora para poder registrar una producción.
3. En la página principal, haz clic en **Nueva producción**, selecciona los catálogos y guarda. Usa **Editar** en su tarjeta para actualizarla. Los seriales nuevos admiten letras sin tilde, números, guiones y guiones bajos. El año de estreno debe estar entre 1900 y el año actual.
4. Haz clic en **Ver** para cargar en la misma pestaña la ruta que se genera a partir del serial, por ejemplo `/media?PELI-001`. La ruta abre el enlace guardado en **URL de la producción** en esa pestaña. En ese campo pega la dirección completa de reproducción, con `https://` o `http://`. Como visitante puedes ver las producciones activas.

## 5. Desplegar el backend en Render

Crea un **Web Service** con `multimedia_backend` como **Root Directory**, `npm ci` como **Build Command** y `npm start` como **Start Command**.

En **Environment**, configura `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD` y `TIDB_DATABASE` con los datos del usuario SQL. Configura `ADMIN_JWT_SECRET` para firmar las sesiones y usa como `FRONTEND_ORIGIN` el origen desde el que se abrirá React. Arranca con `npm start` en ambos entornos. Migra la tabla `usuario` con sus registros a TiDB para conservar las cuentas de la aplicación.

El esquema usa `VARCHAR(768)` para conservar el índice único de `media.url` dentro del límite predeterminado de TiDB con `utf8mb4`. Para mover una base existente, exporta su esquema y sus datos, e impórtalos en un destino vacío. El script base es para instalaciones nuevas e incluye datos de ejemplo. [Límite de índices de TiDB](https://docs.pingcap.com/tidb/stable/tidb-limitations/#limitations-on-indexes)
