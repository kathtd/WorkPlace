package co.workplace.servicio;

import co.workplace.modelo.Usuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Validación de datos del registro de usuarios")
class ValidadorUsuarioTest {

    private static Usuario valido() {
        return new Usuario("1088123456", "María Fernanda", "González Ríos", "maria@correo.com", "3019308927");
    }

    private static Map<String, String> validar(Usuario u) {
        return ValidadorUsuario.validar(ValidadorUsuario.normalizar(u));
    }

    @Test
    @DisplayName("Un usuario con todos los datos correctos no tiene errores")
    void usuarioValido() {
        assertTrue(validar(valido()).isEmpty());
    }

    @Test
    @DisplayName("Todos los campos son obligatorios")
    void camposVacios() {
        Map<String, String> errores = validar(new Usuario("", " ", null, "", ""));
        assertEquals(5, errores.size());
        assertTrue(errores.keySet().containsAll(java.util.List.of("documento", "nombres", "apellidos", "correo", "telefono")));
    }

    @Test
    @DisplayName("Normaliza espacios, mayúsculas del correo y separadores")
    void normaliza() {
        Usuario u = ValidadorUsuario.normalizar(
                new Usuario(" 1.088.123.456 ", "  María   Fernanda ", "González  Ríos", " Maria@Correo.COM ", "+57 301-930-8927"));
        assertEquals("1088123456", u.getDocumento());
        assertEquals("María Fernanda", u.getNombres());
        assertEquals("González Ríos", u.getApellidos());
        assertEquals("maria@correo.com", u.getCorreo());
        assertEquals("3019308927", u.getTelefono());
    }

    @ParameterizedTest
    @ValueSource(strings = {"12345", "12345678901", "abc123456", "1088-12A"})
    @DisplayName("Rechaza documentos con letras o longitud inválida")
    void documentoInvalido(String documento) {
        Usuario u = valido();
        u.setDocumento(documento);
        assertTrue(validar(u).containsKey("documento"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"Juan123", "J", "<script>", "Ana_María"})
    @DisplayName("Rechaza nombres con números, símbolos o muy cortos")
    void nombreInvalido(String nombre) {
        Usuario u = valido();
        u.setNombres(nombre);
        assertTrue(validar(u).containsKey("nombres"));
    }

    @Test
    @DisplayName("Acepta nombres con tildes, ñ, apóstrofo y guion")
    void nombresColombianos() {
        Usuario u = valido();
        u.setNombres("José Ñúñez");
        u.setApellidos("D'Alemán Pérez-Gómez");
        assertTrue(validar(u).isEmpty());
    }

    @ParameterizedTest
    @ValueSource(strings = {"maria", "maria@", "maria@correo", "@correo.com", "maria correo@x.com"})
    @DisplayName("Rechaza correos con formato inválido")
    void correoInvalido(String correo) {
        Usuario u = valido();
        u.setCorreo(correo);
        assertTrue(validar(u).containsKey("correo"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"3019308927", "301 930 8927", "+57 3019308927", "6014567890"})
    @DisplayName("Acepta celulares y fijos colombianos de 10 dígitos")
    void telefonoValido(String telefono) {
        Usuario u = valido();
        u.setTelefono(telefono);
        assertFalse(validar(u).containsKey("telefono"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"301930892", "2019308927", "30193089271", "teléfono"})
    @DisplayName("Rechaza teléfonos con longitud o inicio inválidos")
    void telefonoInvalido(String telefono) {
        Usuario u = valido();
        u.setTelefono(telefono);
        assertTrue(validar(u).containsKey("telefono"));
    }
}
