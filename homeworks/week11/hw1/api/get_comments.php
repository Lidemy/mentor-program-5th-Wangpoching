<?php
  require_once('conn.php');
  require_once('utils.php');
  setcookie("TestCookie","123", time()+3600*24);
  header("Access-Control-Allow-Origin: http://localhost:8000");
  header("Access-Control-Allow-Credentials: true");
  $limit = 3;
  if (is_set($_GET['limit'])) {
    $limit = intval($_GET['limit']);
  }
  
  $offset = 0;
  if (is_set($_GET['offset'])) {
    $offset = intval($_GET['offset']);
  }

  $stmt = $conn->prepare(
    'SELECT C.id AS id, C.content AS content, C.created_at AS created_at, U.nickname AS nickname, U.username AS username '.
    'FROM boching_board_comments AS C '.
    'LEFT JOIN boching_board_comment_users AS U on C.username = U.username '.
    'WHERE is_deleted IS NULL '.
    'ORDER BY id DESC '.
    'limit ? offset ? '
  );
  
  $stmt->bind_param('ii', $limit, $offset);
  $result = $stmt->execute();

  if (!$result) {
    die('Error.' . $conn->error);
  }

  $result = $stmt->get_result();
  $comments = array();
  while ($row = $result->fetch_assoc()) { 
    array_push($comments, array(
      "id" => $row['id'],
      "username" => $row['username'],
      "nickname" => $row['nickname'],
      "content" => $row['content'],
      "created_at" => $row['created_at']  
    ));
  }

  $json = array(
    "comments" => $comments
  );

  $response = json_encode($json);
  header('Contenet-type:application/json;charset=utf8');
  echo $response;
?>