var io = require('socket.io')(3006)

var source = io.of('/source')
var feed = io.of('/feed')

source.on("connection", function(socket) {
	socket.on('tick', function(data){
		feed.emit('tick', data)
	})
})