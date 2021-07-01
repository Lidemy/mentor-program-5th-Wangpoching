<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  // 檢查有沒有文章 id
  if (!is_set($_GET['id'])) {
    die('找不到該文章');
  } else {
    $id = intval($_GET['id']);
  }

  // 檢查有沒有登入
  check_login();
  $username = $_SESSION['username'];

  // 檢查登入者是否與欲觀看文章相同
  if (!is_selfpost($id)) {
    header('Location:index.php');
    die('權限不足');
  }

  // 取出文章
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
    <div class="posts">
      <article class="post">
        <div class="post__header">
          <div><?php echo escape($row['title']); ?></div>
          <div class="post__actions">
            <?php if (isset($username) && (getdata_from_username($id)["username"] == $username)) { ?>
              <a class="post__action" href="update_post.php">編輯</a>
            <?php } ?>
          </div>
        </div>
        <div class="post__info">
          <?php echo escape($row['created_at']); ?>
        </div>
        <div class="post__content"><?php echo escape($row['content']); ?></div>
      </article>
    </div>
  </div>
  <footer>Copyright © 2020 Who's Blog All Rights Reserved.</footer>
</body>
</html>