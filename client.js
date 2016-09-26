var socket = require('socket.io-client')('http://127.0.0.1:3006')
socket.on('connect', function(){
	console.log("connected to server")
})

socket.on('startSession', function(){
	console.log("session initialized. requesting tick data")
	nextTick()
})

socket.on('tick', function(data){
	console.log(data)
	
	console.log("next tick in 1 second...")
	setTimeout(nextTick, 1000)
})

socket.on('disconnect', function(){
	console.log("disconnected from server")
})

function nextTick() {
	socket.emit('nextTick')
}