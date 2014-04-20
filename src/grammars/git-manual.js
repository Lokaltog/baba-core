Baba.registerGrammar('git-manual', function(require, res, tf, $, $var) {
	var common = require('common')

	function split(str, separator) {
		return str.split(separator || '|')
	}

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	// Transforms
	tf('constantify', function (str) {
		return $(str)().toUpperCase().replace(/[^a-z0-9]/gi, '_')
	})

	// Shorthands for the most common transforms for improved minification and less typing
	var tfPrefixAn = common.tf('prefixAn')
	var tfUcFirst = common.tf('ucFirst')
	var tfNounPlural = common.tf('nounPlural')
	var tfVerbTPast = common.tf('verbTPast')
	var tfVerbTPresent = common.tf('verbTPresent')
	var tfVerbTPP = common.tf('verbTPP')

	// Will take a bit less space when uglified
	// Some of these are repeated a lot in git phrases
	var COMMA = ', '
	var PERIOD = '. '
	var SPC = ' '
	var NIL = ''
	var DASH = '-'
	var LODASH = '_'
	var SLASH = '/'

	var W_THE = ' the '

	// VERBS
	var verbGit = split('add|allot|annotate|apply|archive|bisect|blame|branch|bundle|check|checkout|cherry-pick|clean|clone|commit|configure|count|describe|diff|export|fail|fast-export|fast-import|fetch|filter-branch|format-patch|forward-port|fsck|grep|import|index|initialize|log|merge|name|note|pack|parse|patch|perform|prevent|prune|pull|push|quiltimport|reapply|rebase|reflog|relink|remote|remove|repack|request|reset|reset|return|rev-list|rev-parse|revert|save|send|set|show|specify|stage|stash|strip')
	var verbCommon = split('abandon|abduct|abolish|abuse|accuse|acquire|activate|adapt|add|address|adjust|advise|aid|alert|allocate|answer|apprehend|approach|arbitrate|arrange|arrest|assault|assemble|assess|assign|assist|attack|attract|audit|augment|authenticate|authorize|automate|avoid|award|balance|bang|beat|berate|bite|blast|blend|block|blow|book|boost|brace|brief|brighten|buck|bump|bury|bushwhack|calculate|call|calm|cancel|capitalize|catch|centralize|certify|challenge|change|channel|charge|chart|chase|check|choke|circumscribe|circumvent|clap|clarify|classify|climb|clip|clutch|coach|collaborate|collapse|collate|collect|collide|combine|command|commandeer|compile|complete|compose|compute|conceive|condense|configure|conserve|consolidate|construct|consult|contract|control|convert|coordinate|correlate|counsel|count|cram|crash|create|cripple|critique|cultivate|cure|customize|cut|decorate|decrease|define|delegate|delete|delineate|deliver|demonstrate|derive|describe|design|detail|detect|determine|develop|devise|diagnose|dictate|direct|discard|discover|dispatch|display|dissect|distinguish|distribute|ditch|divert|dodge|dominate|dope|double|douse|draft|drag|drain|dramatize|drape|draw|dress|drill|drink|drop|drown|drug|dry|dunk|earn|edge|edit|educate|eject|elect|elevate|eliminate|employ|enable|enact|encourage|endure|engage|engineer|enjoin|ensnare|ensure|enter|equip|escalate|escape|establish|evacuate|evade|evaluate|evict|examine|execute|exhale|exhibit|exit|expand|expedite|expel|explode|experience|experiment|explain|explore|expose|extend|extirpate|extract|extricate|fade|fake|fashion|fear|feed|feel|fight|file|fill|find|finger|finish|fix|flag|flap|flash|flatten|flaunt|flay|flick|fling|flip|flog|flounder|flout|flush|focus|fondle|force|forecast|forge|formalize|form|formulate|fornicate|foster|found|fumble|fund|furnish|gain|gather|generate|gesture|get|give|gouge|govern|graduate|grab|grasp|greet|grind|grip|grope|ground|grow|guard|guide|gyrate|hack|hail|halt|halve|hammer|handle|hang|harass|hasten|haul|head|help|hide|hijack|hire|hit|hitch|hoist|hold|hug|hurl|hurtle|hypothesize|identify|ignore|illustrate|imitate|implement|improve|improvise|increase|index|indict|individualize|induce|inflict|influence|inform|initiate|inject|injure|insert|inspect|inspire|install|instigate|instruct|integrate|intensify|interchange|interpret|interview|introduce|invade|invent|investigate|isolate|itemize|jab|jam|jar|jerk|jimmy|jingle|jolt|judge|jump|justify|keel|keynote|kibitz|kick|kidnap|kill|knife|land|lash|launch|lead|leap|learn|lecture|lessen|level|license|lick|link|listen|locate|log|lower|make|maim|maintain|manage|mangle|manipulate|manufacture|mark|market|massage|master|maul|measure|mediate|meet|mend|mentor|mimic|minimize|mobilize|mock|model|molest|monitor|motivate|mourn|move|mumble|murder|muster|mutilate|nab|nag|nail|narrow|needle|negotiate|nick|nip|nominate|nurture|observe|obtain|occupy|offer|operate|order|organize|originate|outline|overcome|oversee|pack|paddle|page|panic|park|parry|pass|pat|patrol|pause|paw|peel|penetrate|perceive|perfect|perform|persuade|photograph|pick|picket|pile|pilot|pin|pinch|pioneer|pirate|pitch|place|plan|play|plow|plunge|pocket|poke|polish|pose|position|pounce|predict|prepare|prescribe|present|print|prioritize|probe|process|procure|prod|produce|program|project|promote|prompt|proofread|propel|propose|protect|prove|provide|provoke|publicize|publish|pull|pump|punch|purchase|purge|pursue|push|qualify|question|quicken|quit|quiz|race|raid|raise|ram|ransack|rate|rattle|ravage|read|realize|rebuild|receive|recommend|reconcile|record|recoup|recruit|redeem|reduce|refer|regain|regulate|reinforce|rejoin|relate|relax|relieve|remove|render|renew|renovate|reorganize|repair|repel|report|represent|repulse|research|resign|resist|resolve|respond|restore|retain|retaliate|retreat|retrieve|reveal|review|revise|ride|rip|risk|rob|rock|roll|rub|rush|salute|satisfy|save|saw|scale|scan|scare|scatter|scavenge|schedule|scold|scoop|score|scour|scout|scrape|scream|screen|screw|scrub|scruff|scuffle|sculpt|seal|search|secure|seduce|segment|seize|select|sell|sense|serve|service|set|sever|sew|shake|shanghai|shape|share|sharpen|shave|shear|shell|shield|shift|shock|shoot|shorten|shout|shove|shovel|show|shun|sidestep|signal|simplify|sip|skim|skip|skirt|slacken|slam|slap|slash|slay|slide|smack|smear|smell|smuggle|snap|snatch|sniff|snuggle|soak|soil|solve|sort|spear|spin|splice|split|spot|spread|stack|stamp|start|startle|steal|steer|stiffen|stifle|stimulate|stock|stomp|stop|strangle|strap|streamline|strengthen|stress|strike|strip|stroke|stub|study|stuff|stun|subdue|submerge|submit|suck|summarize|summon|supervise|support|surrender|survey|suspend|sustain|swagger|swallow|swap|swing|swipe|switch|synergize|synthesize|systematize|tabulate|tackle|take|tap|target|taste|taunt|teach|tear|tease|terrorize|test|thrash|thread|threaten|throw|tickle|tie|tighten|tilt|tip|toss|touch|tout|track|train|transcribe|transfer|transform|translate|transport|trap|tread|treat|trim|trip|triple|tuck|tug|tumble|turn|tutor|twist|type|uncover|understand|undertake|undo|undress|unfold|unify|unite|unravel|untangle|unwind|update|usher|utilize|vacate|validate|value|vanquish|vault|vent|verbalize|verify|violate|ward|watch|wave|weigh|whack|whip|whirl|whistle|widen|wield|wiggle|withdraw|work|wreck|wrench|wrestle|write|yank|yell|yelp|yield|zap|zip')

	// NOUNS
	var nounGit = split('archive|area|base|branch|change|commit|file|head|history|index|log|object|origin|pack|path|ref|remote|stage|stash|submodule|subtree|tag|tip|tree|upstream')
	var nounLocation = $([$('non-', tfVerbTPast(verbGit), SPC), NIL], split('applied|downstream|local|remote|staged|unstaged|upstream'))

	// ADJECTIVES
	var adjGit = split('automatic|passive|temporary|staged')

	// SYNONYMS
	// verbs
	var synPerform = split('perform|execute|apply')
	var synSupply = split('supply|specify|set|define|provide')
	var synWill = split('can|may|must|should|could|will')
	var synVerify = split('control|verify|check')
	// nouns
	var synFailure = split('failure|error')
	var synOption = split('option|argument|flag')
	var synCommand = split('command|executable|action')
	// adjectives
	var synPossible = [
		'possible',
		$(['a ', synSmallChance, SPC, NIL], 'possibility'),
		$(['a ', synSmallChance, SPC, NIL], 'chance'),
	]
	var synRelevant = split('relevant|applicable|appropriate|significant')
	// adverbs
	var synImmediately = split('immediately|soon|some time|a while')
	var synPreviously = split('previously|earlier|formerly|once')
	var synSometimes = ['sometimes', $('in ', determiner, ' cases')]
	var synCleanly = $(['un', NIL], ['cleanly', 'successfully'])
	// misc
	var synSmallChance = split('certain|small|rare')

	// CONJUNCTIONS
	var conjAndOr = split('and|or|and/or')
	var conjConditional = split('if|when|whenever|provided that|in case|every time')
	var conjConclusion = split('as|because|and|but|so')

	// GIT STUFF
	var gitPath = $(tfNounPlural(nounGit), SLASH, [$(tfVerbTPresent(verbCommon), SLASH), NIL], tfNounPlural(nounGit))
	var gitCommandName = $('git-', verbCommon, DASH, nounGit)
	var gitCommandOption = $([$('-', 'zqwåøæZQWÅØÆ'.split(NIL), SPC), NIL], '--', [$(verbCommon, DASH), NIL], verbCommon, DASH, nounGit)

	// MISC
	var preposition = split('before|below|for|from|inside|next to|opposite of|outside|over|to')
	var determiner = split('a few|all|any|some|the|various')
	var subject = [
		'you',
		'the user',
		$('the ', gitCommandName, ' command'),
	]

	var multipleNouns = $(determiner, SPC, tfVerbTPast(verbGit), SPC, tfNounPlural(nounGit))
	var locatedNoun = $([$(nounLocation, SPC), NIL], nounGit)

	var constNounPrefix = split('new|old|this|that|remote|local|other')
	var constNounConstant = $(verbCommon, LODASH, [$(constNounPrefix, LODASH), NIL], nounGit)
	var constNoun = [
		$('<', [constNounPrefix, verbCommon], DASH, nounGit, '>'),
		$(tf('constantify')(constNounConstant)),
	]

	// TODO create word classes for chaining with prototypes, e.g.: addTransforms('verb', verbTransforms); verbGit.tPast().an()

	// FULL SENTENCES
	var condition = [
		$(conjConditional, SPC, constNoun, ' is ', ['not ', NIL], tfVerbTPast(verbGit)),
		$(conjConditional, SPC, gitCommandName, SPC, tfVerbTPresent(verbGit), SPC, tfPrefixAn(nounGit)),
	]
	var statement = [
		$(constNoun, ' is ', tfVerbTPast(verbGit), ' to ', verbGit, W_THE, nounGit, ' of ', determiner, SPC, tfNounPlural(nounGit), SPC, preposition, W_THE, nounGit),
		$(gitCommandName, SPC, gitCommandOption, SPC, synWill, SPC, synPerform, SPC, tfPrefixAn(adjGit), SPC, gitCommandName, ' before ', [$(tfVerbTPP(verbGit), W_THE, nounGit), 'doing anything else']),
		$(multipleNouns, ' are ', tfVerbTPast(verbGit), ' to ', constNoun, ' by ', gitCommandName),
		$('the same set of ', tfNounPlural(nounGit), ' would ', [$(synSometimes, SPC), NIL], ' be ', tfVerbTPast(verbGit), ' in ', tfPrefixAn(adjGit), SPC, nounGit),
		$(multipleNouns, ' that were ', synPreviously, SPC, tfVerbTPast(verbGit), SPC, preposition, W_THE, adjGit, SPC, tfNounPlural(nounGit), ' are ', tfVerbTPast(verbGit), ' to ', tfPrefixAn(adjGit), SPC, nounGit),
		$('it is ', [$(synSometimes, SPC), NIL], synPossible, ' that ', tfPrefixAn(tfVerbTPast(verbGit)), SPC, synFailure, SPC, synWill, ' prevent ', adjGit, SPC, tfVerbTPP(verbGit), ' of ', multipleNouns),
		$(subject, SPC, synWill, SPC, verbGit, SPC, determiner, SPC, tfNounPlural(nounGit), SPC, conjAndOr, ' run ', gitCommandName, SPC, gitCommandOption, ' instead'),
		$('to ', verbGit, SPC, tfPrefixAn(adjGit), SPC, constNoun, SPC, conjAndOr, SPC, verbGit, ' the working ', tfNounPlural(nounGit), ', use the ', synCommand, SPC, gitCommandName, SPC, gitCommandOption),
		$(W_THE, nounGit, ' to be ', tfVerbTPast(verbGit), ' can be ', tfVerbTPast(synSupply), ' in ', ['several', 'many'], ' ways'),
		$(W_THE, gitCommandOption, SPC, synOption, ' can be used to ', verbGit, SPC, tfPrefixAn(nounGit), ' for the ', nounGit, ' that is ', tfVerbTPast(verbGit), ' by ', tfPrefixAn(adjGit), SPC, nounGit),
		$('any ', tfVerbTPP(verbGit), ' of ', tfPrefixAn(nounGit), ' that ', tfVerbTPresent(verbGit), SPC, tfPrefixAn(nounGit), SPC, synImmediately, ' after can be ', tfVerbTPast(verbGit), ' with ', gitCommandName),
		$('after ', tfVerbTPP(verbGit), SPC, tfNounPlural(nounGit), ' to many ', tfNounPlural(nounGit), ', you can ', verbGit, ' the ', nounGit, ' of the ', tfNounPlural(nounGit)),
		$('after ', tfPrefixAn(gitCommandName), ' (', tfVerbTPast(verbGit), ' by ', gitCommandName, [$(SPC, conjAndOr, SPC, gitCommandName), NIL], ') ', tfVerbTPresent(verbGit), SPC, tfPrefixAn(nounGit), COMMA, synCleanly, SPC, tfVerbTPast(verbGit), SPC, tfNounPlural(nounGit), ' are ', tfVerbTPast(verbGit), ' for ', subject),
		$(tfNounPlural(nounGit), ' that were ', tfVerbTPast(verbGit), ' during ', tfVerbTPP(verbGit), ' are left in ', tfPrefixAn(tfVerbTPast(verbGit)), ' state'),
		$(multipleNouns, SPC, tfVerbTPast(verbGit), ' by ', tfNounPlural(nounGit), ' in the ', locatedNoun, ', but that ', [$(synSometimes, SPC), NIL], 'are ', ['not', NIL], ' in ', constNoun, ', are ', tfVerbTPast(verbGit), ' in ', tfPrefixAn(adjGit), SPC, nounGit),
		$(gitCommandName, ' takes ', tfNounPlural(synOption), SPC, synRelevant, ' to the ', gitCommandName, SPC, synCommand, ' to ', synVerify, ' what is ', tfVerbTPast(verbGit), ' and how'),
	]
	var conclusion = [
		$(conjConclusion, SPC, statement),
	]

	var gitCommandOptionDescription = [
		$(verbGit, W_THE, tfNounPlural(nounGit), ' of ', determiner, SPC, tfNounPlural(nounGit), ' that are ', tfVerbTPast(verbGit)),
		$(conjConditional, ' this ', synOption, ' is ', tfVerbTPast(synSupply), ', the ', nounGit, ' prefixes ', gitPath, SPC, conjAndOr, SPC, gitPath),
		$('the ', nounGit, SPC, synWill, ['not', NIL], ' be ', tfVerbTPast(verbCommon), ' by ', tfPrefixAn(tfVerbTPast(verbGit)), SPC, nounGit),
		$('use ', nounGit, ' to ', verbGit, SPC, gitPath, ' to ', tfPrefixAn(tfVerbTPast(verbGit)), SPC, nounGit),
		$('with', ['out', NIL], ' this ', synOption, COMMA, gitCommandName, SPC, gitCommandOption, SPC, tfVerbTPresent(verbGit), SPC, tfNounPlural(nounGit), ' that ', verbGit, W_THE, tfVerbTPast(synSupply), SPC, tfNounPlural(nounGit)),
	]
	var gitDescribeAction = $($var('command-verb', verbCommon), SPC, determiner, SPC, nounLocation, SPC, tfNounPlural($var('command-noun', nounGit)), SPC, preposition, SPC, determiner, SPC, tfVerbTPast(verbGit), SPC, tfNounPlural(locatedNoun))
	var gitDescribeCommand= $(tfVerbTPast($var('command-verb', verbCommon)), SPC, determiner, SPC, nounLocation, SPC, tfNounPlural($var('command-noun', nounGit)), SPC, preposition, SPC, determiner, SPC, tfVerbTPast(verbGit), SPC, tfNounPlural(locatedNoun), ', and ', statement)

	var sentence = [
		$(tfUcFirst(condition), COMMA, statement, PERIOD),
		$(tfUcFirst(condition), COMMA, statement, COMMA, conclusion, PERIOD),
		$(tfUcFirst(statement), PERIOD),
		$(tfUcFirst(statement), COMMA, conclusion, PERIOD),
	]
	function paragraph() {
		var ret = []
		// Randomly repeat sentences
		for (var i = 0; i < randomInt(4, 2); i++) {
			ret.push(sentence)
		}
		return $.apply(this, ret)
	}

	res({
		paragraph: paragraph,
		gitCommandOptionDescription: gitCommandOptionDescription,
		gitDescribeAction: gitDescribeAction,
		gitDescribeCommand: gitDescribeCommand,
	})
})
