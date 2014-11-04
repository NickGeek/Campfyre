var app = require('express')();
var http = require('http').Server(app);
var ws = require('socket.io')(http);
var mysql = require('mysql');
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
	con.query('SELECT * FROM posts ORDER BY id DESC LIMIT '+startingPost+', 50', function(e, posts) {
		if (e) throw e;
		
		//Send the posts to the user
		for (var i = 0; i < posts.length; ++i) {
			socket.emit('newPost', posts[0]['post']);
		}
		console.log(posts[0]['post']);
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
