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
	host : 'localhost',
	user : dbUsername,
	password : dbPassword,
	database : dbName
});
con.connect(function(e) {
	if (e) throw e;
});

con.query('SELECT * FROM posts ORDER BY id DESC LIMIT 50', function(e, rows) {
	if (e) throw e;
	console.log(rows[0])
})

function getPosts(size, search, nsfw, startingPost) {

}

app.get('/', function(req, res){
	//TODO: emulate old API
	res.send('<p>Server running</p>');
});

ws.on('connection', function(socket) {
	console.log('user connected');
})

http.listen(3973, function(){
	console.log('listening on *:'+3973);
});