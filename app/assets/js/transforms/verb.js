module.exports = {
	id: '1nbdszqqro',
	label: 'Verb',
	children: [
		{
			id: '5by5fe3nqu',
			label: 'Tense',
			children: [
				{
					id: '9z7i8y279k',
					label: 'Present',
					tag: 's',
					type: 'suffix',
					transforms: [
						['^(.*[^aeiou])y$', '$1ies'],
						['^(.*([sc]h|s|ex))$', '$1es'],
						['^(.*)$', '$1s'],
					],
				},
				{
					// Rules from http://www.oxforddictionaries.com/us/words/verb-tenses-adding-ed-and-ing
					id: '8ikx0opb7j',
					label: 'Present participle',
					tag: 'ing',
					type: 'suffix',
					transforms: [
						// two wovels + consonant -> not double final consonant
						['^(.*[aeiouy]{2}[bcdfghjklmnpqrstvwxz])$', '$1ing'],
						// words ending in c
						['^(.*c)$', '$1king'],
						// attempt to handle stress on verbs ending in wovel + consonant
						// exceptions, stress on end of word
						['^(.*)mit$', '$1mitting'],
						['^(.*)fer$', '$1ferring'],
						// double consonant on short (one-syllable) words
						['^(.{1,3}[aeiou])([bdfglmnprstz])$', '$1$2$2ing'],
						// universal rules
						['^(.*[aeiouy]l)$', '$1ling'],
						['^(.*?[eyo]e)$', '$1ing'],
						['^(.*?)e?$', '$1ing'],
					],
				},
				{
					// Rules from http://www.oxforddictionaries.com/us/words/verb-tenses-adding-ed-and-ing
					id: 'lioq5xaxsi',
					label: 'Past',
					tag: 'ed',
					type: 'suffix',
					transforms: [
						// two wovels + consonant -> not double final consonant
						['^(.*[aeiouy]{2}[bcdfghjklmnpqrstvwxz])$', '$1ed'],
						// words ending in c
						['^(.*c)$', '$1ked'],
						// attempt to handle stress on verbs ending in wovel + consonant
						// exceptions, stress on end of word
						['^(.*)mit$', '$1mitted'],
						['^(.*)fer$', '$1ferred'],
						// double consonant on short (one-syllable) words
						['^(.{1,3}[aeiou])([bdfglmnprstz])$', '$1$2$2ed'],
						// universal rules
						['^(.*[aeiouy]l)$', '$1led'],
						['^(.*?[eyo]e)$', '$1d'],
						['^(.*)y$', '$1ied'],
						['^(.*?)e?$', '$1ed'],
					],
				},
				{
					id: 'q0uri6irxk',
					label: 'Past participle',
					tag: 'en',
					type: 'suffix',
					transforms: [
						['^(.*?)[aeiouy]?$', '$1en'],
					],
				},
			],
		},
		{
			id: '61jbjp2yl2',
			label: 'Convert',
			children: [
				{
					id: '9i2oiktftv',
					label: 'Make/become/treat',
					tag: 'ize',
					type: 'suffix',
					transforms: [
						['^(.*?)[aeiouy]?$', '$1ize'],
					],
				},
				{
					id: 'mxjz59qvra',
					label: 'Agent noun (Latinate)',
					tag: 'or',
					type: 'suffix',
					transforms: [
						['^(.*?)(e|or)?$', '$1or'],
					],
				},
				{
					id: 'v5o544wj5n',
					label: 'Agent noun (Germanic)',
					tag: 'er',
					type: 'suffix',
					transforms: [
						['^(.*?)e?$', '$1er'],
					],
				},
			],
		},
	],
}
