<?php
session_start();
require 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$questionId = $_POST['question_id'] ?? '';
$text = $_POST['text'] ?? '';
$userId = $_SESSION['user']['id'];

if (empty($text) || empty($questionId)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing data']);
    exit;
}

$stmt = $conn->prepare("insert into responses (question_id, user_id, text) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $questionId, $userId, $text);
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'id' => $stmt->insert_id]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to save response']);
}
?>
