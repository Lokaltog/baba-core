// TODO store multiple grammars
var STORAGE_KEY = 'baba-grammars'

module.exports = {
	load: function() {
		var data = localStorage.getItem(STORAGE_KEY)
		var json
		try {
			json = JSON.parse(data)
		}
		catch (e) {
			console.log('Attempted to load invalid JSON data, clearing local storage')
			localStorage.setItem(STORAGE_KEY, {})
		}
		return json || {}
	},
	save: function(vm) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(vm.getRawGrammar()))
	},
}
