<?php
//Details to login connect to the database
include("/home/nick/mysqlDetails.php");
include("/home/nick/passwords.php");
$dbname = "campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);
mysqli_set_charset($con, "utf8");

$parent = mysqli_real_escape_string($con, $_GET['id']);
$email = mysqli_real_escape_string($con, $_GET['email']);
mysqli_query($con,"UPDATE `posts`
	SET `emails` = IFNULL(CONCAT(`emails`, ',$email'), '$email')
	WHERE `id` = '$parent'");
echo "Subscribed";
?>