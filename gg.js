var randItem = function (items) {
	return items[Math.floor(Math.random() * items.length)]
}

var randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

var filter = function (str, filters) {
	var ret = ''
	filters.some(function (f) {
		if (str.match(f[0])) {
			ret = str.replace(f[0], f[1])
			return true
		}
	})
	return ret
}

var ref = function (key, min, max, filterList) {
	var refFilters = []
	if (typeof min === 'string' && !filterList) {
		filterList = min
	}

	if (filterList) {
        if (typeof filterList === 'string') {
            filterList = [filterList]
        }
        filterList.forEach(function (filter) {
            refFilters.push(filters[filter])
        })
	}

	return function () {
		var ret = []
		var len = typeof min === 'number' && typeof max === 'number' ? randInt(min, max) : 1
		for (var i = 0; i < len; i++) {
			var item = parseGrammar(grammar[key])
			if (refFilters) {
				refFilters.forEach(function (f) {
					item = filter(item, f)
				})
			}
			ret.push(item)
		}
		return ret.join(' ')
	}
}

var group = function () {
	var items = arguments
	return function () {
        var ret = []
		for (var i = 0; i < items.length; i++) {
			ret.push(parseGrammar(items[i]))
        }
        return ret.join('')
	}
}

var parseString = function (str) {
	str = str.replace(/\$([\w#]+)/gi, function (m, $1) {
		var split = $1.split('#')
		var strRef = split[0]
		var strFilters = split.slice(1, split.length)

		return ref(strRef, null, null, strFilters)()
	})
	return str
}

var parseGrammar = function (elements, root) {
	if (typeof elements === 'function') {
		return parseGrammar(elements())
	}
	if (typeof elements === 'object') {
		return parseGrammar(randItem(elements))
	}
	if (typeof elements === 'string') {
		return parseString(elements)
	}
}

var filters = {
	pluralize: [
		[/(.*)ex$/i, '$1ices'],
		[/(.*)y$/i, '$1ies'],
		[/(.*)([sc]h|s)$/i, '$1$2es'],
		[/(.*)/i, '$1s'],
	],
	verbPastTensify: [
		// exceptions
		[/^((re)?set)$/i, '$1'],
		[/^(send)$/i, 'sent'],
		[/^(show)$/i, 'shown'],
		// general rules
		[/(.*[aeiouy])([tgp])$/i, '$1$2$2ed'],
		[/(.*)e$/i, '$1ed'],
		[/(.*)y$/i, '$1ied'],
		[/(.*)/i, '$1ed'],
	],
	verbPresentParticiplify: [
		[/(.*[aeiouy])([tgp])$/i, '$1$2$2ing'],
		[/(.*)e$/i, '$1ing'],
		[/(.*)$/i, '$1ing'],
	],
	prependAn: [
		[/^([aeiou].*)/i, 'an $1'],
		[/^(.*)/i, 'a $1'],
	],

	uppercase: [[/(.*)/i, function (m, $1) {
		return $1.toUpperCase()
	}]],
	uppercaseFirst: [[/(.*)/i, function (m, $1) {
		return $1.substring(0, 1).toUpperCase() + $1.substring(1, $1.length)
	}]],
}

var grammar = {
	// raw word lists
	verb: 'add,allot,annotate,apply,archive,bisect,blame,branch,bundle,check,checkout,cherry-pick,clean,clone,commit,configure,count,describe,diff,export,fail,fast-export,fast-import,fetch,filter-branch,format-patch,forward-port,fsck,grep,help,import,index,init,log,merge,name,note,pack,parse,patch,perform,prevent,prune,pull,push,quiltimport,reapply,rebase,reflog,relink,remote,remove,repack,request,reset,reset,return,rev-list,rev-parse,revert,save,send,set,show,specify,stage,stash,strip,succeed'.split(','),
	location: group(
		[group('non-', [group(ref('verb', 'verbPresentParticiplify'), ' '), '']), ''],
		'applied,downstream,local,remote,staged,unstaged,upstream'.split(',')
	),
	item: 'archive,stash'.split(','),
	locatedItem: group([group(ref('location'), ' '), ''], ref('item')),
	determiner: 'a few,all,any,some,the,various'.split(','),
	adjective: 'automatic,passive,temporary,original'.split(','),
	preposition: 'before,below,for,from,inside,next to,opposite of,outside,over,to'.split(','),

	// generic sentences
	sentence: group(ref('statement', 'uppercaseFirst'), '.'),
	paragraph: ref('sentence', 2, 5),

	// grammar-specific words and sentences
	taggedItem: [
		group(
			'<',
			[
				group(['new', 'old'], ref('item')),
				group(ref('verb'), '-', ref('item')),
			],
			'>'
		),
		group(
			ref('verb', 'uppercase'),
			'_',
			ref('item', 'uppercase')
		),
	],
	multipleItems: group(ref('determiner'), ' ', ref('adjective'), ' ', ref('item', 'pluralize')),
	commandName: group('git-', ref('verb'), '-', ref('item')),

	// action (generated description)
	action: group(
		ref('verb'), ' ',
		[
			ref('locatedItem', 'prependAn'),
			group(ref('determiner'), ' ', ref('locatedItem', 'pluralize'))
		], ' ',
		ref('preposition'), ' ',
		ref('verb', 'verbPastTensify'), ' ',
		ref('locatedItem', 'pluralize')
	),

	// statements that use all the stuff above
	statement: [
		['$multipleItems are $verb#verbPastTensify to $taggedItem by $commandName'],
	],
}

console.log(parseGrammar(grammar.commandName), '---', parseGrammar(grammar.action), '\n')
console.log(parseGrammar(grammar.paragraph))
