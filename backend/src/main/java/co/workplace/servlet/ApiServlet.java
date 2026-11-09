package co.workplace.servlet;

import co.workplace.modelo.Usuario;
import co.workplace.servicio.Json;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

// Base de los servlets de la API: leen y responden JSON
abstract class ApiServlet extends HttpServlet {

    protected Map<String, String> leerCuerpo(HttpServletRequest request) throws IOException {
        request.setCharacterEncoding("UTF-8");
        StringBuilder sb = new StringBuilder();
        try (BufferedReader lector = request.getReader()) {
            String linea;
            while ((linea = lector.readLine()) != null) {
                sb.append(linea);
            }
        }
        return Json.leer(sb.toString());
    }

    protected void responder(HttpServletResponse response, int estado, Map<String, ?> cuerpo) throws IOException {
        response.setStatus(estado);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(Json.escribir(cuerpo));
    }

    protected void error(HttpServletResponse response, int estado, String mensaje) throws IOException {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("exito", false);
        cuerpo.put("mensaje", mensaje);
        responder(response, estado, cuerpo);
    }

    protected String token(HttpServletRequest request) {
        String cabecera = request.getHeader("Authorization");
        if (cabecera != null && cabecera.startsWith("Bearer ")) {
            return cabecera.substring(7).trim();
        }
        return null;
    }

    protected Map<String, Object> datosUsuario(Usuario u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("documento", u.getDocumento());
        m.put("nombres", u.getNombres());
        m.put("apellidos", u.getApellidos());
        m.put("correo", u.getCorreo());
        m.put("telefono", u.getTelefono());
        return m;
    }
}
