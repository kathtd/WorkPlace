package co.workplace.servicio;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// Tokens en memoria: se pierden si se reinicia el servidor
public final class Sesiones {

    private static final long DURACION_MS = 30 * 60 * 1000;
    private static final Map<String, long[]> TOKENS = new ConcurrentHashMap<>();
    private static final SecureRandom ALEATORIO = new SecureRandom();

    private Sesiones() {
    }

    public static String crear(int idUsuario) {
        byte[] bytes = new byte[32];
        ALEATORIO.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        TOKENS.put(token, new long[]{idUsuario, System.currentTimeMillis() + DURACION_MS});
        return token;
    }

    // Devuelve el id del usuario o -1 si el token no sirve
    public static int validar(String token) {
        long[] datos = token == null ? null : TOKENS.get(token);
        if (datos == null) {
            return -1;
        }
        if (datos[1] < System.currentTimeMillis()) {
            TOKENS.remove(token);
            return -1;
        }
        return (int) datos[0];
    }

    public static void cerrar(String token) {
        if (token != null) {
            TOKENS.remove(token);
        }
    }
}
