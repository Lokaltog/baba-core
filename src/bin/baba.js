#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';

import Baba from '../baba';

yargs.command(['parse <file>', '$0'], 'Parse grammar and output JS module',
	yargs => yargs
		.option('minify', {
			describe: 'Minify output',
			default: false,
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
			coerce: arg => fs.readFileSync(arg, 'utf8'),
		}),
	argv => {
		const script = Baba(argv.file, {
			browsers: argv.targetBrowsers,
			node: argv.targetNode,
		}, argv.minify);

		process.stdout.write(script);
	})
	.argv;
