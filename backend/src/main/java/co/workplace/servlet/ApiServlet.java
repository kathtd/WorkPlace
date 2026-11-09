package co.workplace.servlet;

import co.workplace.modelo.Usuario;
import co.workplace.servicio.Json;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

// Base de los servlets de la API: leen y responden JSON
abstract class ApiServlet extends HttpServlet {

    // Páginas que pueden llamar a la API desde otro dominio
    private static final Pattern ORIGEN_PERMITIDO =
            Pattern.compile("https://kathtd\\.github\\.io|http://(localhost|127\\.0\\.0\\.1)(:\\d+)?");

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String origen = request.getHeader("Origin");
        if (origen != null && ORIGEN_PERMITIDO.matcher(origen).matches()) {
            response.setHeader("Access-Control-Allow-Origin", origen);
            response.setHeader("Vary", "Origin");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        }
        // El navegador pregunta con OPTIONS antes de enviar el POST
        if ("OPTIONS".equals(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }
        super.service(request, response);
    }

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
