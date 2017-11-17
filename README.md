# Baba

Mini-language for creating random text generators, inspired by the [Dada 
Engine](http://dev.null.org/dadaengine/).

## Introduction

This repo contains a Jison-based parser for the Baba language, and a compiler 
for outputting JS modules. The compiler outputs JS modules that may be imported 
and used in the browser or Node.js.

## Resources

* [Vim syntax](https://github.com/Lokaltog/vim-baba)
* AUR package

## Examples

* [Git man page generator](https://github.com/Lokaltog/baba-grammar-git-man-page-generator)

## The Baba language

### Comments

Baba supports **one-line comments**, prefixed with `#`. Comments may appear 
anywhere except inside [strings](#strings).

#### Example

```
# This is a comment
```

### Whitespace

Whitespace (tabs, spaces, newlines) is ignored, _except_ inside 
[strings](#strings).

Whitespace surrounding unquoted [list items](#lists) is removed.

### Identifiers

An **identifier** is any sequence of letters, digits, underscores, hyphens and 
periods, and starts with an underscore or a letter. Periods have a special 
meaning in identifiers, and are used to refer to [scoped elements](#scopes).

#### Example

```
this-is-an-identifier
scope.subscope.identifier
_43baz
```

#### Syntax

```ebnf
var-identifier = "$", identifier ;
identifier     = string, { string | number | special } ;
string         = ? [a-zA-Z]+ ? | "_" ;
number         = ? [0-9]+ ? ;
special        = "-" | "." ;
```

### Blocks

A Baba grammar is composed of **blocks**. A block is a structure identified by 
an [identifier](#identifiers). You may refer to a block anywhere in your 
grammar. Blocks output text based on its contents.

The following elements are valid block structures:

* [Scope](#scopes)
* [List](#lists)
* [Tag](#tags)
* [String](#strings)

#### Syntax

```ebnf
block = identifier, ( scope | list | tag | string ) ;
```

### Scopes

**Scoping** is an optional feature which is useful to structure a grammar in 
a hierarchy. Baba grammars always begin in an unnamed _root scope_. Scopes 
cannot be [exported](#meta-statements).

Scopes may contain any number of [meta statements](#meta-statements) and 
[blocks](#blocks).

#### Syntax

```ebnf
baba-grammar = scope-item, ? EOF ? ;

scope        = "{", { scope-item }, "}" ;
scope-item   = meta-statement | block ;
```

### Lists

**Lists** are collections of one or more [strings](#strings). When evaluated, 
a random list item is returned. Lists may be [exported](#meta-statements).

Strings may be either quoted or unquoted. List items are separated by `,`. 
Whitespace surrounding the list delimiters and list separators is removed.

#### Example

```
[ separated, list, item ] # -> ['separated', 'list', 'item']
[ "quoted", 'quoted', unquoted ] # -> ['quoted', 'quoted', 'unquoted']
[ symbols like \, must be escaped in unquoted items ] # -> ['symbols like , must be...']
```

#### Syntax

```ebnf
list      = "[", { list-item, [ "," ] }, "]" ;
list-item = quoted-string | literal ;
```

### Tags

**Tags** are collections of one or more tag items and modifiers. When 
evaluated, a tag returns a concatenated string of its contents. Tags may be 
[exported](#meta-statements).

A tag may have a quantifier. `?` will insert the tag 0 or 1 times ("optional"). 
`*` will insert the tag 0 or more times. `+` will insert the tag 1 or more 
times.

The default behavior is to concatenate tag items. One or more tag items may be 
randomly selected instead by separating the items with `|`. This is effectively 
the same as having a [list](#lists) inside a tag. The `|` operator has 
presedence over concatenation.

Tag items may be [transformed](#transforms).

Tags may be nested. This is useful e.g. for grouping tag items.

#### Syntax

```ebnf
tag             = "<", tag-item-concat, [ tag-quantifier ], ">" ;
tag-quantifier  = "?" | "+" | "*" ;
tag-item-concat = ( tag-item-concat, tag-item-choice )
                | tag-item-choice ;
tag-item-choice = ( tag-item-choice, "|", tag-item )
                | tag-item ;
tag-item        = quoted-string | transform-expr | tag ;
```

### Tag expressions

Tags may contain tag expressions. Tag expressions provide advanced 
functionality like variable assignment, transforms and function calls.

#### Variables

Variables may be assigned values inside tags with a **variable assign 
expression**. Only identifiers are valid variable values.

#### Transforms

Identifiers in tags may be transformed by external functions with a **transform 
expression**. When a transform is applied, the transform function is called 
with the _evaluated identifier value_ as its only argument. The transform 
function must return a string.

#### Functions

Tags may also include **function expressions**. Function expressions call 
external functions which must return a function which is evaluated at runtime. 
The returned function must return a string.

#### Examples

```
<tag1:inner-transform:outer-transform>
# -> outerTransform(innerTransform(tag1))

<tag2:func-transform("argument")>
# -> funcTransform('argument')(tag2)
```

#### Syntax

```ebnf
transform-expr  = transform-expr, ":", function-expr
                | function-expr ;
function-expr   = ( var-assign-expr, argument-list )
                | var-assign-expr ;
var-assign-expr = ( var-identifier, "=", identifier )
                | var-identifier
                | identifier ;

argument-list      = "(", [ argument-list-body ], ")" ;
argument-list-body = argument-list-item, [ { ",", argument-list-item } ] ;
argument-list-item = identifier | quoted-string | tag | list ;
```

### Strings

Baba supports **literal strings** (enclosed by single quotes), and 
**interpolated strings** (enclosed by double quotes).

Literal strings will be output without any modification.

Interpolated strings may contain [tags](#tags). They may also be weigted by 
appending `+` and a number indicating its weight. This effectively duplicates 
the string in its containing list, making it more likely to be returned.

Strings may span multiple lines, and may contain any character (although some 
characters may need to be escaped depending on the string type).

The following sequences have special meanings inside strings:

* `\'`: Single quote
* `\"`: Double quote
* `\\`: Backslash

Baba supports unquoted literal strings in [lists](#lists). Unquoted strings may 
contain any character, but the following characters _must_ be escaped: `,`, 
`\`, `[`, `]`, `<`, `>`, `'`, `"`. Because of this restriction unquoted strings 
are most useful for simple word lists.

#### Examples

```
'A "literal string"'
"An \"interpolated string\" which may contain <tag>s"
```

#### Syntax

```ebnf
string               = literal-string | interp-string ;
literal-string       = "'", { ? string literal ? }, "'" ;
interp-string        = '"', { interp-string-item }, '"', [ interp-string-weight ] ;
interp-string-weight = "+", ? number ? ;
interp-string-item   = ? string literal ? | tag ;
```

### Meta statements

**Meta statements** provide information about the grammar, e.g. which data 
should be exported.

#### Examples

```
# Import verb transforms and make them available in the `verb` scope
@import('baba-grammar-common/transforms/verb', verb)

# Export an identifier - makes `myList` callable in the exported grammar object
@export('myList', my-list)

# Export an anonymous list that returns a random literal string
@export('myList', [ foo, bar, baz ])
```

#### Syntax

```ebnf
meta-statement = "@", identifier, argument-list ;
```

#### `export(key: string, value: ( list | tag | string ))`

Exports a key/value pair.

#### `import(file: string, alias: identifier)`

Imports functions from an external file.

## Compilation process

TODO
