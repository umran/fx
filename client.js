var feed = require('socket.io-client')('http://127.0.0.1:3006/feed')

feed.on('connect', function(){
	console.log("connected to server")
})

feed.on('tick', function(data){
	console.log(data)
})

feed.on('disconnect', function(){
	console.log("disconnected from server")
})