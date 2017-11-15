#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs';

import Baba from '../baba';

yargs.command(['parse <file>', '$0'], 'Parse grammar and output JS module',
	yargs => {
		yargs
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
		const script = Baba(argv.file, argv.minify);

		process.stdout.write(script);
	})
	.argv;
