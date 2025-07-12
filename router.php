<?php

error_log("📢 Method: " . $_SERVER['REQUEST_METHOD']);
// error_log("📢 URI: " . $uri);

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);


error_log("✅ In router.php with $method $path");


if($method === 'POST' && $path === '/backend/add-response'){
    require_once __DIR__ . '/backend/add_response.php';
}

if($method === 'POST' && $path === '/backend/authorization'){
    require_once __DIR__ . '/backend/auth.php';
}

if($method==='POST' && $path == '/backend/authorize'){
    require_once __DIR__ . '/backend/auth.php';
}

if($method==='POST' && $path='/backend/post-question'){
    require_once __DIR__ . '/backend/ask_question.php';
}








// POST /api/bookings → Create new booking
if ($method === 'POST' && $path === '/api/bookings') {
    require_once __DIR__ . '/api/bookings/create_booking.php';
}

// GET /api/bookings/{id} → Get booking by ID
if ($method === 'GET' && preg_match('#^/api/bookings/([0-9]+)$#', $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . '/api/bookings/get_booking.php';
    return;
}

// GET /api/bookings/user → Get user's bookings
if ($method === 'GET' && $path === '/api/bookings/user') {
    require __DIR__ . '/api/bookings/get_user_bookings.php';
    return;
}

// GET /api/bookings/provider → Get provider's bookings
if ($method === 'GET' && $path === '/api/bookings/provider') {
    require __DIR__ . '/api/bookings/get_provider_bookings.php';
    return;
}

// PUT /api/bookings/{id} → Update booking
if ($method === 'PUT' && preg_match('#^/api/bookings/([0-9]+)$#', $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . '/api/bookings/update_booking.php';
    return;
}

if($method === 'POST' && $path === '/api/reviews'){
    require_once __DIR__ . '/api/reviews/create.php';
}

if($method === 'GET' && preg_match('#^/api/reviews/([0-9]+)$#', $path, $matches)){
    $_GET['id'] = $matches[1];
    require __DIR__ . '/api/reviews/provider.php';
}

if($method === 'POST' && $path === '/api/payments'){
    require_once __DIR__ . '/api/payment/verify.php';
}

if($method === 'GET' && preg_match('#^/api/payment/([0-9]+)$#', $path, $matches)){
    $_GET['id'] = $matches[1];
    require __DIR__ . '/api/payment/history.php';
}

if($method === 'GET' && $path === '/api/services'){
    require_once __DIR__. '/api/services/list.php';
    return;
}

if($method === 'POST' && $path === '/api/services'){
    require_once __DIR__. '/api/services/add_service.php';
    return;
}

if($method === 'GET' && preg_match('#^/api/services/([0-9]+)$#', $path, $matches)){
    $_GET['id'] = $matches[1];
    require_once __DIR__.'/api/services/get_service.php';
}

if($method === 'PUT' && preg_match('#^/api/services/([0-9]+)$#', $path, $matches)) {
    $_GET['id'] = $matches[1];
    require __DIR__ . '/api/services/update_service.php';
    return;
}

// DELETE /api/services/{id} → Delete a service by ID
if ($method === 'DELETE' && preg_match('#^/api/services/([0-9]+)$#', $path, $matches)) {
    $_GET['id'] = $matches[1]; 
    require __DIR__ . '/api/services/delete_Service.php';
    return;
}

if($method === 'POST' && $path === '/api/users/register'){
    require __DIR__. '/api/User/signup.php';
    return;
}

if($method === 'POST' && $path === '/api/users/login'){
    require __DIR__. '/api/Login/mainlogin.php';
    return;
}

if($method === 'GET' && $path === '/api/users/profile'){
    require __DIR__. '/api/User/get_user.php';
}

if ($method === 'PUT' && $path === '/api/users/profile') {
    require_once __DIR__ . '/api/users/update_profile.php';
}

if($method === 'POST' && $path === '/api/providers/register'){
    require __DIR__. '/api/Partner/index.php';
    return;
}

if($method === 'POST' && $path === '/api/providers/login'){
    require __DIR__. '/api/Login/mainlogin.php';
    return;
}

if($method === 'GET' && $path === '/api/providers/profile'){
    require __DIR__. '/api/provider/get_provider.php';
    return;
}


if($method === 'PUT' && $path === '/api/providers/profile'){
    require __DIR__. '/api/provider/update_provider.php';
    return;
}




if($method === 'GET' && $path === '/api/providers/services'){
    require __DIR__. '/api/provider/get_provider_Services.php';
    return;
}



// Default: Route not found
sendError("Route not found", 404);

?>