package co.workplace.servicio;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// JSON sencillo: solo objetos planos con valores de texto
public final class Json {

    private static final Pattern PAR = Pattern.compile("\"((?:[^\"\\\\]|\\\\.)*)\"\\s*:\\s*\"((?:[^\"\\\\]|\\\\.)*)\"");

    private Json() {
    }

    // Devuelve null si el texto no parece un objeto JSON
    public static Map<String, String> leer(String texto) {
        if (texto == null || !texto.trim().startsWith("{")) {
            return null;
        }
        Map<String, String> datos = new LinkedHashMap<>();
        Matcher m = PAR.matcher(texto);
        while (m.find()) {
            datos.put(desescapar(m.group(1)), desescapar(m.group(2)));
        }
        return datos;
    }

    @SuppressWarnings("unchecked")
    public static String escribir(Map<String, ?> datos) {
        StringBuilder sb = new StringBuilder("{");
        boolean primero = true;
        for (Map.Entry<String, ?> e : datos.entrySet()) {
            if (!primero) {
                sb.append(',');
            }
            primero = false;
            sb.append('"').append(escapar(e.getKey())).append("\":");
            Object v = e.getValue();
            if (v instanceof Map) {
                sb.append(escribir((Map<String, ?>) v));
            } else if (v instanceof Number || v instanceof Boolean) {
                sb.append(v);
            } else {
                sb.append('"').append(escapar(String.valueOf(v))).append('"');
            }
        }
        return sb.append('}').toString();
    }

    private static String escapar(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default: sb.append(c);
            }
        }
        return sb.toString();
    }

    private static String desescapar(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\' && i + 1 < s.length()) {
                char sig = s.charAt(++i);
                switch (sig) {
                    case 'n': sb.append('\n'); break;
                    case 'r': sb.append('\r'); break;
                    case 't': sb.append('\t'); break;
                    case 'u':
                        // Tildes escritas en formato unicode, como las mandan algunos clientes JSON
                        if (i + 4 < s.length() && s.substring(i + 1, i + 5).matches("[0-9a-fA-F]{4}")) {
                            sb.append((char) Integer.parseInt(s.substring(i + 1, i + 5), 16));
                            i += 4;
                        } else {
                            sb.append(sig);
                        }
                        break;
                    default: sb.append(sig);
                }
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
