<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  // 沒有輸入值（type 1 error)
  if ( !(is_set($_POST['id']) && is_set($_POST['editable']) && is_set($_POST['deletable']) && is_set($_POST['addable']) && is_set($_POST['identity'])) ) {
    die('failed');
  }

  // 檢查是不是有登錄過了
  check_login();
  $username = $_SESSION['username'];
  
  // 檢查是不是管理員
  if (getdata_from_username($username)['identity'] !== 1) {
    header('Location:index.php');
    die('權限不足');
  }

  // 更新權限
  $id = intval($_POST['id']);
  $editable = intval($_POST['editable']);
  $deletable = intval($_POST['deletable']);
  $addable = intval($_POST['addable']);
  $identity = intval($_POST['identity']);  
  $sql = 'UPDATE boching_board_comment_users SET editable=?, deletable=?, addable=?, identity=? WHERE id=?';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('iiiii', $editable, $deletable, $addable, $identity, $id);
  $result = $stmt->execute();
  if (!$result) {
    die('Error.' . $conn->error);
  }

  header('Location:admin.php')
?>