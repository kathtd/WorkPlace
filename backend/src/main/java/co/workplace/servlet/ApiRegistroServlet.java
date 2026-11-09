package co.workplace.servlet;

import co.workplace.dao.DatoDuplicadoException;
import co.workplace.dao.UsuarioDAO;
import co.workplace.modelo.Usuario;
import co.workplace.servicio.Clave;
import co.workplace.servicio.ValidadorUsuario;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "ApiRegistroServlet", urlPatterns = {"/api/registro"})
public class ApiRegistroServlet extends ApiServlet {

    private static final Logger LOG = Logger.getLogger(ApiRegistroServlet.class.getName());

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> datos = leerCuerpo(request);
        if (datos == null) {
            error(response, 400, "El cuerpo debe ser un JSON válido.");
            return;
        }

        Usuario original = new Usuario(datos.get("documento"), datos.get("nombres"),
                datos.get("apellidos"), datos.get("correo"), datos.get("telefono"));
        Usuario u = ValidadorUsuario.normalizar(original);
        Map<String, String> errores = ValidadorUsuario.validar(u);
        String clave = datos.get("clave");
        String errorClave = Clave.validar(clave);
        if (errorClave != null) {
            errores.put("clave", errorClave);
        }
        if (!errores.isEmpty()) {
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("exito", false);
            cuerpo.put("mensaje", "Hay datos inválidos.");
            cuerpo.put("errores", errores);
            responder(response, 400, cuerpo);
            return;
        }

        try {
            usuarioDAO.registrar(u, Clave.hashear(clave));
            Map<String, Object> cuerpo = new LinkedHashMap<>();
            cuerpo.put("exito", true);
            cuerpo.put("mensaje", "Usuario registrado.");
            cuerpo.put("usuario", datosUsuario(u));
            responder(response, 201, cuerpo);
        } catch (DatoDuplicadoException e) {
            error(response, 409, e.getMessage());
        } catch (SQLException e) {
            LOG.log(Level.SEVERE, "Error de base de datos en /api/registro", e);
            error(response, 503, "No pudimos conectarnos con la base de datos.");
        }
    }
}
