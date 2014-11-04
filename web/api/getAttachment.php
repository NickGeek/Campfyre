<?php
include("/home/nick/mysqlDetails.php");
include("/home/nick/passwords.php");
$dbname = "campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);
mysqli_set_charset($con, "utf8");

$id = mysqli_real_escape_string($con, $_GET['id']);

$query = $con->query("SELECT attachment FROM posts WHERE id = ".$id);

foreach ($query as $post) {
	echo $post['attachment'];
	break;
}
?>