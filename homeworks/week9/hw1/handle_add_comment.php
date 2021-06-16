<?php
  session_start();
  require_once("./conn.php");
  require_once("./utils.php");
  
  // 提交空的留言（type 1 error）
  if (empty($_POST['content'])) {
    header("Location: ./index.php?errCode=1");
    die('資料不齊全');
  }

  // 將暱稱與留言寫入資料庫
  $nickname = getDataFromUsername($_SESSION['username'])['nickname'];
  $content = $_POST['content'];
  $sql = "INSERT INTO `boching_board_comments` (`nickname`, `content`) VALUES ('$nickname', '$content')";
  $result = $conn->query($sql);
  if ($result) {
    header("Location: ./index.php");
  } else {
    die("failed. " . $conn->error);
  }
?>