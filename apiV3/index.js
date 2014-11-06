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
var emailPassword = process.argv[5];

//Connect to the database
var con = mysql.createConnection({
	host: 'localhost',
	user: dbUsername,
	password: dbPassword,
	database: dbName,
	charset: 'utf8mb4'
});
con.connect(function(e) {
	if (e) throw e;
});

function getPosts(size, search, startingPost, socket) {
	//Get the posts from the database
	if (search) {
		search = addslashes(search);
		var query = "SELECT * FROM posts WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% "+search+" %' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '% "+search+"' OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) LIKE '"+search+" %' or REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`post`, '?' , '' ), '!' , '' ), '-' , '' ), '.' , '' ), ':' , '' ) = '"+search+"' ORDER BY id DESC LIMIT "+startingPost+", 100";
	}
	else {
		startingPost = con.escape(startingPost);
		var query = "SELECT * FROM posts WHERE `post` NOT LIKE '%#bonfyre%' ORDER BY id DESC LIMIT "+startingPost+", 50;";
	}
	con.query(query, function(e, posts) {
		if (e) throw e;
		
		//Send the posts to the user
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
					comments[j].ip = 'http://robohash.org/'+md5(comments[j].ip)+'.png?set=set3&size='+size;
				}

				post.comments = comments;

				post.ip = 'http://robohash.org/'+md5(post.ip)+'.png?set=set3&size='+size;
				socket.emit('new post', JSON.stringify(post));
			}).bind(this, i, post));
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

function submitPost(text, attachment, email, catcher, ip, isNsfw, socket) {
	//Get teh [sic] time
	var time = Math.floor(Date.now() / 1000) + 3;
	
	//Sort out other vars
	text = text.replace(/(<([^>]+)>)/ig,"");
	safeText = con.escape(text);
	if (attachment) {
		attachment = con.escape(attachment);
	}
	else {
		attachment = con.escape('n/a')
	}
	email = con.escape(email);
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
		if (safeText && ip && attachment) {
			if (text.length <= 256 && !spamming) {
				var profanity = text.match(/(cum|jizz|pussy|penis|vagina|cock|dick|cunt|porn|p0rn|tits|tities|boob\S*|sex|ballsack|twat\S*)/im);
				if (profanity != null || isNsfw){
					var nsfw = 1;
				}
				else {
					var nsfw = 0;
				}
				con.query("INSERT INTO posts (post, ip, emails, nsfw, time, attachment) VALUES ("+safeText+", '"+ip+"', "+email+", "+nsfw+", "+time+", "+attachment+");", function (e) {
					if (e) throw e;

					con.query("SELECT * FROM posts WHERE `post` = "+safeText+" AND `ip` = '"+ip+"' AND `time` = '"+time+"';", function (e, posts) {
						if (e) throw e;

						//Send the posts to the user
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
								comments[j].ip = 'http://robohash.org/'+md5(comments[j].ip)+'.png?set=set3&size=64x64';
							}

							post.comments = comments;

							post.ip = 'http://robohash.org/'+md5(post.ip)+'.png?set=set3&size=64x64';
							ws.emit('new post', JSON.stringify(post));
							socket.emit('success message', JSON.stringify({title: 'Post submitted', body: ''}));
						}).bind(this, post));
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

app.get('/', function(req, res) {
	//TODO: emulate old API
	res.send('<p>Server running</p>');
});

ws.on('connection', function(socket) {
	socket.on('get posts', function(params) {
		getPosts(params.size, params.search, params.startingPost, socket);
	});
	socket.on('stoke', function(params) {
		var ip = socket.request.connection._peername['address'];
		stoke(params.id, ip, socket)
	});
	socket.on('submit post', function(params) {
		var ip = socket.request.connection._peername['address'];
		submitPost(params.post, params.attachment, params.email, params.catcher, ip, params.nsfw, socket);
	});
});

http.listen(3973, function(){
	console.log('listening on *:'+3973);
});
