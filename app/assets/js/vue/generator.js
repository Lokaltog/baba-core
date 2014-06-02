var Vue = require('../lib/vue')
var popup = require('../popup')
var storage = require('../storage')
var utils = require('../utils')

module.exports = function() {
	Vue.component('tree', {
		template: '#tree-template',
		lazy: true,
		methods: {
			getComponent: function(model) {
				if (model.type === 'sentence' || model.type === 'wordlist') {
					return model.type
				}
				if (model.transforms) {
					return 'transforms'
				}
			},
		},
	})

	Vue.component('container-wordlist', {
		template: '#container-wordlist-template',
		lazy: true,
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
		lazy: true,
	})

	Vue.component('container-transforms', {
		template: '#container-transforms-template',
		lazy: true,
		methods: {
			updateTransformFunction: function(ev, transforms, idx) {
				try {
					// convert to function to check syntax
					transforms[idx] = Function('return (' + $(ev.target).val() + ')')()
					storage.save(this.$root) // force save
					this.testTransform(ev, transforms)
				}
				catch (e) {
					popup.alert('An error occured while parsing the transform function: <p><strong>' + e + '</strong></p>', 'error')
				}
			},
			updateTransformRegex: function(ev, transforms, node, idx) {
				node[idx] = $(ev.target).val()
				storage.save(this.$root) // force save
				this.testTransform(ev, transforms)
			},
			addTransformRegex: function(transform) {
				if (!transform.transforms) {
					transform.$add('transforms', [])
					transform.transforms = []
				}
				transform.transforms.push(['^$', ''])
			},
			addTransformFunction: function(transform) {
				if (!transform.transforms) {
					transform.$add('transforms', [])
					transform.transforms = []
				}
				transform.transforms.push(function(str) {  })
			},
			testTransform: function(ev, transforms) {
				var parent = $(ev.target).closest('.node-wrapper')
				var val = parent.find('.test input').val()
				parent.find('.transform-test').text(val ? utils.applyTransformArray(val, transforms) : '')
			},
		},
	})
}
