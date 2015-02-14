function addslashes(str) {
	return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

var app = require('express')();
var http = require('http').Server(app);
var ws = require('socket.io')(http);
var mysql = require('mysql');
var md5 = require('MD5');
var dbName = process.argv[2];
var dbUsername = process.argv[3];
var dbPassword = process.argv[4];
var salt = process.argv[5];

//Connect to the database
var con = mysql.createConnection({
	host: 'localhost',
	user: dbUsername,
	database: dbName,
	charset: 'utf8mb4'
});
if (dbPassword) {
	con.password = dbPassword;
}
con.connect(function(e) {
	if (e) throw e;
});

ws.use(function(socket, next) {
  socket.campfyreIPAddress = socket.conn.remoteAddress;
  next();
});

function getPosts(size, search, startingPost, loadBottom, socket, reverse, user, batch) {
	//Get the posts from the database
	if (search) {
		search = addslashes(search);
		var extraChar = "";
		if (search.substr(0, 1) == "#") {
			search = search.substr(1, search.length);
			extraChar = "#";
		}
		var query = "SELECT * FROM posts WHERE LOWER(`post`) REGEXP '"+extraChar+"[[:<:]]"+search+"[[:>:]]' ORDER BY id DESC LIMIT "+con.escape(startingPost)+", 50;";
	}
	else {
		if (user) {
			var query = "SELECT * FROM posts WHERE `post` NOT LIKE '%#bonfyre%' AND md5(CONCAT("+salt+", `ip`)) = "+con.escape(user)+" ORDER BY id DESC LIMIT "+con.escape(startingPost)+", 50;";
		}
		else {
			var query = "SELECT * FROM posts WHERE `post` NOT LIKE '%#bonfyre%' ORDER BY id DESC LIMIT "+con.escape(startingPost)+", 50;";
		}
	}
	con.query(query, function(e, posts) {
		if (e) throw e;
		
		//Send the posts to the user
		//Old get posts
		if (!reverse) {
			for (var i = posts.length-1; i > -1; --i) {
				var post = posts[i];
				con.query('SELECT * FROM comments WHERE `parent` = '+post.id+';', (function(i, post, e, comments) {
					if (e) throw e;

					if (comments.length === 1) {
						post.commentNum = comments.length+' comment';
					}
					else {
						post.commentNum = comments.length+' comments';
					}

					for (var j = 0; j < comments.length; ++j) {
						comments[j].ip = 'http://robohash.org/'+md5(salt+comments[j].ip)+'.png?set=set3&size='+size;
					}

					post.comments = comments;

					post.ip = 'http://robohash.org/'+md5(salt+post.ip)+'.png?set=set3&size='+size;

					if (loadBottom) {
						post.loadBottom = true;
					}
					else {
						post.loadBottom = false;
					}

					socket.emit('new post', JSON.stringify(post));
				}).bind(this, i, post));
			}
		}
		else {
			for (var i = 0; i < posts.length; ++i) {
				var post = posts[i];
				con.query('SELECT * FROM comments WHERE `parent` = '+post.id+';', (function(i, post, e, comments) {
					if (e) throw e;

					if (comments.length === 1) {
						post.commentNum = comments.length+' comment';
					}
					else {
						post.commentNum = comments.length+' comments';
					}

					for (var j = 0; j < comments.length; ++j) {
						comments[j].ip = 'http://robohash.org/'+md5(salt+comments[j].ip)+'.png?set=set3&size='+size;
					}

					post.comments = comments;

					post.ip = 'http://robohash.org/'+md5(salt+post.ip)+'.png?set=set3&size='+size;

					if (loadBottom) {
						post.loadBottom = true;
					}
					else {
						post.loadBottom = false;
					}

					socket.emit('new post', JSON.stringify(post));
				}).bind(this, i, post));
			}
		}
	});
}

function stoke(id, ip, socket) {
	//Check the user hasn't already voted
	con.query("SELECT `voters` FROM posts WHERE `id` = '"+id+"'", function(e, voters) {
		if (e) throw e;

		if (voters[0].voters){
			voters = voters[0].voters.split(',');
		}
		else {
			voters = [];
		}
		if (voters.indexOf(ip) == -1) {
			//Stoke the post
			con.query("UPDATE `posts` SET `voters` = IFNULL(CONCAT(`voters`, ',"+ip+"'), '"+ip+"') WHERE `id` = '"+con.escape(id)+"';", function (e) {
				if (e) throw e;
				con.query("UPDATE `posts` SET `score` = `score` + 1 WHERE `id` = '"+con.escape(id)+"';");
				socket.emit('success message', JSON.stringify({title: 'Post stoked', body: ''}));

				//Tell everyone about the stoke
				con.query("SELECT `score` FROM posts WHERE `id` = '"+con.escape(id)+"';", function (e, posts) {
					if (e) throw e;

					ws.emit('post stoked', JSON.stringify({
						id: con.escape(id),
						score: posts[0].score
					}));
				});
			});
		}
		else {
			//Don't stoke and return an error
			socket.emit('error message', JSON.stringify({title: 'Post not stoked', body: 'You can only stoke once'}));
		}
	});
}

function submitPost(text, attachment, catcher, ip, isNsfw, socket) {
	//Get teh [sic] time
	var time = Math.floor(Date.now() / 1000) - 5;
	
	//Sort out other vars
	text = text.replace(/(<([^>]+)>)/ig,"");
	safeText = con.escape(text);
	if (attachment) {
		attachment = con.escape(attachment);
	}
	else {
		attachment = con.escape('n/a')
	}
	var spamming = false;

	//Catch spammers
	con.query("SELECT `ip` FROM posts ORDER BY `id` DESC LIMIT 3", function (e, results) {
		if (e) throw e;

		if (results[0].ip == ip && results[1].ip == ip && results[2].ip == ip) {
			spamming = true;
		}
		else if (catcher.length > 0) {
			spamming = true;
		}

		//Submit the post
		if (text && ip && attachment) {
			if (text.length <= 256 && !spamming) {
				var profanity = text.match(/(cum|jizz|pussy|penis|vagina|cock|dick|cunt|porn|p0rn|tits|tities|boob\S*|sex|ballsack|twat\S*)/im);
				if (profanity != null || isNsfw){
					var nsfw = 1;
				}
				else {
					var nsfw = 0;
				}
				con.query("INSERT INTO posts (post, ip, nsfw, time, attachment) VALUES ("+safeText+", "+con.escape(ip)+", "+nsfw+", "+time+", "+attachment+");", function (e) {
					if (e) throw e;

					con.query("SELECT * FROM posts WHERE `post` = "+safeText+" AND `post` NOT LIKE '%#bonfyre%' AND `ip` = '"+ip+"' AND `time` = '"+time+"';", function (e, posts) {
						if (e) throw e;

						//Send the posts to the user
						if (posts.length > 0) {
							var post = posts[posts.length-1];
							con.query('SELECT * FROM comments WHERE `parent` = '+post.id+';', (function(post, e, comments) {
								if (e) throw e;

								if (comments.length === 1) {
									post.commentNum = comments.length+' comment';
								}
								else {
									post.commentNum = comments.length+' comments';
								}

								for (var j = 0; j < comments.length; ++j) {
									comments[j].ip = 'http://robohash.org/'+md5(salt+comments[j].ip)+'.png?set=set3&size=64x64';
								}

								post.comments = comments;

								post.ip = 'http://robohash.org/'+md5(salt+post.ip)+'.png?set=set3&size=64x64';
								post.loadBottom = false;
								ws.emit('new post', JSON.stringify(post));
								socket.emit('success message', JSON.stringify({title: 'Post submitted', body: ''}));

								//If the user isn't showing NSFW posts, and this post is NSFW show them
								if (nsfw === 1) {
									socket.emit('show nsfw');
								}
							}).bind(this, post));
						}
						else {
							socket.emit('success message', JSON.stringify({title: 'Post submitted', body: ''}));
						}
					});
				});
			}
			else if (spamming) {
				socket.emit('error message', JSON.stringify({title: 'Post not submitted', body: "You've posted too much recently"}));
			}
			else {
				socket.emit('error message', JSON.stringify({title: 'Post not submitted', body: 'Your post is too long'}));
			}
		}
		else {
			socket.emit('error message', JSON.stringify({title: 'Post not submitted', body: 'No data was received'}));
		}
	});
}

function submitComment(parent, text, catcher, ip, commentParent, socket) {
	var time = Math.floor(Date.now() / 1000) - 5;
	text = text.replace(/(<([^>]+)>)/ig,"");
	safeText = con.escape(text);
	var spamming = false;
	if (catcher.length > 0) spamming = true;
	if (!commentParent) commentParent = null;

	if (text && ip && parent) {
		if (text.length <= 256 && !spamming) {
			con.query("INSERT INTO comments (comment, ip, parent, parentComment, time) VALUES ("+safeText+", "+con.escape(ip)+", "+con.escape(parent)+", "+con.escape(commentParent)+", '"+time+"');", function (e) {
				//Tell the user and show the comment
				socket.emit('success message', JSON.stringify({title: 'Comment submitted', body: ''}));

				con.query("SELECT * FROM comments WHERE `comment` = "+safeText+" AND `ip` = '"+ip+"' AND `time` = '"+time+"';", function(e, commentData) {
					var commentData = commentData[commentData.length-1];
					commentData.ip = 'http://robohash.org/'+md5(salt+commentData.ip)+'.png?set=set3&size=64x64'
					ws.emit('new comment', JSON.stringify(commentData));
				});
			})	
		}
		else if (spamming) {
			socket.emit('error message', JSON.stringify({title: 'Post not submitted', body: "You've posted too much recently"}));
		}
		else {
			socket.emit('error message', JSON.stringify({title: 'Post not submitted', body: 'Your post is too long'}));
		}
	}
	else {
		socket.emit('error message', JSON.stringify({title: 'Post not submitted', body: 'No data was received'}));
	}
}

function getCommentThread(parent, socket) {
	con.query("SELECT * FROM `comments` WHERE `parentComment` = "+con.escape(parent)+";", function(e, comments) {
		if (e) throw e;

		for (var i = 0; i < comments.length; ++i) {
			comments[i].ip = 'http://robohash.org/'+md5(salt+comments[i].ip)+'.png?set=set3&size=64x64';
			comments[i].getChildren = true;
			comments[i].dontCount = true;
			socket.emit('new comment', JSON.stringify(comments[i]));
		}
	});
}

function getBulkComments(parent, socket) {
	con.query("SELECT * FROM `comments` WHERE `parent` = "+con.escape(parent)+";", function(e, comments) {
		if (e) throw e;

		for (var i = 0; i < comments.length; ++i) {
			comments[i].ip = 'http://robohash.org/'+md5(salt+comments[i].ip)+'.png?set=set3&size=64x64';
			comments[i].dontCount = true;
			socket.emit('new comment', JSON.stringify(comments[i]));
		}
	});
}

function getPost(size, id, socket) {
	con.query("SELECT * FROM `posts` WHERE `id` = "+con.escape(id)+";", function(e, post) {
		post = post[0];
		con.query('SELECT * FROM comments WHERE `parent` = '+post.id+';', (function(post, e, comments) {
			if (e) throw e;

			if (comments.length === 1) {
				post.commentNum = comments.length+' comment';
			}
			else {
				post.commentNum = comments.length+' comments';
			}

			for (var j = 0; j < comments.length; ++j) {
				comments[j].ip = 'http://robohash.org/'+md5(salt+comments[j].ip)+'.png?set=set3&size='+size;
			}

			post.comments = comments;

			post.ip = 'http://robohash.org/'+md5(salt+post.ip)+'.png?set=set3&size='+size;
			post.loadBottom = false;

			socket.emit('new post', JSON.stringify(post));
		}).bind(this, post));
	});
}

function getStokeCount(id, socket) {
	con.query("SELECT `score` FROM `posts` WHERE md5(CONCAT("+salt+",`ip`)) = "+con.escape(id)+";", function(e, results) {
		totalScore = 0;
		for (var l = 0; l < results.length; ++l) {
			totalScore += results[l].score;
		}
		socket.emit('score result', JSON.stringify({score: totalScore}));
	});
}

app.get('/', function(req, res) {
	//TODO: emulate old API
	res.send('<p>Server running</p>');
});

ws.on('connection', function(socket) {
	socket.on('get posts', function(params) {
		try {
			params = JSON.parse(params);
			getPosts(params.size, params.search, params.startingPost, params.loadBottom, socket, params.reverse, params.user, params.batch);
		}
		catch(e) {
		}
	});
	socket.on('stoke', function(params) {
		try {
			params = JSON.parse(params);
			var ip = socket.campfyreIPAddress;
			stoke(params.id, ip, socket)
		} catch(e) { }
	});
	socket.on('submit post', function(params) {
		try {
			params = JSON.parse(params);
			var ip = socket.campfyreIPAddress;
			submitPost(params.post, params.attachment, params.catcher, ip, params.nsfw, socket);
		} catch(e) { }
	});
	socket.on('submit comment', function(params) {
		try {
			params = JSON.parse(params);
			var ip = socket.campfyreIPAddress;
			submitComment(params.parent, params.comment, params.catcher, ip, params.commentParent, socket);
		} catch(e) { }
	});
	socket.on('get comment thread', function(params) {
		try {
			params = JSON.parse(params);
			getCommentThread(params.parent, socket);
		}
		catch (e) {}
	});
	socket.on('get bulk comments', function(params) {
		try {
			params = JSON.parse(params);
			getBulkComments(params.parent, socket);
		}
		catch (e) {}
	});
	socket.on('get post', function(params) {
		try {
			params = JSON.parse(params);
			getPost(params.size, params.id, socket);
		}
		catch(e) {
		}
	});
	socket.on('get total score', function(params) {
		try {
			params = JSON.parse(params);
			getStokeCount(params.id, socket)
		}
		catch(e) {}
	});
});

http.listen(3973, function(){
	console.log('listening on *:'+3973);
});