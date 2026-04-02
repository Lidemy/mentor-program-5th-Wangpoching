<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');

  // 登入檢查
  $row = requireLogin();

  // 水桶檢查
  if (!verifyPermission($row, EDIT_COMMENT_PERMISSION_ID)) {
      $_SESSION['flash'] = '你沒有編輯留言的權限';
      header('Location: index.php');
      exit();
  };

  // 權限檢查
  $result = getCommentAndVerifyOwner($_GET['comment_id'], $row['username']);
  if (!$result) {
    $_SESSION['flash'] = '你沒有編輯留言的權限';
    header('Location: index.php');
    exit();
  }

  // Get Announcements
  $announceText = getAnnouncements($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>留言板-修改留言</title>
  <link href="style.css" rel="stylesheet" />
</head>
<body>
  <?php if ($announceText) { ?>
    <header class="warning">
      <div class="warning__wrapper">
        <span class="warning__text marquee__content"><?= escape($announceText) ?></span>
      </div>
    </header>
  <?php } ?>
    <?php if (isset($_SESSION['flash'])) { ?>
        <header class="error-msg">
            <?php
                echo $_SESSION['flash'];
                unset($_SESSION['flash']);
            ?>
        </header>
    <?php } ?>
  <main>
    <h1>Edit comment</h1>
      <form class="write-area" method="post" action="handle_alter_comment.php?comment_id=<?= $_GET['comment_id']?>">
        <div class="write-area__submit">
          <input type="hidden" name="csrf_token" value="<?= generateCsrfToken() ?>" />
          <textarea id="comment" name="comment" rows="5" cols="33"><?= escape($result['content']) ?></textarea>
          <input class="button" type="submit" value="送出" />
        </div>
      </form>
      <a href="index.php" class="login-btn button">回留言板</a>
  </main>
</body>
<script>
  setTimeout(() => {
    const el = document.querySelector('.error-msg')
    if (el) el.classList.add('hidden')
  }, 2000)
</script>
<script src="marquee.js"></script>
</html>
