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
					tag: 'ity',
					type: 'suffix',
					transforms: [
						['^(.*)eme$', '$1emacy'],
						['^(.*)([ia])ble$', '$1$2bility'],
						['^(.*)([tv])e$', '$1$2eness'],
						['^(.*[aeiouy]?)$', '$1ity'],
					],
				},
				{
					id: '486o4dziu0',
					label: 'Adverb',
					tag: 'ly',
					type: 'suffix',
					transforms: [
						['^(.*)ic$', '$1ically'],
						['^(.*)[aeiouy]$', '$1y'],
						['^(.*)$', '$1ly'],
					],
				},
			],
		},
	],
}
