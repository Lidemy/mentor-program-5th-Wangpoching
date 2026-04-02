<?php
	require_once('conn.php');
	require_once('utils.php');

	// 將 Markdown 渲染成 html
	require __DIR__ . '/vendor/autoload.php';
	use League\CommonMark\Environment\Environment;
	use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
	use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
	use League\CommonMark\MarkdownConverter;

	// 不允許 HTML 注入
  // 不允許惡意連結
  // 防止 XSS 攻擊
	$environment = new Environment([
	    'html_input' => 'strip',
	    'allow_unsafe_links' => false,
	]);

	$environment->addExtension(new CommonMarkCoreExtension());
	$environment->addExtension(new GithubFlavoredMarkdownExtension());
	$converter = new MarkdownConverter($environment);

	$id = getValue($_GET, 'id');
	if ($id === '') {
		header('Location: index.php');
		exit();
	}
	$id = (int)$id;

	// 草稿不能看
	$sql = "
		SELECT posts.id as id, title, subTitle, content, status, cover_image, posts.category_id as categoryId, GROUP_CONCAT(tags.name) as tags FROM `posts`
    LEFT JOIN `categories` as c on posts.category_id = c.id
    LEFT JOIN `post_tags` as pt on posts.id = pt.post_id
    LEFT JOIN `tags` on pt.tag_id = tags.id
    WHERE posts.id = ? AND status = ?
    GROUP BY posts.id
	";
	$result = executeQuery($conn, $sql, 'is', $id, PUBLISHED_POST_STATUS);
	if (!$result || $result->num_rows === 0) {
		header('Location: index.php');
		exit();
	}
	$post = $result->fetch_assoc();
	$tags = $post['tags'] ? explode(',', $post['tags']) : [];
	$content = $converter->convert($post['content']);

	// 取得同分類的前一篇以及下一篇文章 ID
	$sql = "SELECT id FROM `posts` WHERE category_id = ? ORDER BY created_at ASC";
	$result = executeQuery($conn, $sql, 'i', (int)$post['categoryId']);
	$idsResult =  $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
	$ids = [];
	foreach($idsResult as $item) {
		$ids[] = $item['id'];
	}
	$current = array_search($post['id'] , $ids);

	$nextExit = isset($ids[$current + 1]);
	if ($nextExit) $nextId = $ids[$current + 1];
	$prevExit = isset($ids[$current - 1]);
	if ($prevExit) $prevId = $ids[$current - 1];
?>
<!DOCTYPE html>
<html lang="en">
  <?php
    $title = '單一文章';
    $localCSS = [
      'css/base.css',
      'css/components.css',
      'css/style.css',
    ];
    $extraCSS = [
    	'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap'
    ];
    require_once('template/head.php');
  ?>
  <body>
    <div class="page-public-post">
      <div class="content-wrapper">
	      <?php
	        $active = 'Posts';
	        require_once('template/nav.php');
	      ?>
      	<div class="back-to-posts"><a href="index.php">← All posts</a></div>
      	<div class="information">
      		<div class="tags">
	      		<?php foreach($tags as $tag): ?>
	      			<span class="tag"><?= escape($tag) ?></span>
	      		<?php endforeach; ?>
	      	</div>
	      	<div class="information__detail">
	      		<span>December 1, 2024</span>
	      		<span>8 min Read</span>
	      	</div>
	      	<div class="title"><?= $post['title'] ?></div>
	      	<div class="subtitle"><?= $post['subTitle'] ?></div>
      	</div>
      </div>
	    	<?php if ($post['cover_image']): ?>
	      	<div class="cover_image">
	      		<img src="<?= UPLOAD_COVERS_URL . $post['cover_image'] ?>" />
	      	</div>
	      <?php endif; ?>
      <div class="content-wrapper content">
      	<?= $content ?>
      </div>
      <div class="content-wrapper">
	      <div class="indicators">
	      	<?php if ($prevExit): ?>
	      		<div class="btn prev-post"><a href="post.php?id=<?= $prevId ?>">← Prev post</a></div>
	      	<?php endif; ?>
	      	<?php if ($nextExit): ?>
	      		<div class="btn next-post"><a href="post.php?id=<?= $nextId ?>">Next post →</a></div>
	      	<?php endif; ?>
	      </div>
	    </div>
      <footer class="footer">Handcrafted by <span class="accent">Pocyun</span> for <span class="accent" id="years"></span> years · <div class="footer-right">
          <a href="https://github.com/yourname" target="_blank">GitHub</a>
          <a href="https://linkedin.com/in/yourname" target="_blank">LinkedIn</a>
        </div>
      </footer>
    </div>
  </body>
  <script src="js/footer.js"></script>
</html>