package co.workplace.servicio;

import co.workplace.modelo.Usuario;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

public final class ValidadorUsuario {

    private static final Pattern DOCUMENTO = Pattern.compile("\\d{6,10}");
    private static final Pattern NOMBRE = Pattern.compile("[\\p{L}][\\p{L} '\\-]{1,59}");
    private static final Pattern CORREO = Pattern.compile("[\\w.+\\-]+@[\\w\\-]+(\\.[\\w\\-]+)*\\.[a-z]{2,}");
    private static final Pattern TELEFONO = Pattern.compile("(3\\d{9}|60\\d{8})");

    private ValidadorUsuario() {
    }

    public static Usuario normalizar(Usuario original) {
        Usuario u = new Usuario();
        u.setDocumento(sinSeparadores(original.getDocumento()));
        u.setNombres(espacios(original.getNombres()));
        u.setApellidos(espacios(original.getApellidos()));
        u.setCorreo(espacios(original.getCorreo()).toLowerCase(Locale.ROOT));
        String telefono = sinSeparadores(original.getTelefono());
        if (telefono.length() == 12 && telefono.startsWith("57")) {
            telefono = telefono.substring(2);
        }
        u.setTelefono(telefono);
        return u;
    }

    public static Map<String, String> validar(Usuario u) {
        Map<String, String> errores = new LinkedHashMap<>();

        if (u.getDocumento().isEmpty()) {
            errores.put("documento", "El documento de identidad es obligatorio.");
        } else if (!DOCUMENTO.matcher(u.getDocumento()).matches()) {
            errores.put("documento", "El documento debe tener entre 6 y 10 números.");
        }

        validarNombre(errores, "nombres", "nombres", u.getNombres());
        validarNombre(errores, "apellidos", "apellidos", u.getApellidos());

        if (u.getCorreo().isEmpty()) {
            errores.put("correo", "El correo electrónico es obligatorio.");
        } else if (u.getCorreo().length() > 100 || !CORREO.matcher(u.getCorreo()).matches()) {
            errores.put("correo", "Escribe un correo válido, por ejemplo nombre@dominio.com.");
        }

        if (u.getTelefono().isEmpty()) {
            errores.put("telefono", "El teléfono de contacto es obligatorio.");
        } else if (!TELEFONO.matcher(u.getTelefono()).matches()) {
            errores.put("telefono", "Escribe un celular de 10 dígitos (3XX XXX XXXX) o un fijo 60X XXX XXXX.");
        }

        return errores;
    }

    private static void validarNombre(Map<String, String> errores, String campo, String etiqueta, String valor) {
        if (valor.isEmpty()) {
            errores.put(campo, "Los " + etiqueta + " son obligatorios.");
        } else if (!NOMBRE.matcher(valor).matches()) {
            errores.put(campo, "Los " + etiqueta + " solo pueden tener letras y espacios (2 a 60 caracteres).");
        }
    }

    private static String espacios(String valor) {
        return valor == null ? "" : valor.trim().replaceAll("\\s+", " ");
    }

    private static String sinSeparadores(String valor) {
        return valor == null ? "" : valor.replaceAll("[\\s.\\-()+]", "");
    }
}
