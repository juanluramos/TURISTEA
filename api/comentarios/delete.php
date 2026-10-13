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

$data = json_decode(file_get_contents("php://input"), true);
$id = (int) ($data["id"] ?? 0);

if ($id <= 0) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Falta id de la reseña"
    ]);
    exit;
}

$stmt = $conexion->prepare("DELETE FROM comentario WHERE id = ?");

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error prepare",
        "error" => $conexion->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "ok" => true,
        "mensaje" => "Reseña eliminada"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al eliminar la reseña",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conexion->close();
?>
