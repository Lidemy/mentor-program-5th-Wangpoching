<?php
  require_once("./conn.php");
  $sql = "SELECT * FROM `boching_board_comments` ORDER BY `id` DESC";
  $result = $conn->query($sql);
  if (!$result) {
    die('Error:' . $conn->error);
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
    <a class="form__button" href="./login.php">登入</a>
    <h1 class="board__title">註冊</h1>
    <?php 
      if (!empty($_GET['errCode'])) {
        $code = $_GET['errCode'];
        $msg = 'Error';
        if ($code === '1') {
          $msg = '資料不齊全';
        } else if ($code === '2') {
          $msg = '帳號已被使用';          
        }
        echo "<div class='errmsg'>" . $msg . "</div>";
      }
    ?>
    <form class="form" method="POST" action="handle_register.php">
      <div class="nickname__container">
        <span>暱稱：</span>
        <input class="nickname__input" type="text" name="nickname" placeholder="你的暱稱"/>
      </div>
      <div class="username__container">
        <span>帳號：</span>
        <input class="username__input" type="text" name="username" placeholder="輸入帳號"/>
      </div>
      <div class="password__container">
        <span>密碼：</span>
        <input class="password__input" type="password" name="password" placeholder="輸入密碼"/>
      </div>
      <button class="form__button" value="送出">送出</button>
      </div>
    </form>
  </main>
</body>
<script src="./index.js"></script>
<script>  
  const form = document.querySelector('.form');
  if (document.querySelector('.errmsg')) {
    const errmsg = document.querySelector('.errmsg')
    focusinRemoveErrmsg(form, errmsg);
  }
</script>
</html>

