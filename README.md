![Baba](resources/logo.svg "Baba")

**Mini-language for creating random text generators, inspired by the [Dada 
Engine](http://dev.null.org/dadaengine/).**

## Introduction

This repo contains a Jison-based parser for the Baba language, and a compiler 
for outputting JS modules. The compiler outputs JS modules that may be imported 
and used in the browser or Node.js.

## Usage

Install baba with npm:

```bash
npm install -g baba-core
```

Pass your grammar file to `baba` to receive your text generator as a JS module:

```bash
echo "@export('test', [foo, bar, baz])" > my-grammar.baba

baba my-grammar.baba > my-grammar.js
```

Run `baba --help` for more information about its arguments.

You may now import `my-grammar.js` and use it in your project. The generated 
file doesn't have any dependencies and works standalone:

```js
import myGrammar from './my-grammar';

console.log(myGrammar.test());
// Outputs "foo", "bar" or "baz"
```

## Resources

* [Vim syntax](https://github.com/Lokaltog/vim-baba)
* AUR package

## Examples

* [Git man page generator](https://github.com/Lokaltog/baba-grammar-git-man-page-generator)

## User guide

### Creating your first grammar

## The Baba language

### Comments

Baba supports **one-line comments**, prefixed with `#`. Comments may appear 
anywhere. The parser will ignore anything from the comment prefix to the next 
token.

#### Example

```
# This is a comment
```

### Whitespace

Whitespace characters (tabs, spaces, newlines) are ignored, except inside 
[strings](#strings).

Whitespace surrounding [unquoted list elements](#lists) is removed, but 
whitespace inside unquoted list elements (i.e. between words) is preserved.

### Identifiers

An **identifier** is any sequence of letters, digits, underscores, hyphens and 
periods, and starts with an underscore or a letter. Periods have a special 
meaning in identifiers, and are used to refer to [scoped blocks](#blocks).

Variable identifiers follow the same rules as other identifiers, and are 
prefixed with `$`.

#### Example

```
this-is-an-identifier
scope.subscope.identifier
_43baz
$my-variable
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
an [identifier](#identifiers) which returns text. You may refer to a block by 
its identifier anywhere in your grammar.

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

**Scoping** is useful to structure a grammar in a hierarchy. Baba grammars 
always begin in an unnamed _root scope_. Scopes cannot be 
[exported](#meta-statements).

Scope blocks may be nested, and each scope may contain any number of [meta 
statements](#meta-statements), [blocks](#blocks), [mappings](#mappings) and 
[functions](#functions).

Nested scope blocks must be referred to with the full scope path, with levels 
separated by `.`:

```
a { b { c [ ... ] } }
# The innermost scope `c` must be referred to with the identifier a.b.c
```

#### Syntax

```ebnf
baba-grammar  = scope-element, ? EOF ? ;

scope         = "{", { scope-element }, "}" ;
scope-element = meta-statement | block | mapping | function;
```

### Lists

**Lists** are collections of one or more [strings](#strings). When evaluated, 
a random list element is returned. Lists may be [exported](#meta-statements).

Strings may be either quoted or unquoted. List elements are separated by `,`. 
Whitespace surrounding the list delimiters and list separators is removed.

#### Example

```
[ separated, list, element ] # -> ['separated', 'list', 'element']
[ "quoted", 'quoted', unquoted ] # -> ['quoted', 'quoted', 'unquoted']
[ symbols like \, must be escaped in unquoted elements ] # -> ['symbols like , must be...']
```

#### Syntax

```ebnf
list         = "[", { list-element, [ "," ] }, "]" ;
list-element = quoted-string | literal ;
```

### Tags

**Tags** are collections of one or more tag elements and expressions. When 
evaluated, a tag returns a concatenated string of its contents. Tags may be 
[exported](#meta-statements).

Consecutive tag elements without a separator will be concatenated.

Tag elements may act as a [list](#lists) by separating each element with `|`. 
This will cause a random element to be returned. The `|` operator has 
presedence over concatenation.

Tags may contain [tag expressions](#tag-expressions).

Tags may be nested. This is useful for grouping tag elements.

A tag may have a quantifier. `?` will insert the tag 0 or 1 times ("optional"). 
`*` will insert the tag 0 or more times. `+` will insert the tag 1 or more 
times.

#### Examples

```
<a b c d|e|f g h i> # -> (a + b + c) + (d OR e OR f) + (g + h + i)
<a' 'b c>           # -> a + ' ' + b + c
<a?><b?>            # -> (a OR '') + (b OR '')
<a' '?>             # -> (a + ' ') OR ''
<<a b|c>|d e>       # -> (a + (b OR c)) OR (d + e)
```

#### Syntax

```ebnf
tag                = "<", tag-element-concat, [ tag-quantifier ], ">" ;
tag-quantifier     = "?" | "+" | "*" ;
tag-element-concat = ( tag-element-concat, tag-element-choice )
                   | tag-element-choice ;
tag-element-choice = ( tag-element-choice, "|", tag-element )
                   | tag-element ;
tag-element        = transform-expr | tag ;
```

### Tag expressions

**Tag expressions** provide advanced functionality like variable assignment, 
transforms and function calls.

#### Variables

Variables may be assigned values inside tags with a **variable assign 
expression**. Currently only identifiers can be assigned to variables.

**Regular variable assignment** uses the `=` operator, and will always assign 
the value.

**Optional variable assignment** uses the `?=` operator, and will assign the 
value only if the variable hasn't been assigned a value yet.

#### Transforms

Identifiers in tags may be transformed by external functions with a **transform 
expression**. When a transform is applied, the transform function is called 
with the _evaluated identifier value_ (a string) as its only argument. The 
transform function must return a string.

#### Functions

Tags may also include **function expressions**. Function expressions call 
external functions which must return a function which is evaluated at runtime. 
The returned function must return a string.

#### Examples

```
<a:b:c>       # -> c(b(a))
<a:b(c)>      # -> b(c)(a)
<a:b(c):d(e)> # -> d(e)(b(c)(a))
<$a=b><$a>    # -> Assign b to $a, then output $a + b (= b + b)
<a()>         # -> Return the output from external function a()
<$a=b:c()>    # -> Assign the raw value of b to $a, then transform b as c()(b)
```

#### Syntax

```ebnf
transform-expr   = transform-expr, ":", function-expr
                 | function-expr ;
function-expr    = ( var-assign-expr, argument-list )
                 | var-assign-expr ;
var-assign-expr  = ( var-assign-expr, ( "?=" | "=" ), var-assign-value )
                 | var-assign-value ;
var-assign-value = identifier
                 | quoted-string ;

argument-list         = "(", [ argument-list-body ], ")" ;
argument-list-body    = argument-list-element, [ { ",", argument-list-element } ] ;
argument-list-element = identifier | quoted-string | tag | list ;
```

### Strings

Baba supports **literal strings** (enclosed by single quotes), and 
**interpolated strings** (enclosed by double quotes). Strings may be 
[exported](#meta-statements).

Literal strings will be returned verbatim.

Interpolated strings may contain [tags](#tags). They may also be weighted by 
appending `+` and a number indicating its weight. This effectively duplicates 
the string in its containing list, making it more likely to be returned.

Strings may span multiple lines, and may contain any character (some characters 
may need to be escaped depending on the string type).

Baba supports unquoted literal strings in [lists](#lists). Unquoted strings 
provide superior readability for lists containing short, plain text elements. 
They may contain any character, but the characters in the list below must be 
escaped. Because of this restriction unquoted strings are most useful for 
simple word lists.

#### Special characters

The characters listed below must be escaped with `\`, e.g. a double quote in 
a double quoted string must be escaped as `\"`.

| String type         | Special characters      |
| ------------------- | ----------------------- |
| Literal string      | `\` `'`                 |
| Interpolated string | `\` `"`                 |
| Unquoted string     | `\` `'` `"` `,` `[` `<` |

#### Examples

```
'A "literal string"'
"An \"interpolated string\" which may contain <tag>s"
```

#### Syntax

```ebnf
string                = literal-string | interp-string ;
literal-string        = "'", { ? string literal ? }, "'" ;
interp-string         = '"', { interp-string-element }, '"', [ interp-string-weight ] ;
interp-string-weight  = "+", ? number ? ;
interp-string-element = ? string literal ? | tag ;
```

### Functions

**Functions** are inline JS functions that may be used in tag expressions. 
Functions may receive any type and number of arguments, including tags and 
identifiers.

Functions must be valid JS. Behind the scenes functions are parsed by Babylon 
and the resulting AST is inserted into the grammar AST as arrow function 
expressions.

Because of identifier mangling applied internally by Baba, you cannot reference 
other Baba functions inside a function body.

#### Examples

```
uppercase(str) {
    return str.toUpperCase();
}
demo-function(arg) {
    return element => element + '-' + arg;
}
@export('demo', <'a':demo-function(<'b'|'c'>):uppercase>)
# -> demo = "A-B" OR "A-C"
```

#### Syntax

```ebnf
function = identifier, argument-list, "{", ? function body ?, "}";
```

### Mappings

**Mappings** are used to transform a string into another string. Mappings 
support regular expression or literal string replacement. They are applied on 
the resulting string of a tag expression.

Mappings may be bidirectional. One-directional mappings are separated with 
`->`, bidirectional mappings are separated with `<->`.

#### Examples

```
pluralize {
    /(.*)/i -> '$1s'
}
# Note: there's a better version available in baba-grammar-common
# <'word':pluralize> => "words"

size-swap {
    'large' <-> 'small'
}
# <'large':size-swap> => "small"
# <'small':size-swap> => "large"
# <'medium':size-swap> => "medium"

color-transform {
    'blue'   -> 'red'
    'yellow' -> 'purple'
}
# <'blue':color-transform> => "red"
# <'yellow':color-transform> => "purple"
# <'brown':color-transform> => "brown"
```

#### Syntax

```ebnf
mapping           = mapping-from, mapping-direction, mapping-to;
mapping-from      = literal-string | ? regular expression ? ;
mappnig-to        = literal-string;
mapping-direction = "->" | "<->" ;
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

#### `export(key: string, value: ( identifier | list | tag | string ))`

Adds a key/value pair to the exported module object.

#### `import(file: string, scope: identifier)`

Imports a Baba file into a scope.

## Compilation process

TODO
