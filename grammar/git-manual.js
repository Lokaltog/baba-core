/*!
 * baba/grammar/git-manual - Git manual grammar for Baba
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

if (typeof babaGrammars === 'undefined') var babaGrammars = {}
if (typeof babaTransforms === 'undefined') var babaTransforms = {}

babaTransforms.gitManual = {
	'__common__': {
		'constantify': function (str) {
			return str.toUpperCase().replace(/[^a-z0-9]/gi, '_')
		},
	},
}

babaGrammars.gitManual = {
	'sentence': [
		'{{condition|uppercase-first}}, {{statement}}.',
		'{{condition|uppercase-first}}, {{statement}}, {{conclusion}}.',
		'{{statement|uppercase-first}}.',
		'{{statement|uppercase-first}}, {{conclusion}}.',
	],
	'paragraph': [
		'{{sentence}} {{sentence}}',
		'{{sentence}} {{sentence}} {{sentence}}',
		'{{sentence}} {{sentence}} {{sentence}} {{sentence}}',
	],

	'verb': {
		'git': '[[add|allot|annotate|apply|archive|bisect|blame|branch|bundle|check|checkout|cherry-pick|clean|clone|commit|configure|count|describe|diff|export|fail|fast-export|fast-import|fetch|filter-branch|format-patch|forward-port|fsck|grep|import|index|initialize|log|merge|name|note|pack|parse|patch|perform|prevent|prune|pull|push|quiltimport|reapply|rebase|reflog|relink|remote|remove|repack|request|reset|reset|return|rev-list|rev-parse|revert|save|send|set|show|specify|stage|stash|strip]]',
		'common': '[[abandon|abduct|abolish|abuse|accomplish|accuse|achieve|acquire|act|activate|adapt|add|address|adjust|advise|advocate|affirm|aid|aim|alert|allocate|answer|anticipate|apprehend|approach|arbitrate|arrange|arrest|assault|assemble|assess|assign|assist|assure|attack|attain|attract|audit|augment|authenticate|author|authorize|automate|avoid|award|balance|bang|bar|beat|berate|bite|blast|blend|block|blow|bolster|book|boost|brace|brief|brighten|broke|buck|budget|built|bump|bury|bushwhack|calculate|call|calm|campaign|cancel|capitalize|catch|centralize|certify|chair|challenge|champion|change|channel|charge|chart|chase|check|choke|circumscribe|circumvent|clap|clarify|clash|classify|classify|climb|clip|clutch|coach|collaborate|collapse|collar|collate|collect|collide|combine|command|commandeer|communicate|compile|complete|compose|compute|compute|conceive|condense|conduct|confer|configure|conserve|consolidate|construct|consult|contract|control|convert|coordinate|correlate|counsel|count|cram|crash|crawl|create|creep|cripple|critique|crouch|cultivate|cure|customize|cut|dance|dart|dash|deal|debate|decide|deck|decorate|decrease|deduct|define|delegate|delete|deliberate|delineate|deliver|demonstrate|derive|descend|describe|design|detail|detect|determine|develop|devise|devise|diagnose|dictate|dig|direct|discard|discover|dispatch|display|dissect|distinguish|distribute|distribute|ditch|dive|divert|do|dodge|dominate|dope|double|douse|draft|drag|drain|dramatize|drape|draw|dress|drill|drink|drip|drop|drown|drug|dry|duel|dunk|earn|ease|edge|edit|edit|educate|effect|eject|elect|elevate|eliminate|elope|elude|emerge|employ|enable|enact|encourage|endure|engage|engineer|enjoin|ensnare|ensure|enter|equip|erupt|escalate|escape|establish|establish|estimate|evacuate|evade|evaluate|evict|examine|execute|exert|exhale|exhibit|exit|expand|expand|expedite|expel|explode|experience|experiment|explain|explore|expose|extend|extirpate|extract|extricate|facilitate|fade|fake|fall|falter|fan|fashion|fast|fear|feed|feel|fend|field|fight|file|fill|finance|find|finger|finish|fix|flag|flap|flash|flatten|flaunt|flay|flee|flick|flinch|fling|flip|flit|float|flog|flounder|flout|flush|focus|fondle|force|forecast|forge|formalize|form|formulate|fornicate|foster|found|fumble|fund|furnish|gain|gallop|gather|generate|gesture|get|give|gnaw|gossip|gouge|govern|graduate|grab|grapple|grasp|greet|grind|grip|grope|ground|grow|growl|grunt|guard|guide|gyrate|hack|hail|halt|halve|hammer|handle|hang|harass|hasten|haul|head|help|hesitate|hide|hijack|hire|hit|hitch|hobble|hoist|hold|hover|hug|hurl|hurtle|hypothesize|identify|ignore|illustrate|imitate|implement|improve|improvise|inch|increase|increase|index|indict|individualize|induce|inflict|influence|inform|initiate|inject|injure|innovate|insert|inspect|inspire|install|instigate|institute|instruct|integrate|intensify|interchange|interpret|interview|introduce|invade|invent|inventory|invest|investigate|isolate|itemize|jab|jam|jar|jeer|jerk|jimmy|jingle|jolt|judge|jump|justify|keel|keynote|kibitz|kick|kidnap|kill|kneel|knife|land|lash|launch|lead|lean|leap|learn|lecture|led|left|lessen|level|license|lick|limp|link|listen|locate|log|lower|lunge|lurch|make|maim|maintain|make|manage|mangle|manipulate|manufacture|march|mark|market|massage|master|maul|measure|meddle|mediate|meet|mend|mentor|mimic|mingle|minimize|mobilize|mock|model|mold|molest|monitor|motivate|mourn|move|mumble|murder|muster|mutilate|nab|nag|nail|narrow|needle|negotiate|nick|nip|nominate|nurture|observe|obtain|occupy|offer|officiate|operate|order|organize|originate|outline|overcome|oversee|pack|participate|paddle|page|pander|panic|parachute|parade|park|parry|party|pass|pat|patrol|pause|paw|peel|peep|penetrate|perceive|perfect|perform|persuade|photograph|pick|picket|pile|pilot|pin|pinch|pioneer|pirate|pitch|placate|place|plan|play|plod|plow|plunge|pocket|poke|polish|pore|pose|position|pounce|pout|pray|predict|preen|prepare|prescribe|present|preside|preside|primp|print|prioritize|probe|process|procure|prod|produce|profitable|program|project|promote|prompt|proofread|propel|propose|protect|prove|provide|provoke|pry|publicize|publish|pull|pummel|pump|punch|purchase|purge|pursue|push|qualify|question|quicken|quit|quiz|race|raid|raise|ram|ransack|rate|rattle|ravage|rave|read|realize|rebuild|receive|recline|recommend|reconcile|reconnoiter|record|recoup|recruit|redeem|reduce|reel|refer|regain|regulate|reinforce|rejoin|relate|relate|relax|relent|relieve|remove|render|renew|renovate|reorganize|repair|repel|report|represent|repulse|research|resign|resist|resolve|respond|restore|retain|retaliate|retreat|retrieve|reveal|review|revise|ride|rip|rise|risk|rob|rock|roll|rub|run|rush|sail|salute|sap|satisfy|save|saw|scale|scamper|scan|scare|scatter|scavenge|schedule|scold|scoop|scoot|score|scour|scout|scrape|scrawl|scream|screen|screw|scrub|scruff|scuffle|sculpt|scuttle|seal|search|secure|seduce|segment|seize|select|sell|sense|serve|service|set|setup|sever|sew|shake|shanghai|shape|share|sharpen|shave|shear|shell|shield|shift|shiver|shock|shoot|shorten|shout|shove|shovel|show|shun|shut|sidestep|sigh|signal|simplify|sip|sit|size|skid|skim|skip|skirt|slacken|slam|slap|slash|slay|slide|slug|smack|smear|smell|smuggle|snap|snare|snarl|snatch|snicker|sniff|snitch|snoop|snub|snuff|snuggle|soak|sock|soil|sold|solve|sort|spark|spear|spell|spike|spin|splatter|splice|split|spot|spray|spread|spring|sprint|spurn|spy|squeak|stack|staff|stagger|stamp|stand|start|startle|steal|steer|step|stick|stiffen|stifle|stimulate|stock|stomp|stop|strangle|strap|strategize|streamline|strengthen|stress|strike|strip|stroke|struck|structure|stub|study|stuff|stumble|stun|subdue|submerge|submit|submit|succeed|suck|summarize|sum|summon|supervise|support|surrender|survey|suspend|sustain|swagger|swallow|swap|sway|swear|swerve|swim|swing|swipe|switch|synergize|synthesize|systematize|tabulate|tackle|take|tap|target|taste|taunt|teach|tear|tease|telephone|terrorize|test|thin|thrash|thread|threaten|throw|tickle|tie|tighten|tilt|tip|toss|touch|tout|track|train|transcribe|transfer|transfer|transform|translate|transport|trap|tread|treat|trim|trip|triple|trot|trounce|try|tuck|tug|tumble|turn|tutor|twist|type|uncover|understand|undertake|undo|undress|unfold|unify|unify|unite|unravel|untangle|unwind|update|usher|utilize|utilize|vacate|validate|value|vanish|vanquish|vault|vent|verbalize|verify|violate|wade|walk|wander|ward|watch|wave|wedge|weed|weigh|whack|whip|whirl|whistle|widen|wield|wiggle|win|withdraw|withdraw|work|wreck|wrench|wrestle|write|wrought|yank|yell|yelp|yield|zap|zip]]',
		'synonym': {
			'perform': '[[perform|execute|apply]]',
			'supply': '[[supply|specify|set|define|provide]]',
			'will': '[[can|may|must|should|could|will]]',
			'verify': '[[control|verify|check]]',
		},
	},

	'noun': {
		'git': '[[archive|area|base|branch|change|commit|file|head|history|index|log|object|origin|pack|path|ref|remote|stage|stash|submodule|subtree|tag|tip|tree|upstream]]',
		'location': '[[non-{{verb.git|tense.past}} |]][[applied|downstream|local|remote|staged|unstaged|upstream]]',
		'synonym': {
			'failure': '[[failure|error]]',
			'option': '[[option|argument|flag]]',
			'command': '[[command|executable|action]]',
		},
	},

	'adjective': {
		'git-action': '[[automatic|passive|temporary|staged]]',
		'synonym': {
			'possible': [
				'possible',
				'a [[{{synonym.small-chance}} |]]possibility',
				'a [[{{synonym.small-chance}} |]]chance',
			],
			'relevant': '[[relevant|applicable|appropriate|significant]]',
		},
	},

	'adverb': {
		'synonym': {
			'immediately': '[[immediately|soon|some time|a while]]',
			'previously': '[[previously|earlier|formerly|once]]',
			'sometimes': '[[sometimes|in {{determiner}} cases]]',
			'cleanly': '[[un|]][[cleanly|successfully]]',
		},
	},

	'synonym': {
		'small-chance': '[[certain|small|rare]]',
	},

	'conjunction': {
		'and-or': '[[and|or|and/or]]',
		'conditional': '[[if|when|whenever|provided that|in case]]',
		'conclusion': '[[as|because|and|but|so]]',
	},

	'preposition': '[[before|below|for|from|inside|next to|opposite of|outside|over|to]]',
	'determiner': '[[a few|all|any|some|the|various]]',
	'subject': '[[you|the user|the {{command-name}} command]]',

	'command-name-raw': 'git-{{verb.common}}-{{noun.git}}',
	'command-name-main': 'git-{{verb.common->command-verb}}-{{noun.git->command-noun}}',
	'command-name': '<code>{{command-name-raw}}</code>',
	'command-option-raw': '--[[{{verb.common}}-|]]{{verb.common}}-{{noun.git}}',
	'command-option': '<code>{{command-option-raw}}</code>',

	'git-path-raw': '{{noun.git|plural}}/{{noun.git|plural}}/',
	'git-path': '<code>{{git-path-raw}}</code>',

	'multiple-nouns': '{{determiner}} {{verb.git|tense.past}} {{noun.git|plural}}',
	'located-noun': '[[{{noun.location}} |]]{{noun.git}}',
	'constant-noun-prefix': '[[new|old|this|other|remote|local]]',
	'constant-noun-constant': '{{verb.common}}_[[{{constant-noun-prefix}}_|]]{{noun.git}}',
	'constant-noun': [
		'<i>&lt;[[{{constant-noun-prefix}}|{{verb.common}}-]]{{noun.git}}&gt;</i>',
		'<code>{{constant-noun-constant|constantify}}</code>',
	],

	// sentence objects that use the stuff defined above
	'condition': [
		'{{conjunction.conditional}} {{constant-noun}} is [[not |]]{{verb.git|tense.past}}',
		'{{conjunction.conditional}} {{command-name}} {{verb.git|tense.present}} {{noun.git|prepend-an}}',
	],
	'conclusion': [
		'{{conjunction.conclusion}} {{statement}}',
	],
	'statement': [
		'{{constant-noun}} is {{verb.git|tense.past}} to {{verb.git}} the {{noun.git}} of {{determiner}} {{noun.git|plural}} {{preposition}} the {{noun.git}}',
		'{{command-name}} {{command-option}} {{verb.synonym.will}} {{verb.synonym.perform}} {{adjective.git-action|prepend-an}} {{command-name}} before [[{{verb.git|tense.present-participle}} the {{noun.git}}|doing anything else]]',
		'{{multiple-nouns}} are {{verb.git|tense.past}} to {{constant-noun}} by {{command-name}}',
		'the same set of {{noun.git|plural}} would [[{{adverb.synonym.sometimes}} |]]be {{verb.git|tense.past}} in {{adjective.git-action|prepend-an}} {{noun.git}}',
		'{{multiple-nouns}} that were {{adverb.synonym.previously}} {{verb.git|tense.past}} {{preposition}} the {{adjective.git-action}} {{noun.git|plural}} are {{verb.git|tense.past}} to {{adjective.git-action|prepend-an}} {{noun.git}}',
		'it is [[{{adverb.synonym.sometimes}} |]]{{adjective.synonym.possible}} that {{verb.git|tense.past|prepend-an}} {{noun.synonym.failure}} {{verb.synonym.will}} prevent {{adjective.git-action}} {{verb.git|tense.present-participle}} of {{multiple-nouns}}',
		'{{subject}} {{verb.synonym.will}} {{verb.git}} {{determiner}} {{noun.git|plural}} {{conjunction.and-or}} run {{command-name}} {{command-option}} instead',
		'to {{verb.git}} {{adjective.git-action|prepend-an}} {{constant-noun}} {{conjunction.and-or}} {{verb.git}} the working {{noun.git|plural}}, use the command {{command-name}} {{command-option}}',
		'the {{noun.git}} to be {{verb.git|tense.past}} can be {{verb.synonym.supply|tense.past}} in several ways',
		'the {{command-option}} {{noun.synonym.option}} can be used to {{verb.git}} {{noun.git|prepend-an}} for the {{noun.git}} that is {{verb.git|tense.past}} by {{adjective.git-action|prepend-an}} {{noun.git}}',
		'any {{verb.git|tense.present-participle}} of {{noun.git|prepend-an}} that {{verb.git|tense.present}} {{noun.git|prepend-an}} {{adverb.synonym.immediately}} after can be {{verb.git|tense.past}} with {{command-name}}',
		'after {{verb.git|tense.present-participle}} {{noun.git|plural}} to many {{noun.git|plural}}, you can {{verb.git}} the {{noun.git}} of the {{noun.git|plural}}',
		'after {{command-name|prepend-an}} ({{verb.git|tense.past}} by {{command-name}}[[ {{conjunction.and-or}} {{command-name}}|]]) {{verb.git|tense.present}} {{noun.git|prepend-an}}, {{adverb.synonym.cleanly}} {{verb.git|tense.past}} {{noun.git|plural}} are {{verb.git|tense.past}} for {{subject}}, and {{noun.git|plural}} that were {{verb.git|tense.past}} during {{verb.git|tense.present-participle}} are left in {{verb.git|tense.past|prepend-an}} state',
		'{{multiple-nouns}} {{verb.git|tense.past}} by {{noun.git|plural}} in the {{located-noun}}, but that [[{{adverb.synonym.sometimes}} |]]are [[not |]]in {{constant-noun}}, are {{verb.git|tense.past}} in {{adjective.git-action|prepend-an}} {{noun.git}}',
		'{{command-name}} takes {{noun.synonym.option|plural}} {{adjective.synonym.relevant}} to the {{command-name}} {{noun.synonym.command}} to {{verb.synonym.verify}} what is {{verb.git|tense.past}} and how',
	],
	'command-action': '{{$command-verb}} {{determiner}} {{noun.location}} {{$command-noun|noun.plural}} {{preposition}} {{determiner}} {{verb.git|tense.past}} {{located-noun|noun.plural}}',
	'command-description': '{{$command-verb|verb.tense.present}} {{determiner}} {{noun.location}} {{$command-noun|noun.plural}} {{preposition}} {{determiner}} {{verb.git|tense.past}} {{located-noun|noun.plural}}, and {{statement}}.',
	'option-description': [
		'{{verb.git}} the {{noun.git|plural}} of {{determiner}} {{noun.git|plural}} that are {{verb.git|tense.past}}',
		'{{conjunction.conditional}} this {{noun.synonym.option}} is {{verb.synonym.supply|tense.past}}, the {{noun.git}} prefixes {{git-path}} {{conjunction.and-or}} {{git-path}}',
		'the {{noun.git}} {{verb.synonym.will}} [[not |]]be {{verb.common|tense.past}} by {{verb.git|tense.past|prepend-an}} {{noun.git}}',
		'use {{noun.git}} to {{verb.git}} {{git-path}} to {{verb.git|tense.past|prepend-an}} {{noun.git}}',
		'with[[out|]] this {{noun.synonym.option}}, {{command-name}} {{command-option}} {{verb.git|tense.present}} {{noun.git|plural}} that {{verb.git}} the {{verb.synonym.supply|tense.past}} {{noun.git|plural}}',
	],
}
