<?php
session_start();
require 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$question_id = $_POST['question_id'];
$body = $_POST['body'];
$user_id = $_SESSION['user']['id'];

$stmt = $conn->prepare("INSERT INTO responses (question_id, user_id, body) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $question_id, $user_id, $body);
$stmt->execute();

echo json_encode(['status' => 'success']);
?>
