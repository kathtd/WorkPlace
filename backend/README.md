# WorkPlace · Módulo de registro de usuarios (JDBC + Servlet)

Evidencia **GA7-220501096-AA2-EV01 / EV02** (Fase 3, Actividad de proyecto 7): registro de usuarios con formulario procesado por un **Servlet**, datos guardados en **MySQL** con **JDBC** y validación de **datos repetidos**.

## Requisitos de la guía y dónde se cumplen

| Requisito | Implementación |
|---|---|
| Registro con documento, nombres, apellidos, correo y teléfono | `webapp/WEB-INF/jsp/registro.jsp` + `modelo/Usuario.java` |
| Registrar en BD usando conexión JDBC | `db/Conexion.java` (DriverManager) y `dao/UsuarioDAO.java` (PreparedStatement) |
| Formulario de registro usando Servlet | `servlet/RegistroServlet.java` (GET muestra, POST procesa) |
| Validación de existencia de datos repetidos | `UsuarioDAO.registrar()` consulta documento y correo antes de insertar, y la tabla tiene restricciones `UNIQUE` como respaldo |
| Módulos probados | `src/test`: 25 pruebas unitarias de validación + 3 pruebas de integración con MySQL |

## Estructura

```
backend/
├── sql/workplace.sql                    Crea la base, la tabla usuarios y el usuario de la aplicación
├── pom.xml                              Dependencias (Servlet 3.1, JSTL, MySQL Connector/J, JUnit 5)
├── mvnw.cmd / mvnw                      Maven Wrapper: no hace falta instalar Maven
└── src/
    ├── main/java/co/workplace/
    │   ├── db/Conexion.java             Conexión JDBC (lee db.properties)
    │   ├── modelo/Usuario.java          Modelo
    │   ├── servicio/ValidadorUsuario.java  Limpieza y validación de campos
    │   ├── dao/UsuarioDAO.java          Consultas: existe, registrar, listar
    │   ├── dao/DatoDuplicadoException.java
    │   └── servlet/                     RegistroServlet (/registro) y UsuariosServlet (/usuarios)
    ├── main/resources/db.properties     Credenciales locales (no se sube a git)
    ├── main/webapp/                     Vistas JSP y estilos
    └── test/java/                       Pruebas JUnit
```

## Puesta en marcha

### 1. Base de datos (una sola vez)

Abre **MySQL Workbench**, conéctate con `root`, abre `backend/sql/workplace.sql` (File → Open SQL Script) y ejecútalo con el rayo ⚡. Crea:

- la base `workplace` y la tabla `usuarios`;
- el usuario `workplace_app`, con permisos solo sobre esa base.

### 2. Configuración

Copia `src/main/resources/db.properties.example` como `db.properties` en la misma carpeta. Si cambiaste la contraseña en el script SQL, cámbiala también ahí.

### 3. Ejecutar

Desde VS Code: `Ctrl+Shift+P` → **Tasks: Run Task** → **Backend: ejecutar**. O en una terminal dentro de `backend/`:

```powershell
.\mvnw.cmd jetty:run-war
```

Abre http://localhost:8080/workplace

- `/registro`: formulario de registro
- `/usuarios`: usuarios guardados en MySQL

### 4. Pruebas

```powershell
.\mvnw.cmd test
```

Las pruebas de integración se omiten si MySQL no está disponible.

### 5. (Opcional) Desplegar en el Tomcat de XAMPP

```powershell
.\mvnw.cmd package
```

Copia `target/workplace.war` a `C:\xampp\tomcat\webapps\` y arranca Tomcat desde el panel de XAMPP. Si Jetty está corriendo, deténlo antes, porque ambos usan el puerto 8080.

## Reglas de validación

| Campo | Regla |
|---|---|
| Documento | Obligatorio, solo números, 6 a 10 dígitos. Se aceptan puntos y espacios (`1.088.123.456`) y se guardan sin ellos. **No se puede repetir.** |
| Nombres / Apellidos | Obligatorios, letras (incluye tildes y ñ), espacios, apóstrofo y guion; 2 a 60 caracteres. |
| Correo | Obligatorio, formato válido, se guarda en minúsculas. **No se puede repetir.** |
| Teléfono | Obligatorio. Celular `3XXXXXXXXX` o fijo `60XXXXXXXX` (10 dígitos). Acepta espacios, guiones y `+57`. |

El teléfono puede repetirse a propósito, porque varias personas pueden compartir un número de contacto.

## Casos de prueba (evidencia)

| # | Caso | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Registro correcto | Todos los campos válidos | Mensaje "¡Registro exitoso!" y el usuario aparece en `/usuarios` |
| 2 | Documento repetido | Documento de un usuario ya registrado | "Ya existe un usuario registrado con ese documento de identidad." |
| 3 | Correo repetido | Correo ya registrado (aunque cambien las mayúsculas) | "Ya existe un usuario registrado con ese correo electrónico." |
| 4 | Campos vacíos | Formulario vacío | Mensaje de error en cada campo obligatorio |
| 5 | Documento con letras | `abc123456` | "El documento debe tener entre 6 y 10 números." |
| 6 | Correo inválido | `maria@correo` | "Escribe un correo válido…" |
| 7 | Teléfono inválido | `12345` | "Escribe un celular de 10 dígitos…" |
| 8 | Inyección SQL | Nombre `' OR '1'='1` | Se rechaza por la validación; además todas las consultas usan PreparedStatement |
| 9 | MySQL apagado | Detener el servicio MySQL80 y registrar | Mensaje "No pudimos conectarnos con la base de datos…" sin mostrar errores técnicos |
