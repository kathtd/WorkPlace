package co.workplace.servlet;

import co.workplace.dao.UsuarioDAO;
import co.workplace.modelo.Usuario;
import co.workplace.servicio.Sesiones;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "ApiPerfilServlet", urlPatterns = {"/api/perfil"})
public class ApiPerfilServlet extends ApiServlet {

    private static final Logger LOG = Logger.getLogger(ApiPerfilServlet.class.getName());

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int id = Sesiones.validar(token(request));
        if (id < 0) {
            error(response, 401, "Debes iniciar sesión.");
            return;
        }
        try {
            Usuario u = usuarioDAO.buscarPorId(id);
            if (u == null) {
                error(response, 401, "Debes iniciar sesión.");
                return;
            }
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("exito", true);
            cuerpo.put("usuario", datosUsuario(u));
            responder(response, 200, cuerpo);
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error de base de datos en /api/perfil", e);
            error(response, 503, "No pudimos conectarnos con la base de datos.");
        }
    }
}
