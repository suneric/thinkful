var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

// global count of connected user
var connectedCount = 0;
var typingUsers = new Array;

io.on('connection', function(socket) {
	connectedCount++;
	socket.emit('connectedIndex', connectedCount-1);
	socket.broadcast.emit('connnect_count', connectedCount);
	
	var nickname;
	socket.on('nickname', function(data) {
		nickname = data;
		socket.broadcast.emit('message', nickname+' is connected.');
	});
	
	socket.on('disconnect', function() {
		connectedCount--;
		if (nickname != undefined) {
			console.log(nickname + ' is disconnected.');
			socket.broadcast.emit('message', nickname+' is disconnected.');
			socket.broadcast.emit('connnect_count', connectedCount);
		}
	});
	
	socket.on('message', function(message) {
		var displayMsg = nickname + ' says: ' + message;
		console.log(displayMsg);
		socket.broadcast.emit('message', displayMsg);
	});
	
	socket.on('typing', function(data) {
		if (nickname === undefined) {
			return;
		}
		
		var index = typingUsers.indexOf(nickname);
		if (data === true) {
			if (index < 0) {
				typingUsers.push(nickname);
			}
			socket.broadcast.emit('typing', typingUsers);
		} else {
			if (index >= 0) {
				typingUsers.splice(index, 1);
				socket.broadcast.emit('typing', typingUsers);
			}
		}
	});
});

server.listen(8080);