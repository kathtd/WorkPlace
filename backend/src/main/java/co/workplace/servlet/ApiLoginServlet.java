package co.workplace.servlet;

import co.workplace.dao.UsuarioDAO;
import co.workplace.modelo.Usuario;
import co.workplace.servicio.Clave;
import co.workplace.servicio.Sesiones;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "ApiLoginServlet", urlPatterns = {"/api/login", "/api/logout"})
public class ApiLoginServlet extends ApiServlet {

    private static final Logger LOG = Logger.getLogger(ApiLoginServlet.class.getName());
    private static final String HASH_FALSO = Clave.hashear("no-existe-123");

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (request.getServletPath().equals("/api/logout")) {
            Sesiones.cerrar(token(request));
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("exito", true);
            cuerpo.put("mensaje", "Sesión cerrada.");
            responder(response, 200, cuerpo);
            return;
        }

        Map<String, String> datos = leerCuerpo(request);
        if (datos == null) {
            error(response, 400, "El cuerpo debe ser un JSON válido.");
            return;
        }
        String correo = datos.getOrDefault("correo", "").trim().toLowerCase(Locale.ROOT);
        String clave = datos.getOrDefault("clave", "");
        if (correo.isEmpty() || clave.isEmpty()) {
            error(response, 400, "Escribe el correo y la contraseña.");
            return;
        }

        try {
            Usuario u = usuarioDAO.buscarPorCorreo(correo);
            // Se calcula el hash aunque el correo no exista, para que tarde igual
            boolean correcta = Clave.verificar(clave, u == null ? HASH_FALSO : u.getClaveHash());
            if (u == null || !correcta) {
                error(response, 401, "Correo o contraseña incorrectos.");
                return;
            }
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("exito", true);
            cuerpo.put("mensaje", "Autenticación correcta.");
            cuerpo.put("token", Sesiones.crear(u.getId()));
            cuerpo.put("usuario", datosUsuario(u));
            responder(response, 200, cuerpo);
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error de base de datos en /api/login", e);
            error(response, 503, "No pudimos conectarnos con la base de datos.");
        }
    }
}
