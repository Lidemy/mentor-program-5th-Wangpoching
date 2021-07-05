<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  $username = NULL;
  if (is_set($_SESSION['username'])) {
    $username = $_SESSION['username'];
  }
?>
<!DOCTYPE html>

<html>
<head>
  <meta charset="utf-8">

  <title>部落格</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="normalize.css" />
  <link rel="stylesheet" href="style.css" />
</head>

<body>
  <nav class="navbar">
    <div class="wrapper navbar__wrapper">
      <div class="navbar__site-name">
        <a href="index.php">Who's Blog</a>
      </div>
      <ul class="navbar__list">
        <div>
          <li><a href="#">文章列表</a></li>
          <li><a href="#">分類專區</a></li>
          <li><a href="#">關於我</a></li>
        </div>
        <div>
          <?php if (is_set($username)) { ?>
            <li><a href="admin.php">管理後台</a></li>
            <li><a href="logout.php">登出</a></li>
          <?php } else { ?>
            <li><a href="login.php">登入</a></li>
            <li><a href="register.php">註冊</a></li>         
          <?php } ?>
        </div>
      </ul>
    </div>
  </nav>
  <section class="banner">
    <div class="banner__wrapper">
      <h1>存放技術之地</h1>
      <div>Welcome to my blog</div>
    </div>
  </section>
  <div class="login-wrapper">
    <h2>Login</h2>
    <?php 
      if (is_set($_GET['errCode'])) {
        $code = $_GET['errCode'];
        $msg = 'Error';
        if ($code === '1') {
          $msg = '資料不齊全';
        } else if ($code === '2') {
          $msg = '帳號錯誤';          
        } else if ($code === '3'){
          $msg = '密碼錯誤';          
        }
        echo "<div class='errmsg'>" . $msg . "</div>";
      }
    ?>
    <form action="handle_login.php" method="POST">
      <div class="input__wrapper">
        <div class="input__label">USERNAME</div>
        <input class="input__field" type="text" name="username" />
      </div>
      
      <div class="input__wrapper">
        <div class="input__label">PASSWORD</div>
        <input class="input__field" type="password" name="password" />
      </div>
      <input type='submit' value="登入" />
      <div class='register_btn'><a href='./register.php'>註冊</a></div>
    </form>     
  </div>
</body>
<script src="./index.js"></script>
<script>
  const delegation = document.querySelector('.login-wrapper')
  const errmsg = document.querySelector('.errmsg')
  focusinRemoveErrmsg(delegation, errmsg)
</script>
</html>