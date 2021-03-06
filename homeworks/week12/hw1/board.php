<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous"></script>
    <script src="index.js"></script>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-wEmeIV1mKuiNpC+IOBjI7aAzPcEZeedi5yW5f2yOq55WWLwNGmvvx4Um1vskeMj0" crossorigin="anonymous">
    <link href="modal.css" rel="stylesheet">
    <title>留言板</title>
  </head>
  <body> 
    <div class="container bg-info header"></div> 
    <div class="container bg-light py-5 main">
      <h2>討論區</h2>
      <form class="add-comment-form">
        <div class="form-group">
          <div class="input-group flex-column">
              <label for="nickname-input" class="mt-3">暱稱</label>       
              <input name = "nickname" type="text" class="form-control w-25" placeholder="您的暱稱" id="nickname-input" aria-label="user nickname" aria-describedby="button-addon2">
          </div>
          <label for="content-textarea" class="mt-3">留言內容</label>
          <textarea name="content" class="form-control" id="content-textarea" rows="5"></textarea>
        </div>
        <button type="submit" class="btn btn-primary mt-3 btn-submit">提交</button>
        <a type="submit" class="btn btn-primary mt-3 btn-refresh" href="http://13.59.36.215/commentArea-plugin/board.html">刷新頁面</a>
      </form>
      <div class="comments row justify-content-center mt-5">
      </div>
      <div class="container mt-auto d-flex flex-row-reverse bg-dark">
        <div class="dropup">
          <a class="btn btn-dark dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"></a>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li><a class="dropdown-item btn-gobottom">移至最底</a></li>
            <li><a class="dropdown-item btn-gotop">回到頂部</a></li>
          </ul>
        </div>
      </div>
    </div>

  </body>
</html>