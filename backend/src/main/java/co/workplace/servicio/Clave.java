package co.workplace.servicio;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public final class Clave {

    private static final int ITERACIONES = 120_000;
    private static final int BITS = 256;

    private Clave() {
    }

    // Formato guardado: iteraciones$sal$hash
    public static String hashear(String clave) {
        byte[] sal = new byte[16];
        new SecureRandom().nextBytes(sal);
        byte[] hash = derivar(clave, sal, ITERACIONES);
        Base64.Encoder b64 = Base64.getEncoder();
        return ITERACIONES + "$" + b64.encodeToString(sal) + "$" + b64.encodeToString(hash);
    }

    public static boolean verificar(String clave, String guardado) {
        if (guardado == null) {
            return false;
        }
        String[] partes = guardado.split("\\$");
        if (partes.length != 3) {
            return false;
        }
        Base64.Decoder b64 = Base64.getDecoder();
        byte[] esperado = b64.decode(partes[2]);
        byte[] calculado = derivar(clave, b64.decode(partes[1]), Integer.parseInt(partes[0]));
        return MessageDigest.isEqual(esperado, calculado);
    }

    // Mínimo 8 caracteres, con al menos una letra y un número
    public static String validar(String clave) {
        if (clave == null || clave.isEmpty()) {
            return "La contraseña es obligatoria.";
        }
        if (clave.length() < 8 || clave.length() > 64) {
            return "La contraseña debe tener entre 8 y 64 caracteres.";
        }
        if (!clave.matches(".*\\p{L}.*") || !clave.matches(".*\\d.*")) {
            return "La contraseña debe tener al menos una letra y un número.";
        }
        return null;
    }

    private static byte[] derivar(String clave, byte[] sal, int iteraciones) {
        try {
            PBEKeySpec spec = new PBEKeySpec(clave.toCharArray(), sal, iteraciones, BITS);
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo calcular el hash", e);
        }
    }
}
