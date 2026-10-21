-- Modelo inicial de base de datos para el Caso de Estudio de Películas
-- Motor: MySQL 8.0+
-- Nota: el serial se propone como VARCHAR para permitir identificadores alfanuméricos.
-- Cada producción tiene un solo género, director, productora y tipo, como exige el caso.

CREATE DATABASE IF NOT EXISTS cine_universitario
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cine_universitario;

CREATE TABLE genero (
    id_genero INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    descripcion TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE director (
    id_director INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(180) NOT NULL,
    estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE productora (
    id_productora INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    slogan VARCHAR(255) NULL,
    descripcion TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE tipo (
    id_tipo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    descripcion TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE media (
    serial VARCHAR(50) PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    sinopsis TEXT NOT NULL,
    url VARCHAR(2048) NOT NULL UNIQUE,
    portada VARCHAR(2048) NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    anio_estreno YEAR NOT NULL,
    id_genero INT UNSIGNED NOT NULL,
    id_director INT UNSIGNED NOT NULL,
    id_productora INT UNSIGNED NOT NULL,
    id_tipo INT UNSIGNED NOT NULL,
    CONSTRAINT fk_media_genero
        FOREIGN KEY (id_genero) REFERENCES genero(id_genero)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_media_director
        FOREIGN KEY (id_director) REFERENCES director(id_director)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_media_productora
        FOREIGN KEY (id_productora) REFERENCES productora(id_productora)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_media_tipo
        FOREIGN KEY (id_tipo) REFERENCES tipo(id_tipo)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Datos iniciales solicitados en el enunciado.
INSERT INTO genero (nombre, descripcion) VALUES
('Acción', 'Producciones de acción'),
('Aventura', 'Producciones de aventura'),
('Ciencia ficción', 'Producciones de ciencia ficción'),
('Drama', 'Producciones dramáticas'),
('Terror', 'Producciones de terror');

INSERT INTO tipo (nombre, descripcion) VALUES
('Película', 'Producción audiovisual de tipo película'),
('Serie', 'Producción audiovisual de tipo serie');

-- Consulta para revisar la estructura de las tablas:
SHOW TABLES;
DESCRIBE genero;
DESCRIBE director;
DESCRIBE productora;
DESCRIBE tipo;
DESCRIBE media;
