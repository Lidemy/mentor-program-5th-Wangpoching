<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  // 有沒有收到 id 
  if (!is_set($_GET['id'])) {
    header('Location:index.php');
    die('failed');
  } else {
    $id = intval($_GET['id']);
  }

  // 檢查是不是有登入過了
  check_login();
  $username = $_SESSION['username'];

  // 檢查登入者是否與欲修改留言相同
  if (!is_selfpost($id)) {
    header('Location:index.php');
    die('權限不足');
  }

  // 刪除留言
  $sql = "UPDATE boching_blog_posts SET is_deleted=1 WHERE id=?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('i', $id);
  $result = $stmt->execute();
  if (!$result) {
    die('Error:' . $conn->error);
  }

  header('Location:admin.php')
?>