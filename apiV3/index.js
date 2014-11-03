function utf8_encode(argString) {
	//  discuss at: http://phpjs.org/functions/utf8_encode/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: sowberry
	// improved by: Jack
	// improved by: Yves Sucaet
	// improved by: kirilloid
	// bugfixed by: Onno Marsman
	// bugfixed by: Onno Marsman
	// bugfixed by: Ulrich
	// bugfixed by: Rafal Kukawski
	// bugfixed by: kirilloid
	//   example 1: utf8_encode('Kevin van Zonneveld');
	//   returns 1: 'Kevin van Zonneveld'

	if (argString === null || typeof argString === 'undefined') {
	return '';
	}

	var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	var utftext = '',
	start, end, stringl = 0;

	start = end = 0;
	stringl = string.length;
	for (var n = 0; n < stringl; n++) {
	var c1 = string.charCodeAt(n);
	var enc = null;

	if (c1 < 128) {
		end++;
	} else if (c1 > 127 && c1 < 2048) {
		enc = String.fromCharCode(
			(c1 >> 6) | 192, (c1 & 63) | 128
			);
	} else if ((c1 & 0xF800) != 0xD800) {
		enc = String.fromCharCode(
			(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
	} else { // surrogate pairs
		if ((c1 & 0xFC00) != 0xD800) {
			throw new RangeError('Unmatched trail surrogate at ' + n);
		}
		var c2 = string.charCodeAt(++n);
		if ((c2 & 0xFC00) != 0xDC00) {
			throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
		}
		c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
		enc = String.fromCharCode(
			(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
	}
	if (enc !== null) {
		if (end > start) {
			utftext += string.slice(start, end);
		}
		utftext += enc;
		start = end = n + 1;
	}
}

if (end > start) {
	utftext += string.slice(start, stringl);
}

return utftext;
}

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
			socket.emit('newPost', posts[i]);
		}
		console.log(utf8_encode(posts[1]['post']));
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