var io = require('socket.io')(3006)
var Stream = require('./stream')
var options = require('./config')
	
// start server
io.on('connection', function (socket) {
	console.log("a new client has connected")
	
	// create new stream
	var stream = new Stream(options)
	
	// initiate new authorized session
	stream.authenticate(function(err, res) {
		if(err) {
			console.log(err)
			socket.disconnect()
			return
		}
		
		console.log("a new session has been established")
		socket.emit("startSession")
		
		socket.on('nextTick', function() {
	
			stream.nextTick(function(err, res) {
				if(err) {
					console.log(err)
					socket.disconnect()
					return
				}
				
				if(res) {
					console.log("sending tick data")
					socket.emit("tick", res)
				} else {
					console.log("renegotiating session")
				}
			})
		
		})
		
	})

})