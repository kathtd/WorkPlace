package co.workplace.db;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public final class Conexion {

    private static final String ARCHIVO = "db.properties";
    private static final Properties CONFIG = cargarConfiguracion();

    private Conexion() {
    }

    private static Properties cargarConfiguracion() {
        Properties props = new Properties();
        try (InputStream in = Conexion.class.getClassLoader().getResourceAsStream(ARCHIVO)) {
            if (in == null) {
                throw new IllegalStateException("No se encontró " + ARCHIVO
                        + ". Copia db.properties.example como db.properties en src/main/resources.");
            }
            props.load(in);
            // Se registra el driver a mano porque en Tomcat la carga automatica puede fallar
            Class.forName(props.getProperty("db.driver", "com.mysql.cj.jdbc.Driver"));
            return props;
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo leer " + ARCHIVO, e);
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("No se encontró el driver JDBC de MySQL en el classpath", e);
        }
    }

    public static Connection obtener() throws SQLException {
        return DriverManager.getConnection(
                CONFIG.getProperty("db.url"),
                CONFIG.getProperty("db.usuario"),
                CONFIG.getProperty("db.clave"));
    }
}
