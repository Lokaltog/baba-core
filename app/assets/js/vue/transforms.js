var popup = require('../popup')
var storage = require('../storage')
var utils = require('../utils')
var Vue = require('../lib/vue')

module.exports = function() {
	Vue.component('transforms', {
		template: '#transforms-template',
		data: {
			open: false,
		},
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
