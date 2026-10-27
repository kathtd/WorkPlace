<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="seccion" value="usuarios" />
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuarios Registrados | WorkPlace</title>
    <link rel="stylesheet" href="${ctx}/vendor/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="${ctx}/css/style.css">
    <link rel="stylesheet" href="${ctx}/css/registro.css">
    <link rel="icon" href="${ctx}/Imagenes/icon-192.png" type="image/png">
</head>
<body>
    <%@ include file="encabezado.jspf" %>

    <main class="page" id="contenido">
        <div class="container">
            <section class="panel-card">
                <div class="panel-card__header">
                    <h1 class="panel-card__heading"><i class="fa-solid fa-users" aria-hidden="true"></i> Usuarios registrados</h1>
                    <span class="badge badge--outline">${usuarios.size()} en total</span>
                </div>

                <c:if test="${not empty errorGeneral}">
                    <div class="alerta alerta--error" role="alert">
                        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                        <p><c:out value="${errorGeneral}" /></p>
                    </div>
                </c:if>

                <c:choose>
                    <c:when test="${empty usuarios}">
                        <div class="empty-state">
                            <span class="empty-state__icon"><i class="fa-solid fa-user-plus" aria-hidden="true"></i></span>
                            <h2 class="empty-state__title">Aún no hay usuarios</h2>
                            <p class="empty-state__text">Los usuarios que se registren aparecerán aquí.</p>
                            <a class="btn btn--primary" href="${ctx}/registro">Registrar el primero</a>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <div class="tabla-wrap" role="region" aria-label="Tabla de usuarios registrados" tabindex="0">
                            <table class="tabla">
                                <thead>
                                    <tr>
                                        <th scope="col">Documento</th>
                                        <th scope="col">Nombres</th>
                                        <th scope="col">Apellidos</th>
                                        <th scope="col">Correo electrónico</th>
                                        <th scope="col">Teléfono</th>
                                        <th scope="col">Fecha de registro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="u" items="${usuarios}">
                                        <tr>
                                            <td><c:out value="${u.documento}" /></td>
                                            <td><c:out value="${u.nombres}" /></td>
                                            <td><c:out value="${u.apellidos}" /></td>
                                            <td><c:out value="${u.correo}" /></td>
                                            <td><c:out value="${u.telefono}" /></td>
                                            <td><c:out value="${u.fechaRegistro.toLocalDate()} ${u.fechaRegistro.toLocalTime().withNano(0)}" /></td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </c:otherwise>
                </c:choose>
            </section>
        </div>
    </main>
</body>
</html>
