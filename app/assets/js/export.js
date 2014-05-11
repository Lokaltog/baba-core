// functions to include in the exported JS code
function export__randomWord(word) {
	console.log(word)
}

function export__globalBaba(sentence) {
	console.log(sentence)
}

// export grammar
function exportGrammar(grammar) {
	var ret = []
	var wordlists = grammar.get('wordlists')
	var sentences = grammar.get('sentences')
	var transforms = grammar.get('transforms')

	var exportTransforms = {}
	var exportSentences = []

	// include global functions
	ret.push('var randomWord = ' + export__randomWord)

	// export word lists
	wordlists.forEach(function(wordlistClass) {
		wordlistClass.groups.forEach(function(wordlistGroup) {
			var wordlistGroupWords = []
			wordlistGroup.words.forEach(function(word) {
				wordlistGroupWords.push(word.word)
			})
			ret.push([
				'var',
				[wordlistClass.class, wordlistGroup.class].join('__'),
				'=',
				JSON.stringify(wordlistGroupWords),
			].join(' '))
		})
	})

	// export sentences
	sentences.forEach(function(sentence) {
		var sentenceElement = []
		sentence.elements.forEach(function(element) {
			if (element.static) {
				sentenceElement.push(JSON.stringify(element.phrase))
			}
			else {
				var sentenceFunctions = ['randomWord']
				// initial function name to be transformed
				var sentenceStr = [
					wordlists[element.classIdx].class,
					wordlists[element.classIdx].groups[element.groupIdx].class,
				].join('__')

				element.prefix.forEach(function(prefix) {
					var grammarPrefix = grammar.get(prefix)
					if (!exportTransforms.hasOwnProperty(grammarPrefix.class)) {
						exportTransforms[grammarPrefix.class] = grammarPrefix.fn
					}
					sentenceFunctions.push(grammarPrefix.class)
				})
				element.postfix.forEach(function(postfix) {
					var grammarPostfix = grammar.get(postfix)
					if (!exportTransforms.hasOwnProperty(grammarPostfix.class)) {
						exportTransforms[grammarPostfix.class] = grammarPostfix.fn
					}
					sentenceFunctions.push(grammarPostfix.class)
				})

				sentenceFunctions.forEach(function(fn) {
					sentenceStr = fn + '(' + sentenceStr + ')'
				})

				sentenceElement.push(sentenceStr)
			}
		})
		exportSentences.push(sentenceElement.join(' + '))
	})

	// export transforms
	for (var transform in exportTransforms) {
		if (exportTransforms.hasOwnProperty(transform)) {
			ret.push('var ' + transform + ' = ' + exportTransforms[transform])
		}
	}

	ret.push('var sentences = [' + exportSentences.join(',') + ']')

	return ret.join('\n')
}

function compress(code) {
	var ast = UglifyJS.parse(code)
	var compressor = UglifyJS.Compressor()
	ast.figure_out_scope()
	var compressed_ast = ast.transform(compressor)
	compressed_ast.figure_out_scope()
	compressed_ast.compute_char_frequency()
	compressed_ast.mangle_names()

	return compressed_ast.print_to_string()
}

module.exports = {
	exportToBrowser: function (grammar) {
		// create raw JS code to be exported
		var exported = []

		// wrap with browser-specific stuff
		exported.push('(function (global) {')
		exported.push('global.baba = ' + export__globalBaba)
		exported.push(exportGrammar(grammar))
		exported.push('})(this)')

		exported = exported.join('\n')

		return compress(exported)
	},
}
