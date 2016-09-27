var request = require('request')

function Stream(options) {
	this._options = options
	this._session_id
}

Stream.prototype.authenticate = function(callback) {
	var self = this
	request(this._options.authUrl, function(error, response, body) {
		if (error) {
			console.log(error)
			callback(100)
			return
		}
		
		if(response.statusCode != 200) {
			console.log(response.statusCode)
			callback(104)
			return
		}
		
		// return error if authentication fails
		if (body.indexOf("elemetrics:ibra1369:nonce:") < 0) {
			callback(106)
			return
		}
		
		self._session_id = body
		callback(null)
		
	})
}

Stream.prototype.nextTick = function(callback) {
	var self = this
	request(this._options.rateBaseUrl + this._session_id, function(error, response, body) {
		if (error) {
			console.log(error)
			callback(100)
			return
		}
		
		if(response.statusCode != 200) {
			console.log(response.statusCode)
			callback(104)
			return
		}
		
		// check if the right data was returned
		if(body.indexOf("EUR/USDUSD/JPYGBP/USDEUR/GBPUSD/CHFEUR/JPYEUR/CHFUSD/CADAUD/USDGBP/JPY") > 0) {
			// renegotiate session
			self.authenticate(function(err){
				if(err) {
					callback(err)
					return
				}
				
				self.nextTick(callback)
				callback(null)
			})
			return
		}
		
		// if there are no problems with the response format it for delivery
		var data = self.formatData(body)
		
		callback(null, data)
	})
}

Stream.prototype.formatData = function(raw) {
	var data = raw.split("\n")
		
	//remove superfluous elements
	var se0 = data.indexOf("\r")
	var se1 = data.indexOf("")
	
	if(se0 > -1) {
		data.splice(se0, 1)
	}
	
	if(se1 > -1) {
		data.splice(se0, 1)
	}
	
	// prepare result
	var result = []
	
	for(i=0; i<data.length; i++) {
		var attributes = data[i].split(",")
		
		var observation = {
			pair: attributes[0],
			timestamp: attributes[1],
			bid_fig: attributes[2],
			bid_pts: attributes[3],
			ask_fig: attributes[4],
			ask_pts: attributes[5],
			high: attributes[6],
			low: attributes[7],
			mid: attributes[8]
		}
		
		result.push(observation)
	}
	
	return result
}

module.exports = Stream