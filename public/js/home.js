var socket = io('http://localhost:3000');

var interviewCall = function(id){
	socket.emit('connInterview', {callerID: id});
}

socket.on('interviewRequest', function(data){
	if(cookie[0] === data.callerID){
		
	}
});