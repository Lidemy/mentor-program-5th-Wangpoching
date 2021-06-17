<?php
  require_once('./conn.php');
  
  // 輸入使用者名稱得到有相關資料的陣列
  function getDataFromUsername($username) {
    global $conn;
    $sql = "SELECT * FROM `boching_board_comment_users` WHERE `username`='$username'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    return $row;
  }

?>