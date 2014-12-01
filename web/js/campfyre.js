//Setting up variables
var showNSFW = 0;
var tag = "";
var loaded = false;
var page = 1;
var lastPost = 0;
var ws = io('ws://'+window.location.hostname+':3973');
var userID = '';
var currentPageFile = location.pathname.substring(1);

//Display posts when they arrive
ws.on('new post', function(postData) {
	if (currentPageFile != "permalink.html" || $("#posts > section").length < 1) {
		loaded = false;
		postData = JSON.parse(postData);
		var newHTML = '';

		//Handle NSFW posts
		if (showNSFW === 0 && postData.nsfw === 1) {
			return;
		}

		newHTML = newHTML + "<section id="+postData.id+" class='card'>";
		newHTML = newHTML + '<paper-shadow z="3"></paper-shadow>';
			var submitterHash = postData.ip.split("g/")[1].split(".")[0];
			newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+submitterHash+"\")'><img src='"+postData.ip+"' /></a> says...<br></i><a href='permalink.html?id="+postData.id+"'>Permalink</a> | <span data-livestamp="+postData.time+" />";
				
				//Tags
				switch (submitterHash) {
					case "21232f297a57a5a743894a0e4a801fc3":
						newHTML = newHTML + " [admin]";
						break;
					case "5c1055237c524ca98c243b81ba3f9e93":
						newHTML = newHTML + " [Wellington College]";
						break;
				}
				if (postData.nsfw == 1) {
					newHTML = newHTML + " [nsfw]";
				}
			newHTML = newHTML + "</p>";
			newHTML = newHTML + '<h3 id="postText'+postData.id+'" style="text-align: left;">'+emojione.unicodeToImage(postData.post.replace(new RegExp('\r\n','g'), '<br />'))+'</h3>';

			//Attachments
			if (postData.attachment != "n/a") {
				newHTML = newHTML + attach(postData.attachment)+"<br><br>";
			}

			//Stokes and Comments
			newHTML = newHTML + '<span id="stokeBtn'+postData.id+'"><a class="btn" href="javascript:void(0);" onclick="stoke('+postData.id+', '+postData.score+')">Stoke ('+postData.score+')</a></span>';
			newHTML = newHTML + ' <a id="showCommentButton'+postData.id+'" class="btn" href="javascript:void(0);" onclick="showCommentForm('+postData.id+')">Load comments ('+postData.commentNum.split(" ")[0]+')</a>';
			newHTML = newHTML + ' <a style="display: none;" id="hideCommentButton'+postData.id+'" class="btn" href="javascript:void(0);" onclick="hideCommentForm('+postData.id+')">Hide comments</a>';
			newHTML = newHTML + '<div style="display: none;" id="commentForm'+postData.id+'">';
				newHTML = newHTML + '<br><br><form id="commentForm" method="post">';
					newHTML = newHTML + '<input type="hidden" name="type" value="comment">';
					newHTML = newHTML + '<input type="hidden" name="parent" value="'+postData.id+'">';
					newHTML = newHTML + '<textarea id="postText" name="postText" placeholder="Comment text" class="rounded" rows="5" onkeydown="countChar(this, '+postData.id+')" onkeyup="countChar(this, '+postData.id+')" required></textarea>';
					newHTML = newHTML + '<div style="font-family: "Lato", serif;" id="counter'+postData.id+'">256/256</div><br />';
					newHTML = newHTML + '<b>Subscribe to comments:</b><br />';
					newHTML = newHTML + '<input type="text" name="catcher" style="display: none;">';
					newHTML = newHTML + '<input name="email" type="email" class="rounded" placeholder="E-Mail address (optional)"><br />';
					newHTML = newHTML + '<input class="btn" type="submit" name="post" value="Post">';
				newHTML = newHTML + '</form>';
				//Comments have been posted lets show them
				newHTML = newHTML + '<div id="comments'+postData.id+'">';
					for (var i = 0; i < postData.comments.length; ++i) {
						var commenterHash = postData.comments[i].ip.split("g/")[1].split(".")[0];
						newHTML = newHTML + '<hr />';
						newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+commenterHash+"\")'><img src='"+postData.comments[i].ip+"' /></a> says...<br></i><span data-livestamp="+postData.comments[i].time+" />";
						//Tags
						switch (commenterHash) {
							case "21232f297a57a5a743894a0e4a801fc3":
								newHTML = newHTML + " [admin]";
								break;
							case "5c1055237c524ca98c243b81ba3f9e93":
								newHTML = newHTML + " [Wellington College]";
								break;
							case "6285b28b64eb14ba3188048edce3356b":
								newHTML = newHTML + " [developer]";
								break;
						}
						newHTML = newHTML + "</p>";
						newHTML = newHTML + '<h4 id="commentText">'+emojione.unicodeToImage(postData.comments[i].comment.replace(new RegExp('\r?\n','g'), '<br />'))+'</h4>';
					}
				newHTML = newHTML + '</div>';
			newHTML = newHTML + '</div>';
		newHTML = newHTML + "</section>";

		var posts = document.getElementById('posts');
		if (postData.loadBottom) {
			posts.innerHTML = posts.innerHTML + newHTML;
		}
		else {
			posts.innerHTML = newHTML + posts.innerHTML;
		}

		//Submit a comment
		$('#posts').off('submit');
		$('#posts').on('submit','#commentForm',function(e){
			e.preventDefault();
			
			ws.emit('submit comment', JSON.stringify({
				comment: $(this).find('textarea[name="postText"]').val(),
				email: $(this).find('input[name="email"]').val(),
				catcher: $(this).find('input[name="catcher"]').val(),
				parent: $(this).find('input[name="parent"]').val()
			}));

			$(this)[0].reset();
			return false;
		});

		//Link #tags/URLs
		highlighter(postData.id);

		loaded = true;
		$('#loadingMessage').hide();
}
});

ws.on('new comment', function(commentData) {
	var commentData = JSON.parse(commentData);
	var newHTML = '';
	var commenterHash = commentData.ip.split("g/")[1].split(".")[0];
	newHTML = newHTML + '<hr />';
	newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+commenterHash+"\")'><img src='"+commentData.ip+"' /></a> says...<br></i><span data-livestamp="+commentData.time+" />";
	//Tags
	switch (commenterHash) {
		case "21232f297a57a5a743894a0e4a801fc3":
			newHTML = newHTML + " [admin]";
			break;
		case "5c1055237c524ca98c243b81ba3f9e93":
			newHTML = newHTML + " [Wellington College]";
			break;
	}
	newHTML = newHTML + "</p>";
	newHTML = newHTML + '<h4 id="commentText">'+emojione.unicodeToImage(commentData.comment.replace(new RegExp('\r?\n','g'), '<br />'))+'</h4>';

	//Insert the comment
	var comments = document.getElementById('comments'+commentData.parent);
	comments.innerHTML = comments.innerHTML + newHTML;

	//Increment the number on the counter
	var newCommNum = parseInt(+document.getElementById('showCommentButton'+commentData.parent).innerHTML.split('(')[1].split(')')[0])+1;
	document.getElementById('showCommentButton'+commentData.parent).innerHTML = 'Load comments ('+newCommNum+')';
});

//Attachments
function attach(url) {
var attachCode = '';
var URLbits = document.createElement('a');
URLbits.href = url;

//Get hostname
var hostname = URLbits.hostname;
var sitename = hostname.match(/(youtube|youtu.be|imgur.com|sharepic.tk)/i);

//Create attachement code depending on site
if (sitename != null) {
	switch (sitename[0]) {
		case "youtu.be":
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
			attachCode = '<a target="_blank" href="http://i.imgur.com/'+imgid+'.png"><img style="max-height: 30em;" src="http://i.imgur.com/'+imgid+'.png" /></a>';
			break;
		case "sharepic.tk":
			attachCode = '<a target="_blank" href="'+url+'"><img style="max-height: 30em;" src="'+url+'" /></a>';
			break;
		default:
			attachCode = 'Attached URL: <a target="_blank" href="'+url+'">'+url+'</a>';
			break;
	}
}
else {
	attachCode = 'Attached URL: <a target="_blank" href="'+url+'">'+url+'</a>';
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
	'<a target="_blank" href="$1">$1</a>'
);
}

function findLinks(id) {
$('#postText'+id).each(function() {
	$(this).html(linkURLs($(this).html()));
});
};

function highlighter(id) {
findLinks(id);
findHashtags(id);
}

//#YOLOSWAG - thanks to http://stackoverflow.com/questions/4913555/find-twitter-hashtags-using-jquery-and-apply-a-link
hashtag_regexp = /#([a-zA-Z]+)/g;

function linkHashtags(text) {
return text.replace(
	hashtag_regexp,
	'<a href="javascript:void(0);" onclick="runSearch(\'#$1\')">#$1</a>'
);
}

function findHashtags(id) {
$('#postText'+id).each(function() {
	$(this).html(linkHashtags($(this).html()));
});
};

$.urlParam = function(name, url) {
	if (!url) {
	 url = window.location.href;
	}
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
	if (!results) { 
		return undefined;
	}
	return results[1] || undefined;
}

ws.on('success message', function(message) {
	message = JSON.parse(message);
	toastr.success(message.body, message.title);
});

ws.on('error message', function(message) {
	message = JSON.parse(message);
	toastr.warning(message.body, message.title);
});

ws.on('post stoked', function(params) {
	params = JSON.parse(params);
	$('#stokeBtn'+params.id).html('<a id="stokeBtn'+params.id+'" class="btn" href="javascript:void();" onclick="stoke('+params.id+')">Stoke ('+params.score+')</a>');
});

ws.on('show nsfw', function() {
	if (showNSFW !== 1) refresh(1);
});

ws.on('score result', function(params) {
	params = JSON.parse(params);
	var title = document.getElementById('searchTitle');
	title.innerHTML = title.innerHTML + '<h2>Stokes: '+params.score+'</h2>';
});

function stoke(postID) {
	ws.emit('stoke', JSON.stringify({
		id: postID
	}));
}

function runSearch(searchQuery) {
	//Re-arange the site
	tag = searchQuery;
	$('#submit').hide();
	$('#searchTitle').html('<h2>Results for: '+tag+'</h2>');
	$('#goBack').show();
	$('#posts').html('');
	$('#loadingMessage').show();

	page = 1;
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		user: userID,
		reverse: true
	}));
}

function exitSearch() {
	tag = '';
	userID = '';
	$('#submit').show();
	$('#searchTitle').html('');
	$('#goBack').hide();
	$('#loadingMessage').show();

	$('#posts').html('');
	page = 1;
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		user: userID,
		reverse: true
	}));
}

function loadUserPage(id) {
	tag = ''
	userID = id.split("/")[0];
	$('#submit').hide();
	$('#searchTitle').html('<h2>Viewing posts from <img src="http://robohash.org/'+userID+'.png?set=set3&size=64x64"/></h2>');
	$('#goBack').show();
	$('#posts').html('');
	$('#loadingMessage').show();

	ws.emit('get total score', JSON.stringify({
		id: userID
	}));

	page = 1;
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		user: userID,
		reverse: true
	}));
}

function loadMore() {
	$('#loadingMessage').show();
	page += 1;
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		reverse: true,
		user: userID
	}));
}

$(document).ready(function() {
	$('#submit').popup({
		transition: 'all 0.3s'
	});

	$('#closeSubmitPopup').click(function() {
		console.log('close');
		$('#submit').popup('hide');
	});
});