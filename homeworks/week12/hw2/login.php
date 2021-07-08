<?php
  require('utils.php');
?>
<!DOCTYPE html>

<html>
<head>
  <meta charset="utf-8">
  <title>To-do List</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./normalize.css">
  <link rel="stylesheet" href="./modal.css">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="main.js"></script>
</head>

<body>
  <div class="all__wrapper">
    <div class="login-form__wrapper">
      <div class="wrapper">
        <section>
          <h1>Todo List</h1>
          <form action="index.php" method="post">
            <div class="login-block">
              <input type="text" class="login-input" name="access_token" placeholder="Type in your access token" />
              <button type="submit" class="login-btn">Send</button>
            </div>
          </form>
          <a class="direct-login" href="index.php">Open New</a>
        </section>
      </div>
    </div>
  </div>
</body>
</html>