<?php
include("/home/nick/mysqlDetails.php");
include("/home/nick/passwords.php");
$dbname = "campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);

//Setup Variables
$ip = $_SERVER['REMOTE_ADDR'];
$id = mysqli_real_escape_string($con, $_GET['id']);

//Make sure the user hasn't already voted
$query = $con->query("SELECT `voters` FROM posts WHERE `id` = '$id'");
$voters = explode(",", mysqli_fetch_assoc($query)['voters']);
if (in_array($ip, $voters)) {
	echo "You can only vote once";
}
else {
	//Make the user a voter
	$safeIP = mysqli_real_escape_string($con, $ip);
	mysqli_query($con,"UPDATE `posts`
				SET `voters` = IFNULL(CONCAT(`voters`, ',$safeIP'), '$safeIP')
				WHERE `id` = '$id'");
	//Add 1 to the score of the post
	mysqli_query($con,"UPDATE `posts` SET `score` = `score` + 1 WHERE `id` = '$id'");
	if (!isset($_GET['mobile'])) {
		header("Location: ../#".$_GET['id']);
	}
	else {
		echo "Post stoked";
	}
}
?>