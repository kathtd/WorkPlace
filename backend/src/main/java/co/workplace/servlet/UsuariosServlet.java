package co.workplace.servlet;

import co.workplace.dao.UsuarioDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "UsuariosServlet", urlPatterns = {"/usuarios"})
public class UsuariosServlet extends HttpServlet {

    private static final Logger LOG = Logger.getLogger(UsuariosServlet.class.getName());

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            request.setAttribute("usuarios", usuarioDAO.listar());
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error de base de datos al listar usuarios", e);
            request.setAttribute("usuarios", Collections.emptyList());
            request.setAttribute("errorGeneral",
                    "No pudimos conectarnos con la base de datos. Verifica que MySQL esté encendido.");
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        }
        request.getRequestDispatcher("/WEB-INF/jsp/usuarios.jsp").forward(request, response);
    }
}
