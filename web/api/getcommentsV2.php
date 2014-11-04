<?php
//Details to login connect to the database
include("/home/nick/mysqlDetails.php");
include("/home/nick/passwords.php");
$dbname = "campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);
mysqli_set_charset($con, "utf8");

$id = mysqli_real_escape_string($con, $_GET['id']);

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

function getPic($id) {
	//Details to login connect to the database
	include("/home/nick/mysqlDetails.php");
	include("/home/nick/passwords.php");
	$dbname = "campfyre";

	//Connect to the database
	$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);
	mysqli_set_charset($con, "utf8");

	$size = $_GET['size'];

	$query = $con->query("SELECT ip FROM comments WHERE id = ".$id);

	foreach ($query as $post) {
		$hash = md5($post['ip']);
		if (isset($size)) {
			$imgurl = "http://robohash.org/".$hash.".png?set=set3&size=".$size;
		}
		else {
			$imgurl = "http://robohash.org/".$hash.".png?set=set3&size=200x200";
		}
		break;
	}
	return $imgurl;
}

function getLatest($con, $id) {
	//Array the data is in
	$data = array();

	//Get the data
	$query = $con->query("SELECT * FROM comments WHERE parent = '".$id."' ORDER BY id ASC");

	if (mysqli_num_rows($query) > 0) {
		foreach ($query as $item) {
			$comment = array();
			$comment['comment'] = $item['comment'];
			$comment['pic'] = getPic($item['id']);
			$comment['time'] = relativeTime($item['time']);
			$data[] = $comment;
		}
	}
	else {
		$comment = array();
		$comment['comment'] = "This post has no comments. Be the first!";
		$comment['pic'] = getPic(2);
		$comment['time'] = "";
		$data[] = $comment;
	}
	$output = json_encode($data);
	return $output;
}

echo getLatest($con, $id);
?>