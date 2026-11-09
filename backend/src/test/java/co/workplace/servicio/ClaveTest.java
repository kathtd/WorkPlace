package co.workplace.servicio;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Contraseñas y JSON de la API")
class ClaveTest {

    @Test
    @DisplayName("La contraseña correcta se verifica contra su hash")
    void verificaCorrecta() {
        String hash = Clave.hashear("Clave1234");
        assertTrue(Clave.verificar("Clave1234", hash));
    }

    @Test
    @DisplayName("Una contraseña distinta no pasa")
    void rechazaIncorrecta() {
        String hash = Clave.hashear("Clave1234");
        assertFalse(Clave.verificar("Clave12345", hash));
        assertFalse(Clave.verificar("Clave1234", null));
    }

    @Test
    @DisplayName("El hash no contiene la contraseña y cambia en cada llamada")
    void hashConSal() {
        String a = Clave.hashear("Clave1234");
        String b = Clave.hashear("Clave1234");
        assertFalse(a.contains("Clave1234"));
        assertNotEquals(a, b);
    }

    @Test
    @DisplayName("Valida el formato de la contraseña")
    void validaFormato() {
        assertNotNull(Clave.validar(""));
        assertNotNull(Clave.validar("corta1"));
        assertNotNull(Clave.validar("sinnumeros"));
        assertNotNull(Clave.validar("12345678"));
        assertNull(Clave.validar("Clave1234"));
    }

    @Test
    @DisplayName("Lee un JSON con tildes y comillas")
    void leeJson() {
        var datos = Json.leer("{\"correo\": \"a@b.co\", \"nombres\": \"Mar\\\"ía\"}");
        assertEquals("a@b.co", datos.get("correo"));
        assertEquals("Mar\"ía", datos.get("nombres"));
    }

    @Test
    @DisplayName("Entiende las tildes escritas en formato unicode")
    void leeUnicode() {
        var datos = Json.leer("{\"nombres\": \"Mar\\u00eda\"}");
        assertEquals("María", datos.get("nombres"));
    }

    @Test
    @DisplayName("Un texto que no es JSON se rechaza")
    void rechazaTexto() {
        assertNull(Json.leer("correo=a@b.co"));
    }

    @Test
    @DisplayName("Un token válido se acepta y uno falso no")
    void sesiones() {
        String token = Sesiones.crear(7);
        assertEquals(7, Sesiones.validar(token));
        assertEquals(-1, Sesiones.validar("falso"));
        Sesiones.cerrar(token);
        assertEquals(-1, Sesiones.validar(token));
    }
}
