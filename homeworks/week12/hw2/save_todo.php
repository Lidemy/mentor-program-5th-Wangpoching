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
  if (!is_set($_POST['todos'])) {
    $err_json['message'] = 'Data missing';
    $response = json_encode($err_json);
    echo $response;
    die();
  }
  $data = $_POST['todos'];

  // 沒傳通行碼（ 新使用者 ）
  if (!is_set($_POST['access_token'])) {
    $str = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';
    $access_token = substr(str_shuffle($str),26,5);
    $sql = 'INSERT INTO boching_todos (access_token, content) VALUES (?, ?)';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss',$access_token, $data);
    $result = $stmt->execute();
    // 資料庫錯誤
    if (!result) {
      $err_json['message'] = $conn->error;
      $response = json_encode($err_json);
      echo $response;
      die();
    }
    // 發送通行碼
    $json['access_token'] = $access_token;
    $response = json_encode($json);
    echo $response;
    die();
  }

  // 有攜帶通行碼

  // 檢查通行碼
  $sql = 'SELECT * FROM boching_todos WHERE access_token=?';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('s', $_POST['access_token']);  
  $result = $stmt->execute();
  // 資料庫錯誤
  if (!result) {
    $err_json['message'] = $conn->error;
    $response = json_encode($err_json);
    echo $response;
    die();
  }
  $result = $stmt->get_result(); 
  // 通行碼錯誤
  if ($result->num_rows !== 1) {
    $err_json['message'] = 'Wrong access token';
    $response = json_encode($err_json);
    echo $response;
    die();  
  } 
  // 儲存 todos
  $sql = 'UPDATE boching_todos SET content=? WHERE access_token=?';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('ss',$data, $_POST['access_token']);  
  $result = $stmt->execute();
  // 資料庫錯誤
  if (!result) {
    $err_json['message'] = $conn->error;
    $response = json_encode($err_json);
    echo $response;
    die();
  }
  // 修改成功
  $response = json_encode($json);
  echo $response;
?>