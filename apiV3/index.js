var app = require('express')();
var http = require('http').Server(app);
var ws = require('socket.io')(http);
var mysql = require('mysql');
var sys = require('sys');

//Connect to the database
var con = mysql.createConnection({
	host: 'localhost',
	user: '',
	password: ''
});

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