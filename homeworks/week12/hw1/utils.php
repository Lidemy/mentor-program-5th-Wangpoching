<?php
  // 檢查輸入是否被設置且不為空
  function is_set($input) {
    return (isset($input) && (strlen($input) !== 0));
  }
?>