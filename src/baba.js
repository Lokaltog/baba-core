import babaParser from './parser/baba';
import * as babel from 'babel-core';
import * as babylon from 'babylon';
import * as t from "babel-types";
import fs from 'fs';
import path from 'path';

function findImport(directory, fileName) {
	const file = [
		path.join(directory, fileName),
		path.join(directory, 'node_modules', fileName),
	].filter(f => fs.existsSync(f) && fs.statSync(f).isFile())[0];

	if (file) {
		return file;
	}
	let parent = path.resolve(directory, '..');
	if (parent === directory) {
		return null;
	}
	return findImport(parent, fileName);
}

const getAst = (grammar, jsTemplate='default') => {
	const getIdentifier = it => `baba$${it.join('$').replace(/[^a-z0-9_]/ig, '_')}`;
	const getFunctionIdentifier = it => `baba$${it.join('$').replace(/[^a-z0-9_]/ig, '_')}$$fn`;
	const getVarIdentifier = it => `baba$${it.join('$').replace(/[^a-z0-9_]/ig, '_')}$$var`;
	const arrowWrap = (identifier, arg) => t.callExpression(
		t.identifier(identifier),
		[t.arrowFunctionExpression([], arg)],
	);

	const template = fs.readFileSync(require.resolve(`./templates/${jsTemplate}`), 'utf-8');
	const templateAst = babylon.parse(template, { sourceType: 'module' });

	const templateRefs = {};
	(function extractTemplateData(node) {
		if (Array.isArray(node)) {
			node.forEach(sub =>	extractTemplateData(sub));
			return;
		}

		try {
			const [, m] = node.leadingComments[0].value.trim().match(/@([a-z]+)/);
			if (m) {
				templateRefs[m] = node.declarations[0].id.name;
			}
		}
		catch (e) {
			// Ignore
		}
	})(templateAst.program.body);

	class DeclarationBlock {
		constructor() {
			this.exports = [];
			this.definitions = [];
			this.vars = [];
			this.declaredVars = [];
			this.mappings = {};
		}

		_getFunctions(node, path=[]) {
			let ret = [];
			if (Array.isArray(node)) {
				node.forEach(subNode => {
					ret = ret.concat(this._getFunctions(subNode, path.concat(subNode.key.name || subNode.key.value)));
				});
				return ret;
			}
			if (t.isObjectProperty(node)) {
				if (t.isObjectExpression(node.value)) {
					return ret.concat(this._getFunctions(node.value.properties, path));
				}
				return {path, ast: node.value};
			}
			else if (t.isObjectMethod(node)) {
				return {path, ast: t.functionExpression(null, node.params, node.body)};
			}
			return ret;
		}

		addImport(file, alias) {
			const filePath = findImport(path.resolve(path.dirname(file)), file + '.baba');
			if (!filePath) {
				throw new Error(`Could not find grammar file "${file}"`);
			}
			const contents = fs.readFileSync(filePath, 'utf-8');
			reduceTree(babaParser.parse(contents), [alias]); // Parse and insert the imported grammar
		}

		addFunction(identifier, args, body) {
			this.definitions.push(t.variableDeclaration('const', [
				t.variableDeclarator(
					t.identifier(identifier),
					t.callExpression(
						t.identifier(templateRefs.function),
						[
							t.arrowFunctionExpression(
								args.map(arg => t.identifier(arg)),
								// The function must be wrapped in a function body to 
								// be able to parsed, otherwise we'll likely receive 
								// a "return outside function" exception
								babylon.parse(`() => { ${body} }`).program.body[0].expression.body,
							),
						],
					),
				),
			]));
		}

		addMapping(identifier, from, to, type) {
			if (!this.mappings[identifier]) {
				this.mappings[identifier] = [];
			}

			let ret = [
				from.type === 'regexp' ? babylon.parse(from.value).program.body[0].expression : t.stringLiteral(from.value),
				t.stringLiteral(to.value),
			];

			this.mappings[identifier].push(t.arrayExpression(ret));

			if (type === '<->') {
				// Add reverse mapping (bidirectional)
				this.mappings[identifier].push(t.arrayExpression(ret.slice().reverse()));
			}
		}

		addExport(key, value) {
			this.exports.push(t.objectProperty(t.stringLiteral(key), value));
		}

		addDefinition(identifier, value) {
			this.definitions.push(t.variableDeclaration('const', [
				t.variableDeclarator(
					t.identifier(identifier),
					value,
				),
			]));
		}

		addVar(identifier, alias, value) {
			if (~this.declaredVars.indexOf(identifier)) {
				return;
			}
			this.declaredVars.push(identifier);
			this.vars.push(t.variableDeclaration('const', [
				t.variableDeclarator(
					t.identifier(identifier),
					t.callExpression(
						t.identifier(templateRefs.variable),
						[t.stringLiteral(alias), t.arrowFunctionExpression([], value)],
					),
				),
			]));
		}

		getAst() {
			let mappings = Object.entries(this.mappings)
				.reduce((acc, [identifier, arr]) =>
					acc.concat(t.variableDeclaration('const', [
						t.variableDeclarator(
							t.identifier(identifier),
							t.callExpression(t.identifier(templateRefs.mapping), arr),
						),
					])), []);

			return mappings
				.concat(this.definitions)
				.concat(this.vars)
				.concat(t.exportDefaultDeclaration(t.objectExpression(this.exports)));
		}
	}

	const declarations = new DeclarationBlock();
	const parsed = babaParser.parse(grammar);

	let handlers;

	const reduceTree = (nodes, path=[]) => {
		// Note: A handler must return an AST node with children, or undefined
		return nodes.map(node => {
			try {
				return handlers[node.type]({ node, path });
			}
			catch (e) {
				console.error('Error in "%s" at "%s" handler: %s', node.type, path.join('.'), e);
				throw e;
			}
		}).filter(item => !!item); // Remove empty items
	};

	handlers = {
		meta_import({ node }) {
			const [file, alias] = node.arguments;
			declarations.addImport(file.value, alias.value);
		},
		meta_export({ node, path }) {
			const [key, value] = node.arguments;

			declarations.addExport(key.value, t.callExpression(
				t.identifier(templateRefs.export), [t.arrowFunctionExpression([], reduceTree([value], path)[0])]
			));
		},
		list_block({ node, path, addDeclaration=true }) {
			const nodePath = node.identifier ? path.concat(node.identifier.value) : [];
			const subTree = reduceTree(node.children, nodePath);

			if (!subTree.length) {
				// Ignore empty scopes/lists
				return null;
			}

			let ret = arrowWrap(templateRefs.choice, t.arrayExpression(subTree));

			if (!nodePath.length) {
				// Anonymous list
				return ret;
			}

			const identifier = getIdentifier(nodePath);

			if (addDeclaration) {
				if (node.identifier.type === 'var_identifier') {
					// Variable declaration and fallback definition
					declarations.addVar(getVarIdentifier(path.concat(node.identifier.value)), node.identifier.value, ret);
				}
				else {
					declarations.addDefinition(identifier, ret);
				}
			}

			return t.identifier(identifier);
		},
		scope_block({ node, path }) {
			// TODO Scopes may be exported if declarations are added, make this 
			// configurable. It's off by default to save space in the generated 
			// JS file.
			return this.list_block({ node, path, addDeclaration: false });
		},
		tag_block({ node, path }) {
			const subTree = reduceTree([node.tag], path);
			const identifier = getIdentifier(path.concat(node.identifier.value));

			let ret = arrowWrap(templateRefs.choice, t.arrayExpression(subTree));

			if (node.identifier.type === 'var_identifier') {
				// Variable declaration and fallback definition
				declarations.addVar(getVarIdentifier(path.concat(node.identifier.value)), node.identifier.value, ret);
			}
			else {
				declarations.addDefinition(identifier, ret);
			}

			return t.identifier(identifier);
		},
		quoted_string_block({ node, path }) {
			const subTree = reduceTree([node.string], path);
			const identifier = getIdentifier(path.concat(node.identifier.value));

			let ret = subTree[0];

			if (node.identifier.type === 'var_identifier') {
				// Variable declaration and fallback definition
				declarations.addVar(getVarIdentifier(path.concat(node.identifier.value)), node.identifier.value, ret);
			}
			else {
				declarations.addDefinition(identifier, ret);
			}

			return t.identifier(identifier);
		},
		literal({ node }) {
			return t.stringLiteral(node.value);
		},
		function({ node, path }) {
			declarations.addFunction(
				getFunctionIdentifier(path.concat(node.identifier.value)),
				node.arguments.map(arg => arg.value),
				node.body);
		},
		mapping({ node, path }) {
			declarations.addMapping(getFunctionIdentifier(path), node.from, node.to, node.dir);
		},
		identifier({ node, path }) {
			return t.identifier(getIdentifier(path.concat(node.value.split('.'))));
		},
		var_identifier({ node, path }) {
			return t.identifier(getVarIdentifier(path.concat(node.value.split('.'))));
		},
		var_assign({ node, optional=false }) {
			const identifier = getVarIdentifier(node.name.value.split('.'));
			const ret = reduceTree(node.value)[0];
			declarations.addVar(identifier, node.name.value, ret);

			// Returns `VARIABLE.a(() => VALUE`
			return t.callExpression(
				t.memberExpression(
					t.identifier(identifier),
					t.identifier('a'),
				),
				[
					t.arrowFunctionExpression([], ret),
					t.booleanLiteral(optional),
				],
			);
		},
		var_opt_assign({ node }) {
			return this.var_assign({ node, optional: true });
		},
		function_identifier({ node, path }) {
			return t.identifier(getFunctionIdentifier(path.concat(node.value.split('.'))));
		},
		interpolated_string({ node }) {
			let subTree = reduceTree(node.children);
			let ret = arrowWrap(templateRefs.concat, t.arrayExpression(subTree));
			if (node.weight > 1) {
				// Returns `new Array(weight).fill(CONCAT(() => NODES))`
				return t.callExpression(t.memberExpression(t.newExpression(t.identifier('Array'), [t.numericLiteral(node.weight)]), t.identifier('fill')), [ret]);
			}
			// Returns `CONCAT(() => NODES)`
			return ret;
		},
		tag({ node, path }) {
			if (node.quantifier === '?') {
				// "Optional" quantifier
				node.children.push({ type: 'literal', value: '' });
				return this.tag_choice({ node, path });
			}
			return reduceTree(node.children, path)[0];
		},
		tag_choice({ node, path }) {
			return this.list_block({ node, path });
		},
		tag_concat({ node, path }) {
			return arrowWrap(templateRefs.concat, t.arrayExpression(reduceTree(node.children, path)));
		},
		transform({ node, path }) {
			const argTree = reduceTree(node.args, path);
			const fnTree = reduceTree(node.fn, path);
			return t.callExpression(
				fnTree[0],
				[t.arrowFunctionExpression([], argTree[0])]
			);
		},
		function_call({ node, path }) {
			// Note: Function calls must return a callable
			const argTree = reduceTree(node.args, path);
			const fnIdentifier = t.identifier(getFunctionIdentifier(node.fn.value.split('.')));
			return t.callExpression(
				fnIdentifier,
				argTree,
			);
		},
	};

	reduceTree(parsed);

	templateAst.program.body = templateAst.program.body.concat(declarations.getAst());

	templateAst.program.body = [(t.exportDefaultDeclaration(t.arrowFunctionExpression([], 
		t.blockStatement(templateAst.program.body))))]

	return templateAst;
};

export default (file, targets, minify=false, template='default') => {
	const presets = [];

	if (minify) {
		presets.push(
			[require('babel-preset-env'), { targets }],
			[require('babel-preset-minify'), {
				mangle: {
					topLevel: true,
				},
			}],
		);
	}

	return babel.transformFromAst(
		getAst(fs.readFileSync(file, 'utf-8'), template),
		null, {
			presets,
			babelrc: false,
			generatorOpts: {
				comments: false,
			},
		}).code;
};
