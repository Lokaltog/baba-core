var Fuse = require('./lib/fuse')
var Mustache = require('./lib/mustache')

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

function updateSuggestions(nodeCache) {
	// update typeahead suggestions with contents from the node cache
	var suggestions = []

	Object.keys(nodeCache.cache).forEach(function(key) {
		var refNode = nodeCache.get(key)
		var components = []
		var searchKey = []
		refNode.parents.forEach(function(key) {
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
			target.val('')
			// TODO implement adding sentence element
			// TODO implement transforming preceding sentence element
			console.log(obj.id)
		}

		target.on('click', function() {
			$(this).val('')
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

module.exports = {
	updateSuggestions: updateSuggestions,
}
