/*!
 * Tumblr grammars for Baba
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

(function (global, module, define) {
	function init (Baba) {
		var common = new Baba.Grammar('tumblr-common', ['{', '}'], ['[', ']'])
		common.require('common')
		common.addGrammar({
			'alignment': {
				'prefix': {
					'sexuality': '[andro|anthro|demi|gender|gray|gyne|pomo|skolio|tulpa]',
					'personality': '[a|bi|demi|inter|multi|non|omni|pan|para|poly|trans]',
				},
				'postfix': {
					'sexuality': '[amorous|romantic|platonic|sensual|sexual]',
					'personality': '[ethnic|gender|queer|racial|romantic|sensual|sexual]',
				},
				'sexuality': '{alignment.prefix.sexuality}{alignment.postfix.sexuality}',
				'personality': '{alignment.prefix.personality}{alignment.postfix.personality}',
			},
			'adjective': {
				'good': '[attractive|neutral|natural|integral|intersectional|equal|feminine|invisible]',
				'bad': '[supreme|masculine|white]',
				'synonym': {
					'bad': '[bad|negative]',
					'good': '[good|positive]',
					'important': '[important|crucial]',
				},
			},
			'adverb': {
				'sexuality': '{prefix.sexuality}{postfix.sexuality}',
				'personality': '{prefix.personality}{postfix.personality}',
				'synonym': {
					'now': '[now|right {fucking} now|right away]',
					'really': '[really|actually]',
				},
			},
			'verb': {
				'bad': '[discriminate|oppress|internalize|institutionalize|colonize|appropriate|exotify|erode]',
				'good': '[abolish|self-diagnose|love]',
				'personal': '[wear|label]',
				'other': '[obsess over]',
				'swear': '[screw|fuck|damn]',
				'auxiliary': {
					'should': '[should|must|need to|can]',
				},
				'synonym': {
					'die': '[die|burn|burn in hell]',
					'must-die': [
						'{verb.auxiliary.should} [{fucking} ]{verb.synonym.die}',
						'{verb.auxiliary.should} [{fucking} ]{verb.synonym.die}',
					],
				},
			},
			'noun': {
				'privileged': '[]',
				'oppressed': '[]',
				'bad': '[culture|domination|entitlement|opinion|privilege|right|gender role|TERF|man|nazi|addict]',
				'good': '[appearance|height|weight|race|womyn|hair|body hair|body|fandom|species|fat|fatty|female|food|stretchmark]',
				'abstract': {
					'good': '[misandr|femininit|integrit|equalit|intersectionalit]y',
					'bad': '[masculinit|kyriarch|patriarc|superiorit|misogyn]y',
				},
				'ism-prefix': {
					'good': '[misandr|femin|equal|intersectional|activ|separat|commun|egalitarian|fandom|fat|lesbian|freegan|social]',
					'bad': '[patriarch|kyriarch|masculin|misogyn|rac|fasc]',
				},
				'ism': {
					'good': '{noun.ism-prefix.good}ism',
					'bad': '{noun.ism-prefix.bad}ism',
				},
				'ist': {
					'good': '{noun.ism-prefix.good}ist',
					'bad': '{noun.ism-prefix.bad}ist',
				},
			},
			'concept': {
				'discrimination': '[{noun.good}|{adjective.good|-ity}] {verb.bad|-ion}',
				'supremacy': '[][]',
				'institution': '[][]',
			},
			'fuck': '{verb.swear}',
			'fucking': '[fucking|damn]',
			'pronoun': '[you|you all]',
			'interjection': '[goddamn it|ffs|for fucks sake]',
			'conjunction': {
				'and-or': '[and|or|and/or]',
				'conditional': '[if|because]',
				'conclusion': '[as|because|and|but|so]',
			},
		})

		var angry = new Baba.Grammar('tumblr-angry', ['{', '}'], ['[', ']'])
		angry.require('tumblr-common')
		angry.addGrammar({
			'condition': [
				'{conjunction.conditional} you {verb.bad} {noun.good|plural}',
			],
			'sentence': [
				'{statement}!',
				'{statement}, and {statement}!',
				'{condition} {conclusion}!',
				'{condition} {conclusion}, and {statement}!',
			],
			'statement': [
				'{pronoun} {fucking} {noun.good}-{verb.bad|tense.present-participle} {noun.ist.bad|plural} {verb.synonym.must-die}',
			],
			'conclusion': [
				'you can {verb.synonym.die}',
			],
		})

		var calm = new Baba.Grammar('tumblr-calm', ['{', '}'], ['[', ']'])
		calm.require('tumblr-common')
		calm.addGrammar({
			'sentence': [
				'{statement}.',
			],
			'statement': [
				'it is {adjective.synonym.important} that you[ all] [are aware|realize] that {verb.bad|tense.present-participle} {noun.ist.good|plural} is {adjective.synonym.bad}',
			],
		})

		// TODO add tumblrized grammar transforms
	}

	// Export as either CommonJS or AMD module
	if (typeof module === 'object' && module.exports) {
		module.exports = init
	}
	else if (typeof define === 'function' && define.amd) {
		define(function () {
			return init
		})
	}
	else {
		// Initialize from global object, e.g. if running in browser
		init(global.Baba)
	}
})(this,
   (typeof module !== 'undefined' ? module : false),
   (typeof define !== 'undefined' ? define : false))
