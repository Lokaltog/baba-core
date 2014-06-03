var Fuse = require('./lib/fuse')
var Mustache = require('./lib/mustache')

module.exports = function(nodeCache) {
	var fuse = new Fuse([], {
		caseSensitive: false,
		includeScore: false,
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 48,
		keys: ['searchKey', 'root']
	})

	var generatorTypeaheadTemplate = [
		'<div class="suggestion">',
		'<span class="label">{{root}}</span>',
		'{{#components}}',
		'<span class="component">{{label}}</span>',
		'{{/components}}',
		'<span class="tag">{{tag}}</span>',
		'</div>',
	].join('\n')

	Mustache.parse(generatorTypeaheadTemplate)

	function updateSuggestions() {
		// update typeahead suggestions with contents from the node cache
		var suggestions = []

		Object.keys(nodeCache.cache).forEach(function(key) {
			var refNode = nodeCache.get(key)

			if (refNode.node.children) {
				return
			}

			var components = []
			var searchKey = []
			refNode.parents.forEach(function(key) {
				// TODO only show leaf nodes
				// TODO only show max 10 suggestions
				var parent = nodeCache.get(key).node
				searchKey.push(parent.label)
				components.push({
					label: parent.label,
				})
			})

			var suggestion = {
				id: key,
				root: refNode.root,
				searchKey: searchKey.join(' / '),
				components: components,
				tag: refNode.node.tag,
			}

			suggestions.push(suggestion)
		})

		// manually add static string suggestion
		suggestions.push({
			id: '__static_string__',
			root: 'Misc',
			searchKey: 'Static string',
			components: [{ label: 'Static string' }],
		})

		// update fuse search array
		fuse.list = suggestions
	}

	function attachGeneratorTypeahead(parentNode) {
		$('.generator-typeahead:not(.tt-input)', parentNode).each(function() {
			var target = $(this)

			function handleCompletion(ev, obj, dataset) {
				$(this).typeahead('val', '')

				var vm = $(this).closest('.sentence').get(0).vue_vm
				var sentence = vm.sentence.sentence
				var el = {}

				if (obj.id === '__static_string__') {
					// add static string
					el.str = ''
					sentence.push(el)
					return
				}

				var node = nodeCache.get(obj.id).node

				if (node.transforms) {
					// transform preceding sentence element
					var word = sentence[sentence.length - 1]
					if (word.ref) {
						if (!word.transform) {
							word.$add('transform', [])
							word.transform = []
						}
						word.transform.push(node.id)
					}
				}
				else if (node.type === 'wordlist' || node.type === 'sentence') {
					// add reference
					el.ref = node.id
					sentence.push(el)
				}
			}

			target.on('click', function() {
				$(this).typeahead('val', '')
			})

			target.typeahead(
				{
					autoselect: true,
					hint: false,
				},
				{
					source: function(query, cb) {
						cb(fuse.search(query))
					},
					displayKey: 'searchKey',
					templates: {
						suggestion: function(obj) {
							return Mustache.render(generatorTypeaheadTemplate, obj)
						},
					},
				}
			).on({
				'typeahead:selected': handleCompletion,
				'typeahead:autocompleted': handleCompletion,
			})
		})
	}

	// observe DOM mutations, attach typeahead handler to newly created input elements
	(new MutationObserver(function(mutations) {
		for(var i = 0; i < mutations.length; i += 1) {
			for(var j = 0; j < mutations[i].addedNodes.length; j += 1) {
				attachGeneratorTypeahead(mutations[i].addedNodes[j])
			}
		}
	})).observe($('body .create-grammar .contents').get(0), {
		childList: true,
		subtree: true,
	})

	// attach typeahead handler to any initial body elements
	attachGeneratorTypeahead($('body').get(0))

	return {
		updateSuggestions: updateSuggestions,
	}
}
