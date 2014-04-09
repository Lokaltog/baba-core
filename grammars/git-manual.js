var GitManualGrammar = function (p) {
	return {
		// sentences
		sentence: [
			'$condition#uppercaseFirst, $statement.',
			'$condition#uppercaseFirst, $statement, $conclusion.',
			'$statement#uppercaseFirst.',
			'$statement#uppercaseFirst, $conclusion.',
		],
		paragraph: p.ref('sentence', 2, 4),

		// raw word lists
		verb: 'add,allot,annotate,apply,archive,bisect,blame,branch,bundle,check,checkout,cherry-pick,clean,clone,commit,configure,count,describe,diff,export,fail,fast-export,fast-import,fetch,filter-branch,format-patch,forward-port,fsck,grep,import,index,initialize,log,merge,name,note,pack,parse,patch,perform,prevent,prune,pull,push,quiltimport,reapply,rebase,reflog,relink,remote,remove,repack,request,reset,reset,return,rev-list,rev-parse,revert,save,send,set,show,specify,stage,stash,strip'.split(','),
		verbPerform: 'perform,execute,apply'.split(','),
		object: 'archive,area,base,branch,change,commit,file,head,history,index,log,object,pack,path,ref,stage,stash,submodule,subtree,tag,tip,tree'.split(','),
		location: p.group(
			'[non-$verb#verbPresentParticiplify |]',
			'applied,downstream,local,remote,staged,unstaged,upstream'.split(',')
		),
		preposition: 'before,below,for,from,inside,next to,opposite of,outside,over,to'.split(','),
		determiner: 'a few,all,any,some,the,various'.split(','),
		chanceDeterminer: 'certain,small,rare'.split(','),
		adjective: 'automatic,passive,temporary,original'.split(','),
		conditionalConjunction: 'if,when[ever|],provided that,in case'.split(','),
		conclusionConjunction: 'as,because,and,but,so'.split(','),
		subject: 'you,the user,the $commandName command'.split(','),

		// make sure we're not consistent
		wordFailure: 'failure,error,breakdown,segfault,collapse'.split(','),
		wordImmediately: 'immediately,soon,some time,a while'.split(','),
		wordOption: 'option,argument'.split(','),
		wordPossible: 'possible,a [$chanceDeterminer |]possibility,a [$chanceDeterminer |] chance'.split(','),
		wordPreviously: 'previously,earlier,formerly,once'.split(','),
		wordShould: 'will have to,may have to,should'.split(','),
		wordSometimes: 'sometimes,in some cases'.split(','),
		wordSupplied: 'supplied,specified,set,defined,provided'.split(','),
		wordWill: 'can,may,must,should,will'.split(','),

		// grammar objects
		commandName: '<code>git-$verb-$object</code>',
		commandOption: '<code>--[$verb-|]$verb-$object</code>',
		action: '$verb [$locatedObject#prependAn|$determiner $locatedObject#pluralize] $preposition $verb#verbPastTensify $locatedObject#pluralize',
		commandDescription: '$verb#verbPresentTensify [$locatedObject#prependAn|$determiner $locatedObject#pluralize] $preposition $verb#verbPastTensify $locatedObject#pluralize, and $statement.',
		multipleObjects: '$determiner $adjective $object#pluralize',
		locatedObject: '[$location |]$object',
		constantObject: [
			p.group('<i>&lt;', ['[new|old]$object', '$verb-$object'], '&gt;</i>'),
			'<code>$verb#uppercase_$verb#uppercase</code>',
		],

		// sentence objects that use the stuff defined above
		condition: [
			'$conditionalConjunction $constantObject is [not |]$verb#verbPastTensify',
			'$conditionalConjunction $commandName $verb#verbPresentTensify $object#prependAn',
		],
		conclusion: [
			'$conclusionConjunction $statement',
		],
		statement: [
			'$constantObject is $verb#verbPastTensify to $verb the $object of the $object $preposition the $object',
			'$commandName $commandOption will $verbPerform $adjective#prependAn $commandName before [$verb#verbPresentParticiplify the $object|doing anything else]',
			'$multipleObjects are $verb#verbPastTensify to $constantObject by $commandName',
			'the same set of $object#pluralize would [$wordSometimes |]be $verb#verbPastTensify in $adjective#prependAn $object',
			'$multipleObjects that were $wordPreviously $verb#verbPastTensify $preposition the $adjective $object#pluralize are $verb#verbPastTensify to $adjective#prependAn $object',
			'it is [$wordSometimes |]$wordPossible that $verb#verbPastTensify#prependAn $wordFailure will prevent $adjective $verb#verbPresentParticiplify of $multipleObjects',
			'$subject $wordWill $verb any such $wordFailure#pluralize and run $commandName $commandOption instead',
			'to $verb $adjective#prependAn $constantObject and $verb the working $object#pluralize, use the command $commandName $commandOption instead',
			'the $object to be $verb#verbPastTensify can be $wordSupplied in several ways',
			'the $commandOption $wordOption can be used to $verb $object#prependAn for the $object that is $verb#verbPastTensify by $adjective#prependAn $object',
			'any $verb#verbPresentParticiplify of $object#prependAn that $verb#verbPresentTensify $object#prependAn $wordImmediately after can be $verb#verbPastTensify with $commandName',
			'after $verb#verbPresentParticiplify $object#pluralize to many $object#pluralize, you can $verb the $object of the $object#pluralize',
			'after $commandName#prependAn ($verb#verbPastTensify by $commandName[ or $commandName|]) $verb#verbPresentTensify $object#prependAn, cleanly $verb#verbPastTensify $object#pluralize are $verb#verbPastTensify for $subject, and $object#pluralize that were $verb#verbPastTensify during $verb#verbPresentParticiplify are left in $verb#verbPastTensify#prependAn state',
			'$multipleObjects $verb#verbPastTensify by $object#pluralize in the $locatedObject, but that [$wordSometimes |]are [not |]in $constantObject, are $verb#verbPastTensify in $adjective#prependAn $object',
		],
	}
}
