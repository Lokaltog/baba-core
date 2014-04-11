/*!
 * Git manual grammar for Baba
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

(function (global, module, define) {
	function init (Baba) {
		var grammar = new Baba.Grammar('git-manual', ['{', '}'], ['[', ']'])

		grammar.require('common')
		grammar.addTransforms({
			'__common__': {
				'constantify': function (str) {
					return str.toUpperCase().replace(/[^a-z0-9]/gi, '_')
				},
			},
		})
		grammar.addGrammar({
			'sentence': [
				'{condition|uppercase-first}, {statement}.',
				'{condition|uppercase-first}, {statement}, {conclusion}.',
				'{statement|uppercase-first}.',
				'{statement|uppercase-first}, {conclusion}.',
			],
			'paragraph': [
				'{sentence} {sentence}',
				'{sentence} {sentence} {sentence}',
				'{sentence} {sentence} {sentence} {sentence}',
			],

			'verb': {
				'git': '[add|allot|annotate|apply|archive|bisect|blame|branch|bundle|check|checkout|cherry-pick|clean|clone|commit|configure|count|describe|diff|export|fail|fast-export|fast-import|fetch|filter-branch|format-patch|forward-port|fsck|grep|import|index|initialize|log|merge|name|note|pack|parse|patch|perform|prevent|prune|pull|push|quiltimport|reapply|rebase|reflog|relink|remote|remove|repack|request|reset|reset|return|rev-list|rev-parse|revert|save|send|set|show|specify|stage|stash|strip]',
				'common': '[abandon|abduct|abolish|abuse|accuse|acquire|activate|adapt|add|address|adjust|advise|aid|alert|allocate|answer|apprehend|approach|arbitrate|arrange|arrest|assault|assemble|assess|assign|assist|attack|attract|audit|augment|authenticate|authorize|automate|avoid|award|balance|bang|beat|berate|bite|blast|blend|block|blow|book|boost|brace|brief|brighten|buck|bump|bury|bushwhack|calculate|call|calm|cancel|capitalize|catch|centralize|certify|challenge|change|channel|charge|chart|chase|check|choke|circumscribe|circumvent|clap|clarify|classify|climb|clip|clutch|coach|collaborate|collapse|collate|collect|collide|combine|command|commandeer|compile|complete|compose|compute|conceive|condense|configure|conserve|consolidate|construct|consult|contract|control|convert|coordinate|correlate|counsel|count|cram|crash|create|cripple|critique|cultivate|cure|customize|cut|decorate|decrease|define|delegate|delete|delineate|deliver|demonstrate|derive|describe|design|detail|detect|determine|develop|devise|diagnose|dictate|direct|discard|discover|dispatch|display|dissect|distinguish|distribute|ditch|divert|dodge|dominate|dope|double|douse|draft|drag|drain|dramatize|drape|draw|dress|drill|drink|drop|drown|drug|dry|dunk|earn|edge|edit|educate|eject|elect|elevate|eliminate|employ|enable|enact|encourage|endure|engage|engineer|enjoin|ensnare|ensure|enter|equip|escalate|escape|establish|evacuate|evade|evaluate|evict|examine|execute|exhale|exhibit|exit|expand|expedite|expel|explode|experience|experiment|explain|explore|expose|extend|extirpate|extract|extricate|fade|fake|fashion|fear|feed|feel|fight|file|fill|find|finger|finish|fix|flag|flap|flash|flatten|flaunt|flay|flick|fling|flip|flog|flounder|flout|flush|focus|fondle|force|forecast|forge|formalize|form|formulate|fornicate|foster|found|fumble|fund|furnish|gain|gather|generate|gesture|get|give|gouge|govern|graduate|grab|grasp|greet|grind|grip|grope|ground|grow|guard|guide|gyrate|hack|hail|halt|halve|hammer|handle|hang|harass|hasten|haul|head|help|hide|hijack|hire|hit|hitch|hoist|hold|hug|hurl|hurtle|hypothesize|identify|ignore|illustrate|imitate|implement|improve|improvise|increase|index|indict|individualize|induce|inflict|influence|inform|initiate|inject|injure|insert|inspect|inspire|install|instigate|instruct|integrate|intensify|interchange|interpret|interview|introduce|invade|invent|investigate|isolate|itemize|jab|jam|jar|jerk|jimmy|jingle|jolt|judge|jump|justify|keel|keynote|kibitz|kick|kidnap|kill|knife|land|lash|launch|lead|leap|learn|lecture|lessen|level|license|lick|link|listen|locate|log|lower|make|maim|maintain|manage|mangle|manipulate|manufacture|mark|market|massage|master|maul|measure|mediate|meet|mend|mentor|mimic|minimize|mobilize|mock|model|molest|monitor|motivate|mourn|move|mumble|murder|muster|mutilate|nab|nag|nail|narrow|needle|negotiate|nick|nip|nominate|nurture|observe|obtain|occupy|offer|operate|order|organize|originate|outline|overcome|oversee|pack|paddle|page|panic|park|parry|pass|pat|patrol|pause|paw|peel|penetrate|perceive|perfect|perform|persuade|photograph|pick|picket|pile|pilot|pin|pinch|pioneer|pirate|pitch|place|plan|play|plow|plunge|pocket|poke|polish|pose|position|pounce|predict|prepare|prescribe|present|print|prioritize|probe|process|procure|prod|produce|program|project|promote|prompt|proofread|propel|propose|protect|prove|provide|provoke|publicize|publish|pull|pump|punch|purchase|purge|pursue|push|qualify|question|quicken|quit|quiz|race|raid|raise|ram|ransack|rate|rattle|ravage|read|realize|rebuild|receive|recommend|reconcile|record|recoup|recruit|redeem|reduce|refer|regain|regulate|reinforce|rejoin|relate|relax|relieve|remove|render|renew|renovate|reorganize|repair|repel|report|represent|repulse|research|resign|resist|resolve|respond|restore|retain|retaliate|retreat|retrieve|reveal|review|revise|ride|rip|risk|rob|rock|roll|rub|rush|salute|satisfy|save|saw|scale|scan|scare|scatter|scavenge|schedule|scold|scoop|score|scour|scout|scrape|scream|screen|screw|scrub|scruff|scuffle|sculpt|seal|search|secure|seduce|segment|seize|select|sell|sense|serve|service|set|sever|sew|shake|shanghai|shape|share|sharpen|shave|shear|shell|shield|shift|shock|shoot|shorten|shout|shove|shovel|show|shun|sidestep|signal|simplify|sip|skim|skip|skirt|slacken|slam|slap|slash|slay|slide|smack|smear|smell|smuggle|snap|snatch|sniff|snuggle|soak|soil|solve|sort|spear|spin|splice|split|spot|spread|stack|stamp|start|startle|steal|steer|stiffen|stifle|stimulate|stock|stomp|stop|strangle|strap|streamline|strengthen|stress|strike|strip|stroke|stub|study|stuff|stun|subdue|submerge|submit|suck|summarize|summon|supervise|support|surrender|survey|suspend|sustain|swagger|swallow|swap|swing|swipe|switch|synergize|synthesize|systematize|tabulate|tackle|take|tap|target|taste|taunt|teach|tear|tease|terrorize|test|thrash|thread|threaten|throw|tickle|tie|tighten|tilt|tip|toss|touch|tout|track|train|transcribe|transfer|transform|translate|transport|trap|tread|treat|trim|trip|triple|tuck|tug|tumble|turn|tutor|twist|type|uncover|understand|undertake|undo|undress|unfold|unify|unite|unravel|untangle|unwind|update|usher|utilize|vacate|validate|value|vanquish|vault|vent|verbalize|verify|violate|ward|watch|wave|weigh|whack|whip|whirl|whistle|widen|wield|wiggle|withdraw|work|wreck|wrench|wrestle|write|yank|yell|yelp|yield|zap|zip]',
				'synonym': {
					'perform': '[perform|execute|apply]',
					'supply': '[supply|specify|set|define|provide]',
					'will': '[can|may|must|should|could|will]',
					'verify': '[control|verify|check]',
				},
			},

			'noun': {
				'git': '[archive|area|base|branch|change|commit|file|head|history|index|log|object|origin|pack|path|ref|remote|stage|stash|submodule|subtree|tag|tip|tree|upstream]',
				'location': '[non-{verb.git|tense.past} |][applied|downstream|local|remote|staged|unstaged|upstream]',
				'synonym': {
					'failure': '[failure|error]',
					'option': '[option|argument|flag]',
					'command': '[command|executable|action]',
				},
			},

			'adjective': {
				'git-action': '[automatic|passive|temporary|staged]',
				'synonym': {
					'possible': [
						'possible',
						'a [{synonym.small-chance} |]possibility',
						'a [{synonym.small-chance} |]chance',
					],
					'relevant': '[relevant|applicable|appropriate|significant]',
				},
			},

			'adverb': {
				'synonym': {
					'immediately': '[immediately|soon|some time|a while]',
					'previously': '[previously|earlier|formerly|once]',
					'sometimes': '[sometimes|in {determiner} cases]',
					'cleanly': '[un|][cleanly|successfully]',
				},
			},

			'synonym': {
				'small-chance': '[certain|small|rare]',
			},

			'conjunction': {
				'and-or': '[and|or|and/or]',
				'conditional': '[if|when|whenever|provided that|in case]',
				'conclusion': '[as|because|and|but|so]',
			},

			'preposition': '[before|below|for|from|inside|next to|opposite of|outside|over|to]',
			'determiner': '[a few|all|any|some|the|various]',
			'subject': '[you|the user|the {command-name} command]',

			'command-name-raw': 'git-{verb.common}-{noun.git}',
			'command-name': '<code>{command-name-raw}</code>',
			'command-option-raw': '--[{verb.common}-|]{verb.common}-{noun.git}',
			'command-option': '<code>{command-option-raw}</code>',

			'git-path-raw': '{noun.git|plural}/{noun.git|plural}/',
			'git-path': '<code>{git-path-raw}</code>',

			'multiple-nouns': '{determiner} {verb.git|tense.past} {noun.git|plural}',
			'located-noun': '[{noun.location} |]{noun.git}',
			'constant-noun-prefix': '[new|old|this|other|remote|local]',
			'constant-noun-constant': '{verb.common}_[{constant-noun-prefix}_|]{noun.git}',
			'constant-noun': [
				'<i>&lt;[{constant-noun-prefix}|{verb.common}-]{noun.git}&gt;</i>',
				'<code>{constant-noun-constant|constantify}</code>',
			],

			// sentence objects that use the stuff defined above
			'condition': [
				'{conjunction.conditional} {constant-noun} is [not |]{verb.git|tense.past}',
				'{conjunction.conditional} {command-name} {verb.git|tense.present} {noun.git|prepend-an}',
			],
			'conclusion': [
				'{conjunction.conclusion} {statement}',
			],
			'statement': [
				'{constant-noun} is {verb.git|tense.past} to {verb.git} the {noun.git} of {determiner} {noun.git|plural} {preposition} the {noun.git}',
				'{command-name} {command-option} {verb.synonym.will} {verb.synonym.perform} {adjective.git-action|prepend-an} {command-name} before [{verb.git|tense.present-participle} the {noun.git}|doing anything else]',
				'{multiple-nouns} are {verb.git|tense.past} to {constant-noun} by {command-name}',
				'the same set of {noun.git|plural} would [{adverb.synonym.sometimes} |]be {verb.git|tense.past} in {adjective.git-action|prepend-an} {noun.git}',
				'{multiple-nouns} that were {adverb.synonym.previously} {verb.git|tense.past} {preposition} the {adjective.git-action} {noun.git|plural} are {verb.git|tense.past} to {adjective.git-action|prepend-an} {noun.git}',
				'it is [{adverb.synonym.sometimes} |]{adjective.synonym.possible} that {verb.git|tense.past|prepend-an} {noun.synonym.failure} {verb.synonym.will} prevent {adjective.git-action} {verb.git|tense.present-participle} of {multiple-nouns}',
				'{subject} {verb.synonym.will} {verb.git} {determiner} {noun.git|plural} {conjunction.and-or} run {command-name} {command-option} instead',
				'to {verb.git} {adjective.git-action|prepend-an} {constant-noun} {conjunction.and-or} {verb.git} the working {noun.git|plural}, use the command {command-name} {command-option}',
				'the {noun.git} to be {verb.git|tense.past} can be {verb.synonym.supply|tense.past} in several ways',
				'the {command-option} {noun.synonym.option} can be used to {verb.git} {noun.git|prepend-an} for the {noun.git} that is {verb.git|tense.past} by {adjective.git-action|prepend-an} {noun.git}',
				'any {verb.git|tense.present-participle} of {noun.git|prepend-an} that {verb.git|tense.present} {noun.git|prepend-an} {adverb.synonym.immediately} after can be {verb.git|tense.past} with {command-name}',
				'after {verb.git|tense.present-participle} {noun.git|plural} to many {noun.git|plural}, you can {verb.git} the {noun.git} of the {noun.git|plural}',
				'after {command-name|prepend-an} ({verb.git|tense.past} by {command-name}[ {conjunction.and-or} {command-name}|]) {verb.git|tense.present} {noun.git|prepend-an}, {adverb.synonym.cleanly} {verb.git|tense.past} {noun.git|plural} are {verb.git|tense.past} for {subject}, and {noun.git|plural} that were {verb.git|tense.past} during {verb.git|tense.present-participle} are left in {verb.git|tense.past|prepend-an} state',
				'{multiple-nouns} {verb.git|tense.past} by {noun.git|plural} in the {located-noun}, but that [{adverb.synonym.sometimes} |]are [not |]in {constant-noun}, are {verb.git|tense.past} in {adjective.git-action|prepend-an} {noun.git}',
				'{command-name} takes {noun.synonym.option|plural} {adjective.synonym.relevant} to the {command-name} {noun.synonym.command} to {verb.synonym.verify} what is {verb.git|tense.past} and how',
			],
			'command-action': '{$command-verb verb.common} {determiner} {noun.location} {$command-noun noun.git|noun.plural} {preposition} {determiner} {verb.git|tense.past} {located-noun|noun.plural}',
			'command-description': '{$command-verb verb.common|verb.tense.present} {determiner} {noun.location} {$command-noun noun.git|noun.plural} {preposition} {determiner} {verb.git|tense.past} {located-noun|noun.plural}, and {statement}.',
			'option-description': [
				'{verb.git} the {noun.git|plural} of {determiner} {noun.git|plural} that are {verb.git|tense.past}',
				'{conjunction.conditional} this {noun.synonym.option} is {verb.synonym.supply|tense.past}, the {noun.git} prefixes {git-path} {conjunction.and-or} {git-path}',
				'the {noun.git} {verb.synonym.will} [not |]be {verb.common|tense.past} by {verb.git|tense.past|prepend-an} {noun.git}',
				'use {noun.git} to {verb.git} {git-path} to {verb.git|tense.past|prepend-an} {noun.git}',
				'with[out|] this {noun.synonym.option}, {command-name} {command-option} {verb.git|tense.present} {noun.git|plural} that {verb.git} the {verb.synonym.supply|tense.past} {noun.git|plural}',
			],
		})
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
