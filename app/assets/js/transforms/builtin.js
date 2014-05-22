module.exports = {
	id: '77xwo46b8i',
	label: 'Built-in',
	children: [
		{
			id: '4zof4baosv',
			label: 'Common',
			children: [
				{
					id: '654xgb5vh1',
					label: 'Uppercase',
					transforms: [
						function(str) {
							return str.toUpperCase()
						},
					],
				},
				{
					id: 'uhoj9p0fyl',
					label: 'Uppercase first',
					transforms: [
						function(str) {
							return str.substring(0, 1).toUpperCase() + str.substring(1, str.length)
						},
					],
				},
			],
		},
		{
			id: 'q17kuhis6f',
			label: 'Technical',
			children: [
				{
					id: '97zyo4wmwl',
					label: 'Slugify',
					transforms: [
						function(str) {
							return str.replace(/[^\w-]/g, '-').toLowerCase()
						},
					],
				},
				{
					id: '3h13djennn',
					label: 'Constantify',
					transforms: [
						function(str) {
							return str.replace(/[^\w-]/g, '_').toUpperCase()
						},
					],
				},
			],
		},
	],
}
