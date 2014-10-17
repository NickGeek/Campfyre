<?php
//Details to login connect to the database
include("/home1/etherals/mysqlDetails.php");
$dbname = "etherals_campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);
$oldcon = mysql_connect("localhost", $dbusername, $dbpassword);

$parent = mysqli_real_escape_string($con, $_GET['id']);
$email = mysqli_real_escape_string($con, $_GET['email']);
mysqli_query($con,"UPDATE `posts`
	SET `emails` = IFNULL(CONCAT(`emails`, ',$email'), '$email')
	WHERE `id` = '$parent'");
echo "Subscribed";
?>