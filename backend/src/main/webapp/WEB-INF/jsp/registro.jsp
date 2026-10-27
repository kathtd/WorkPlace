<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="seccion" value="registro" />
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Usuarios | WorkPlace</title>
    <link rel="stylesheet" href="${ctx}/vendor/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="${ctx}/css/style.css">
    <link rel="stylesheet" href="${ctx}/css/registro.css">
    <link rel="icon" href="${ctx}/Imagenes/icon-192.png" type="image/png">
</head>
<body>
    <%@ include file="encabezado.jspf" %>

    <main class="page" id="contenido">
        <div class="container narrow">
            <div class="form-card">
                <div class="registro__intro">
                    <span class="registro__icon"><i class="fa-solid fa-user-plus" aria-hidden="true"></i></span>
                    <div>
                        <h1 class="form-step__title">Crea tu cuenta en WorkPlace</h1>
                        <p class="form-step__text">Regístrate para postularte a vacantes y hacer seguimiento a tus procesos.</p>
                    </div>
                </div>

                <c:if test="${not empty registrado}">
                    <div class="alerta alerta--exito" role="status">
                        <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
                        <p><strong>¡Registro exitoso!</strong> <c:out value="${registrado}" /> quedó registrado en WorkPlace.
                            <a href="${ctx}/usuarios">Ver usuarios registrados</a></p>
                    </div>
                </c:if>

                <c:if test="${not empty errorGeneral}">
                    <div class="alerta alerta--error" role="alert">
                        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                        <p><c:out value="${errorGeneral}" /></p>
                    </div>
                </c:if>

                <c:if test="${not empty errores}">
                    <div class="alerta alerta--error" role="alert">
                        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
                        <p>Revisa los campos marcados para completar el registro.</p>
                    </div>
                </c:if>

                <form class="form-fields registro__form" method="post" action="${ctx}/registro" novalidate>
                    <div class="field">
                        <label class="field__label" for="documento"><i class="fa-regular fa-id-card" aria-hidden="true"></i> Documento de identidad</label>
                        <input class="input${not empty errores.documento ? ' input--error' : ''}" type="text" id="documento" name="documento"
                               inputmode="numeric" maxlength="13" autocomplete="off" required placeholder="Ej. 1088123456"
                               value="<c:out value='${usuario.documento}' />"
                               aria-describedby="documento-ayuda${not empty errores.documento ? ' documento-error' : ''}"${not empty errores.documento ? ' aria-invalid="true"' : ''}>
                        <p class="field__help" id="documento-ayuda">Solo números, entre 6 y 10 dígitos.</p>
                        <c:if test="${not empty errores.documento}"><p class="field__error" id="documento-error"><c:out value="${errores.documento}" /></p></c:if>
                    </div>

                    <div class="form-row">
                        <div class="field">
                            <label class="field__label" for="nombres"><i class="fa-regular fa-user" aria-hidden="true"></i> Nombres</label>
                            <input class="input${not empty errores.nombres ? ' input--error' : ''}" type="text" id="nombres" name="nombres"
                                   maxlength="60" autocomplete="given-name" required placeholder="Ej. María Fernanda"
                                   value="<c:out value='${usuario.nombres}' />"${not empty errores.nombres ? ' aria-invalid="true" aria-describedby="nombres-error"' : ''}>
                            <c:if test="${not empty errores.nombres}"><p class="field__error" id="nombres-error"><c:out value="${errores.nombres}" /></p></c:if>
                        </div>
                        <div class="field">
                            <label class="field__label" for="apellidos"><i class="fa-regular fa-user" aria-hidden="true"></i> Apellidos</label>
                            <input class="input${not empty errores.apellidos ? ' input--error' : ''}" type="text" id="apellidos" name="apellidos"
                                   maxlength="60" autocomplete="family-name" required placeholder="Ej. González Ríos"
                                   value="<c:out value='${usuario.apellidos}' />"${not empty errores.apellidos ? ' aria-invalid="true" aria-describedby="apellidos-error"' : ''}>
                            <c:if test="${not empty errores.apellidos}"><p class="field__error" id="apellidos-error"><c:out value="${errores.apellidos}" /></p></c:if>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="field">
                            <label class="field__label" for="correo"><i class="fa-regular fa-envelope" aria-hidden="true"></i> Correo electrónico</label>
                            <input class="input${not empty errores.correo ? ' input--error' : ''}" type="email" id="correo" name="correo"
                                   maxlength="100" autocomplete="email" required placeholder="nombre@correo.com"
                                   value="<c:out value='${usuario.correo}' />"${not empty errores.correo ? ' aria-invalid="true" aria-describedby="correo-error"' : ''}>
                            <c:if test="${not empty errores.correo}"><p class="field__error" id="correo-error"><c:out value="${errores.correo}" /></p></c:if>
                        </div>
                        <div class="field">
                            <label class="field__label" for="telefono"><i class="fa-solid fa-phone" aria-hidden="true"></i> Teléfono de contacto</label>
                            <input class="input${not empty errores.telefono ? ' input--error' : ''}" type="tel" id="telefono" name="telefono"
                                   maxlength="16" autocomplete="tel" required placeholder="Ej. 301 930 8927"
                                   value="<c:out value='${usuario.telefono}' />"${not empty errores.telefono ? ' aria-invalid="true" aria-describedby="telefono-error"' : ''}>
                            <c:if test="${not empty errores.telefono}"><p class="field__error" id="telefono-error"><c:out value="${errores.telefono}" /></p></c:if>
                        </div>
                    </div>

                    <button type="submit" class="btn btn--primary btn--lg btn--block">Registrarme</button>
                    <p class="form-note"><i class="fa-solid fa-lock" aria-hidden="true"></i> Tus datos se guardan de forma segura y no se comparten sin tu autorización.</p>
                </form>
            </div>
        </div>
    </main>
</body>
</html>
