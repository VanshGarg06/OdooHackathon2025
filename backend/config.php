<?php
$host = 'localhost';
$db = 'questionhub';
$user = 'root';  // change if needed
$pass = '';      // change if needed

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
