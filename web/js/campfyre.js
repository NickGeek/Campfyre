//Setting up variables
var tag = "";
var loaded = false;
var page = 1;
var lastPost = 0;
var ws = io('ws://'+window.location.hostname+':3973');
var userID = '';
var currentPageFile = location.pathname.substring(1);
var topics = ['clamminess', 'Nick', 'Bitcoin', 'your mum', 'homework', 'procrastination', 'tautology', 'anything', 'spiderman', 'The Doctor', '&#26085;&#26412;', 'a = &Delta;v/&Delta;t', 'The Sims', 'CHIM', 'life', 'stuff', 'the weather', 'python', 'COBOL', 'campfires', 'Google Buzz', 'emoji', 'Totoro', 'Constantine', 'ideas', 'GitHub', 'Android', 'iOS', 'GNU/Linux', 'Arch Linux', 'Ubuntu', 'xkcd', 'tents', 'creeps', 'corn crisps', '#rebellion', 'Briggleybear', 'Dragonborns', 'wabbajacks', '&#3232;_&#3232;', 'ISIL/ISIS', 'women', 'men', 'Google', 'Apple', 'apples', 'kiwifruit'];

//NSFW posts
if (store.get('showNSFW')) {
	var showNSFW = store.get('showNSFW');
}
else {
	store.set('showNSFW', 0);
	var showNSFW = store.get('showNSFW');
}

//Display posts when they arrive
ws.on('new post', function(postData) {
	if (currentPageFile != "permalink.html" || $("#posts > section").length < 1) {
		loaded = false;
		postData = JSON.parse(postData);
		// if (tag.length > 0) {
		// 	var tagRegex = new RegExp("((^|\s)("+tag+"+?)(?=[\s.,:,!,?,<>,]|$))", "gmi")
		// 	if (postData.post.match(tagRegex) == null) {
		// 		return;
		// 	}
		// 	else {
		// 		console.log(postData.post.match(tagRegex));
		// 	}
		// }
		var newHTML = '';

		//Handle NSFW posts
		if (showNSFW === 0 && postData.nsfw === 1) {
			return;
		}

		newHTML = newHTML + "<section id="+postData.id+" class='card'>";
			var submitterHash = postData.ip.split("g/")[1].split(".")[0];
			newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+submitterHash+"\")'><img src='"+postData.ip+"' /></a> says...<br></i><a href='permalink.html?id="+postData.id+"'>Permalink</a> | <span data-livestamp="+postData.time+"></span>";
				
				//Tags
				switch (submitterHash) {
					case "324411d31d789ba374008ab7960dfa2f":
						newHTML = newHTML + " [admin]";
						break;
				}
				if (postData.nsfw == 1) {
					newHTML = newHTML + " [nsfw]";
				}
			newHTML = newHTML + "</p>";
			newHTML = newHTML + '<h3 id="postText'+postData.id+'" style="text-align: left;">'+postData.post.replace(new RegExp('\n','g'), '<br />')+'</h3>';

			//Attachments
			if (postData.attachment != "n/a") {
				newHTML = newHTML + attach(postData.attachment)+"<br><br>";
			}

			//Stokes and Comments
			newHTML = newHTML + '<span id="stokeBtn'+postData.id+'"><a class="btn" href="javascript:void(0);" onclick="stoke('+postData.id+', '+postData.score+')">Stoke ('+postData.score+')</a></span>';
			newHTML = newHTML + ' <a id="showCommentButton'+postData.id+'" class="btn" href="javascript:void(0);" onclick="showCommentForm('+postData.id+')">Load comments ('+postData.commentNum.split(" ")[0]+')</a>';
			newHTML = newHTML + ' <a style="display: none;" id="hideCommentButton'+postData.id+'" class="btn" href="javascript:void(0);" onclick="hideCommentForm('+postData.id+')">Hide comments</a>';
			if (!postData.subscribed) {
				newHTML = newHTML + ' <span id="subscribeBtn'+postData.id+'"><a class="btn" href="javascript:void(0);" onclick="subscribe('+postData.id+', true)">Subscribe to new comments</a></span>';
			}
			else {
				newHTML = newHTML + ' <span id="subscribeBtn'+postData.id+'"><a class="btn" href="javascript:void(0);" onclick="subscribe('+postData.id+', false)">Unsubscribe to new comments</a></span>';
			}
			newHTML = newHTML + '<div style="display: none;" id="commentForm'+postData.id+'">';
				newHTML = newHTML + '<br><br><form id="commentForm" method="post">';
					newHTML = newHTML + '<input type="hidden" name="type" value="comment">';
					newHTML = newHTML + '<input type="hidden" name="parent" value="'+postData.id+'">';
					newHTML = newHTML + '<textarea id="postText" name="postText" placeholder="Comment text" class="rounded" rows="5" onkeydown="countChar(this, '+postData.id+')" onkeyup="countChar(this, '+postData.id+')" required></textarea>';
					newHTML = newHTML + '<div style="font-family: "Lato", serif;" id="counter'+postData.id+'">256/256</div><br />';
					newHTML = newHTML + '<input type="text" name="catcher" style="display: none;">';
					newHTML = newHTML + '<input class="btn" type="submit" name="post" value="Post">';
				newHTML = newHTML + '</form>';
				newHTML = newHTML + '<a id="goBackCommentBtn'+postData.id+'" style="display: none;" href="javascript:void(0);" onclick="exitThread('+postData.id+');"><< Go Back</a>';
				//Comments have been posted lets show them
				newHTML = newHTML + '<div id="comments'+postData.id+'">';
					for (var i = 0; i < postData.comments.length; ++i) {
						var commenterHash = postData.comments[i].ip.split("g/")[1].split(".")[0];
						newHTML = newHTML + '<div style="padding-left: 0px;" id="comment'+postData.comments[i].id+'">';
						newHTML = newHTML + '<hr />';
						newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+commenterHash+"\")'><img src='"+postData.comments[i].ip+"' /></a> says...<br></i><span data-livestamp="+postData.comments[i].time+" />";
						//Tags
						switch (commenterHash) {
							case "324411d31d789ba374008ab7960dfa2f":
								newHTML = newHTML + " [admin]";
								break;
						}
						newHTML = newHTML + "</p>";
						newHTML = newHTML + '<h4 id="commentText">'+postData.comments[i].comment.replace(new RegExp('\r?\n','g'), '<br />')+'</h4>';
						newHTML = newHTML + '<button class="btn" onclick="replyToComment('+postData.id+', '+postData.comments[i].id+');">Reply</button>';
						newHTML = newHTML + ' <button style="display: none;" id="continueThreadBtn'+postData.comments[i].id+'" class="btn" onclick="loadCommentThread('+postData.comments[i].id+', '+postData.id+');">Continue thread >></button>'
						newHTML = newHTML + '<div style="padding-left: 20px;" id="replies'+postData.comments[i].id+'">';
						newHTML = newHTML + '</div>';
						newHTML = newHTML + '</div>';
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
		$('#posts').on('submit','#commentForm',function(e) {
			e.preventDefault();
			
			ws.emit('submit comment', JSON.stringify({
				comment: $(this).find('textarea[name="postText"]').val(),
				catcher: $(this).find('input[name="catcher"]').val(),
				parent: $(this).find('input[name="parent"]').val()
			}));

			$(this)[0].reset();
			return false;
		});

		//Link #tags/URLs
		highlighter(postData.id);

		//Sort the comment replies
		for (var i = 0; i < postData.comments.length; ++i) if (postData.comments[i].parentComment) {
			//Put the comment in the comment replies div for its parent comment
			$('#comment'+postData.comments[i].id).appendTo('#replies'+postData.comments[i].parentComment);

			//Remove comments too deep and make continue thread buttons
			if ($('#comment'+postData.comments[i].parentComment).parents().length >= 13 || !$('#comment'+postData.comments[i].parentComment).parents().length) {
				$('#comment'+postData.comments[i].id).remove();
			}
			if ($('#comment'+postData.comments[i].id).parents().length == 13) {
				$('#continueThreadBtn'+postData.comments[i].id).show();
			}
		}


		loaded = true;
		$('#loadingMessage').hide();
}
});

ws.on('new comment', function(commentData) {
	commentData = JSON.parse(commentData);

	//Increment the number on the counter
	if (!commentData.dontCount) {
		var newCommNum = parseInt(+document.getElementById('showCommentButton'+commentData.parent).innerHTML.split('(')[1].split(')')[0])+1;
		document.getElementById('showCommentButton'+commentData.parent).innerHTML = 'Load comments ('+newCommNum+')';
	}

	var newHTML = '';
	var commenterHash = commentData.ip.split("g/")[1].split(".")[0];
	newHTML = newHTML + '<div style="padding-left: 0px;" id="comment'+commentData.id+'">';
	newHTML = newHTML + '<hr />';
	newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+commenterHash+"\")'><img src='"+commentData.ip+"' /></a> says...<br></i><span data-livestamp="+commentData.time+" />";
	//Tags
	switch (commenterHash) {
		case "324411d31d789ba374008ab7960dfa2f":
			newHTML = newHTML + " [admin]";
			break;
	}
	newHTML = newHTML + "</p>";
	if ($('#comment'+commentData.parentComment).parents().length >= 13) {
		return;
	}
	else if ($('#comment'+commentData.parentComment).length === 0) {
		if (commentData.parentComment && !commentData.getChildren) {
			return;
		}
		else {
			newHTML = newHTML + '<h4 id="commentText">'+commentData.comment.replace(new RegExp('\n','g'), '<br />')+'</h4>';
		}
	}
	else {
		newHTML = newHTML + '<h4 id="commentText">'+commentData.comment.replace(new RegExp('\n','g'), '<br />')+'</h4>';
	}
	newHTML = newHTML + '<button class="btn" onclick="replyToComment('+commentData.parent+', '+commentData.id+');">Reply</button>';
	newHTML = newHTML + ' <button style="display: none;" id="continueThreadBtn'+commentData.id+'" class="btn" onclick="loadCommentThread('+commentData.id+', '+commentData.parent+');">Continue thread >></button>';
	newHTML = newHTML + '<div style="padding-left: 20px;" id="replies'+commentData.id+'">';
	newHTML = newHTML + '</div>';
	newHTML = newHTML + "</div>";

	//Insert the comment
	var comments = document.getElementById('comments'+commentData.parent);
	comments.innerHTML = comments.innerHTML + newHTML;


	//Sort the comment replies
	if (commentData.parentComment) {
		//Put the comment in the comment replies div for its parent comment
		$('#comment'+commentData.id).appendTo('#replies'+commentData.parentComment);
	}

	if ($('#comment'+commentData.id).parents().length == 13) {
		$('#continueThreadBtn'+commentData.id).show();
	}

	if (commentData.getChildren) {
		ws.emit('get comment thread', JSON.stringify({
			parent: commentData.id
		}));
	}
});

//Comment Replies
function replyToComment(postParent, commentParent) {
	$('#commentForm').find('input[name="parent"]').val(postParent);
	$('#commentForm').find('input[name="commentParent"]').val(commentParent);
	$('#submitComment').popup('show');
}

//Load into a thread
function loadCommentThread(parent, post) {	
	//Empty the current comments
	$('#comments'+post).empty();

	//Show a go back button
	$('#goBackCommentBtn'+post).show();

	//API call to get all comments with our parent
	ws.emit('get comment thread', JSON.stringify({
		parent: parent
	}));
}

function exitThread(parent) {
	$('#comments'+parent).empty();
	$('#goBackCommentBtn'+parent).hide();

	ws.emit('get bulk comments', JSON.stringify({
		parent: parent
	}));
}

//Attachments
function attach(url) {
var attachCode = '';
var URLbits = document.createElement('a');
URLbits.href = url;

//Get hostname
var hostname = URLbits.hostname;
var sitename = hostname.match(/(youtube|youtu.be|imgur.com|sharepic.tk|puu.sh)/i);

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
			attachCode = '<br /><iframe width="'+width+'" height="'+height+'" src="http://youtube.com/embed/'+videoid+'" frameborder="0" allowfullscreen></iframe>';
			break;
		case "imgur.com":
			var imgid = url.split("/");
			imgid = imgid[imgid.length-1];
			imgid = imgid.split(".");
			imgid = imgid[0];
			attachCode = '<a class="imgContainer" target="_blank" href="http://i.imgur.com/'+imgid+'.png"><img src="http://i.imgur.com/'+imgid+'.png" /></a>';
			break;
		case "sharepic.tk":
			attachCode = '<a class="imgContainer" target="_blank" href="'+url+'"><img src="'+url+'" /></a>';
			break;
		case "puu.sh":
			var imgid = url.split("http://puu.sh/")[1].split(".")[0];
			attachCode = '<a class="imgContainer" target="_blank" href="http://puu.sh/'+imgid+'.png"><img src="http://puu.sh/'+imgid+'.png" /></a>';
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
// var hashtag_regexp = /(#\w+)/ug;
var hashtag_regexp = /(#(.+?)(?=[\s.,:,!,?,<>,]|$))/gmi;

function linkHashtags(text) {
return text.replace(
	hashtag_regexp,
	'<a href="javascript:void(0);" onclick="runSearch(\'$1\')">$1</a>'
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

ws.on('notification', function(params) {
	notifications = JSON.parse(params);
	for (var i = notifications.length - 1; i >= 0; i--) {
		var notification = notifications[i];
		$('#sidebarNotifications').append('<section style="padding: 0.5rem;" class="notification"> <p>'+notification.commentText+'</p> <button class="btn" onclick="replyToComment('+notification.postID+', '+notification.commentID+');">Reply</button> <a class="btn" href="permalink.html?id='+notification.postID+'">View post</a> <button class="btn" onclick="$(this).parent().remove();">Dismiss</button> </section>');
	};
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
	$('#submitFAB').hide();

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
	$('#submitFAB').show();

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
	$('#submitFAB').hide();

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

	$('#submitComment').popup({
		transition: 'all 0.3s'
	});

	$('#closeSubmitPopup').click(function() {
		$('#submit').popup('hide');
	});

	$('#closeCommentPopup').click(function() {
		$('#submitComment').popup('hide');
	});

	$('.submit_open').html('WRITE A POST about '+topics[Math.floor(Math.random() * topics.length)]);

	//Get notifications
	ws.emit('get notifications');
});

function refresh(nsfw) {
	if (nsfw === 0 || nsfw === 1){
		showNSFW = nsfw;
		store.set('showNSFW', nsfw)
	}
	page = 1;
	$('#posts').html('');
	$('#loadingMessage').show();
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		user: userID,
		reverse: true
	}));
	nsfwToggle();
}

window.setInterval(function(){
	//Put a topic in the write a post button every 2 seconds
	$('.submit_open').html('WRITE A POST about '+topics[Math.floor(Math.random() * topics.length)]);
	ws.emit('get notifications');
}, 2000);

function subscribe(id, subscribe) {
	//N.B. If subscribe is not true unsubscribe
	if (subscribe) {
		$('#subscribeBtn'+id).html('<a class="btn" href="javascript:void(0);" onclick="subscribe('+id+', false)">Unsubscribe to new comments</a>')
	}
	else {
		$('#subscribeBtn'+id).html('<a class="btn" href="javascript:void(0);" onclick="subscribe('+id+', true)">Subscribe to new comments</a>')
	}

	ws.emit('subscribe', JSON.stringify({
		id: id,
		subscribe: subscribe
	}));
}