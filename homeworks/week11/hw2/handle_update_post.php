<?php
  session_start();
  require_once('conn.php');
  require_once('utils.php');
  
  // 檢查輸入  
  if (!is_set($_POST['id']) || !is_set($_POST['title']) || !is_set($_POST['content'])) {
    if (is_set($_POST['id'])) {
      header('Location:update_post.php?errCode=1&id='.$_POST['id']);
      die('資料不齊全');
    } else {
      die('failed');
    }
  } else {
    $id = intval($_POST['id']);
  }

  // 檢查是不是有登錄過了
  check_login();
  $username = $_SESSION['username'];

  // 檢查登入者是否與欲修改文章相同
  if (!is_selfpost($id)) {
    die('權限不足');
  }

  // 將暱稱與留言寫入資料庫
  $title = $_POST['title'];
  $content = $_POST['content'];  
  $sql = 'UPDATE boching_blog_posts SET title=?, content=? WHERE id=?';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('ssi',$title, $content, $id);
  $result = $stmt->execute();
  if ($result) {
    if (is_set($_POST['page'])) {
      header('Location:' . $_POST['page']); 
    } else {
      header('Location:admin.php');      
    }
  } else {
    die('Error. ' . $conn->error);
  }
?>