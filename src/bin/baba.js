#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';

import Baba from '../baba';

yargs.command(['parse <file>', '$0'], 'Parse grammar and output JS module',
	yargs => {
		yargs
			.option('prettify', {
				default: false,
			})
			.option('minify', {
				default: false,
			})
			.positional('file', {
				describe: 'Baba grammar file',
				type: 'string',
				coerce: arg => fs.readFileSync(arg, 'utf8'),
			});
	},
	argv => {
		const script = Baba(argv.file);

		if (argv.prettify) {
			const prettier = require('prettier');
			process.stdout.write(prettier.format(script));
			return;
		}
		if (argv.minify) {
			const minify = require('babel-minify');
			process.stdout.write(minify(script).code);
			return;
		}

		process.stdout.write(script);
	})
	.argv;
