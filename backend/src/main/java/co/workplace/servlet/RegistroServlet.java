package co.workplace.servlet;

import co.workplace.dao.DatoDuplicadoException;
import co.workplace.dao.UsuarioDAO;
import co.workplace.modelo.Usuario;
import co.workplace.servicio.ValidadorUsuario;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Formulario de registro de usuarios.
 * GET  /registro  muestra el formulario.
 * POST /registro  valida los datos, revisa duplicados y guarda en MySQL.
 */
@WebServlet(name = "RegistroServlet", urlPatterns = {"/registro"})
public class RegistroServlet extends HttpServlet {

    private static final Logger LOG = Logger.getLogger(RegistroServlet.class.getName());
    private static final String VISTA = "/WEB-INF/jsp/registro.jsp";

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Mensaje de éxito guardado en sesión por el POST anterior (patrón Post/Redirect/Get)
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("registrado") != null) {
            request.setAttribute("registrado", session.getAttribute("registrado"));
            session.removeAttribute("registrado");
        }
        request.getRequestDispatcher(VISTA).forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        Usuario usuario = ValidadorUsuario.normalizar(new Usuario(
                request.getParameter("documento"),
                request.getParameter("nombres"),
                request.getParameter("apellidos"),
                request.getParameter("correo"),
                request.getParameter("telefono")));

        Map<String, String> errores = ValidadorUsuario.validar(usuario);
        if (!errores.isEmpty()) {
            mostrarFormulario(request, response, usuario, errores, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        try {
            usuarioDAO.registrar(usuario);
            LOG.info(() -> "Usuario registrado con id " + usuario.getId());
            request.getSession().setAttribute("registrado", usuario.getNombreCompleto());
            response.sendRedirect(request.getContextPath() + "/registro");
        } catch (DatoDuplicadoException e) {
            errores.put(e.getCampo(), e.getMessage());
            mostrarFormulario(request, response, usuario, errores, HttpServletResponse.SC_CONFLICT);
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error de base de datos al registrar usuario", e);
            request.setAttribute("errorGeneral",
                    "No pudimos conectarnos con la base de datos. Verifica que MySQL esté encendido e inténtalo de nuevo.");
            mostrarFormulario(request, response, usuario, errores, HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        }
    }

    private void mostrarFormulario(HttpServletRequest request, HttpServletResponse response,
                                   Usuario usuario, Map<String, String> errores, int estado)
            throws ServletException, IOException {
        response.setStatus(estado);
        request.setAttribute("usuario", usuario);
        request.setAttribute("errores", errores);
        request.getRequestDispatcher(VISTA).forward(request, response);
    }
}
