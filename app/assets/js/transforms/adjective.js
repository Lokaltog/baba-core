module.exports = {
	id: 'jti2urlqps',
	label: 'Adjective',
	children: [
		{
			id: '07z8wo05hy',
			label: 'Convert',
			children: [
				{
					id: 'ipb3aevta0',
					label: 'Abstract noun',
					tag: '·ity',
					type: 'suffix',
					re: [
						[['(.*)eme$', 'i'], '$1emacy'],
						[['(.*)([ia])ble$', 'i'], '$1$2bility'],
						[['(.*)([tv])e$', 'i'], '$1$2eness'],
						[['(.*)[aeiouy]$', 'i'], '$1ity'],
						[['(.*)$', 'i'], '$1ity'],
					],
				},
				{
					id: '486o4dziu0',
					label: 'Adverb',
					tag: '·ly',
					type: 'suffix',
					re: [
						[['(.*)ic$', 'i'], '$1ically'],
						[['(.*)[aeiouy]$', 'i'], '$1y'],
						[['(.*)$', 'i'], '$1ly'],
					],
				},
			],
		},
	],
}
