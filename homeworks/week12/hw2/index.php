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
		<div class="form__wrapper">
			<div class="wrapper">
				<section>
					<h1>Todo List</h1>
				</section>
			</div>

			<div class="wrapper">
				<section class= "query-block">
					<?php if (is_set($_POST['access_token'])) { ?>
						<input type="hidden" class="access-token" value="<?php echo escape($_POST['access_token']); ?>">
					<?php } ?>
					<img class="clear-select" src="images/delete_img.png"></img>
					<input class="input__text" type="text" placeholder="Add something to do here <(￣︶￣)>?">
					<div class="input__underline"></div>
				</section>
			</div>

			<div class="wrapper">
				<section class= "main-block">
					<ul class="todos">
					</ul>
				</section>
			</div>
			<div class="wrapper footer">
				<section class="toolbar">
					<div class="uncomplete-count">0 items left</div>
					<div class="complete-type">
						<div class="complete-type__all active" data-id=0>All</div>
						<div class="complete-type__yes" data-id=1>Done</div>
						<div class="complete-type__no" data-id=2>Undone</div>
					</div>
					<div class="selet-tools">
						<label>
						<div>Select All</div>
						<input type="checkbox" class="select-all" />
						</label>
					</div>
				</section>
				<hr />
				<div class="buttons">
					<a class="btn-backlogin" href="login.php">Login</a>				
					<button class="btn-save">Save</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>