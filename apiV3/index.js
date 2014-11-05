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

function getPosts(size, search, nsfw, startingPost, socket) {
	//Get the posts from the database
	con.query("SELECT * FROM posts WHERE `post` NOT LIKE '%#bonfyre%' ORDER BY id DESC LIMIT "+startingPost+", 50;", function(e, posts) {
		if (e) throw e;
		
		//Send the posts to the user
		for (var i = 49; i > -1; --i) {
			var post = posts[i];
			con.query('SELECT `id` FROM comments WHERE `parent` = '+post.id+';', (function(i, post, e2, comments) {
				if (e2) throw e2;

				if (comments.length === 1) {
					post.commentNum = comments.length+' comment';
				}
				else {
					post.commentNum = comments.length+' comments';
				}
				// var hashedIP = md5('admin');
				post.ip = 'http://robohash.org/'+md5(post.ip)+'.png?set=set3&size='+size;
				// post['ip'] = "test123";
				socket.emit('newPost', JSON.stringify(post));
			}).bind(this, i, post));
		}
	})
}

app.get('/', function(req, res){
	//TODO: emulate old API
	res.send('<p>Server running</p>');
});

ws.on('connection', function(socket) {
	console.log('user connected');
	getPosts('64x64', '', 0, 50-50, socket);
})

http.listen(3973, function(){
	console.log('listening on *:'+3973);
});
