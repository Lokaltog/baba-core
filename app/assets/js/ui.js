module.exports = function() {
	var catchphraseGenerator = require('./generators/catchphrase.generator.js')

	// init catchprase generator
	$('.catchphrase .text')
		.text(catchphraseGenerator.catchphrase() + '!')
		.click(function() {
			$(this).text(catchphraseGenerator.catchphrase() + '!')
		})
}
