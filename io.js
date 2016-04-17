var Server = require('socket.io');

var io = new Server();

var users = {};
var rooms = 'general';

io.sockets.on('connection',
function(socket)
{
	socket.on('sendchat', function(data){
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
    socket.on('adduser', function(user)
    {
		socket.user = user;
		socket.join('general');
		socket.emit('updatechat');
		
		users[user] = socket.id;
    });
	
	socket.on('sendchat', function(data)
	{
		io.sockets.in('general').emit('updatechat', socket.username, data);
	});
	
	socket.on('start_interview', function(user, otheruser){
		socket.user = user;
		if(!users[otheruser]) {
			otheruser = null;
		}else {
			io.sockets.connected[users[otheruser]].emit('interview_request', user);
		}
	});
});

module.exports = io;
