<?php
	require_once('../../conn.php');
	require_once('../../utils.php');

	header('Content-Type: application/json');

	// 檢查欄位
	if (empty($_POST['username'])) {
	    echo json_encode(["ok" => false, "message" => "帳號不得為空"]);
	    exit();		
	}

	if (empty($_POST['password'])) {
	    echo json_encode(["ok" => false, "message" => "密碼不得為空"]);
	    exit();
	}

	$sql = "SELECT * FROM `users` WHERE username = ?";
	$result = executeQuery($conn, $sql, 's', $_POST['username']);
	if (!$result) {
	    echo json_encode(["ok" => false, "message" => "系統錯誤"]);
	    exit();		
	}
	if ($result->num_rows === 0) {
	    echo json_encode(["ok" => false, "message" => "帳號或密碼錯誤"]);
	    exit();			
	}
	$row = $result->fetch_assoc();
	if (!password_verify($_POST['password'], $row['password_hash'])) {
	    echo json_encode(["ok" => false, "message" => "帳號或密碼錯誤"]);
	    exit();		
	}

	// 發放 jwtToken
	$header  = base64url(json_encode(["alg" => "HS256", "typ" => "JWT"]));
	$payload = base64url(json_encode([
	    "username" => $row['username'],
	    "exp"      => time() + 3600  // 1小時後過期
	]));
	$signature = base64url(hash_hmac('sha256', "$header.$payload", SECRET_KEY, true));

	$token = "$header.$payload.$signature";

	echo json_encode([
	    "ok" => true,
	    "token" => $token
	]);
	exit();
?>