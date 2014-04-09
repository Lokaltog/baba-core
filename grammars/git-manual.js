var grammar = {
	// sentences
	sentence: '$statement#uppercaseFirst.',
	paragraph: p.ref('sentence', 2, 5),

	// raw word lists
	verb: 'add,allot,annotate,apply,archive,bisect,blame,branch,bundle,check,checkout,cherry-pick,clean,clone,commit,configure,count,describe,diff,export,fail,fast-export,fast-import,fetch,filter-branch,format-patch,forward-port,fsck,grep,help,import,index,init,log,merge,name,note,pack,parse,patch,perform,prevent,prune,pull,push,quiltimport,reapply,rebase,reflog,relink,remote,remove,repack,request,reset,reset,return,rev-list,rev-parse,revert,save,send,set,show,specify,stage,stash,strip,succeed'.split(','),
	verbPerform: 'perform,execute,apply'.split(','),
	object: 'archive,area,base,branch,change,commit,file,head,history,index,log,object,pack,ref,stage,stash,submodule,subtree,tag,tip,tree'.split(','),
	location: p.group(
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
	wordWill: 'can,may,must,should,will'.split(','),

	// grammar objects
	commandName: 'git-$verb-$object',
	commandOption: '--[$verb-|]$verb-$object',
	action: '$verb [$locatedObject#prependAn|$determiner $locatedObject#pluralize] $preposition $verb#verbPastTensify $locatedObject#pluralize',
	multipleObjects: '$determiner $adjective $object#pluralize',
	locatedObject: '[$location |]$object',
	constantObject: [
		p.group('<', ['[new|old]$object', '$verb-$object'], '>'),
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
		'$constantObject is $verb#verbPastTensify to $verb the $object of the $object $preposition the $object',
		'$multipleObjects that were $wordPreviously $verb#verbPastTensify $preposition the $adjective $object are $verb#verbPastTensify to $adjective#prependAn $object',
		'it is [$wordSometimes |]$wordPossible that $verb#verbPastTensify#prependAn $wordFailure will prevent $adjective $verb#verbPresentParticiplify of $multipleObjects',
		'$subject $wordWill $verb any such $wordFailure#pluralize and run $commandName $commandOption instead',
		'to $verb $adjective#prependAn $constantObject and $verb the working $object#pluralize, use the command $commandName $commandOption instead',
	],
}
