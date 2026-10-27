-- =========================================================
-- WorkPlace · Base de datos del módulo de registro de usuarios
-- Ejecutar una sola vez con un usuario administrador (root),
-- por ejemplo desde MySQL Workbench: File > Open SQL Script > ⚡ Execute
-- =========================================================

CREATE DATABASE IF NOT EXISTS workplace
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE workplace;

CREATE TABLE IF NOT EXISTS usuarios (
    id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    documento       VARCHAR(10)   NOT NULL COMMENT 'Documento de identidad, solo números',
    nombres         VARCHAR(60)   NOT NULL,
    apellidos       VARCHAR(60)   NOT NULL,
    correo          VARCHAR(100)  NOT NULL COMMENT 'Se guarda en minúsculas',
    telefono        VARCHAR(10)   NOT NULL COMMENT 'Celular (3XXXXXXXXX) o fijo (60XXXXXXXX)',
    fecha_registro  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    -- Evitan datos repetidos aunque dos registros lleguen al mismo tiempo
    CONSTRAINT uq_usuarios_documento UNIQUE (documento),
    CONSTRAINT uq_usuarios_correo    UNIQUE (correo)
) ENGINE = InnoDB;

-- Usuario de la aplicación: solo puede conectarse desde este equipo y solo
-- tiene permisos sobre la base workplace (no usar root en la aplicación).
-- Es una credencial de desarrollo local; cámbiala aquí y en db.properties si lo deseas.
CREATE USER IF NOT EXISTS 'workplace_app'@'localhost' IDENTIFIED BY 'WorkPlace#Local2026';
GRANT SELECT, INSERT, UPDATE, DELETE ON workplace.* TO 'workplace_app'@'localhost';
FLUSH PRIVILEGES;

-- Comprobación
SELECT 'Base de datos lista' AS estado, COUNT(*) AS usuarios_registrados FROM usuarios;
