<?php
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/auth.php";
verificarAdmin();

require_once __DIR__ . "/../config/bd.php";

$sql = "
    SELECT
        c.id,
        c.usuario_id,
        c.paquete_id,
        c.titulo_viaje,
        c.comentario,
        c.foto_url,
        c.valoracion_viaje,
        c.valoracion_compania,
        c.estado,
        c.creado_at,
        u.nombre AS autor_nombre,
        u.apellidos AS autor_apellidos,
        u.email AS autor_email,
        p.titulo AS paquete_titulo,
        p.destino AS paquete_destino,
        p.imagen AS paquete_imagen
    FROM comentario c
    JOIN usuario u ON u.id = c.usuario_id
    LEFT JOIN paquete p ON p.id = c.paquete_id
    ORDER BY c.creado_at DESC, c.id DESC
";

$resultado = $conexion->query($sql);

if (!$resultado) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al listar reseñas",
        "error" => $conexion->error
    ]);
    exit;
}

echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));

$conexion->close();
?>
