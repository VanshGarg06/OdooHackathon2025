<?php
session_start();
require_once __DIR__ . '/../config/database.php';
require_once __DIR__. '/../utils/response.php';
// require_once '../config/jwt.php';

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $user_email = trim($_POST['email'] ?? '');
    $user_password = trim($_POST['password'] ?? '');
    
    if(empty($user_email) || empty($user_password)){
            ?>
    <script>
        checkValidation();
    </script>
    <?php



    }



// Step 2: Check if email already exists
$stmt = $pdo->prepare("select * FROM users WHERE email = ?");
$stmt->execute([$user_email]);
$user = $stmt->fetch();

if ($stmt->rowCount() > 0 || password_verify($user_password,$user['password'])) {
    ?>
<script>
    Toastify({
        text: "Loggin In Successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#10b981",
      }).showToast();
    </script>
    <?php
     $_SESSION['user'] = ['id' => $result['id'], 'username' => $user['username']];
        echo json_encode(['status' => 'success', 'username' => $user['username']]);
}
else{
    ?>
<script>
    Toastify({
        text: "User Doesn't Exist",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ef4444",
      }).showToast();
</script>
    <?php
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
}

?>
