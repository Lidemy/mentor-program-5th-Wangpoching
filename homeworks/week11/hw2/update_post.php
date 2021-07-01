<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');
  
  if (!is_set($_GET['id'])) {
    header('Location:index.php');
    die('failed');
  } else {
    $id = intval($_GET['id']);
  }

  // 檢查是不是有登錄過了
  check_login();
  $username = $_SESSION['username'];

  // 檢查是不是管理員或者留言者本人
  if (!is_selfpost($id)) {
    header('Location:index.php');
    die('權限不足');
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
        <form action="handle_update_post.php" method="POST">
          <?php
            $stmt = $conn->prepare(
              'SELECT * FROM boching_blog_posts WHERE is_deleted IS NULL AND id=?'
            );
            $stmt->bind_param('i', $id);
            $result = $stmt->execute();
            if (!$result) {
              die('Error:' . $conn->error);
            }
            $result = $stmt->get_result();
            if ($result->num_rows != 1) {
              die('找不到該文章'); 
            } else {
              $row = $result->fetch_assoc();   
            }
          ?>
          <div class="edit-post__title">
            編輯文章：
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
            <input name="title" class="edit-post__input" placeholder="請輸入文章標題" value="<?php echo escape($row['title']); ?>"/>
          </div>
          <div class="edit-post__input-wrapper">
            <textarea name="content" rows="20" class="edit-post__content"><?php echo escape($row['content']); ?></textarea>
          </div>
          <div class="edit-post__btn-wrapper">
              <input type="submit" class="edit-post__btn" value="送出" />
          </div>
          <input type="hidden" name="id" value="<?php echo escape($row['id']); ?>" />
          <input type="hidden" name="page" value="<?php echo escape($_SERVER['HTTP_REFERER']); ?>" />
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
  if (document.querySelector('.errmsg')) {
    const errmsg = document.querySelector('.errmsg')
    focusinRemoveErrmsg(delegation, errmsg)
  }

</script>
</html>