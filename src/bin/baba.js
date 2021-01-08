#!/usr/bin/env node

import fs from 'fs';
import vm from 'vm';
import yargs from 'yargs';

import Baba from '../baba';

yargs.command(['parse <file>', '$0'], 'Parse grammar and output JS module',
	yargs => yargs
		.option('minify', {
			describe: 'Minify output',
			type: 'boolean',
			default: false,
		})
		.option('test-output', {
			describe: 'Test generator output',
			type: 'string',
		})
		.option('test-output-count', {
			type: 'number',
			default: 5,
		})
		.option('target-browsers', {
			describe: 'Target browsers (browserslist syntax)',
			type: 'string',
			default: 'last 1 firefox version, last 1 chrome version, last 1 edge version',
		})
		.option('target-node', {
			describe: 'Node target',
			type: 'string',
			default: 'current',
		})
		.positional('file', {
			describe: 'Baba grammar file',
			type: 'string',
		})
		.positional('template', {
			describe: 'JS template',
			type: 'string',
			default: 'default',
		}),
	argv => {
		const script = Baba(argv.file, {
			browsers: argv.targetBrowsers,
			node: argv.targetNode,
		}, argv.minify, argv.template);

		if (typeof argv.testOutput !== 'undefined') {
			const wrap = (s, w) => s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n');
			const addBullet = str => str.substr(0, 2) + '\x1b[31m→\x1b[0m' + str.substr(3);
			const outputText = text => addBullet(wrap(text, 80).split('\n').map(it => `    ${it}`).join('\n')) + '\n';

			const generator = new vm.Script(script);
			const sandbox = {exports: {}};
			vm.createContext(sandbox);
			generator.runInContext(sandbox);

			const source = argv.testOutput && sandbox.exports.default[argv.testOutput]
				? { [argv.testOutput]: sandbox.exports.default[argv.testOutput] }
				: sandbox.exports.default;

			Object.entries(source).forEach(([key, fn]) => {
				process.stdout.write(`\x1b[1;31m${key}\x1b[0m\n`);
				for (let i = 1; i <= argv.testOutputCount; i++) {
					process.stdout.write(outputText(fn()));
				}
			});
		}
		else {
			process.stdout.write(script);
		}
	})
	.argv;
