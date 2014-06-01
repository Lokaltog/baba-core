var traverse = require('./lib/traverse')

// Node cache
function NodeCache() {
	this.cache = {}
}
NodeCache.prototype.refresh = function(source) {
	// Generate node cache, return traverse node objects
	var self = this
	traverse(source).forEach(function(node) {
		if (node && node.id) {
			var current = this
			var parents = []
			while (current.parent) {
				if (current.node.id) {
					parents.push(current.node.id)
				}
				current = current.parent
			}
			self.cache[node.id] = {
				node: this.node,
				parents: parents.reverse(),
			}
		}
	})
}
NodeCache.prototype.get = function(key) {
	return this.cache[key]
}
// End node cache

module.exports = {
	NodeCache: NodeCache,
	randomItem: function(items) {
		return items[Math.floor(Math.random() * items.length)]
	},
	swapItems: function(arr, index, newIndex) {
		var tmp = arr[index]
		arr.$set(index, arr[newIndex])
		arr.$set(newIndex, tmp)
	},
	sortByProperty: function(obj, property) {
		obj.sort(function (a, b) {
			if (a[property] > b[property]) {
				return 1
			}
			if (a[property] < b[property]) {
				return -1
			}
			return 0
		})
	},
	applyTransformArray: function(str, transforms) {
		if (typeof str !== 'string') {
			// TODO handle references here
			str = str.toString()
		}
		transforms.some(function(transform) {
			if (typeof transform === 'string') {
				// function string from imported/stored generator
				// convert to native function
				transform = new Function('return (' + transform + ')')()
			}
			if (typeof transform === 'function') {
				// function transform
				// TODO allow the transform function to return true to discontinue applying transforms
				str = transform(str)
				return false
			}
			// regexp transform
			var search = new RegExp(transform[0], 'ig')
			if (str.match(search)) {
				str = str.replace(search, transform[1])
				return true
			}
		})
		return str
	},
	objPropertyPath: function(obj, path, silent) {
		var arr = path.split('.')
		while (arr.length && (obj = obj[arr.shift()])) {}
		if (typeof obj === 'undefined' && !silent) {
			throw 'Undefined property path: ' + path
		}
		return obj
	},
	generateId: function() {
		return Math.random().toString(36).substr(2, 10)
	},
	/**
	 * general topological sort
	 * @author SHIN Suzuki (shinout310@gmail.com)
	 * @param Array<Array> edges : list of edges. each edge forms Array<ID,ID> e.g. [12 , 3]
	 *
	 * @returns Array : topological sorted list of IDs
	 **/
	tsort: function(edges) {
		var nodes   = {}, // hash: stringified id of the node => { id: id, afters: lisf of ids }
		    sorted  = [], // sorted list of IDs ( returned value )
		    visited = {}; // hash: id of already visited node => true

		var Node = function(id) {
			this.id = id;
			this.afters = [];
		}

		// 1. build data structures
		edges.forEach(function(v) {
			var from = v[0], to = v[1];
			if (!nodes[from]) nodes[from] = new Node(from);
			if (!nodes[to]) nodes[to]     = new Node(to);
			nodes[from].afters.push(to);
		});

		// 2. topological sort
		Object.keys(nodes).forEach(function visit(idstr, ancestors) {
			var node = nodes[idstr],
			    id   = node.id;

			// if already exists, do nothing
			if (visited[idstr]) return;

			if (!Array.isArray(ancestors)) ancestors = [];

			ancestors.push(id);

			visited[idstr] = true;

			node.afters.forEach(function(afterID) {
				if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
					throw new Error('closed chain : ' +  afterID + ' is in ' + id);

				visit(afterID.toString(), ancestors.map(function(v) { return v })); // recursive call
			});

			sorted.unshift(id);
		});

		return sorted;
	},
}
