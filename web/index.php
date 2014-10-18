<?php
//Get posts + post data from the API
function getPosts($con, $startingPost) {
	$ch = curl_init();
	$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]/api/getpostsV2.php?size=64x64&startingPost=$startingPost";
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	$result = curl_exec($ch);
	print_r($result);
}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Campfyre</title>
		<link rel="icon" type="image/x-icon" href="favicon.ico">
		<meta name="description" content="256 characters. No login required. Have fun.">
		<meta name="author" content="Etheral Studios">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<link rel="stylesheet" type="text/css" href="lato.css">
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/2.3.2/css/bootstrap.min.css">

		<style>
			body {
				background-image: url(img/bg.png);
			}
			#centre {
				text-align: center;
			}
			h1 {
				font-family: 'Lato', serif;
				font-weight:900;
				font-size: 4em;
				color: #fa6900;
				padding-right: 20px;
			}
			h2 {
				text-align: center;
				padding-right: 20px;
				font-weight:100;
				font-family: 'Lato', serif;
				padding-left: 10px;
			}
			h3 {
				padding-right: 20px;
				font-weight:100;
				font-family: 'Lato', serif;
				padding-left: 10px;
			}

			h4 {
				padding-right: 20px;
				font-weight:100;
				font-family: 'Lato', serif;
				padding-left: 10px;
			}

			/* Mobile */
			@media (max-width: 960px) {
				.card {
					padding:1rem;
					box-shadow:0 1px 2px #aaa;
					background:white;
					margin:0 1rem 1rem;
					border-radius:3px;
					width: 80%;
					margin-left:auto;
					margin-right:auto;
					word-wrap: break-word;
				}
			}
			/* Widescreen */
			@media (min-width: 960px) {
				.card {
					padding:1rem;
					box-shadow:0 1px 2px #aaa;
					background:white;
					margin:0 1rem 1rem;
					border-radius:3px;
					width: 50%;
					margin-left:auto;
					margin-right:auto;
					word-wrap: break-word;
				}
			}

			#ip {
				font-family: 'Lato', serif;
			}
			p {
				font-family: 'Lato', serif;
			}
			a:link {
				color: #5C5858;
				text-decoration: none;
			}
			a:visited {
				color: #5C5858;
				text-decoration: none;
			}
			a:hover {
				color: black;
				text-decoration: underline;
			}
			a:active {
				color: black;
				text-decoration: underline;
			}
			#postText {
				width: 95%;
				height: auto;
			}
			.campaigns {
				text-align: center;
			}
			#search {
				margin-left: 15px;
				margin-top: 15px;
			}
		</style>

		<script src="http://code.jquery.com/jquery-1.5.js"></script>
		<script>
			//Attachments
			function attach(url) {
				var attachCode = '';
				var URLbits = document.createElement('a');
				URLbits.href = url;

				//Get hostname
				var hostname = URLbits.hostname;
				var sitename = hostname.match(/(youtube|imgur.com|sharepic.tk)/i);
				
				//Create attachement code depending on site
				switch (sitename[0]) {
					case "youtube":
						//Thanks to http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
						var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
						var match = url.match(regExp);
						var videoid = match[2];

						var width = '95%';
						var height = '420';
						attachCode = '<br /><object width="'+width+'" height="'+height+'"><param name="movie" value="http://www.youtube.com/v/'+videoid+'&amp;hl=en_US&amp;fs=1?rel=0"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+videoid+'&amp;hl=en_US&amp;fs=1?rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="'+width+'" height="'+height+'"></embed></object>';
						break;
					case "imgur.com":
						var imgid = url.split("/");
						imgid = imgid[imgid.length-1];
						imgid = imgid.split(".");
						imgid = imgid[0];
						attachCode = '<a target="_blank" href="http://i.imgur.com/'+imgid+'.png"><img style="max-height: 35%;" src="http://i.imgur.com/'+imgid+'.png" /></a>';
						break;
					case "sharepic.tk":
						attachCode = '<a target="_blank" href="'+url+'"><img style="max-height: 35%;" src="'+url+'" /></a>';
						break;
					default:
						attachCode = 'Attached URL: <a target="_blank" href="'+url+'">'+url+'</a>';
						break;
				}

				return attachCode;
			}

			//Character counter
			function countChar(val, id) {
				var counterDiv = "#counter"+id
				var len = val.value.length;
				if (len >= 256) {
					$(counterDiv).text("0/256");
					val.value = val.value.substring(0, 256);
				} else {
					$(counterDiv).text(256 - len+"/256");
				}
			};

			//Comment form
			function showCommentForm(id) {
				divToShow = "commentForm"+id;
				//Show the comments div
				document.getElementById(divToShow).style.display = 'inline';

				//Hide the show button
				document.getElementById("showCommentButton"+id).style.display = "none";
				document.getElementById("hideCommentButton"+id).style.display = "";
			}

			//Hide the comments
			function hideCommentForm(id) {
				divToHide = "commentForm"+id;
				//Hide the comments div
				document.getElementById(divToShow).style.display = 'none';

				//Show the show button
				document.getElementById("showCommentButton"+id).style.display = "";
				document.getElementById("hideCommentButton"+id).style.display = "none";
			}

			//Auto links
			var url_regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
			function linkURLs(text) {
				return text.replace(
					url_regex,
					'<a href="$1">$1</a>'
				);
			}

			$(document).ready(function(){
				$('h3').each(function() {
					$(this).html(linkURLs($(this).html()));
				});
			});

			//#YOLOSWAG - thanks to http://stackoverflow.com/questions/4913555/find-twitter-hashtags-using-jquery-and-apply-a-link
			hashtag_regexp = /#([a-zA-Z]+)/g;

			function linkHashtags(text) {
				return text.replace(
					hashtag_regexp,
					'<a href="search.php?tag=%23$1">#$1</a>'
				);
			}

			$(document).ready(function(){
				$('h3').each(function() {
					$(this).html(linkHashtags($(this).html()));
				});
			});

			/*/You can have your damn ~tags
			tildetag_regexp = /~([a-zA-Z]+)/g;

			function linkTildetags(text) {
				return text.replace(
					tildetag_regexp,
					'<a href="search.php?tag=%7E$1">~$1</a>'
				);
			}

			$(document).ready(function(){
				$('h3').each(function() {
					$(this).html(linkTildetags($(this).html()));
				});
			});*/
		</script>
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-8931238-13', 'auto');
		  ga('send', 'pageview');
		</script>
	</head>
	<body>
		<div id="search" class="input-append">
			<form action="search.php" method="get">
				<input name="tag" type="text" class="rounded" placeholder="#hashtag" required />
				<input class="btn" type="submit" name="search" value="Search">
			</form>
		</div>

		<?php
			if (isset($_GET['m'])) {
				//Error messages
				switch ($_GET['m']) {
					case 'spamming':
						$errorMsg = "Woah there! Give someone else a turn to say something.";
						break;
					case 'tooLong':
						$errorMsg = "Your post/comment is longer than 256 characters.";
						break;
					case 'noPost':
						$errorMsg = "No text was sent to be posted.";
						break;
				}
		?>
				<section id="message" class="card">
				<i><h2>Post not submitted: <?php echo $errorMsg; ?></h2></i>
				</section>
		<?php } ?>

		<div id="centre">
			<h1>Campfyre</h1>
			<h2>256 characters.</h2>
			<h2>No login required.</h2>
			<h2>Have fun.</h2>
		</div>

		<div class="campaigns">
		<a href="https://play.google.com/store/apps/details?id=nz.co.nickwebster.campfyre">
		  <img style="height: 45px; width: auto;" alt="Android app on Google Play" src="http://developer.android.com/images/brand/en_app_rgb_wo_60.png" />
		</a>

		<br /><br /><div id="donate">
			<script src="http://coinwidget.com/widget/coin.js"></script>
			<script>
			CoinWidgetCom.go({
				wallet_address: "17F8D5ZjfPu94ndWQbjhLCgaxgtPWMk5Kb"
				, currency: "bitcoin"
				, counter: "count"
				, alignment: "bl"
				, qrcode: true
				, auto_show: false
				, lbl_button: "Donate"
				, lbl_address: "Bitcoin Address:"
				, lbl_count: "donations"
				, lbl_amount: "Bitcoins"
			});
			</script>
		</div></div><br />

		<!-- Submit -->
		<section id="submit" class="card">
			<h2 style="text-align: left;">Write a post</h2>
			<!--
			<form action="submitV2.php" method="post">
				<input type="hidden" name="type" value="post">
				<textarea id="postText" name="postText" placeholder="Post text" class="rounded" rows="5" onkeydown="countChar(this, -1)" onkeyup="countChar(this, -1)" required></textarea>
				<div style="font-family: 'Lato', serif;" id="counter-1">256/256</div>
				<input type="url" name="attachment" class="rounded" placeholder="Link to image/video (optional)">
				<div class="checkbox">
					<label>
						<input name="nsfw" value="1" type="checkbox"> This post is Offensive/NSFW
					</label>
				  </div><br />
				<b>Subscribe to comments:</b><br />
				<input name="email" type="email" class="rounded" placeholder="E-Mail address (optional)"><br />
				<input class="btn" type="submit" name="post" value="Post"> <a href="rules.html">Read the rules</a> | <a href="formatting.html">Formatting</a>
			</form>
			-->
			<!-- I hate spammers. Thanks to http://hivelogic.com for this -->
			<script type="text/javascript">
			//<![CDATA[
			<!--
			var x="function f(x){var i,o=\"\",l=x.length;for(i=0;i<l;i+=2) {if(i+1<l)o+=" +
			"x.charAt(i+1);try{o+=x.charAt(i);}catch(e){}}return o;}f(\"ufcnitnof x({)av" +
			" r,i=o\\\"\\\"o,=l.xelgnhtl,o=;lhwli(e.xhcraoCedtAl(1/)3=!35{)rt{y+xx=l;=+;" +
			"lc}tahce({)}}of(r=i-l;1>i0=i;--{)+ox=c.ahAr(t)i};erutnro s.buts(r,0lo;)f}\\" +
			"\"(7),6\\\"\\\\qy6{02\\\\\\\\34\\\\03\\\\00\\\\\\\\IQ_U27\\\\03\\\\01\\\\\\" +
			"\\iBo@mFs^\\\\\\\\\\\\\\\\2q02\\\\\\\\5J00\\\\\\\\25\\\\0O\\\\OIPQOBOS Y@?w" +
			"wpmq9}{fg}pa}.k7Wmonue%\\\\?\\\\\\\"}\\\\@ 34\\\\0S\\\\tG\\\\\\\\34\\\\04\\" +
			"\\02\\\\\\\\02\\\\04\\\\00\\\\\\\\1U02\\\\\\\\33\\\\06\\\\00\\\\\\\\4Q02\\\\"+
			"\\\\16\\\\03\\\\01\\\\\\\\R?6I05\\\\05\\\\00\\\\\\\\23\\\\06\\\\01\\\\\\\\7" +
			"K02\\\\\\\\06\\\\06\\\\01\\\\\\\\24\\\\02\\\\02\\\\\\\\2}00\\\\\\\\:`(>x1j6" +
			"ju6q01\\\\\\\\#%6 03\\\\\\\\0o02\\\\\\\\/v$<0&fe37\\\\06\\\\/24O03\\\\\\\\1" +
			"a00\\\\\\\\W^VX27\\\\04\\\\02\\\\\\\\@i_ZES\\\\\\\\\\\\\\\\14\\\\0q\\\\21\\" +
			"\\0N\\\\PZ\\\\\\\\\\\\\\\\07\\\\04\\\\00\\\\\\\\Jy@W03\\\\0|\\\\\\\"\\\\\\\\"+
			"\\\\nmw}9ybl{f/}MfSdQzWxUd[z*8q$=`\\\\>\\\\\\\\!\\\\7U02\\\\\\\\33\\\\07\\\\"+
			"02\\\\\\\\27\\\\06\\\\03\\\\\\\\02\\\\05\\\\00\\\\\\\\33\\\\0[\\\\2R00\\\\\\"+
			"\\03\\\\0n\\\\\\\\\\\\34\\\\0t\\\\\\\\\\\\10\\\\0n\\\\\\\\\\\\5J00\\\\\\\\0" +
			"1\\\\06\\\\00\\\\\\\\H+A!\\\\>\\\\\\\\2\\\\02\\\\\\\\::31?39:&;vu17\\\\06\\" +
			"\\44;!\\\"\\\\\\\\\\\\i>26\\\\0t\\\\4;)'c'5`03\\\\\\\\V,P_1Y03\\\\\\\\4f00\\"+
			"\\\\\\G]AO24\\\\01\\\\02\\\\\\\\]nNYHC16\\\\0w\\\\27\\\\0L\\\\FE5H00\\\\\\\\"+
			"VPOR#IAjGhEnKlIxOf>,}01li25%t2krnano^c22\\\\00\\\\01\\\\\\\\7[03\\\\\\\\33\\"+
			"\\01\\\\02\\\\\\\\05\\\\05\\\\02\\\\\\\\06\\\\06\\\\02\\\\\\\\06\\\\0!\\\\2" +
			"O02\\\\\\\\2S03\\\\\\\\0103\\\\\\\\6703\\\\\\\\4503\\\\\\\\0;01\\\\\\\\6902" +
			"\\\\\\\\\\\\?\\\\\\\\N\\\\-@a<-b=3kwuv7 01\\\\\\\\r&\\\\\\\\3$02\\\\\\\\1:0" +
			"2\\\\\\\\\\\"\\\\\\\\\\\\27\\\\08\\\\25\\\\0v\\\\#+%'m/4}JcHaNgLeXkFieocw1a" +
			"00\\\\\\\\ZHYBMG@A4j00\\\\\\\\KP01\\\\0T\\\\ql<mshLq(7H7}k{skloeV)m47w17\\\\"+
			"\\\\$q^!\\\\0\\\\\\\"\\\\\\\\\\\\\\\"@\\\\31\\\\06\\\\01\\\\\\\\26\\\\00\\\\"+
			"03\\\\\\\\16\\\\0W\\\\)T03\\\\05\\\\02\\\\\\\\01\\\\07\\\\03\\\\\\\\3R0S01\\"+
			"\\\\\\01\\\\0n\\\\\\\\\\\\04\\\\0I\\\\34\\\\02\\\\02\\\\\\\\26\\\\03\\\\01\\"+
			"\\\\\\\\\\r_\\\\26\\\\0=\\\\24\\\\03\\\\00\\\\\\\\1*00\\\\\\\\7(00\\\\\\\\5" +
			".00\\\\\\\\3,01\\\\\\\\t8\\\\\\\\7&01\\\\\\\\=l-5!/?p26\\\\0=\\\\24\\\\03\\" +
			"\\32\\\\01\\\\30\\\\07\\\\36\\\\0/\\\\34\\\\0M\\\\3b00\\\\\\\\36\\\\0g\\\\V" +
			"B\\\\Z\\\\\\\\U\\\\\\\\P\\\\\\\\P\\\\20\\\\0m\\\\\\\\r\\\\\\\\\\\\\\\\]\\\\" +
			"@LnH\\\\\\\\A_2C03\\\\\\\\xQ~W|UBk@sFi:'?Kuy}}dx77\\\\1a\\\\,%odam)qc`ob h2" +
			"1\\\\0t\\\\\\\\\\\\\\\\\\\\\\\\\\\\20\\\\04\\\\02\\\\\\\\20\\\\04\\\\*U6H00" +
			"\\\\\\\\26\\\\06\\\\02\\\\\\\\35\\\\07\\\\03\\\\\\\\07\\\\03\\\\01\\\\\\\\1" +
			"6\\\\0r\\\\\\\\\\\\07\\\\02\\\\03\\\\\\\\JI2;00\\\\\\\\00\\\\00\\\\00\\\\\\" +
			"\\\\\\r7\\\\02\\\\\\\\16\\\\02\\\\02\\\\\\\\2}00\\\\\\\\/`;(;5tw\\\\t \\\\7" +
			"=8</,89h*25\\\\0u\\\\\\\"\\\\\\\\\\\\$+c*5`03\\\\\\\\M,7K03\\\\\\\\6`00\\\\" +
			"\\\\I_CA26\\\\0A\\\\CA\\\\\\\\\\\\\\\\4X01\\\\\\\\r[pYv_t]zIxW35\\\\0T\\\\D" +
			"H\\\\0\\\\\\\"+\\\\))/5%-7(\\\\H\\\\\\\"?\\\\uc`{cx(h5Uoc&%9_ig14\\\\00\\\\" +
			"03\\\\\\\\17\\\\0[\\\\^V27\\\\03\\\\00\\\\\\\\27\\\\09\\\\SS0H01\\\\\\\\34\\"+
			"\\06\\\\00\\\\\\\\03\\\\04\\\\01\\\\\\\\\\\\nF\\\\36\\\\07\\\\00\\\\\\\\07\\"+
			"\\01\\\\00\\\\\\\\9D6Y00\\\\\\\\16\\\\00\\\\03\\\\\\\\24\\\\0,\\\\+~?5-f04\\"+
			"\\0#\\\\\\\\n!\\\\10\\\\0'\\\\16\\\\0?\\\\14\\\\0=\\\\22\\\\0s\\\\.-(8?<1#7" +
			"k17\\\\\\\\%|M%HW^M1H03\\\\\\\\32\\\\0k\\\\37\\\\04\\\\00\\\\\\\\31\\\\03\\" +
			"\\02\\\\\\\\36\\\\0B\\\\GY5Z00\\\\\\\\J^jB\\\\\\\\\\\\\\\\SIGJ01\\\\0~\\\\3" +
			"4\\\\0P\\\\gjwxuu:9?K9$>3ybzg~%bj|Jsigj^!n<\\\\t2\\\\02\\\\\\\\30\\\\02\\\\" +
			"00\\\\\\\\37\\\\02\\\\02\\\\\\\\26\\\\00\\\\03\\\\\\\\WVF(-P4M03\\\\\\\\31\\"+
			"\\02\\\\00\\\\\\\\36\\\\0K\\\\5H14\\\\02\\\\00\\\\\\\\02\\\\03\\\\01\\\\\\\\"+
			"21\\\\04\\\\01\\\\\\\\20\\\\0C\\\\b<.-7=y93z01\\\\\\\\\\\"\\\\\\\\\\\\1-r'#" +
			"%6 03\\\\\\\\0o02\\\\\\\\8v,,)+!-# 0-37\\\\04\\\\03\\\\\\\\Ha_CLmYD6E02\\\\" +
			"\\\\7o01\\\\\\\\]T@N\\\\r6\\\\01\\\\\\\\^wMQRsKV0S00\\\\\\\\5}03\\\\\\\\w{}" +
			"=h~lxso(aNgLeR{PyVeT{$9pYmp\\\\q\\\\\\\"\\\\\\\\\\\\\\\"@\\\\31\\\\06\\\\01" +
			"\\\\\\\\26\\\\00\\\\03\\\\\\\\16\\\\0W\\\\)T21\\\\03\\\\00\\\\\\\\13\\\\05\\"+
			"\\00\\\\\\\\3R0S01\\\\\\\\01\\\\0n\\\\\\\\\\\\04\\\\0I\\\\;J10\\\\00\\\\00\\"+
			"\\\\\\00\\\\07\\\\00\\\\\\\\13\\\\0t\\\\\\\\\\\\3B00\\\\\\\\8c\\\\,\\\\\\\"" +
			".\\\\,y\\\"\\\\\\\\\\\\;&o=r&\\\\\\\\3$02\\\\\\\\1:02\\\\\\\\7802\\\\\\\\Z$" +
			"Xw =t]\\\\r2\\\\02\\\\\\\\14\\\\0Y\\\\D&34\\\\00\\\\03\\\\\\\\36\\\\01\\\\0" +
			"0\\\\\\\\21\\\\06\\\\03\\\\\\\\SR7,03\\\\\\\\06\\\\05\\\\03\\\\\\\\YB5<03\\" +
			"\\\\\\01\\\\0n\\\\\\\\\\\\04\\\\00\\\\02\\\\\\\\27\\\\0A\\\\\\\\>\\\\\\\\6\\"+
			"\\01\\\\\\\\70?)z:*408vi<{5=';;?>e-'3*+&\\\\'(\\\"}fo;n uret}r);+)y+^(i)t(e" +
			"AodrCha.c(xdeCoarChomfrg.intr=So+7;12%=;y=iy+7)=6i=f({i+)i+l;i<0;i=r(foh;gt" +
			"en.l=x,l\\\"\\\\\\\"\\\\o=i,r va){,y(x fontincfu)\\\"\")"                    ;
			while(x=eval(x));
			//-->
			//]]>
			</script>
		</section>

		<hr />

		<!-- Posts -->
		<script>
			function displayPosts(postJSON) {
				for (var i = 0; i < postJSON.length; ++i) {
					document.write("<section id="+postJSON[i]['id']+" class='card'>");
						document.write("<p><i id='ip'><img src='"+postJSON[i]['pic']+"' /> says...<br></i><a href='?show=1#"+postJSON[i]['id']+"'>Permalink</a> | "+postJSON[i]['time']);
							
							//Tags
							switch (postJSON[i]['pic']) {
								case "http://robohash.org/21232f297a57a5a743894a0e4a801fc3.png?set=set3&size=64x64":
									document.write(" [admin]");
									break;
								case "http://robohash.org/5c1055237c524ca98c243b81ba3f9e93.png?set=set3&size=64x64":
									document.write(" [Wellington College]");
									break;
							}
							if (postJSON[i]['nsfw'] == 1) {
								document.write(" [nsfw]");
							}
						document.write("</p>");
						document.write('<h3 style="text-align: left;">'+postJSON[i]['post']+'</h3>');

						//Attachments
						if (postJSON[i]['attachment'] != "n/a") {
							document.write(attach(postJSON[i]['attachment'])+"<br><br>");
						}

						//Stokes and Comments
						document.write('<a class="btn" href="api/stoke.php?type=post&id='+postJSON[i]['id']+'">Stoke ('+postJSON[i]['score']+')</a>')
						document.write(' <a id="showCommentButton'+postJSON[i]['id']+'" class="btn" href="javascript:void(0)" onclick="showCommentForm('+postJSON[i]['id']+')">Load comments ('+postJSON[i]['commentNum'].split(" ")[0]+')</a>');
						document.write(' <a style="display: none;" id="hideCommentButton'+postJSON[i]['id']+'" class="btn" href="javascript:void(0)" onclick="hideCommentForm('+postJSON[i]['id']+')">Hide comments</a>');
						document.write('<div style="display: none;" id="commentForm'+postJSON[i]['id']+'">');
							document.write('<br><br><form action="submitV2.php" method="post">');
								document.write('<input type="hidden" name="type" value="comment">');
								document.write('<input type="hidden" name="id" value="'+postJSON[i]['id']+'">');
								document.write('<textarea id="postText" name="postText" placeholder="Comment text" class="rounded" rows="5" onkeydown="countChar(this, '+postJSON[i]['id']+')" onkeyup="countChar(this, '+postJSON[i]['id']+')" required></textarea>');
								document.write('<div style="font-family: "Lato", serif;" id="counter'+postJSON[i]['id']+'">256/256</div><br />');
								document.write('<b>Subscribe to comments:</b><br />');
								document.write('<input name="email" type="email" class="rounded" placeholder="E-Mail address (optional)"><br />');
								document.write('<input class="btn" type="submit" name="post" value="Post">');
							document.write('</form>');
							if (postJSON[i]['commentNum'].split(" ")[0] > 0) {
								//Comments have been posted lets show them
								//TODO: var commentJSON = <?php getComments($con); ?>
							}
						document.write('</div>');
					document.write("</section>");
				}
			}

			//Display the posts
			displayPosts(<?php getPosts($con, 0); ?>);
		</script>

		<?php
		/*$tag = "#bonfyre";
		if (!isset($_GET['hide'])) {
			$posts = $con->query("SELECT * FROM posts WHERE `post` NOT LIKE '%$tag%' ORDER BY id DESC LIMIT 50");
		}
		elseif (isset($_GET['show']) && $_GET['show'] == "1") {
			$posts = $con->query("SELECT * FROM posts WHERE `post` NOT LIKE '%$tag%' ORDER BY id DESC");
		}

		$postloop = 0;
		foreach ($posts as $post) {
			$postloop += 1;
			//Get the comments for this post from the database
			$id = $post['id'];
			if (!isset($_GET['show'])) {
				$comments = $con->query("SELECT * FROM comments WHERE parent = '$id' ORDER BY id ASC LIMIT 50");
			}
			elseif (isset($_GET['show']) && $_GET['show'] == "1") {
				$comments = $con->query("SELECT * FROM comments WHERE parent = '$id' ORDER BY id ASC");
			}?>
			<section id="<?php echo $post['id']; ?>" class="card">
				<p><i id="ip"><?php echo "<img src='http://robohash.org/".md5($post['ip']).".png?set=set3&size=64x64' /> says...<br />"; ?></i><a href="?show=1#<?php echo $post['id']; ?>">Permalink</a> | <?php echo relativeTime($post['time']); if ($post['ip'] == "admin") { echo " [admin]"; } if ($post['nsfw'] == 1) { echo " [nsfw]"; } ?> <?php if ($post['ip'] == "210.55.213.210") { echo " [Wellington College]"; } ?></p>
				<h3 style="text-align: left;"><?php if ($post['nsfw'] == 1 && !isset($_GET['nsfw']) && !isset($_GET['show'])) { echo "<i>This post is possibly offensive. <a href='?nsfw=1#".$post['id']."'>Click here</a> to view possibly offensive posts.</i>"; } elseif($post['nsfw'] == 1 && !isset($_GET['nsfw']) && isset($_GET['show'])) { echo "<i>This post is possibly offensive. <a href='?show=1&nsfw=1#".$post['id']."'>Click here</a> to view possibly offensive posts.</i>"; } else { echo "<h3 class='postText'>".str_replace("\n", "<br />", $post['post'])."</h3>"; } ?></h3>
				<?php echo attachmentDisplay($post['attachment'], $post['nsfw']); ?><?php if ($post['attachment'] != "n/a") { ?><br /><br /><?php } ?>
				<a class="btn" href="api/stoke.php?type=post&id=<?php echo $post['id']; ?>">Stoke (<?php echo $post['score']; ?>)</a>
				<a id="showCommentButton<?php echo $post['id']; ?>" class="btn" href="javascript:void(0)" onclick="showCommentForm(<?php echo $post['id']; ?>)">Load comments (<?php echo mysqli_num_rows($comments); ?>)</a>
				<a style="display: none;" id="hideCommentButton<?php echo $post['id']; ?>" class="btn" href="javascript:void(0)" onclick="hideCommentForm(<?php echo $post['id']; ?>)">Hide comments</a>
				<div style="display: none;" id="commentForm<?php echo $post['id']; ?>">
					<br /><br />
					<form action="submitV2.php" method="post">
						<input type="hidden" name="type" value="comment">
						<input type="hidden" name="id" value="<?php echo $post['id']; ?>">
						<textarea id="postText" name="postText" placeholder="Comment text" class="rounded" rows="5" onkeydown="countChar(this, <?php echo $post['id']; ?>)" onkeyup="countChar(this, <?php echo $post['id']; ?>)" required></textarea>
						<div style="font-family: 'Lato', serif;" id="counter<?php echo $post['id']; ?>">256/256</div><br />
						<b>Subscribe to comments:</b><br />
						<input name="email" type="email" class="rounded" placeholder="E-Mail address (optional)"><br />
						<input class="btn" type="submit" name="post" value="Post">
					</form>

				<?php
				//Comments
				if (mysqli_num_rows($comments) > 0) { ?>
					<hr />
					<?php
					$loop = 0;
					foreach ($comments as $comment) { 
						$loop += 1; ?>
						<p><i id="ip"><?php echo "<img src='http://robohash.org/".md5($comment['ip']).".png?set=set3&size=64x64' /> says...<br />"; ?></i><?php echo relativeTime($comment['time']); ?></p>
						<h4 id="commentText"><?php echo str_replace("\n", "<br />", $comment['comment']); ?></h4>
						<?php if ($loop != mysqli_num_rows($comments)) { ?>
							<hr />
						<?php } ?>
					<?php } ?>
				<?php } ?>
				</div>
			</section>
		<?php }*/ ?>
		<?php
		if (!isset($_GET['show'])) {
			echo "<p style='text-align: right;'><a href='?show=1'>Show all posts and comments</a></p>";
		}
		?>
		<p style='text-align: right;'>Written and run by <a href="http://nickwebster.co.nz">Nick Webster</a></p>
	</body>
</html>