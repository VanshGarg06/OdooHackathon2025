<?php
session_start();
require_once __DIR__ . '/../backend/config.php';
// require_once '../config/jwt.php';

    // Collect and sanitize POST data
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get user data
    // Collect and sanitize POST data
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';
    $termsAccepted = isset($_POST['terms']);
    
    if(!$user_terms  || $password !== $confirmPassword || empty($username) || empty($email) || empty($password) || empty($confirmPassword)){
        ?>
<script>
    checkValidation();
</script>
<?php
        
    }
    // $user_address = $_POST['userAddress'] ?? '';
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    // Validate basic fields
    // Connect to DB
    try {
        $stmt = $pdo->prepare("insert into users (Name, username, Password) VALUES (:username, :email, :password)");
        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':password' => $hashedPassword
        ]);
        $_SESSION['useremail'] = $email;
        $_SESSION['userpassword'] = $hashedPassword;

       ?>
        <script>
            Toastify({
        text: "Signup Successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#10b981",
      }).showToast();
        </script>
       <?php
        $_SESSION['user'] = ['id' => $conn->insert_id, 'username' => $username];
       echo json_encode(['status' => 'success', 'username' => $username]);
    } catch (PDOException $e) {
        ?>
        <script>
            Toastify({
        text: "Sign In Error",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ef4444",
      }).showToast();
        </script>
       <?php
       echo json_encode(['status' => 'error', 'message' => 'Signup failed (email may already exist)']);
    }
} else {
      ?>
        <script>
            Toastify({
        text: "Sign In Error",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ef4444",
      }).showToast();
        </script>
       <?php
}
?>


