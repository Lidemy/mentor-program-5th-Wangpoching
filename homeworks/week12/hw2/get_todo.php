<?php
  require(dirname(__FILE__).'/conn.php');
  require(dirname(__FILE__).'/utils.php');
  header('Content-type: application/json;charset=utf-8');

  // 回覆模板
  $err_json = array(
    'ok' => false
  );
  $json = array(
    'ok' => true
  );

  // 資料不齊全
  if (!is_set($_POST['access_token'])) {
    $err_json['message'] = 'Data missing';
    $response = json_encode($err_json);
    echo $response;
    die();
  }
  $access_token = $_POST['access_token'];

  // 撈資料
  $sql = 'SELECT content FROM boching_todos WHERE access_token=?';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('s',$access_token);
  $result = $stmt->execute();
  // 資料庫錯誤
  if (!result) {
    $err_json['message'] = $conn->error;
    $response = json_encode($err_json);
    echo $response;
    die();
  }
  // 通行碼錯誤
  $result = $stmt->get_result();
  if ($result->num_rows !== 1) {
    $err_json['message'] = 'Wrong access token';
    $response = json_encode($err_json);
    echo $response;
    die();
  }
  // 返回資料
  $row = $result->fetch_assoc();
  $json['todos'] = $row['content'];
  $response = json_encode($json);
  echo $response;
?>