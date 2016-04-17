var Server = require('socket.io');

var io = new Server();

io.sockets.on('connection',
function(socket)
{
    socket.on('adduser', function(data)
    {
    });
	
	socket.on('connInterview', function(data){
		socket.emit('interviewRequest', data);
	});
});

module.exports = io;
