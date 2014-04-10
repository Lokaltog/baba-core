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
		gitVerb: 'add,allot,annotate,apply,archive,bisect,blame,branch,bundle,check,checkout,cherry-pick,clean,clone,commit,configure,count,describe,diff,export,fail,fast-export,fast-import,fetch,filter-branch,format-patch,forward-port,fsck,grep,import,index,initialize,log,merge,name,note,pack,parse,patch,perform,prevent,prune,pull,push,quiltimport,reapply,rebase,reflog,relink,remote,remove,repack,request,reset,reset,return,rev-list,rev-parse,revert,save,send,set,show,specify,stage,stash,strip'.split(','),
		// extra verbs that have nothing to do with git
		verb: 'abandon,abduct,abolish,abuse,accomplish,accuse,achieve,acquire,act,activate,adapt,add,address,adjust,advise,advocate,affirm,aid,aim,alert,allocate,answer,anticipate,apprehend,approach,arbitrate,arrange,arrest,assault,assemble,assess,assign,assist,assure,attack,attain,attract,audit,augment,authenticate,author,authorize,automate,avoid,award,balance,bang,bar,beat,berate,bite,blast,blend,block,blow,bolster,book,boost,brace,brief,brighten,broke,buck,budget,built,bump,bury,bushwhack,calculate,call,calm,campaign,cancel,capitalize,catch,centralize,certify,chair,challenge,champion,change,channel,charge,chart,chase,check,choke,circumscribe,circumvent,clap,clarify,clash,classify,classify,climb,clip,clutch,coach,collaborate,collapse,collar,collate,collect,collide,combine,command,commandeer,communicate,compile,complete,compose,compute,compute,conceive,condense,conduct,confer,configure,conserve,consolidate,construct,consult,contract,control,convert,coordinate,correlate,counsel,count,cram,crash,crawl,create,creep,cripple,critique,crouch,cultivate,cure,customize,cut,dance,dart,dash,deal,debate,decide,deck,decorate,decrease,deduct,define,delegate,delete,deliberate,delineate,deliver,demonstrate,derive,descend,describe,design,detail,detect,determine,develop,devise,devise,diagnose,dictate,dig,direct,discard,discover,dispatch,display,dissect,distinguish,distribute,distribute,ditch,dive,divert,do,dodge,dominate,dope,double,douse,draft,drag,drain,dramatize,drape,draw,dress,drill,drink,drip,drop,drown,drug,dry,duel,dunk,earn,ease,edge,edit,edit,educate,effect,eject,elect,elevate,eliminate,elope,elude,emerge,employ,enable,enact,encourage,endure,engage,engineer,enjoin,ensnare,ensure,enter,equip,erupt,escalate,escape,establish,establish,estimate,evacuate,evade,evaluate,evict,examine,execute,exert,exhale,exhibit,exit,expand,expand,expedite,expel,explode,experience,experiment,explain,explore,expose,extend,extirpate,extract,extricate,facilitate,fade,fake,fall,falter,fan,fashion,fast,fear,feed,feel,fend,field,fight,file,fill,finance,find,finger,finish,fix,flag,flap,flash,flatten,flaunt,flay,flee,flick,flinch,fling,flip,flit,float,flog,flounder,flout,flush,focus,fondle,force,forecast,forge,formalize,form,formulate,fornicate,foster,found,fumble,fund,furnish,gain,gallop,gather,generate,gesture,get,give,gnaw,gossip,gouge,govern,graduate,grab,grapple,grasp,greet,grind,grip,grope,ground,grow,growl,grunt,guard,guide,gyrate,hack,hail,halt,halve,hammer,handle,hang,harass,hasten,haul,head,help,hesitate,hide,hijack,hire,hit,hitch,hobble,hoist,hold,hover,hug,hurl,hurtle,hypothesize,identify,ignore,illustrate,imitate,implement,improve,improvise,inch,increase,increase,index,indict,individualize,induce,inflict,influence,inform,initiate,inject,injure,innovate,insert,inspect,inspire,install,instigate,institute,instruct,integrate,intensify,interchange,interpret,interview,introduce,invade,invent,inventory,invest,investigate,isolate,itemize,jab,jam,jar,jeer,jerk,jimmy,jingle,jolt,judge,jump,justify,keel,keynote,kibitz,kick,kidnap,kill,kneel,knife,land,lash,launch,lead,lean,leap,learn,lecture,led,left,lessen,level,license,lick,limp,link,listen,locate,log,lower,lunge,lurch,make,maim,maintain,make,manage,mangle,manipulate,manufacture,march,mark,market,massage,master,maul,measure,meddle,mediate,meet,mend,mentor,mimic,mingle,minimize,mobilize,mock,model,mold,molest,monitor,motivate,mourn,move,mumble,murder,muster,mutilate,nab,nag,nail,narrow,needle,negotiate,nick,nip,nominate,nurture,observe,obtain,occupy,offer,officiate,operate,order,organize,originate,outline,overcome,oversee,pack,participate,paddle,page,pander,panic,parachute,parade,park,parry,party,pass,pat,patrol,pause,paw,peel,peep,penetrate,perceive,perfect,perform,persuade,photograph,pick,picket,pile,pilot,pin,pinch,pioneer,pirate,pitch,placate,place,plan,play,plod,plow,plunge,pocket,poke,polish,pore,pose,position,pounce,pout,pray,predict,preen,prepare,prescribe,present,preside,preside,primp,print,prioritize,probe,process,procure,prod,produce,profitable,program,project,promote,prompt,proofread,propel,propose,protect,prove,provide,provoke,pry,publicize,publish,pull,pummel,pump,punch,purchase,purge,pursue,push,qualify,question,quicken,quit,quiz,race,raid,raise,ram,ransack,rape,rate,rattle,ravage,rave,read,realize,rebuild,receive,recline,recommend,reconcile,reconnoiter,record,recoup,recruit,redeem,reduce,reel,refer,regain,regulate,reinforce,rejoin,relate,relate,relax,relent,relieve,remove,render,renew,renovate,reorganize,repair,repel,report,represent,repulse,research,resign,resist,resolve,respond,restore,retain,retaliate,retreat,retrieve,reveal,review,revise,ride,rip,rise,risk,rob,rock,roll,rub,run,rush,sail,salute,sap,satisfy,save,saw,scale,scamper,scan,scare,scatter,scavenge,schedule,scold,scoop,scoot,score,scour,scout,scrape,scrawl,scream,screen,screw,scrub,scruff,scuffle,sculpt,scuttle,seal,search,secure,seduce,segment,seize,select,sell,sense,serve,service,set,setup,sever,sew,shake,shanghai,shape,share,sharpen,shave,shear,shell,shield,shift,shiver,shock,shoot,shorten,shout,shove,shovel,show,shun,shut,sidestep,sigh,signal,simplify,sip,sit,size,skid,skim,skip,skirt,slacken,slam,slap,slash,slay,slide,slug,smack,smear,smell,smuggle,snap,snare,snarl,snatch,snicker,sniff,snitch,snoop,snub,snuff,snuggle,soak,sock,soil,sold,solve,sort,spark,spear,spell,spike,spin,splatter,splice,split,spot,spray,spread,spring,sprint,spurn,spy,squeak,stack,staff,stagger,stamp,stand,start,startle,steal,steer,step,stick,stiffen,stifle,stimulate,stock,stomp,stop,strangle,strap,strategize,streamline,strengthen,stress,strike,strip,stroke,struck,structure,stub,study,stuff,stumble,stun,subdue,submerge,submit,submit,succeed,suck,summarize,sum,summon,supervise,support,surrender,survey,suspend,sustain,swagger,swallow,swap,sway,swear,swerve,swim,swing,swipe,switch,synergize,synthesize,systematize,tabulate,tackle,take,tap,target,taste,taunt,teach,tear,tease,telephone,terrorize,test,thin,thrash,thread,threaten,throw,tickle,tie,tighten,tilt,tip,toss,touch,tout,track,train,transcribe,transfer,transfer,transform,translate,transport,trap,tread,treat,trim,trip,triple,trot,trounce,try,tuck,tug,tumble,turn,tutor,twist,type,uncover,understand,undertake,undo,undress,unfold,unify,unify,unite,unravel,untangle,unwind,update,usher,utilize,utilize,vacate,validate,value,vanish,vanquish,vault,vent,verbalize,verify,violate,wade,walk,wander,ward,watch,wave,wedge,weed,weigh,whack,whip,whirl,whistle,widen,wield,wiggle,win,withdraw,withdraw,work,wreck,wrench,wrestle,write,wrought,yank,yell,yelp,yield,zap,zip'.split(','),
		object: 'archive,area,base,branch,change,commit,file,head,history,index,log,object,pack,path,ref,stage,stash,submodule,subtree,tag,tip,tree'.split(','),
		location: p.group(
			'[non-$verb#verbPresentParticiplify |]',
			'applied,downstream,local,remote,staged,unstaged,upstream'.split(',')
		),
		preposition: 'before,below,for,from,inside,next to,opposite of,outside,over,to'.split(','),
		determiner: 'a few,all,any,some,the,various'.split(','),
		chanceDeterminer: 'certain,small,rare'.split(','),
		actionAdjective: 'automatic,passive,temporary,original'.split(','),
		conditionalConjunction: 'if,when[ever|],provided that,in case'.split(','),
		conclusionConjunction: 'as,because,and,but,so'.split(','),
		subject: 'you,the user,the $commandName command'.split(','),

		// make sure we're not consistent
		wordFailure: 'failure,error'.split(','),
		wordImmediately: 'immediately,soon,some time,a while'.split(','),
		wordOption: 'option,argument,flag'.split(','),
		wordPossible: 'possible,a [$chanceDeterminer |]possibility,a [$chanceDeterminer |] chance'.split(','),
		wordPreviously: 'previously,earlier,formerly,once'.split(','),
		wordRelevant: 'relevant,applicable,appropriate,significant'.split(','),
		wordShould: 'will have to,may have to,should'.split(','),
		wordSometimes: 'sometimes,in some cases'.split(','),
		wordWill: 'can,may,must,should,will'.split(','),

		verbPerform: 'perform,execute,apply'.split(','),
		verbSupply: 'supply,specify,set,define,provide'.split(','),

		// grammar objects
		commandNameRaw: 'git-$verb-$object',
		commandName: '<code>$commandNameRaw</code>',
		commandOptionRaw: '--[$verb-|]$verb-$object',
		commandOption: '<code>$commandOptionRaw</code>',
		gitPathElement: 'ref,head,tag,remote'.split(','),
		gitPathRaw: '$gitPathElement#pluralize/$gitPathElement#pluralize/',
		gitPath: '<code>$gitPathRaw</code>',
		action: '$gitVerb [$locatedObject#prependAn|$determiner $locatedObject#pluralize] $preposition $gitVerb#verbPastTensify $locatedObject#pluralize',
		commandDescription: '$gitVerb#verbPresentTensify [$locatedObject#prependAn|$determiner $locatedObject#pluralize] $preposition $gitVerb#verbPastTensify $locatedObject#pluralize, and $statement.',
		multipleObjects: '$determiner $gitVerb#verbPastTensify $object#pluralize',
		locatedObject: '[$location |]$object',
		constantObject: [
			p.group('<i>&lt;', ['[new|old]$object', '$verb-$object'], '&gt;</i>'),
			'<code>$verb#uppercase_$object#uppercase</code>',
		],

		// sentence objects that use the stuff defined above
		condition: [
			'$conditionalConjunction $constantObject is [not |]$gitVerb#verbPastTensify',
			'$conditionalConjunction $commandName $gitVerb#verbPresentTensify $object#prependAn',
		],
		conclusion: [
			'$conclusionConjunction $statement',
		],
		statement: [
			'$constantObject is $gitVerb#verbPastTensify to $gitVerb the $object of the $object $preposition the $object',
			'$commandName $commandOption will $verbPerform $actionAdjective#prependAn $commandName before [$gitVerb#verbPresentParticiplify the $object|doing anything else]',
			'$multipleObjects are $gitVerb#verbPastTensify to $constantObject by $commandName',
			'the same set of $object#pluralize would [$wordSometimes |]be $gitVerb#verbPastTensify in $actionAdjective#prependAn $object',
			'$multipleObjects that were $wordPreviously $gitVerb#verbPastTensify $preposition the $actionAdjective $object#pluralize are $gitVerb#verbPastTensify to $actionAdjective#prependAn $object',
			'it is [$wordSometimes |]$wordPossible that $gitVerb#verbPastTensify#prependAn $wordFailure will prevent $actionAdjective $gitVerb#verbPresentParticiplify of $multipleObjects',
			'$subject $wordWill $gitVerb any such $object#pluralize and run $commandName $commandOption instead',
			'to $gitVerb $actionAdjective#prependAn $constantObject and $gitVerb the working $object#pluralize, use the command $commandName $commandOption',
			'the $object to be $gitVerb#verbPastTensify can be $verbSupply#verbPastTensify in several ways',
			'the $commandOption $wordOption can be used to $gitVerb $object#prependAn for the $object that is $gitVerb#verbPastTensify by $actionAdjective#prependAn $object',
			'any $gitVerb#verbPresentParticiplify of $object#prependAn that $gitVerb#verbPresentTensify $object#prependAn $wordImmediately after can be $gitVerb#verbPastTensify with $commandName',
			'after $gitVerb#verbPresentParticiplify $object#pluralize to many $object#pluralize, you can $gitVerb the $object of the $object#pluralize',
			'after $commandName#prependAn ($gitVerb#verbPastTensify by $commandName[ or $commandName|]) $gitVerb#verbPresentTensify $object#prependAn, cleanly $gitVerb#verbPastTensify $object#pluralize are $gitVerb#verbPastTensify for $subject, and $object#pluralize that were $gitVerb#verbPastTensify during $gitVerb#verbPresentParticiplify are left in $gitVerb#verbPastTensify#prependAn state',
			'$multipleObjects $gitVerb#verbPastTensify by $object#pluralize in the $locatedObject, but that [$wordSometimes |]are [not |]in $constantObject, are $gitVerb#verbPastTensify in $actionAdjective#prependAn $object',
			'$commandName takes $wordOption#pluralize $wordRelevant to the $commandName command to control what is $verb#verbPastTensify and how',
		],
		optionDescription: [
			'$gitVerb the $object#pluralize of any $object#pluralize that are $gitVerb#verbPastTensify',
			'$conditionalConjunction this $wordOption is $verbSupply#verbPastTensify, the $object prefixes $gitPath [and|or] $gitPath',
			'the $object will [not |]be $verb#verbPastTensify by $gitVerb#verbPastTensify#prependAn $object',
			'use $object to $gitVerb $gitPath to $gitVerb#prependAn $object',
			'with[out|] this $wordOption, $commandName $commandOption $gitVerb#verbPresentTensify $object#pluralize that $verb the $verbSupply#verbPastTensify $object#pluralize',
		],
	}
}
