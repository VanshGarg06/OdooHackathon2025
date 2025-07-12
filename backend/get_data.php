<?php
header('Content-Type: application/json');
require_once 'config.php'; // assumes you have PDO connection as $pdo

$response = ['success' => false, 'questions' => [], 'responses' => []];

try {
    // Fetch questions
    $stmtQ = $pdo->prepare("Select q.id, q.title, q.body, q.tags, u.username as author, q.created_at as date, q.votes, q.views
                            from questions q
                            join users u ON q.author_id = u.id
                            order by q.created_at DESC
                            limit 10");
    $stmtQ->execute();
    $response['questions'] = $stmtQ->fetchAll(PDO::FETCH_ASSOC);

    // Fetch responses
    $stmtR = $pdo->prepare("select r.id, r.question_id, r.text, u.username as author, r.created_at as date, r.votes
                            from responses r
                            join users u ON r.author_id = u.id
                            order by r.created_at DESC");
    $stmtR->execute();
    $response['responses'] = $stmtR->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
} catch (Exception $e) {
    $response['message'] = 'Server error: ' . $e->getMessage();
}

echo json_encode($response);
