/*!
 * Tumblr grammars for Baba
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

(function (global, module, define) {
	function split(str, delimiter) {
		// Pre-split strings to improve performance
		return str.split(delimiter || '|')
	}

	function init(Baba) {
		var common = new Baba.Grammar('tumblr-common', ['{', '}'], ['[', ']'])
		common.require('common')
		common.addGrammar({
			'emoji': ['(◕﹏◕✿)', '（　｀ー´）', '(•﹏•)', '└(｀0´)┘', 'ᕙ(⇀‸↼‶)ᕗ', 'ᕦ(ò_óˇ)ᕤ', '(⋋▂⋌)', '(¬_¬)', '٩(×̯×)۶', '(╯°□°)╯︵ ┻━┻', '(⊙﹏⊙✿)', '(ﾉ◕ヮ◕)ﾉ*: ･ﾟ✧', '(⊙_◎)'],
			'alignment': {
				'pre': {
					'sexual': split('andro|anthro|demi|gender|gray|gyne|pomo|skolio|tulpa'),
					'personal': split('a|bi|demi|inter|multi|non|omni|pan|para|poly|trans'),
				},
				'post': {
					'sexual': split('amorous|romantic|platonic|sensual|sexual'),
					'personal': split('ethnic|gender|queer|racial|romantic|sensual|sexual'),
				},
				'sexual': '{alignment.pre.sexual}{alignment.post.sexual}',
				'personal': '{alignment.pre.personal}{alignment.post.personal}',
			},
			'adjective': {
				'good': split('attractive|neutral|natural|integral|intersectional|equal|feminine|invisible|fat|deathfat|confident|proud'),
				'bad': split('masculine|white|able-bodied|binary|smallfat|thin|antediluvian|awful|body-shaming|chauvinistic|ciscentric|close-minded|deluded|entitled|heteropatriarchal|patriarchal|ignorant|inconsiderate|insensitive|intolerant|judgmental|misogynistic|nphopic|oppressive|pathetic|racist|rape culture-supporting|worthless'),
				'ist': split('cyber|gay|lesbian|liberal|radical|sex-positive|male|intersectional'),
				'sn': {
					'bad': split('bad|terrible|awful|problematic'),
					'good': split('good|great|awesome'),
					'important': split('important|crucial'),
				},
			},
			'adverb': {
				'sexual': '{pre.sexual}{post.sexual}',
				'personal': '{pre.personal}{post.personal}',
				'sn': {
					'now': split('now|right {fucking} now|right away'),
					'really': split('really|seriously'),
					'fucking': split('fucking|damn|goddamn'),
				},
			},
			'verb': {
				// Must work in any verb.tense: "you {stare-raped} that CAFAB", "{dehumanizing} species is bad"
				'good': split('abolish|self-diagnose|love'),
				'bad': split('abuse|attack|criticize|dehumanize|deny|desexualize|discriminate|erase|exotify|exploit|fetishize|harass|hypersexualize|ignore|kinkshame|label|marginalize|misgender|objectify|oppress|reject|sexualize|shame|stare-rape|stigmatize|internalize|institutionalize|colonize|appropriate|erode|censor|blame|condemn|denounce|hate|dominate'),
				'auxiliary': {
					'should': split('should|must|need to|can'),
				},

				'check': split('check|acknowledge'),
				'swear': split('screw|fuck|damn'),
			},
			'noun': {
				'subject': {
					// Example: "you fucking {basement dweller}", "all {male}s must die"
					// Must be pluralizable
					'good': split('CAFAB|CAMAB|PoC|QTPOC|WoC|ace|agnostic|ally|amputee|cross-dresser|fatty|female|furry|headmate|ladytype|little person|minority|native american|princex|radfem|survivor|transman|transnormative|transwoman|vegan|vegetarian|victim|womyn|food addict'),
					'bad': split('male|cishet|cisgender|hetero|smallfat|uterus-bearer|white womyn|MRA|TERF|asshole|basement dweller|bigot|brogrammer|cracker|creep|dudebro|feminazi|femscum|hitler|twat|loser|lowlife|mouthbreather|nazi|neckbeard|oppressor|pedophile|piece of shit|radscum|rapist|redditor|scum|shit stain|subhuman|troll|truscum|virgin'),
				},
				'concept': {
					// Example: "fuck [white womyn] {standards}"
					'good': split('rights|opinions|supremacy'),
					'bad': split('gender roles|standards'),
				},
				'action': {
					// Example: "species {entitlement} is bad"
					// Basically converted verbs from verb.bad, i.e. dehumanize -> dehumanization
					// There are no consistent rules for converting a verb to a noun with a suffix like -ion
					'good': split('abolishing|self-diagnosing|love'),
					'bad': split('abuse|attacking|criticization|dehumanization|denial|desexualizing|discrimination|erasure|exotification|exploitation|fetishization|harassment|hypersexualization|ignoring|kinkshaming|labeling|marginalization|misgendering|objectifying|oppression|rejection|sexualization|shaming|stare-raping|stigmatization|internalization|institutionalization|colonization|appropriation|erosion|censoring|blaming|condemnation|denouncement|hate|domination' +
					             // extras not in verb.bad
					             '|entitlement|privilege|culture|domination'),
				},
				'abstract': {
					// Example: "{misandry} is good", "{weight} is good", "{misogyny} is bad"
					// Will not be pluralized
					'good': split('misandry|femininity|integrity|equality|intersectionality' +
					              '|appearance|height|weight|race|womyn|hair|body hair|body|fandom|species|fat|fatty|female|food|stretchmark|color|body image'),
					'bad': split('masculinity|kyriarchy|patriarcy|superiority|misogyny' +
					             '|ideals'),
				},
				'ism-pre': {
					// Must be able to be suffixed with -ism and -ist
					'good-base': split('misandr|femin|equal|intersectional|activ|separat|commun|egalitarian|fandom|fat|lesbian|freegan|social|vegan|vegetarian|athe|food'),
					'bad-base': split('patriarch|kyriarch|masculin|misogyn|rac|fasc|able|age|binar|assimilation|chauvin|carn|cissex|class|essential|rape-apolog|singlet|traditional|transmisogyn'),
					'good': ['{noun.ism-pre.good-base}', 'anti-{noun.ism-pre.bad-base}'],
					'bad': ['{noun.ism-pre.bad-base}', 'anti-{noun.ism-pre.good-base}'],
				},
				'ism': {
					'good': '{noun.ism-pre.good}ism',
					'bad': '{noun.ism-pre.bad}ism',
				},
				'ist': {
					'good': '{noun.ism-pre.good}ist',
					'bad': '{noun.ism-pre.bad}ist',
				},
				'kin-type': split('cat|demon|dog|dolphin|dragon|fox|goat|other|poly|rabbit|wolf'),
				'kin': '{noun.kin-type}kin',
				'personality': split('individual|personality|person|spirit|entity'),
				'alignment': '{noun.personality}-[aligned|associating|identifying|type|supporting] {noun.oppressed}',
				'trigger': '{noun.good} {noun.concept.bad}',
			},
			'pronoun': {
				'subject': split('*e|ey|tho|hu|thon|jee|ve|xe|ze|zhe'), // he
				'object': split('h*|em|thong|hum|thon|jem|ver|xem|zir|hir|mer|zhim'), // him
				'possessive': split('h*s|eir|thors|hus|thons|jeir|vis|xyr|zes|hir|zer|zher'), // his
				'weird-pre': split('bun|cub|fluff|ham|kit|pan|pup|squeak|squid|purr|paw'), // for prefixing like bun/buns/bunself
				'weird-list': '{pronoun.weird-pre->p}/{$p}s/{$p}self',
				'second-person': split('you|you all'),
			},
			'concept': {
				'good': [
					// e.g. ladytype standards, basement dweller rights
					'{noun.subject.good} {noun.concept.good}',
					'{noun.subject.bad} {noun.concept.bad}',
				],
				'bad': [
					// e.g. ladytype standards, basement dweller rights
					'{noun.subject.good} {noun.concept.bad}',
					'{noun.subject.bad} {noun.concept.good}',
				],
			},
			'fuck': '{verb.swear}',
			'fuck-off': {
				'universal': [
					// Must work in sentences like "you can {fuck off}", "seriously, {screw you}"
					'[burn in|go to|rot in] hell',
					'go die in a [ditch|fire]',
					'drink [bleach|piss]',
					'fuck [off|you]',
					'shut [the fuck ]up',
					'{verb.check} your [fucking ]{noun.subject.bad} privilege',
				],
				'standalone': [
					// Must be full sentence statements
					'drop dead',
					'[fuck|screw] you',
					'get [bent|fucked with a cactus]',
					'go [kill yourself|fuck yourself|play in traffic|to hell|light yourself on fire]',
					'go drown in [bleach|your own piss]',
					'make love to yourself in a furnace',
				],
			},
			'tw-concept': '{noun.oppressed} {noun.concept.bad}',
			'tw': [
				'trigger warning: {tw-concept}, {tw-concept}, {tw-concept}',
				'trigger warning: {tw-concept} and {tw-concept}',
			],
			'interjection': split('goddamn it|ffs|for fucks sake'),
			'conjunction': {
				'and-or': split('and|or|and/or'),
				'conditional': split('if|because'),
				'conclusion': split('as|because|and|but|so'),
			},
		})

		var angry = new Baba.Grammar('tumblr-angry', ['{', '}'], ['[', ']'])
		angry.require('tumblr-common')
		angry.addGrammar({
			'alignment': {
				'angry': '[{alignment.pre.sexual}|{alignment.pre.personal}] fucking [{alignment.post.sexual}|{alignment.post.personal}]',
			},
			'condition': [
				'{conjunction.conditional} you {verb.bad} {noun.good|plural}',
			],
			'statement': {
				'universal': [
					'{pronoun.second-person} [fucking ]{noun.subject.good}-{verb.bad|tense.present-participle} {noun.ist.bad|plural} can all {fuck-off.universal}',
					'[learn|use] [my|the correct] [fucking ]pronouns you [fucking ]{adjective.bad} {noun.subject.bad}, I am {adjective.good|prepend-an}[, {adjective.good}] {noun.kin} and my pronouns are {pronoun.weird-list}',
					'[like ]seriously, {fuck-off.universal}',
				],
				'conditional': [
					'if you XXX',
				],
				'toucan': [
					'never reblog my posts [ever ]again',
					'feel free to unfollow {conjunction.and-or} block/ignore me',
					'fucking {noun.subject.bad}-{adjective.bad} people',
					'i [don|can]\'t even',
					'i am [literally ]100% done',
					'now go [the fuck ]away',
					'please leave me alone',
					'try again, [fucking ]{nouns.privileged}',
					'unfollow me right now',
					'you guys are [fucking ]impossible',
					'for the love of god',
					'i do not [fucking ]care anymore',
					'no. just no',
					'[oh my god|omg]',
					'just... stop',
					'seriously',
					'this. is. not. okay',
					'wow. just. wow',
					'i do not give a [shit|fuck]',
					'you know what? [fuck|screw] it',
				],
				'condescending': [
					'girl, please',
					'yeah, no',
					'i [literally ]could not care less',
				],
			},
			'introduction': {
				'unbelievable': [
					'how [can it be|is it] so fucking difficult to',
				],
			},
			'conclusion': [
				'i hope you {fuck-off.universal}',
				'never [fucking ][reblog|mention] [any of ]my posts [ever ]again',
			],
			'sentence': [
				'{statement.universal|uppercase-first}!',
				// '{statement.universal}, and {statement.universal}!',
				// '{condition} {statement.conditional}!',
				// '{condition} {statement.conditional}, and {statement.universal}!',
				// '{conclusion}',
				// '{noun.trigger}',
				// 'expected that to come from an {oppressed} {insult}',
				// 'fighting against {concept.bad}. fighting for {concept.good}.',
			],
		})

		var calm = new Baba.Grammar('tumblr-calm', ['{', '}'], ['[', ']'])
		calm.require('tumblr-common')
		calm.addGrammar({
			'sentence': [
				'{statement}.',
			],
			'statement': [
				'it is {adjective.sn.important} that you[ all] [are aware|realize] that {noun.ist.good} {noun.action.bad} is {adverb.sn.really} {adjective.sn.bad}',
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
