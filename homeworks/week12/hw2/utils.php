<?php
  // 逃脫字元（防止 XSS)
  function escape($str) {
    return htmlspecialchars($str , ENT_QUOTES);
  }

  // 檢查輸入是否被設置且不為空
  function is_set($input) {
    return (isset($input) && (strlen($input) !== 0));
  }
?>