<?php
session_start();
require 'config.php'; // Contains $conn (MySQLi)

header('Content-Type: application/json');

// Ensure user is logged in
if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

// Retrieve and sanitize inputs
$title = trim($_POST['title'] ?? '');
$body  = trim($_POST['body'] ?? '');
$tags  = trim($_POST['tags'] ?? '');
$user_id = $_SESSION['user']['id'];

// Validate inputs
if (strlen($title) < 10 || strlen($body) < 20) {
    echo json_encode(['status' => 'error', 'message' => 'Title or body too short']);
    exit;
}

// Insert into database
$stmt = $conn->prepare("INSERT INTO questions (user_id, title, body, tags) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $user_id, $title, $body, $tags);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Question posted']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Database error']);
}
?>
