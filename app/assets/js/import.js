module.exports = {
	fromGist: function(uri) {
		var id = uri.split('/').slice(-1)[0]
		var queryUri = 'https://api.github.com/gists/' + id
		var deferred = $.Deferred()

		$.getJSON(queryUri)
			.done(function(data) {
				var generator = ''
				for (var file in data.files) {
					if (data.files.hasOwnProperty(file)) {
						// only read first item
						// TODO handle multiple items by prompting the user?
						try {
							generator = JSON.parse(data.files[file].content)
							break
						}
						catch (e) {
							return deferred.reject('Could not import JSON: ' + e, 'error')
						}
					}
				}

				if (!generator) {
					return deferred.reject('Could not read any files from the gist!', 'error')
				}

				deferred.resolve(generator)
			})
			.fail(function() {
				return deferred.reject('Could not import grammar: invalid gist URI or ID.', 'error')
			})

		return deferred.promise()
	},
	fromJson: function(jsonText) {
		var deferred = $.Deferred()
		var jsonObj
		try {
			jsonObj = JSON.parse(jsonText)
			deferred.resolve(jsonObj)
		}
		catch (e) {
			return deferred.reject('An error occured while parsing the JSON string: ' + e, 'error')
		}
		if (!jsonObj) {
			return deferred.reject('Empty JSON object')
		}
		return deferred.promise()
	},
}
