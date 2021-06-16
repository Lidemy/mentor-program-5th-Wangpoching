<?php
  require_once("./conn.php");
  // 沒輸入帳密或暱稱（type 1 error）
  if (empty($_POST['nickname']) || empty($_POST['username']) || empty($_POST['password'])) {
    header("Location: ./register.php?errCode=1");
    die('資料不齊全');
  }
  // 在 user 資料庫新增帳密資訊
  $nickname = $_POST['nickname'];
  $username = $_POST['username'];
  $password = $_POST['password'];
  $sql = "INSERT INTO `boching_board_comment_users` (`nickname`, `username`,`password`) VALUES ('$nickname', '$username','$password')";
  $result = $conn->query($sql);
  
  // 帳號重複（type 2 error）
  if ($result) {
    header("Location: ./index.php"); 
  } else if ($conn->errno === 1062) {
    header("Location: ./register.php?errCode=2");
    die('failed.');
  } else {
    die('failed. '. $conn->error);
  }
?>