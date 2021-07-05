<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  // 檢查是否登入
  check_login();
  $username = $_SESSION['username'];

  // 提交空的留言（type 1 error）
  if (!is_set($_POST['content']) || !is_set($_POST['title'])) {
    header('Location: ./create_post.php?errCode=1');
    die('資料不齊全');
  }

  // 將暱稱與留言寫入資料庫
  $content = $_POST['content'];
  $title = $_POST['title'];
  $sql = 'INSERT INTO boching_blog_posts (username, title, content) VALUES (?, ?, ?)';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('sss',$username, $title, $content);
  $result = $stmt->execute();
  if (!$result) {
    die('Error. ' . $conn->error);
  }

  header('Location:admin.php');
?>