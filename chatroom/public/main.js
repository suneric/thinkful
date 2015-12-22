$(document).ready(function() {
	var socket = io();
	
    var input = $('input');
    var messages = $('#messages');
	var connect = $('#connect');
	var typingUser = $('#typing');
	
    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
	
	var updateConnect = function(count) {
		connect.html(count + ' users are connected including you.');
	};
	
	var addTyping = function(user) {
		if (user.length === 0) {
			typingUser.html('');
		} else {
			typingUser.html(user + ' is typing');
		}
	}
	
	// send nickname
	socket.on('connectedIndex', function(index) {
		var nickname = 'Eric_'+index;
		socket.emit('nickname', nickname);
	});
	
    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
			socket.emit('typing', true);
            return;
        }

        var message = input.val();
        addMessage('You say: ' + message);
		socket.emit('message', message);
		socket.emit('typing', false);
        input.val('');
    });
	
	// add message
	socket.on('message', function(data) {
		addMessage(data);
	});
	
	// connect count
	socket.on('connnect_count', function(data) {
		updateConnect(data);
	});
	
	// user is typing
	socket.on('typing', function(user){
		addTyping(user);
	});

});
