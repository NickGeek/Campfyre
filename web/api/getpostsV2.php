<?php
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

	//Would you like that with search?
	if (!isset($_GET['search'])) {
		$tag = "#bonfyre";
		$query = $con->query("SELECT * FROM posts WHERE `post` NOT LIKE '%$tag%' ORDER BY id DESC LIMIT $startingPost, 50");
	}
	else {
		$query = $con->query("SELECT * FROM posts WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag %' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% $tag' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '$tag %' or REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) = '$tag' ORDER BY id DESC LIMIT $startingPost, 50");
	}

	foreach ($query as $item) {
		if ($item['nsfw'] == 0) { $post =  $item['post']; } else { $post = "Post hidden: this post is possibly offensive"; }
		$postArr = array();
		$postArr['post'] = $post;
		$postArr['id'] = $item['id'];
		$postArr['score'] = $item['score'];
		$postArr['pic'] = getPic($item['id'], $con);
		$comments = $con->query("SELECT * FROM comments WHERE parent = '".$item['id']."' ORDER BY id ASC");
		$postArr['commentNum'] = mysqli_num_rows($comments)." comments";
		$postArr['time'] = relativeTime($item['time']);
		$postArr['nsfw'] = $item['nsfw'];
		$postArr['attachement'] = $item['attachment'];
		$data[] = $postArr;
	}
	$output = json_encode($data);
	return $output;
}

echo getPosts($con);
?>