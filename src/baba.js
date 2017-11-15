import babaParser from './parser/baba';
import * as babel from 'babel-core';
import * as babylon from 'babylon';
import * as t from "babel-types";
import fs from 'fs';

export default (grammar, minify) => {
	const getIdentifier = it => `baba$${it.join('__').replace(/[^a-z0-9_]/ig, '_')}`;
	const getFunctionIdentifier = it => `baba$${it.join('__').replace(/[^a-z0-9_]/ig, '_')}$fn`;
	const arrowWrap = (identifier, arg) => t.callExpression(
		t.identifier(identifier),
		[t.arrowFunctionExpression([], arg)],
	);

	const template = fs.readFileSync(require.resolve('./templates/default'), 'utf-8');
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
			this.imports = [];
			this.exports = [];
			this.definitions = [];
			this.vars = [];
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
			const contents = fs.readFileSync(require.resolve(file), 'utf-8');
			const contentsAst = babylon.parse(contents, { sourceType: 'module' }); 
			contentsAst.program.body.forEach(rootNode => {
				if (!t.isExportDefaultDeclaration(rootNode)) {
					return;
				}
				this.imports = this.imports.concat(this._getFunctions(rootNode.declaration.properties, [alias]));
			});
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

		addVar(identifier, alias, fallback) {
			this.vars.push(t.variableDeclaration('const', [
				t.variableDeclarator(
					t.identifier(identifier),
					t.callExpression(
						t.identifier(templateRefs.variable),
						[t.stringLiteral(alias), t.arrowFunctionExpression([], fallback)],
					),
				),
			]));
		}

		getAst() {
			// Imports
			const imports = this.imports.map(imp => {
				// const imported_func = functionWrapper(function)
				return t.variableDeclaration('const', [
					t.variableDeclarator(
						t.identifier(getFunctionIdentifier(imp.path)),
						t.callExpression(
							t.identifier(templateRefs.function),
							[imp.ast],
						),
					),
				]);
			});

			// Exports
			const exports = t.exportDefaultDeclaration(t.objectExpression(this.exports));

			return imports
				.concat(this.definitions)
				.concat(this.vars)
				.concat(exports);
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
		});
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
		list_block({ node, path }) {
			const nodePath = node.identifier ? path.concat(node.identifier.value) : [];
			const subTree = reduceTree(node.children, nodePath);

			let ret = arrowWrap(templateRefs.choice, t.arrayExpression(subTree));

			if (!nodePath.length) {
				// Anonymous list
				return ret;
			}

			const identifier = getIdentifier(nodePath);

			if (node.identifier.type === 'var_identifier') {
				// Variable declaration and fallback definition
				declarations.addVar(identifier, node.identifier.value, ret);
			}
			else {
				declarations.addDefinition(identifier, ret);
			}

			return t.identifier(identifier);
		},
		scope_block({ node, path }) {
			return this.list_block({ node, path });
		},
		literal({ node }) {
			return t.stringLiteral(node.value);
		},
		identifier({ node, path }) {
			return t.identifier(getIdentifier(path.concat(node.value.split('.'))));
		},
		var_identifier({ node, path }) {
			return this.identifier({ node, path });
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
				[argTree[0]],
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

	const presets = [
		[require('babel-preset-env'), {
			targets: {
				node: true,
			},
		}],
	];

	if (minify) {
		presets.push([require('babel-preset-minify'), {
			mangle: {
				topLevel: true,
			},
		}]);
	}

	return babel.transformFromAst(templateAst, null, {
		presets,
		babelrc: false,
		generatorOpts: {
			comments: false,
		},
	}).code;
};
