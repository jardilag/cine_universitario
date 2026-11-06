-- Migración para bases de datos YA creadas con el script anterior.
-- Agrega la columna "estado" a tipo y media, para que "eliminar" solo inactive
-- (igual que ya ocurría con genero, director y productora).
-- Ejecutar UNA sola vez. Si la columna ya existe, MySQL mostrará un error y no hace falta repetirlo.

USE cine_universitario;

ALTER TABLE tipo
  ADD COLUMN estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo' AFTER nombre;

ALTER TABLE media
  ADD COLUMN estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo' AFTER portada;
