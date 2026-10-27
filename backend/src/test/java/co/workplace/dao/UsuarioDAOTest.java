package co.workplace.dao;

import co.workplace.db.Conexion;
import co.workplace.modelo.Usuario;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

@DisplayName("Registro de usuarios en MySQL con JDBC")
class UsuarioDAOTest {

    private static final String DOC_1 = "9999990001";
    private static final String DOC_2 = "9999990002";
    private static final String CORREO_1 = "prueba.junit.1@workplace.test";
    private static final String CORREO_2 = "prueba.junit.2@workplace.test";

    private final UsuarioDAO dao = new UsuarioDAO();

    @BeforeAll
    static void requiereBaseDeDatos() {
        boolean disponible;
        try (Connection con = Conexion.obtener()) {
            disponible = con.isValid(2);
        } catch (Exception | LinkageError e) {
            // LinkageError por si falta db.properties
            disponible = false;
        }
        assumeTrue(disponible, "MySQL no está disponible: se omiten las pruebas de integración");
    }

    @AfterEach
    void limpiar() throws Exception {
        dao.eliminarPorDocumento(DOC_1);
        dao.eliminarPorDocumento(DOC_2);
    }

    @Test
    @DisplayName("Registra un usuario y queda guardado en la base de datos")
    void registraUsuario() throws Exception {
        Usuario u = new Usuario(DOC_1, "Prueba", "JUnit", CORREO_1, "3001112233");
        dao.registrar(u);

        assertTrue(u.getId() > 0, "Debe asignarse el id generado por MySQL");
        assertTrue(dao.existeDocumento(DOC_1));
        assertTrue(dao.existeCorreo(CORREO_1));
        assertTrue(dao.listar().stream().anyMatch(x -> x.getDocumento().equals(DOC_1)));
    }

    @Test
    @DisplayName("No permite registrar dos usuarios con el mismo documento")
    void documentoRepetido() throws Exception {
        dao.registrar(new Usuario(DOC_1, "Prueba", "Uno", CORREO_1, "3001112233"));

        DatoDuplicadoException e = assertThrows(DatoDuplicadoException.class,
                () -> dao.registrar(new Usuario(DOC_1, "Prueba", "Dos", CORREO_2, "3004445566")));
        assertEquals("documento", e.getCampo());
    }

    @Test
    @DisplayName("No permite registrar dos usuarios con el mismo correo")
    void correoRepetido() throws Exception {
        dao.registrar(new Usuario(DOC_1, "Prueba", "Uno", CORREO_1, "3001112233"));

        DatoDuplicadoException e = assertThrows(DatoDuplicadoException.class,
                () -> dao.registrar(new Usuario(DOC_2, "Prueba", "Dos", CORREO_1, "3004445566")));
        assertEquals("correo", e.getCampo());
    }
}
