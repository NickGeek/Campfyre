<?php
//Details to login connect to the database
include("/home1/etherals/mysqlDetails.php");
$dbname = "etherals_campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);

function getLatest($con) {
	//String the data is in
	$data = "";

	//Get the data
	$query = $con->query("SELECT * FROM posts ORDER BY id DESC LIMIT 1");

	foreach ($query as $item) {
		$data = $item['id'];
		break;
	}
	$output = $data;
	return $output;
}

echo getLatest($con);
?>