var randItem = function (items) {
	return items[Math.floor(Math.random() * items.length)]
}

var randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

var filter = function (str, filters) {
	var ret = ''
	filters.some(function (f) {
		if (typeof str === 'undefined') {
			ret = '<<ERROR>>'
			return true
		}
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
	// replace option groups: [something|something else]
	str = str.replace(/\[(.*?)\]/gi, function (m, $1) {
		return randItem($1.split('|'))
	})
	// replace variables: $variable#filter#filter2
	str = str.replace(/\$([a-z#]+)/gi, function (m, $1) {
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
	// sentences
	sentence: '$statement#uppercaseFirst.',
	paragraph: ref('sentence', 2, 5),

	// raw word lists
	verb: 'add,allot,annotate,apply,archive,bisect,blame,branch,bundle,check,checkout,cherry-pick,clean,clone,commit,configure,count,describe,diff,export,fail,fast-export,fast-import,fetch,filter-branch,format-patch,forward-port,fsck,grep,help,import,index,init,log,merge,name,note,pack,parse,patch,perform,prevent,prune,pull,push,quiltimport,reapply,rebase,reflog,relink,remote,remove,repack,request,reset,reset,return,rev-list,rev-parse,revert,save,send,set,show,specify,stage,stash,strip,succeed'.split(','),
	verbPerform: 'perform,execute,apply'.split(','),
	object: 'archive,area,base,branch,change,commit,file,head,history,index,log,object,pack,ref,stage,stash,submodule,subtree,tag,tip,tree'.split(','),
	location: group(
		'[non-$verb#verbPresentParticiplify |]',
		'applied,downstream,local,remote,staged,unstaged,upstream'.split(',')
	),
	preposition: 'before,below,for,from,inside,next to,opposite of,outside,over,to'.split(','),
	determiner: 'a few,all,any,some,the,various'.split(','),
	chanceDeterminer: 'certain,small,rare'.split(','),
	adjective: 'automatic,passive,temporary,original'.split(','),
	conditionConjunction: 'if,when,in case'.split(','),
	subject: 'you,the user,the $commandName command'.split(','),

	// make sure we're not consistent
	wordFailure: 'failure,error,breakdown,segfault,collapse'.split(','),
	wordPossible: 'possible,a [$chanceDeterminer |]possibility,a [$chanceDeterminer |] chance'.split(','),
	wordPreviously: 'previously,earlier,formerly,once'.split(','),
	wordShould: 'will have to,may have to,should'.split(','),
	wordSometimes: 'sometimes,in some cases'.split(','),
	wordSupplied: 'supplied,specified,set,defined,provided'.split(','),

	// grammar objects
	commandName: 'git-$verb-$object',
	commandOption: '--[$verb-|]$verb-$object',
	action: '$verb [$locatedObject#prependAn|$determiner $locatedObject#pluralize] $preposition $verb#verbPastTensify $locatedObject#pluralize',
	multipleObjects: '$determiner $adjective $object#pluralize',
	locatedObject: '[$location |]$object',
	constantObject: [
		group('<', ['[new|old]$object', '$verb-$object'], '>'),
		'$verb#uppercase_$verb#uppercase',
	],
	condition: [
		'$constantObject is [not |]$verb#verbPastTensify',
	],

	// statements that use all the stuff above
	statement: [
		'$conditionConjunction $condition, $commandName $commandOption will $verbPerform $adjective#prependAn $commandName before [$verb#verbPresentParticiplify the $object|doing anything else]',
		'$multipleObjects $verb#verbPastTensify by $object#pluralize in the $locatedObject but that [$wordSometimes |]are [not |]in $constantObject are $verb#verbPastTensify in $adjective#prependAn $object',
		'$multipleObjects are $verb#verbPastTensify to $constantObject by $commandName',
		'the same set of $object#pluralize would [$wordSometimes |]be $verb#verbPastTensify in $adjective#prependAn $object',
		'$constantObject is $verb#verbPastTensify to $verb the $object of the $object $preposition the $verb',
		'$multipleObjects that were $wordPreviously $verb#verbPastTensify $preposition the $adjective $object are $verb#verbPastTensify to $adjective#prependAn $object',
		'it is [$wordSometimes |]$wordPossible that $verb#verbPastTensify#prependAn $wordFailure will prevent $adjective $verb#verbPresentParticiplify of $multipleObjects',
		'$subject will $verb any such $wordFailure#pluralize and run $commandName $commandOption instead',
		'to $verb $adjective#prependAn $constantObject and $verb the working $object#pluralize, use the command $commandName $commandOption instead',
	],
}

console.log(parseGrammar(grammar.commandName), '---', parseGrammar(grammar.action), '\n')
console.log(parseGrammar(grammar.paragraph))
