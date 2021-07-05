<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');
  
  // 檢查是不是有登錄過了
  $username = NULL;
  if (is_set($_SESSION['username'])) {
    $username = $_SESSION['username'];
    $nickname = getdata_from_username($username)['nickname'];
    $identity = getdata_from_username($username)['identity'];
  }
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>留言板</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="normalize.css">
  <link rel="stylesheet" href="modal.css">
</head>

<body>
  <header class="warning"><strong>注意！本站為練習用網站，因教學用途刻意忽略資安的實作，註冊時請勿使用任何真實的帳號或密碼。</strong></header>
  <main class="board">
    <?php if (!is_set($username)) { ?>
      <a class="form__button" href="register.php">註冊</a>
      <a class="form__button" href="login.php">登入</a>
    <?php }  else { ?>
      <a class="form__button logout" href="logout.php">登出</a>
      <a class="form__button" href="alter_nickname.php">編輯暱稱</a>
      <?php if ($identity === 1) {?>
        <a class="form__button" href="admin.php">管理頁面</a>
      <?php } ?>
    <?php } ?>
    <h1 class="board__title">Comments</h1>
    <?php 
      if (is_set($_GET['errCode'])) {
        $code = $_GET['errCode'];
        $msg = 'Error';
        if ($code === '1') {
          $msg = '資料不齊全';
        }
        echo "<div class='errmsg'>" . $msg . "</div>";
      }
    ?>
    <form class="form" method="POST" action="handle_add_comment.php">
      <?php if (is_set($nickname)) { ?>
        <div class="nickname__container">
          <?php if (has_permission($username, 'addable')) { ?>
            <span><strong><?php echo escape($nickname); ?></strong> 想說些甚麼…</span>
          <?php }  else { ?>
            <span><strong><?php echo escape($nickname); ?></strong> 您已被水桶</span>
          <?php } ?>
        </div>
      <?php } ?>
      <div class="comment__container">
        <textarea class="comment__area" rows=5 name="content" placeholder="請輸入留言..."></textarea>
        <?php if (!empty($username) && has_permission($username, 'addable')) { ?>
          <button class="form__button submit">送出</button>
          </div>
        <?php } else { ?>
          </div>
          <h3>請登入以發布留言</h3>
        <?php } ?>
    </form>
    <hr>
    <section>
    <?php
      $page = 1;
      if (is_set($_GET['page'])) {
        $page = intval($_GET['page']);
      }
      $items_per_page = 3;
      $offset = ($page - 1) * $items_per_page;
      $stmt = $conn->prepare(
        'SELECT C.id AS id, C.content AS content, C.created_at AS created_at, U.nickname AS nickname, U.username AS username '.
        'FROM boching_board_comments AS C '.
        'LEFT JOIN boching_board_comment_users AS U on C.username = U.username '.
        'WHERE is_deleted IS NULL '.
        'ORDER BY id DESC '.
        'limit ? offset ? '
      );
      $stmt->bind_param('ii', $items_per_page, $offset);
      $result = $stmt->execute();
      if (!$result) {
        die('Error:' . $conn->error);
      }
      $result = $stmt->get_result();
      while ($row = $result->fetch_assoc()) { 
    ?>
      <div class="card">
        <div class="card__avatar"></div>
        <div class="card__body">
          <div class="card__info">
            <div class="author"><?php echo escape($row['nickname']); ?>(@<?php echo escape($row['username']); ?>)</div>
            <div class="time-stamp"><?php echo escape($row['created_at']); ?></div>
            <?php if ($row['username'] === $username || $identity === 1) {?>
              <div class="tools">
              <?php if (has_permission($username, 'editable')){ ?>
                <a href="update_comment.php?id=<?php echo escape($row['id']); ?>"><img class="alter-content" src="images/alter_img.jpg"></img></a>
              <?php } ?>
              <?php if (has_permission($username, 'deletable')){ ?>
                <a href="pre_delete_comment.php?id=<?php echo escape($row['id']); ?>"><img class="delete-content" src="images/delete_img.png"></img></a>
              <?php } ?>
              </div>
          <?php } ?>
          </div>
          <p class="card__content"><?php echo escape($row['content']); ?></p>
        </div>
      </div>
    <?php } ?>
    </section>
    <hr>
    <?php
      $stmt = $conn->prepare('SELECT COUNT(id) FROM boching_board_comments WHERE is_deleted IS NULL');
      $result = $stmt->execute();
      if (!$result) {
        die('Error.' . $conn->error);
      }
      $result = $stmt->get_result();
      $row = $result->fetch_assoc();
      $total_count = $row['COUNT(id)'];
      $total_page = ceil($total_count/$items_per_page);
    ?>
    <div class="page_info">
      <span>共有 <?php echo $total_count; ?> 筆留言</span>
      <span>第 <?php echo escape($page); ?> 頁</span>
    </div>
    <div class="pagination_container">
      <ul class="pagination">
      <?php 
        $pages_per_pagination = 5;
        $pagination = ceil($page/$pages_per_pagination);
        $pagination_offset = ($pagination - 1) * $pages_per_pagination + 1;
        $total_pagination = ceil($total_page/$pages_per_pagination);
      ?>
      <?php if ($pagination != 1) { ?>
          <li><a href="./index.php?page=<?php echo $pagination_offset - $pages_per_pagination; ?>">«</a><li>
      <?php } ?>
      <?php for ($i = $pagination_offset; $i < ($pagination_offset + $pages_per_pagination); $i++) { ?>
        <?php if ($i > $total_page) {
          break;
        } ?>
        <li><a <?php if (intval($i) === $page) {echo 'class="active"';}?> href="<?php echo 'index.php?page='.$i; ?>"><?php echo $i; ?></a></li>
      <?php } ?>
      <?php  if ($pagination < $total_pagination) { ?>
          <li><a href="index.php?page=<?php echo $pagination_offset + $pages_per_pagination; ?>">»</a><li>
      <?php } ?>
      </ul>
    </div>
  </main>
</body>
<script src="index.js"></script>
<script>
  const commentArea = document.querySelector('.comment__area')
  if (document.querySelector('.errmsg')) {
    const errmsg = document.querySelector('.errmsg')
    focusinRemoveErrmsg(commentArea, errmsg);
  }
  // 資料保存
  const oldValue = window.localStorage.getItem('text')
  commentArea.value = oldValue
  commentArea.addEventListener('input', (e) => {
    const value = e.target.value
    window.localStorage.setItem('text', value)
  })
  // 登出或提交留言清空 localstorage
  const logout = document.querySelector('.logout')
  const submitBtn = document.querySelector('.submit')
  if (logout) {
    logout.addEventListener('click', ()=>{
      window.localStorage.removeItem('text')
    })
  }
  if (submitBtn) {
    submitBtn.addEventListener('click', ()=>{
      window.localStorage.removeItem('text')
    })
  }
</script>
</html>

