<?php
include("/home1/etherals/mysqlDetails.php");
$dbname = "etherals_campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);

$id = mysqli_real_escape_string($con, $_GET['id']);
$query = $con->query("SELECT `score` FROM posts WHERE `id` = '$id'");
echo mysqli_fetch_assoc($query)['score']
?>