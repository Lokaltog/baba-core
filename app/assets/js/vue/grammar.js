module.exports = function() {
	Vue.component('grammar', {
		template: '#grammar-template',
		data: {
			open: false,
		},
	})

	Vue.component('container-wordlist', {
		template: '#container-wordlist-template',
		methods: {
			addString: function(ev) {
				var value = ev.target.value.trim().toLowerCase()

				// check for duplicates
				if (!this.$data.elements.some(function(el) {
					return el === value
				})) {
					this.$data.elements.push(value)
				}

				// sort word list alphabetically
				this.$data.elements.sort()

				ev.target.value = ''
			},
		},
	})

	Vue.component('container-sentence', {
		template: '#container-sentence-template',
		methods: {
			filterTransforms: function(transformList, type) {
				var ret = []
				var nc = this.$root.nodeCache

				;(transformList || []).forEach(function(ref) {
					if (!nc.hasOwnProperty(ref)) {
						return
					}
					var tf = nc[ref].node
					if (tf.type === type || !type) {
						ret.push(tf)
					}
				})

				return ret
			},
			updatePreview: function(model) {
				// add and remove a property to force an update
				// this will update it twice, but at least it works
				model.$add('preview', true)
				model.$delete('preview')
			},
		},
	})
}
