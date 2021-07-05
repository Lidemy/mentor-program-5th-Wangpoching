<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  $username = NULL;
  if (is_set($_SESSION['username'])) {
    $username = $_SESSION['username'];
    $stmt = $conn->prepare(
      'SELECT * FROM boching_blog_posts WHERE is_deleted IS NULL AND username=? ORDER BY id DESC'
    );
    $stmt->bind_param('s', $username);
    $result = $stmt->execute();
    if (!$result) {
      die('Error:' . $conn->error);
    }
    $result = $stmt->get_result();
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
  <div class="container-wrapper">
    <div class="posts">
      <?php if (!is_set($username) || $result->num_rows ===0) { ?>
        <article class="post default-post">
          <div class="post__header">
            <div>建立值得被分享的部落格</div>
          </div>
          <div class="post__info">
            <?php 
              echo date("Y-m-d H:i:s",time()+8*60*60);
            ?>
          </div>
          <div class="post__content">
            在靈感閃現的那一刻，使用您的電腦或移動設備，隨時用文字紀錄您的想法和管理您的部落格。
          </div>
        </article>
      <?php } else { ?>
        <?php while ($row = $result->fetch_assoc()) { ?>    
          <article class="post">
            <div class="post__header">
              <div><?php echo escape($row['title']); ?></div>
              <div class="post__actions">
                <a class="post__action" href="update_post.php?id=<?php echo escape($row['id']); ?>">編輯</a>
              </div>
            </div>
            <div class="post__info">
              <?php echo escape($row['created_at']); ?>
            </div>
            <div class="post__content"><?php echo escape($row['content']); ?></div>
            <a class="btn-read-more" href="post.php?id=<?php echo escape($row['id']); ?>">READ MORE</a>
          </article>
        <?php } ?>
      <?php } ?>
    </div>
  </div>
  <footer>Copyright © 2020 Who's Blog All Rights Reserved.</footer>
</body>
</html>