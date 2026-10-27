package co.workplace.dao;

/**
 * Se lanza cuando se intenta registrar un documento o correo que ya existe.
 */
public class DatoDuplicadoException extends Exception {

    private final String campo;

    public DatoDuplicadoException(String campo, String mensaje) {
        super(mensaje);
        this.campo = campo;
    }

    /** Campo del formulario que está repetido: "documento" o "correo". */
    public String getCampo() {
        return campo;
    }
}
