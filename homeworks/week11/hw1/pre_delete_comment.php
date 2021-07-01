<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  // 沒有帶 id
  if (!is_set($_GET['id'])) {
    header('Location:index.php');
    die('failed');
  } else {
    $id = intval($_GET['id']);
  }

  // CRSF token 
  $str = "ASZXDCFVGBHNJMKLPOIUYTREWQzaqwxscderfvbgtyhnmjuiklop";
  $name = substr(str_shuffle($str),26,10);
  $_SESSION['csrf-token'] = $name;

  // 檢查是不是有登錄過了
  check_login();
  $username = $_SESSION['username'];

  // 檢查是不是管理員或是否是自己的留言
  if (!(is_selfcomment($id) || getdata_from_username($username)['identity'] === 1)) {
    header('Location:index.php');
    die('權限不足');
  }
  
  // 檢查有沒有被水桶
  if (!has_permission($username, 'deletable')) {
    header('Location:index.php');
    die('您已被水桶，請洽管理員');
  }
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>留言板</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./normalize.css">
  <link rel="stylesheet" href="./modal.css">
</head>

<body>
  <header class="warning"><strong>注意！本站為練習用網站，因教學用途刻意忽略資安的實作，註冊時請勿使用任何真實的帳號或密碼。</strong></header>
  <main class="board">
    <a class="form__button" href="./index.php">回留言板</a>
    <h1 class="board__title">刪除留言</h1>
    <?php 
      if (is_set($_GET['errCode'])) {
        $code = $_GET['errCode'];
        $msg = 'Error';
        if ($code === '1') {
          $msg = '請勿輸入空值';
        }
        echo '<div class="errmsg">' . $msg . '</div>';
      }
    ?>
    <form class="form" method="POST" action="delete_comment.php">
    <?php
      $sql = 'SELECT * FROM boching_board_comments WHERE id=? AND is_deleted IS NULL';
      $stmt = $conn->prepare($sql);
      $stmt->bind_param('i', $id);
      $stmt->execute();
      $result = $stmt->get_result();
      if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
      } else {
        header('Location:index.php');
        die('查無留言');
      }

    ?>
      <div class="delete-comment__container">
        <input type= "hidden" type="text" name="id" value="<?php echo escape($row['id']); ?>" />
        <input type= "hidden" type="text" name="csrf-token" value="<?php echo escape($name); ?>" />
        <button class="form__button submit">確認刪除</button>
      </div>
    </form>
  </main>
</body>
</html>

