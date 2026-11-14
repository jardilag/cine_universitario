-- Ejecutar en bases existentes para admitir el año 1900.
USE cine_universitario;

ALTER TABLE media MODIFY COLUMN anio_estreno SMALLINT UNSIGNED NOT NULL;
