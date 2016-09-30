var socket = require('socket.io-client')('http://127.0.0.1:3006/source')
var Stream = require('./stream')
var options = require('./config')

// create new stream
var stream = new Stream(options)

// initiate new authorized session
stream.authenticate(function(err, res) {
	if(err) {
		console.log(err)
		return
	}
	
	// start stream
	stream.startTicking()
	
	stream.on('data', function(data){
		// store data on cache and on disk
		
		// send data to relay
		socket.emit('tick', data)
	})
})