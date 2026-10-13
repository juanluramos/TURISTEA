<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once __DIR__ . "/../config/auth.php";
verificarAdmin();

require_once __DIR__ . "/../config/bd.php";

$contentType = $_SERVER["CONTENT_TYPE"] ?? "";
$data = strpos($contentType, "multipart/form-data") !== false
    ? $_POST
    : json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["ok" => false, "mensaje" => "No se recibieron datos"]);
    exit;
}

function mensajeErrorSubida($codigo)
{
    $mensajes = [
        UPLOAD_ERR_INI_SIZE => "La imagen supera el tamaño permitido por PHP",
        UPLOAD_ERR_FORM_SIZE => "La imagen supera el tamaño permitido por el formulario",
        UPLOAD_ERR_PARTIAL => "La imagen se subió solo parcialmente",
        UPLOAD_ERR_NO_FILE => "No se subió ninguna imagen",
        UPLOAD_ERR_CANT_WRITE => "No se pudo escribir la imagen en disco",
        UPLOAD_ERR_EXTENSION => "Una extensión de PHP bloqueó la subida"
    ];

    return $mensajes[$codigo] ?? "Error al subir la imagen";
}

function guardarImagenComentario($campo)
{
    if (!isset($_FILES[$campo]) || $_FILES[$campo]["error"] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($_FILES[$campo]["error"] !== UPLOAD_ERR_OK) {
        echo json_encode([
            "ok" => false,
            "mensaje" => mensajeErrorSubida($_FILES[$campo]["error"])
        ]);
        exit;
    }

    $permitidos = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp",
        "image/gif" => "gif"
    ];

    $mime = mime_content_type($_FILES[$campo]["tmp_name"]);
    if (!isset($permitidos[$mime])) {
        echo json_encode(["ok" => false, "mensaje" => "Formato de imagen no permitido"]);
        exit;
    }

    if ($_FILES[$campo]["size"] > 2 * 1024 * 1024) {
        echo json_encode(["ok" => false, "mensaje" => "La imagen supera el tamaño máximo de 2MB"]);
        exit;
    }

    $directorio = __DIR__ . "/../../frontend/assets/img/experiencias/";
    if (!is_dir($directorio)) {
        mkdir($directorio, 0775, true);
    }

    if (!is_writable($directorio)) {
        echo json_encode(["ok" => false, "mensaje" => "La carpeta de imágenes no tiene permisos de escritura"]);
        exit;
    }

    $nombre = uniqid("experiencia_", true) . "." . $permitidos[$mime];
    $destino = $directorio . $nombre;

    if (!move_uploaded_file($_FILES[$campo]["tmp_name"], $destino)) {
        echo json_encode(["ok" => false, "mensaje" => "No se pudo guardar la imagen en el servidor"]);
        exit;
    }

    return "assets/img/experiencias/" . $nombre;
}

$id = (int) ($data["id"] ?? 0);
$titulo = trim($data["titulo_viaje"] ?? "");
$comentario = trim($data["comentario"] ?? "");
$valoracionViaje = (int) ($data["valoracion_viaje"] ?? 0);
$valoracionCompania = (int) ($data["valoracion_compania"] ?? 0);
$estado = strtoupper(trim($data["estado"] ?? ""));

if ($id <= 0) {
    echo json_encode(["ok" => false, "mensaje" => "Falta id de la reseña"]);
    exit;
}

if ($titulo === "" || $comentario === "") {
    echo json_encode(["ok" => false, "mensaje" => "Título y comentario son obligatorios"]);
    exit;
}

if (strlen($titulo) > 150) {
    echo json_encode(["ok" => false, "mensaje" => "El título no puede superar 150 caracteres"]);
    exit;
}

if ($valoracionViaje < 1 || $valoracionViaje > 5 || $valoracionCompania < 1 || $valoracionCompania > 5) {
    echo json_encode(["ok" => false, "mensaje" => "Las valoraciones deben estar entre 1 y 5"]);
    exit;
}

if (!in_array($estado, ["PENDIENTE", "APROBADA"], true)) {
    echo json_encode(["ok" => false, "mensaje" => "Estado de reseña no válido"]);
    exit;
}

$fotoUrl = guardarImagenComentario("foto");

if ($fotoUrl !== null) {
    $stmt = $conexion->prepare("
        UPDATE comentario
        SET titulo_viaje = ?,
            comentario = ?,
            valoracion_viaje = ?,
            valoracion_compania = ?,
            estado = ?,
            foto_url = ?
        WHERE id = ?
    ");
} else {
    $stmt = $conexion->prepare("
        UPDATE comentario
        SET titulo_viaje = ?,
            comentario = ?,
            valoracion_viaje = ?,
            valoracion_compania = ?,
            estado = ?
        WHERE id = ?
    ");
}

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error prepare",
        "error" => $conexion->error
    ]);
    exit;
}

if ($fotoUrl !== null) {
    $stmt->bind_param("ssiissi", $titulo, $comentario, $valoracionViaje, $valoracionCompania, $estado, $fotoUrl, $id);
} else {
    $stmt->bind_param("ssiisi", $titulo, $comentario, $valoracionViaje, $valoracionCompania, $estado, $id);
}

if ($stmt->execute()) {
    echo json_encode([
        "ok" => true,
        "mensaje" => "Reseña actualizada"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al actualizar la reseña",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conexion->close();
?>
