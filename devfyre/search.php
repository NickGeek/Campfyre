<?php
//Details to login connect to the database
include("/home1/etherals/mysqlDetails.php");
$dbname = "etherals_campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);

$tag = mysqli_real_escape_string($con, $_GET['tag']);

function getRelativeTime($secs) {
	$second = 1;
	$minute = 60;
	$hour = 60*60;
	$day = 60*60*24;
	$week = 60*60*24*7;
	$month = 60*60*24*7*30;
	$year = 60*60*24*7*30*365;

	if ($secs <= 0) { $output = "now";
	}elseif ($secs > $second && $secs < $minute) { $output = round($secs/$second)." second";
	}elseif ($secs >= $minute && $secs < $hour) { $output = round($secs/$minute)." minute";
	}elseif ($secs >= $hour && $secs < $day) { $output = round($secs/$hour)." hour";
	}elseif ($secs >= $day && $secs < $week) { $output = round($secs/$day)." day";
	}elseif ($secs >= $week && $secs < $month) { $output = round($secs/$week)." week";
	}elseif ($secs >= $month && $secs < $year) { $output = round($secs/$month)." month";
	}elseif ($secs >= $year && $secs < $year*10) { $output = round($secs/$year)." year";
	}else{ $output = "now"; }

	if ($output <> "now"){
		$output = (substr($output,0,2)<>"1 ") ? $output."s" : $output;
	}
	if ($output != "now") {
		return $output." ago";
	}
	else {
		return $output;
	}
}

function relativeTime($timeOfPost) {
	$secsSincePost = time() - $timeOfPost;
	return getRelativeTime($secsSincePost);
}

//Attachments
function splitDomain($url) { 
 $host = "";
 $url = parse_url($url);
 if(isset($url['host'])) { 
    $host = $url['host'];
 } else {
    $host = $url['path'];
 }
 $host = str_replace('www.','',$host);
 $tmp = explode('.', $host);
 $name = $tmp[0];
 if ($name == "i") {
 	$name = $tmp[1];
 }
return array('name'=>$name);
}

function attach($url) {
	$output = "";
	if (splitDomain($url)['name'] == "youtube") {
		//YouTube
		preg_match(
		        '/[\\?\\&]v=([^\\?\\&]+)/',
		        $url,
		        $matches
		    );
		$id = $matches[1];
		 
		$width = '95%';
		$height = '420';
		return '<br /><object width="' . $width . '" height="' . $height . '"><param name="movie" value="http://www.youtube.com/v/' . $id . '&amp;hl=en_US&amp;fs=1?rel=0"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/' . $id . '&amp;hl=en_US&amp;fs=1?rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="' . $width . '" height="' . $height . '"></embed></object>';
	}
	elseif (splitDomain($url)['name'] == "sharepic") {
		return '<br /><a target="_blank" href="'.$url.'"><img style="max-height: 50%;" src="'.$url.'" /></a>';
	}
	elseif(splitDomain($url)['name'] == "imgur") {
		$link = explode("/", $url);
		return '<br /><a target="_blank" href="http://i.imgur.com/'.$link[count($link)-1].'"><img style="max-height: 50%;" src="http://i.imgur.com/'.$link[count($link)-1].'" /></a>';
	}
	elseif($url != "n/a") {
		return '<br />Attached URL: <a target="_blank" href="'.$url.'">'.$url.'</a>';
	}

	return "";
}

function attachmentDisplay($url, $nsfw) {
	if ($nsfw == 1) {
		if (isset($_GET['nsfw'])) {
			return attach($url);
		}
		else {
			return "";
		}
	}
	else {
		return attach($url);
	}
}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Campfyre</title>
		<link rel="icon" type="image/x-icon" href="favicon.ico">
		<meta name="description" content="256 characters. No login required. Have fun.">
		<meta name="author" content="Etheral Studios">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<link rel="stylesheet" type="text/css" href="lato.css">
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/2.3.2/css/bootstrap.min.css">

		<style>
			body {
				background-image: url(img/bg.png);
			}
			#centre {
				text-align: center;
				margin-top: 10%;
			}
			h1 {
				font-family: 'Lato', serif;
				font-weight:900;
				font-size: 4em;
				color: #fa6900;
				padding-right: 20px;
			}
			h2 {
				text-align: center;
				padding-right: 20px;
				font-weight:100;
				font-family: 'Lato', serif;
				padding-left: 10px;
			}
			h3 {
				padding-right: 20px;
				font-weight:100;
				font-family: 'Lato', serif;
				padding-left: 10px;
			}

			/* Mobile */
			@media (max-width: 960px) {
				.card {
					padding:1rem;
					box-shadow:0 1px 2px #aaa;
					background:white;
					margin:0 1rem 1rem;
					border-radius:3px;
					width: 80%;
					margin-left:auto;
					margin-right:auto;
					word-wrap: break-word;
				}
			}
			/* Widescreen */
			@media (min-width: 960px) {
				.card {
					padding:1rem;
					box-shadow:0 1px 2px #aaa;
					background:white;
					margin:0 1rem 1rem;
					border-radius:3px;
					width: 50%;
					margin-left:auto;
					margin-right:auto;
					word-wrap: break-word;
				}
			}

			#ip {
				font-family: 'Lato', serif;
			}
			p {
				font-family: 'Lato', serif;
			}
			a:link {
				color: #5C5858;
				text-decoration: none;
			}
			a:visited {
				color: #5C5858;
				text-decoration: none;
			}
			a:hover {
				color: black;
				text-decoration: underline;
			}
			a:active {
				color: black;
				text-decoration: underline;
			}
			#postText {
				width: 95%;
				height: auto;
			}
		</style>

		<script src="http://code.jquery.com/jquery-1.5.js"></script>
		<script>
			//Character counter
			function countChar(val, id) {
				var counterDiv = "#counter"+id
				var len = val.value.length;
				if (len >= 256) {
					$(counterDiv).text("0/256");
					val.value = val.value.substring(0, 256);
				} else {
					$(counterDiv).text(256 - len+"/256");
				}
			};

			//Comment form
			function showCommentForm(id) {
				divToShow = "commentForm"+id;
				//Show the comments div
				document.getElementById(divToShow).style.display = 'inline';

				//Hide the show button
				document.getElementById("showCommentButton"+id).style.display = "none";
				document.getElementById("hideCommentButton"+id).style.display = "";
			}

			//Hide the comments
			function hideCommentForm(id) {
				divToHide = "commentForm"+id;
				//Hide the comments div
				document.getElementById(divToShow).style.display = 'none';

				//Show the show button
				document.getElementById("showCommentButton"+id).style.display = "";
				document.getElementById("hideCommentButton"+id).style.display = "none";
			}

			//Auto links
			var url_regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
			function linkURLs(text) {
				return text.replace(
					url_regex,
					'<a href="$1">$1</a>'
				);
			}

			$(document).ready(function(){
				$('.postText').each(function() {
					$(this).html(linkURLs($(this).html()));
				});
			});

			//#YOLOSWAG - thanks to http://stackoverflow.com/questions/4913555/find-twitter-hashtags-using-jquery-and-apply-a-link
			hashtag_regexp = /#([a-zA-Z]+)/g;

			function linkHashtags(text) {
				return text.replace(
					hashtag_regexp,
					'<a href="http://campfyre.org/search.php?tag=%23$1">#$1</a>'
				);
			}

			$(document).ready(function(){
				$('h3').each(function() {
					$(this).html(linkHashtags($(this).html()));
				});
			});

			/*/You can have your damn ~tags
			tildetag_regexp = /~([a-zA-Z]+)/g;

			function linkTildetags(text) {
				return text.replace(
					tildetag_regexp,
					'<a href="http://campfyre.org/search.php?tag=%7E$1">~$1</a>'
				);
			}

			$(document).ready(function(){
				$('h3').each(function() {
					$(this).html(linkTildetags($(this).html()));
				});
			});*/
		</script>
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-8931238-13', 'auto');
		  ga('send', 'pageview');
		</script>
	</head>
	<body>
		<p><a href="./"><< Go Back</a></p>
		<div id="centre">
			<h1>Campfyre</h1>
			<h2>Search results for <?php echo $tag; ?>:</h2>
		</div>

		<!-- Posts -->
		<?php
		/*/Dipslay ordered posts
		if (!isset($_GET['show'])) {
			$posts = $con->query("SELECT * FROM posts WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag %' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '$tag %' or REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) = '$tag' ORDER BY id DESC LIMIT 0, 9");
			$orderedPosts = array();
			foreach ($posts as $post) {
				array_push($orderedPosts, $post);
			}
			//Order the array based on the score of each post
			function sortByScore($x, $y) {
				return $y['score'] - $x['score'];
			}
			usort($orderedPosts, 'sortByScore');

			foreach ($orderedPosts as $post) {
				//Get the comments for this post from the database
				$id = $post['id'];
				if (!isset($_GET['show'])) {
					$comments = $con->query("SELECT * FROM comments WHERE parent = '$id' ORDER BY id ASC LIMIT 50");
				}
				elseif (isset($_GET['show']) && $_GET['show'] == "1") {
					$comments = $con->query("SELECT * FROM comments WHERE parent = '$id' ORDER BY id ASC");
				}?>
				<section id="<?php echo $post['id']; ?>" class="card">
					<p><i id="ip"><?php echo "<img src='http://robohash.org/".md5($post['ip']).".png?set=set3&size=64x64' /> says...<br />"; ?></i><a href="http://campfyre.org/?show=1#<?php echo $post['id']; ?>">Permalink</a> | <?php echo relativeTime($post['time']); if ($post['ip'] == "admin") { echo " [admin]"; } if ($post['nsfw'] == 1) { echo " [nsfw]"; } ?> <?php if ($post['ip'] == "117.18.80.21") { echo " [Wellington College]"; } ?></p>
					<h3 style="text-align: left;"><?php if ($post['nsfw'] == 1 && !isset($_GET['nsfw']) && !isset($_GET['show'])) { echo "<i>This post is possibly offensive. <a href='http://campfyre.org/search.php?tag=".urlencode($tag)."&nsfw=1#".$post['id']."'>Click here</a> to view possibly offensive posts.</i>"; } elseif($post['nsfw'] == 1 && !isset($_GET['nsfw']) && isset($_GET['show'])) { echo "<i>This post is possibly offensive. <a href='http://campfyre.org/search.php?tag=".urlencode($tag)."&show=1&nsfw=1#".$post['id']."'>Click here</a> to view possibly offensive posts.</i>"; } else { echo "<h3 class='postText'>".str_replace("\n", "<br />", $post['post'])."</h3>"; } ?></h3>
					<?php echo attachmentDisplay($post['attachment'], $post['nsfw']); ?><?php if ($post['attachment'] != "n/a") { ?><br /><br /><?php } ?>
					<a class="btn" href="http://campfyre.org/api/stoke.php?type=post&id=<?php echo $post['id']; ?>">Stoke (<?php echo $post['score']; ?>)</a>
					<a id="showCommentButton<?php echo $post['id']; ?>" class="btn" href="javascript:void(0)" onclick="showCommentForm(<?php echo $post['id']; ?>)">Load comments (<?php echo mysqli_num_rows($comments); ?>)</a>
					<a style="display: none;" id="hideCommentButton<?php echo $post['id']; ?>" class="btn" href="javascript:void(0)" onclick="hideCommentForm(<?php echo $post['id']; ?>)">Hide comments</a>
					<div style="display: none;" id="commentForm<?php echo $post['id']; ?>">
						<br /><br />
						<form action="submitV2.php" method="post">
							<input type="hidden" name="type" value="comment">
							<input type="hidden" name="id" value="<?php echo $post['id']; ?>">
							<textarea id="postText" name="postText" placeholder="Comment text" class="rounded" rows="5" onkeydown="countChar(this, <?php echo $post['id']; ?>)" onkeyup="countChar(this, <?php echo $post['id']; ?>)" required></textarea>
							<div style="font-family: 'Lato', serif;" id="counter<?php echo $post['id']; ?>">256/256</div><br />
							<b>Subscribe to comments:</b><br />
							<input name="email" type="email" class="rounded" placeholder="E-Mail address (optional)"><br />
							<input class="btn" type="submit" name="post" value="Post">
						</form>
					<?php
					//Comments
					if (mysqli_num_rows($comments) > 0) { ?>
						<hr />
						<?php
						$loop = 0;
						foreach ($comments as $comment) { 
							$loop += 1; ?>
							<p><i id="ip"><?php echo "<img src='http://robohash.org/".md5($comment['ip']).".png?set=set3&size=64x64' /> says...<br />"; ?></i><?php echo relativeTime($comment['time']); ?></p>
							<h3><?php echo str_replace("\n", "<br />", $comment['comment']); ?></h3>
							<?php if ($loop != mysqli_num_rows($comments)) { ?>
								<hr />
							<?php } ?>
						<?php } ?>
					<?php } ?>
					</div>
				</section>
			<?php }
		}*/

		//Get all the posts from the database
		if (!isset($_GET['show'])) {
			$posts = $con->query("SELECT * FROM posts WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag %' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '$tag %' or REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) = '$tag' ORDER BY id DESC LIMIT 50");
		}
		elseif (isset($_GET['show']) && $_GET['show'] == "1") {
			$posts = $con->query("SELECT * FROM posts WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag %' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '$tag %' or REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) = '$tag' ORDER BY id DESC");
		}

		$postloop = 0;
		foreach ($posts as $post) {
			$postloop += 1;
			//Get the comments for this post from the database
			$id = $post['id'];
			if (!isset($_GET['show'])) {
				$comments = $con->query("SELECT * FROM comments WHERE parent = '$id' ORDER BY id ASC LIMIT 50");
			}
			elseif (isset($_GET['show']) && $_GET['show'] == "1") {
				$comments = $con->query("SELECT * FROM comments WHERE parent = '$id' ORDER BY id ASC");
			}?>
			<section id="<?php echo $post['id']; ?>" class="card">
				<p><i id="ip"><?php echo "<img src='http://robohash.org/".md5($post['ip']).".png?set=set3&size=64x64' /> says...<br />"; ?></i><a href="http://campfyre.org/?show=1#<?php echo $post['id']; ?>">Permalink</a> | <?php echo relativeTime($post['time']); if ($post['ip'] == "admin") { echo " [admin]"; } if ($post['nsfw'] == 1) { echo " [nsfw]"; } ?> <?php if ($post['ip'] == "117.18.80.21") { echo " [Wellington College]"; } ?></p>
				<h3 style="text-align: left;"><?php if ($post['nsfw'] == 1 && !isset($_GET['nsfw']) && !isset($_GET['show'])) { echo "<i>This post is possibly offensive. <a href='http://campfyre.org/search.php?tag=".urlencode($tag)."&nsfw=1#".$post['id']."'>Click here</a> to view possibly offensive posts.</i>"; } elseif($post['nsfw'] == 1 && !isset($_GET['nsfw']) && isset($_GET['show'])) { echo "<i>This post is possibly offensive. <a href='http://campfyre.org/search.php?tag=".urlencode($tag)."&show=1&nsfw=1#".$post['id']."'>Click here</a> to view possibly offensive posts.</i>"; } else { echo "<h3 class='postText'>".str_replace("\n", "<br />", $post['post'])."</h3>"; } ?></h3>
				<?php echo attachmentDisplay($post['attachment'], $post['nsfw']); ?><?php if ($post['attachment'] != "n/a") { ?><br /><br /><?php } ?>
				<a class="btn" href="http://campfyre.org/api/stoke.php?type=post&id=<?php echo $post['id']; ?>">Stoke (<?php echo $post['score']; ?>)</a>
				<a id="showCommentButton<?php echo $post['id']; ?>" class="btn" href="javascript:void(0)" onclick="showCommentForm(<?php echo $post['id']; ?>)">Load comments (<?php echo mysqli_num_rows($comments); ?>)</a>
				<a style="display: none;" id="hideCommentButton<?php echo $post['id']; ?>" class="btn" href="javascript:void(0)" onclick="hideCommentForm(<?php echo $post['id']; ?>)">Hide comments</a>
				<div style="display: none;" id="commentForm<?php echo $post['id']; ?>">
					<br /><br />
					<form action="submitV2.php" method="post">
						<input type="hidden" name="type" value="comment">
						<input type="hidden" name="id" value="<?php echo $post['id']; ?>">
						<textarea id="postText" name="postText" placeholder="Comment text" class="rounded" rows="5" onkeydown="countChar(this, <?php echo $post['id']; ?>)" onkeyup="countChar(this, <?php echo $post['id']; ?>)" required></textarea>
						<div style="font-family: 'Lato', serif;" id="counter<?php echo $post['id']; ?>">256/256</div><br />
						<b>Subscribe to comments:</b><br />
						<input name="email" type="email" class="rounded" placeholder="E-Mail address (optional)"><br />
						<input class="btn" type="submit" name="post" value="Post">
					</form>
				<?php
				//Comments
				if (mysqli_num_rows($comments) > 0) { ?>
					<hr />
					<?php
					$loop = 0;
					foreach ($comments as $comment) { 
						$loop += 1; ?>
						<p><i id="ip"><?php echo "<img src='http://robohash.org/".md5($comment['ip']).".png?set=set3&size=64x64' /> says...<br />"; ?></i><?php echo relativeTime($comment['time']); ?></p>
						<h3><?php echo str_replace("\n", "<br />", $comment['comment']); ?></h3>
						<?php if ($loop != mysqli_num_rows($comments)) { ?>
							<hr />
						<?php } ?>
					<?php } ?>
				<?php } ?>
				</div>
			</section>
		<?php } ?>
		<?php
		if (!isset($_GET['show'])) {
			echo "<p style='text-align: right;'><a href='http://campfyre.org/search.php?tag=".urlencode($tag)."&show=1'>Show all posts and comments</a></p>";
		}
		?>
		<p style='text-align: right;'>Written and run by <a href="http://nickwebster.co.nz">Nick Webster</a></p>
	</body>
</html>