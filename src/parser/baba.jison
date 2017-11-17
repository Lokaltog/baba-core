%lex

%s scope list tag arg_list interp_string

%%
\s*'#'.*\n*\s* // ignore comments
<INITIAL,scope,arg_list,tag>\s+ // ignore whitespace, but not in lists

// Meta statement
\@[a-zA-Z0-9\._-]+ return 'META_STATEMENT'

// String literals
<INITIAL,scope,list,arg_list,tag>\'(?:[^'\\]|\\.)*\' return 'SINGLE_QUOTED_STRING'

// Interpolated string
<interp_string>\"(?:\+\d+)? this.popState(); return 'DOUBLE_QUOTE'
\" this.begin('interp_string'); return 'DOUBLE_QUOTE'
<interp_string>(?:[^\\\<\"]|\\.)+ return 'LITERAL'

// Scope
'{' this.begin('scope'); return 'LBRACE'
<scope>'}' this.popState(); return 'RBRACE'
<scope>\/[^\/]+?\/[a-z]+ return 'REGEXP'

// List
\[\s* this.begin('list'); return 'LSBRACKET'
<list>(?:\,)?\s*\] this.popState(); return 'RSBRACKET'
<list>\b(?:[^,\\\[\]\<\>\'\"]|\\.)+\b return 'LITERAL'
<list>\s*\,\s* return 'LIST_SEPARATOR'

// Argument list
\( this.begin('arg_list'); return 'LPAREN'
<arg_list>\) this.popState(); return 'RPAREN'
<arg_list>\, return 'ARG_LIST_SEPARATOR'

// Tag
\< this.begin('tag'); return 'LABRACKET'
<tag>\> this.popState(); return 'RABRACKET'
<tag>\| return 'ITEM_CHOICE'
<tag>\: return 'ITEM_TRANSFORM'
<tag>\??(?=\>) return 'QUANTIFIER'
<tag>\= return 'VAR_ASSIGN'

// Other
<INITIAL,scope,list,arg_list,tag>\$ return 'VAR_PREFIX'
<INITIAL,scope,list,arg_list,tag>(?![0-9\-\.])[a-zA-Z0-9_\-\.]+ return 'IDENTIFIER'

// Special
<<EOF>> return 'EOF'
. return 'INVALID'

/lex

%start baba

%%

baba
	: scope_body EOF { return $1 }
	;

meta_statement
	: META_STATEMENT arg_list -> {type: 'meta_' + $1.trim().slice(1), arguments: $2}
	;

// Scope
scope_block
	: identifier scope -> {type: 'scope_block', identifier: $1, children: $2}
	;

scope
	: LBRACE scope_body RBRACE -> $2
	;

scope_body
	: scope_body scope_item -> $1.concat([$2])
	| scope_item -> [$1]
	;

scope_item
	: meta_statement
	| scope_block
	| list_block
	| quoted_string_block
	| tag_block
	;

// List
list_block
	: identifier list -> {type: 'list_block', identifier: $1, children: $2}
	;

list
	: LSBRACKET list_body RSBRACKET -> $2
	;

list_body
	: list_body LIST_SEPARATOR list_item -> $1.concat([$3])
	| list_body LIST_SEPARATOR -> [$1]
	| list_item -> [$1]
	;

list_item
	: literal
	| quoted_string
	;

// Quoted string
quoted_string_block
	: identifier quoted_string -> {type: 'quoted_string_block', identifier: $1, string: $2}
	;

// Tag
tag_block
	: identifier tag -> {type: 'tag_block', identifier: $1, tag: $2}
	;

tag
	: LABRACKET tag_item_concat RABRACKET -> {type: 'tag', children: [$2], quantifier: ''}
	| LABRACKET tag_item_concat QUANTIFIER RABRACKET -> {type: 'tag', children: [$2], quantifier: ($3 || '').trim()}
	;

tag_item_concat
	: tag_item_concat tag_item_choice -> {type: 'tag_concat', identifier: null, children: $1.type === 'tag_concat' ? $1.children.concat($2) : [$1, $2]}
	| tag_item_choice
	;

tag_item_choice
	: tag_item_choice ITEM_CHOICE tag_item -> {type: 'tag_choice', identifier: null, children: $1.type === 'tag_choice' ? $1.children.concat($3) : [$1, $3]}
	| tag_item
	;

tag_item
	: quoted_string
	| transform_expr
	| tag
	;

// Tag expressions
transform_expr
	: transform_expr ITEM_TRANSFORM function_expr {
		if ($3.type === 'identifier') $3.type = 'function_identifier';
		$$ = {type: 'transform', fn: [$3], args: [$1]}
	}
	| function_expr
	;

function_expr
	: var_assign_expr arg_list {
		$1.type = 'function_identifier';
		$$ = {type: 'function_call', fn: $1, args: $2}
	}
	| var_assign_expr
	;

var_assign_expr
	: var_assign_expr VAR_ASSIGN identifier -> {type: 'var_assign', name: $1, value: [$3]}
	| identifier
	;

// Argument list
arg_list
	: LPAREN arg_list_body RPAREN -> $2
	| LPAREN RPAREN -> []
	;

arg_list_body
	: arg_list_body ARG_LIST_SEPARATOR arg_list_item -> $1.concat([$3])
	| arg_list_item -> [$1]
	;

arg_list_item
	: identifier
	| quoted_string
	| tag
	| list -> {type: 'list_block', identifier: null, children: $2}
	;

// Atoms
quoted_string
	: SINGLE_QUOTED_STRING -> {type: 'literal', value: $1.trim().slice(1, -1)}
	| DOUBLE_QUOTE double_quote_string DOUBLE_QUOTE -> {type: 'interpolated_string', children: $2, weight: parseInt($3.slice(2), 10)}
	;

double_quote_string
	: double_quote_string double_quote_string_item -> $1.concat([$2])
	| double_quote_string_item -> [$1]
	;

double_quote_string_item
	: literal
	| tag
	;

literal
	: LITERAL -> {type: 'literal', value: $1.replace(/\\(.)/g, (m, p1) => p1)}
	;

identifier
	: var_identifier
	| IDENTIFIER -> {type: 'identifier', value: $1.trim()}
	;

var_identifier
	: VAR_PREFIX IDENTIFIER -> {type: 'var_identifier', value: $2.trim()}
	;
