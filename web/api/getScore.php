<?php
include("/home/nick/mysqlDetails.php");
include("/home/nick/passwords.php");
$dbname = "campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);
mysqli_set_charset($con, "utf8");

$id = mysqli_real_escape_string($con, $_GET['id']);
$query = $con->query("SELECT `score` FROM posts WHERE `id` = '$id'");
echo mysqli_fetch_assoc($query)['score']
?>