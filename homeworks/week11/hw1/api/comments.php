<?php
  require_once('../conn.php');
  require_once('../utils.php');

  header('Content-Type: application/json');

  // 從 Header 取出 Token
  $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
  if (!str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(["ok" => false, "message" => "Unauthorized"]);
    exit();
  }
  $token = substr($authHeader, 7); // 去掉 "Bearer "
  $jwtData = verifyJWT($token);
  if (!$jwtData) {
    http_response_code(401);
    echo json_encode(["ok" => false, "message" => "Unauthorized"]);
    exit();
  }

  // 分頁參數
  $perPage = 5;
  $page = (int)($_GET['page'] ?? 1);
  $page = max(1, $page);

  // 取得總筆數
  $countResult = $conn->query("SELECT COUNT(*) as count FROM `comments`");
  if (!$countResult) {
    echo json_encode(["ok" => false, "message" => "系統錯誤"]);
    exit();
  }
  $total = $countResult->fetch_assoc()['count'];
  $totalPages = ceil($total / $perPage);
  $page = min($page, max(1, $totalPages));
  $offset = ($page - 1) * $perPage;

  // 撈留言
  $sql = "
    SELECT 
      comments.id, 
      comments.content,
      comments.createdAt,
      users.username,
      users.nickname
    FROM `comments`
    LEFT JOIN `users` ON comments.username = users.username
    ORDER BY comments.createdAt DESC
    LIMIT ? OFFSET ?
  ";
  $result = executeQuery($conn, $sql, 'ii', $perPage, $offset);
  if (!$result) {
    echo json_encode(["ok" => false, "message" => "系統錯誤"]);
    exit();
  }

  // 整理資料
  $data = [];
  while ($row = $result->fetch_assoc()) {
    $data[] = [
      "id"        => $row['id'],
      "nickname"  => $row['nickname'],
      "username"  => $row['username'],
      "content"   => $row['content'],
      "createdAt" => $row['createdAt']
    ];
  }

  echo json_encode([
    "ok"   => true,
    "data" => $data,
    "pagination" => [
      "total"       => (int)$total,
      "currentPage" => $page,
      "totalPages"  => $totalPages,
      "perPage"     => $perPage
    ]
  ]);
  exit();
?>