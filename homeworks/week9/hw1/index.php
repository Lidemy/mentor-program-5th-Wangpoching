<?php
  session_start();
  require_once("./conn.php");
  require_once("./utils.php");
  // 檢查是不是有登錄過了
  $username = NULL;
  if (isset($_SESSION['username'])) {
    $username = $_SESSION['username'];
    $nickname = getDataFromUsername($username)['nickname'];
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
    <?php if (empty($username)) { ?>
      <a class="form__button" href="./register.php">註冊</a>
      <a class="form__button" href="./login.php">登入</a>
    <?php }  else { ?>
      <a class="form__button" href="./logout.php">登出</a>
    <?php } ?>
    <h1 class="board__title">Comments</h1>
    <?php 
      if (!empty($_GET['errCode'])) {
        $code = $_GET['errCode'];
        $msg = 'Error';
        if ($code === '1') {
          $msg = '資料不齊全';
        }
        echo "<div class='errmsg'>" . $msg . "</div>";
      }
    ?>
    <form class="form" method="POST" action="handle_add_comment.php">
      <?php if (!empty($nickname)) { ?>
        <div class="nickname__container">
          <span><strong><?php echo $nickname; ?></strong> 想說些甚麼…</span>
        </div>
      <?php } ?>
      <div class="comment__container">
        <textarea class="comment__area" rows=5 name="content" placeholder="請輸入留言..."></textarea>
        <?php if (!empty($username)) { ?>
          <button class="form__button" value="送出">送出</button>
          </div>
        <?php } else { ?>
          </div>
          <h3>請登入以發布留言</h3>
        <?php } ?>
    </form>
    <hr>
    <section>
    <?php
      $sql = "SELECT * FROM `boching_board_comments` ORDER BY `id` DESC";
      $result = $conn->query($sql);
      if (!$result) {
        die('Error:' . $conn->error);
      }
      while ($row = $result->fetch_assoc()) { 
    ?>
      <div class="card">
        <div class="card__avatar"></div>
        <div class="card__body">
          <div class="card__info">
            <div class="author"><?php echo $row['nickname']; ?></div>
            <div class="time-stamp"><?php echo $row['created_at']; ?></div>
          </div>
          <p class="card__content"><?php echo $row['content']; ?></p>
        </div>
      </div>
    <?php } ?>
    </section>
  </main>
</body>
<script src="./index.js"></script>
<script>  
  const comment_area = document.querySelector('.comment__area');
  if (document.querySelector('.errmsg')) {
    const errmsg = document.querySelector('.errmsg')
    focusinRemoveErrmsg(comment_area, errmsg);
  }
</script>
</html>

