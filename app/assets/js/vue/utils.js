var S = require('../lib/string')

module.exports = {
	getNodeCache: function() {
		var ret = {}
		function getNodes(node, parent) {
			if (!node) {
				return
			}
			if (node.id) {
				ret[node.id] = { node: node, parent: ret[parent.id] }
			}
			if (node.children && node.children.length) {
				node.children.forEach(function(child) {
					getNodes(child, node)
				})
			}
		}
		for (var i = 0; i < arguments.length; i += 1) {
			getNodes(arguments[i])
		}
		return ret
	},
	createNodeCache: function(obj) {
		// store flat cache of all nodes with parents
		var nodeCache = this.getNodeCache(obj.generator.grammar, obj.generator.transforms)
		for (var n in nodeCache) {
			if (nodeCache.hasOwnProperty(n)) {
				obj.nodeCache[n] = nodeCache[n]
			}
		}
	},
	updateSlugs: function(obj) {
		if (!obj.generator.grammar) {
			return
		}
		obj.exportedSlugs = (obj.exported || []).map(function(el) {
			return S(el.label).slugify().toString()
		}).sort()
		obj.grammarNameSlug = S(obj.generator.grammar.name || '').slugify().toString()
	},
	getExportedNodes: function(node) {
		if (!node) {
			return []
		}
		var ret = []
		if (node.children && node.children.length) {
			node.children.forEach(function(child) {
				ret = ret.concat(this.getExportedNodes(child))
			}.bind(this))
		}
		if (node.export === true) {
			ret.push(node)
		}
		return ret
	},
}
