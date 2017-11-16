%lex

%s scope list tag arglist ipstring

%%
\s*'#'.*\n*\s* // ignore comments
\n+ // ignore newlines completely
<INITIAL,scope,arglist,tag>\s+ // ignore whitespace, but not in lists

// Meta statement
\@[a-zA-Z0-9\._-]+ return 'META_STATEMENT'

// String literals
<INITIAL,scope,list,arglist,tag>\'(?:[^'\\]|\\.)*\' return 'SINGLE_QUOTED_STRING'

// Interpolated string
<ipstring>\"(?:\+\d+)? this.popState(); return 'DOUBLE_QUOTE'
\" this.begin('ipstring'); return 'DOUBLE_QUOTE'
<ipstring>(?:[^\\\<\"]|\\.)+ return 'LITERAL'

// Scope
'{' this.begin('scope'); return 'LBRACE'
<scope>'}' this.popState(); return 'RBRACE'
<scope>\/[^\/]+?\/[a-z]+ return 'REGEXP'

// List
\[\s* this.begin('list'); return 'LSBRACKET'
<list>(?:\,)?\s*\] this.popState(); return 'RSBRACKET'
<list>\b(?:[^,\\\[\]\<\>\'\"\`]|\\.)+\b return 'LITERAL'
<list>\s*\,\s* return 'LIST_SEPARATOR'

// Arglist
\( this.begin('arglist'); return 'LPAREN'
<arglist>\) this.popState(); return 'RPAREN'
<arglist>\, return 'ARGLIST_SEPARATOR'

// Tag
\< this.begin('tag'); return 'LABRACKET'
<tag>\> this.popState(); return 'RABRACKET'
<tag>\| return 'ITEM_CHOICE'
<tag>\: return 'ITEM_TRANSFORM'
<tag>\??(?=\>) return 'QUANTIFIER'
<tag>\= return 'VAR_ASSIGN'

// Other
<INITIAL,scope,list,arglist,tag>\$ return 'VAR_PREFIX'
<INITIAL,scope,list,arglist,tag>(?![0-9\-\.])[a-zA-Z0-9_\-\.]+ return 'IDENTIFIER'

// Special
<<EOF>> return 'EOF'
. return 'INVALID'

/lex

%start baba

%%

baba
	: scope EOF { return $1 }
	;

scope
	: scope scope_expr -> $1.concat([$2])
	| scope_expr -> [$1]
	;

scope_expr
	: scope_block
	| list_block
	| meta_statement
	| identifier
	;

scope_block
	: identifier LBRACE scope RBRACE -> {type: 'scope_block', identifier: $1, children: $3}
	;

list_block
	: identifier LSBRACKET list_block_content RSBRACKET -> {type: 'list_block', identifier: $1, children: $3}
	;

list_block_content
	: list_block_content LIST_SEPARATOR list_block_item -> $1.concat([$3])
	| list_block_content LIST_SEPARATOR -> [$1]
	| list_block_item -> [$1]
	;

list_block_item
	: literal
	| quoted_string
	;

meta_statement
	: META_STATEMENT arglist -> {type: 'meta_' + $1.trim().slice(1), arguments: $2}
	;

arglist
	: LPAREN arglist_body RPAREN -> $2
	| LPAREN RPAREN -> []
	;

arglist_body
	: arglist_body ARGLIST_SEPARATOR arglist_item -> $1.concat([$3])
	| arglist_item -> [$1]
	;

arglist_item
	: identifier
	| quoted_string
	| LSBRACKET list_block_content RSBRACKET -> {type: 'list_block', identifier: null, children: $2}
	;

tag
	: LABRACKET tag_body RABRACKET -> {type: 'tag', children: $2}
	| LABRACKET tag_body QUANTIFIER RABRACKET -> {type: 'tag', children: $2, quantifier: $3.trim()}
	;

tag_body
	: tag_item_concat -> [$1]
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
	: value
	| tag
	| var_assign_expr
	;

value
	: value ITEM_TRANSFORM identifier_expr -> {type: 'transform', fn: [$3], args: [$1]}
	| var_assign_expr ITEM_TRANSFORM identifier_expr -> {type: 'transform', fn: [$3], args: [$1]}
	| identifier
	| quoted_string
	;

identifier_expr
	: function_identifier arglist -> {type: 'function_call', fn: $1, args: $2}
	| function_identifier
	;

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

var_assign_expr
	: var_identifier VAR_ASSIGN var_assign_value -> {type: 'var_assign', name: $1, value: [$3]}
	;

var_assign_value
	: identifier
	| quoted_string
	;

identifier
	: var_identifier
	| IDENTIFIER -> {type: 'identifier', value: $1.trim()}
	;

var_identifier
	: VAR_PREFIX IDENTIFIER -> {type: 'var_identifier', value: $2.trim()}
	;

function_identifier
	: IDENTIFIER -> {type: 'function_identifier', value: $1.trim()}
	;
