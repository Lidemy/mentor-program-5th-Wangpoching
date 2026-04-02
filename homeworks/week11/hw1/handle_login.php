<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  // 檢查欄位
  $userName = trim($_POST['username'] ?? '');
  if ($userName === '') {
      $_SESSION['flash'] = '帳號不可為空';
      header('Location: login.php');
      exit();
  }

  $password = trim($_POST['password'] ?? '');
  if ($password === '') {
      $_SESSION['flash'] = '密碼不可為空';
      header('Location: login.php');
      exit();
  }

  $sql = "SELECT `username`, `password_hash` FROM `users` WHERE username=?";
  $result = executeQuery($conn, $sql, 's', $userName);
  if (!$result) {
    $_SESSION['flash'] = '系統錯誤';
    header('Location: login.php');
    exit();
  }
  $row = $result->fetch_assoc();
  if (!$row || !password_verify($password, $row['password_hash'])) {
    $_SESSION['flash'] = '帳號密碼錯誤';
    header('Location: login.php');
    exit();
  }

  // 發放 Cookie
  $_SESSION['username'] = $row['username'];
  header('Location: index.php');
  exit();
?>