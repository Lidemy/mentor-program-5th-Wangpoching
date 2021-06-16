<?php
  session_start();
  require_once("./conn.php");
  require_once("./utils.php");

  // 沒有輸入帳號或密碼（type 1 error）
  if (empty($_POST['username']) || empty($_POST['password'])) {
    header("Location: ./login.php?errCode=1");
    die('資料不齊全');
  }

  // 搜尋存放已註冊帳密的資料庫
  $username = $_POST['username'];
  $password = $_POST['password'];
  $sql = "SELECT * FROM `boching_board_comment_users` WHERE `username`='$username' AND `password`='$password'";
  $result = $conn->query($sql);

  if (!$result) {
    die('failed. '.$conn->error);
  }

  // 找到資料庫的帳密是正確的
  if ($result->num_rows === 1) {
    // 給一組新的通行證並存入 username 變數
    session_regenerate_id();
    $_SESSION['username'] = $username;
    header("Location:./index.php");
  } else {
    // 沒有在資料庫撈到帳密->帳密錯誤（type 2 error）
    header("Location:./login.php?errCode=2");
  }
?>