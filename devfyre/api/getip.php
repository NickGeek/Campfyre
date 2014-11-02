<?php
//Details to login connect to the database
include("/home/nick/mysqlDetails.php");
include("/home/nick/passwords.php");
$dbname = "campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);

$id = mysqli_real_escape_string($con, $_GET['id']);
$size = $_GET['size'];

$query = $con->query("SELECT ip FROM posts WHERE id = ".$id);

foreach ($query as $post) {
	$hash = md5($post['ip']);
	$imgurl = "http://robohash.org/".$hash.".png?set=set3&size=".$size;
	echo $imgurl;
	break;
}
?>