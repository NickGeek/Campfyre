<?php
require_once "Mail.php";

//Details to login connect to the database
include("/home1/etherals/mysqlDetails.php");
include("/home1/etherals/passwords.php");
$dbname = "etherals_campfyre";

//Connect to the database
$con=mysqli_connect("localhost", $MYSQL_USERNAME, $MYSQL_PASSWORD, $dbname);

if (isset($_GET['email'])) {
	$email = $_GET['email'];
}

$time = time();

$text = $_GET['postText'];
$originaltext = $text;
//Strip all the HTML from the post so no one goes around adding js or weird stylings to the page
$text = strip_tags($text);

//Escape the date to make it safe (should be updated to mysqli sometimg eventually)
$text = mysqli_real_escape_string($con, $text);

if (!isset($_GET['attachment'])) {
	$attachment = "n/a";
}
else {
	$attachment = mysqli_real_escape_string($con, $_GET['attachment']);
}

$type = $_GET['type'];
$ip = $_SERVER["REMOTE_ADDR"];
$nsfw = $_GET['nsfw'];

if (!isset($nsfw)) {
	$nsfw = 0;
}

//Are ya'll a spamma?
$query = $con->query("SELECT * FROM posts ORDER BY id DESC LIMIT 3");
$latestIPs = array();
foreach ($query as $post) {
	array_push($latestIPs, $post['ip']);
}

if (count(array_unique($latestIPs)) === 1 && $latestIPs[0] === $ip && $ip != "210.55.213.210") { //210.55.213.210 is Wellington College, many people use this connection
	$spamming = True;
}
else {
	$spamming = False;
}

//Post
if (!empty($text) && !empty($type) && !empty($ip) && !empty($type)) {
	if ($type == "post" && strlen($originaltext) <= 256 && !$spamming) {
		//Auto moderator
		$profanity = '/(\S*fuck\S*|bitch\S*|cum|jizz|pussy|penis|vagina|cock|dick|cunt|porn|p0rn|tits|tities|boob\S*|sex|ballsack|twat\S*|shit\S*)+([^a-z])*/im';
		if (preg_match_all($profanity, $text) || $nsfw == 1) {
			//Submit a post
			if (!empty($email)) {
				$email = mysqli_real_escape_string($con, $email);
				mysqli_query($con,"INSERT INTO posts (post, ip, emails, nsfw, time, attachment)
					VALUES ('$text', '$ip', '$email', 1, '$time', '$attachment')");
			}
			else {
				mysqli_query($con,"INSERT INTO posts (post, ip, nsfw, time, attachment)
					VALUES ('$text', '$ip', 1, '$time', '$attachment')");
			}
		}
		else {
			//Submit a post
			if (!empty($email)) {
				$email = mysqli_real_escape_string($con, $email);
				mysqli_query($con,"INSERT INTO posts (post, ip, emails, time, attachment)
					VALUES ('$text', '$ip', '$email', '$time', '$attachment')");
			}
			else {
				mysqli_query($con,"INSERT INTO posts (post, ip, time, attachment)
					VALUES ('$text', '$ip', '$time', '$attachment')");
			}
		}

		echo "Post Submitted";
	}
	elseif ($type == "comment" && strlen($originaltext) <= 256) {
		//Submit a comment
		$parent = $_GET['id'];
		$parent = mysqli_real_escape_string($con, $parent);
		mysqli_query($con,"INSERT INTO comments (comment, ip, parent, time)
			VALUES ('$text', '$ip', '$parent', '$time')");

		//E-Mail everyone who is subscribed to this post
		$emailquery = $con->query("SELECT `emails` FROM posts WHERE id = '$parent'");
		$emails = explode(",", mysqli_fetch_assoc($emailquery)['emails']);

		foreach ($emails as $address) {
			//Send the email over SMTP
			$from = 'notify@campfyre.org';
			$to = $address;
			$subject = 'New comment on post - Campfyre';
			$body = "<img src='http://robohash.org/".md5($ip).".png?set=set3&size=100x100' /> says:<br /><h3>".str_replace(array("\r\n","\r","\n"), "<br />", $originaltext)."</h3><a href='http://campfyre.org/#".$parent."'>View post on Campfyre.</a>";
			$headers = array(
				'From' => $from,
				'To' => $to,
				'Subject' => $subject,
				'Content-type' => 'text/html'
			);
			$smtp = Mail::factory('smtp', array(
				'host' => 'ssl://box710.bluehost.com', //Change these details to your email server for testing, or just comment this section out
				'port' => '465',
				'auth' => true,
				'username' => 'notify@campfyre.org',
				'password' => $CAMPFYRE_NOTIFY_EMAIL
			));
			$mail = $smtp->send($to, $headers, $body);
			}

		if (!empty($email)) {
			$email = mysqli_real_escape_string($con, $email);
			mysqli_query($con,"UPDATE `posts`
				SET `emails` = IFNULL(CONCAT(`emails`, ',$email'), '$email')
				WHERE `id` = '$parent'");
		}

		echo "Comment Submitted";
	}
	elseif ($spamming) {
		echo "Post not submitted: Woah there! Give someone else a turn to say something.";
	}
	else {
		echo "There was an error submitting your post";
	}
}
else {
	echo "There was an error submitting your post";
}
?>