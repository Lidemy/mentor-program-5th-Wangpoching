<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');
  
  // 檢查是否登入
  check_login();
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
        <a href='index.php'>Who's Blog</a>
      </div>
      <ul class="navbar__list">
        <div>
          <li><a href="#">文章列表</a></li>
          <li><a href="#">分類專區</a></li>
          <li><a href="#">關於我</a></li>
        </div>
        <div>
          <li><a href="admin.php">管理後台</a></li>
          <li><a href="logout.php">登出</a></li>
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
  <div class="container-wrapper">
    <div class="container">
      <div class="edit-post">
        <form action="handle_create_post.php" method="POST">
          <div class="edit-post__title">
            發表文章：
            <?php 
              if (is_set($_GET['errCode'])) {
                $code = $_GET['errCode'];
                $msg = 'Error';
                if ($code === '1') {
                  $msg = '資料不齊全';
                }
                echo '<span class="errmsg">' . $msg . '</span>';
              }
            ?>
          </div>
          <div class="edit-post__input-wrapper">
            <input name="title" class="edit-post__input" placeholder="請輸入文章標題" />
          </div>
          <div class="edit-post__input-wrapper">
            <textarea name="content" rows="20" class="edit-post__content"></textarea>
          </div>
          <div class="edit-post__btn-wrapper">
              <input type="submit" class="edit-post__btn" value="送出" />
          </div>
        </form>
      </div>
    </div>
  </div>
  <footer>Copyright © 2020 Who's Blog All Rights Reserved.</footer>
</body>
<script src="index.js"></script>
<script>
  // 清除錯誤訊息
  const delegation = document.querySelector('.edit-post')
  const errmsg = document.querySelector('.errmsg')
  focusinRemoveErrmsg(delegation, errmsg)
  // 資料保存
  const content = document.querySelector('.edit-post__content')
  const title = document.querySelector('.edit-post__input')
  const contentOldValue = window.localStorage.getItem('text')
  const titleOldValue = window.localStorage.getItem('title')
  content.value = contentOldValue
  title.value = titleOldValue
  content.addEventListener('input', (e) => {
    const value = e.target.value
    window.localStorage.setItem('text', value)
  })
  title.addEventListener('input', (e) => {
    const value = e.target.value
    window.localStorage.setItem('title', value)
  })
  // 
</script>
</html>