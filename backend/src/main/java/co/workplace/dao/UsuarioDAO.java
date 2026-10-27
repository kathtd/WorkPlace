package co.workplace.dao;

import co.workplace.db.Conexion;
import co.workplace.modelo.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {

    private static final String EXISTE_DOCUMENTO = "SELECT 1 FROM usuarios WHERE documento = ?";
    private static final String EXISTE_CORREO = "SELECT 1 FROM usuarios WHERE correo = ?";
    private static final String INSERTAR =
            "INSERT INTO usuarios (documento, nombres, apellidos, correo, telefono) VALUES (?, ?, ?, ?, ?)";
    private static final String LISTAR =
            "SELECT id, documento, nombres, apellidos, correo, telefono, fecha_registro FROM usuarios ORDER BY fecha_registro DESC, id DESC";
    private static final String ELIMINAR_POR_DOCUMENTO = "DELETE FROM usuarios WHERE documento = ?";

    public boolean existeDocumento(String documento) throws SQLException {
        return existe(EXISTE_DOCUMENTO, documento);
    }

    public boolean existeCorreo(String correo) throws SQLException {
        return existe(EXISTE_CORREO, correo);
    }

    // Revisa documento y correo; si aun asi se repiten, el UNIQUE de la tabla lo detiene
    public void registrar(Usuario usuario) throws SQLException, DatoDuplicadoException {
        if (existeDocumento(usuario.getDocumento())) {
            throw new DatoDuplicadoException("documento", "Ya existe un usuario registrado con ese documento de identidad.");
        }
        if (existeCorreo(usuario.getCorreo())) {
            throw new DatoDuplicadoException("correo", "Ya existe un usuario registrado con ese correo electrónico.");
        }

        try (Connection con = Conexion.obtener();
             PreparedStatement ps = con.prepareStatement(INSERTAR, PreparedStatement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, usuario.getDocumento());
            ps.setString(2, usuario.getNombres());
            ps.setString(3, usuario.getApellidos());
            ps.setString(4, usuario.getCorreo());
            ps.setString(5, usuario.getTelefono());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    usuario.setId(keys.getInt(1));
                }
            }
        } catch (SQLIntegrityConstraintViolationException e) {
            boolean esCorreo = e.getMessage() != null && e.getMessage().contains("uq_usuarios_correo");
            throw new DatoDuplicadoException(
                    esCorreo ? "correo" : "documento",
                    esCorreo ? "Ya existe un usuario registrado con ese correo electrónico."
                             : "Ya existe un usuario registrado con ese documento de identidad.");
        }
    }

    public List<Usuario> listar() throws SQLException {
        List<Usuario> usuarios = new ArrayList<>();
        try (Connection con = Conexion.obtener();
             PreparedStatement ps = con.prepareStatement(LISTAR);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Usuario u = new Usuario(
                        rs.getString("documento"),
                        rs.getString("nombres"),
                        rs.getString("apellidos"),
                        rs.getString("correo"),
                        rs.getString("telefono"));
                u.setId(rs.getInt("id"));
                u.setFechaRegistro(rs.getTimestamp("fecha_registro").toLocalDateTime());
                usuarios.add(u);
            }
        }
        return usuarios;
    }

    public boolean eliminarPorDocumento(String documento) throws SQLException {
        try (Connection con = Conexion.obtener();
             PreparedStatement ps = con.prepareStatement(ELIMINAR_POR_DOCUMENTO)) {
            ps.setString(1, documento);
            return ps.executeUpdate() > 0;
        }
    }

    private boolean existe(String sql, String valor) throws SQLException {
        try (Connection con = Conexion.obtener();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, valor);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }
}
