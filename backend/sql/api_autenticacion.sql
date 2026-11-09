-- Agrega la contraseña (guardada con hash) a una base que ya existía.
-- Si la base se creó con el workplace.sql nuevo, no hace falta. Ejecutar con root.
USE workplace;

ALTER TABLE usuarios
    ADD COLUMN clave_hash VARCHAR(120) NULL COMMENT 'PBKDF2: iteraciones$sal$hash' AFTER telefono;
