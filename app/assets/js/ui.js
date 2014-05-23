module.exports = function() {
	var generator = require('./generators/catchphrase.generator.js')

	// init catchprase generator
	$('.catchphrase .text')
		.text(generator.catchphrase() + '!')
		.click(function() {
			$(this).text(generator.catchphrase() + '!')
		})

	// dynamic name/author
	$('#generator-name').attr('placeholder', generator.generator())
	$('#generator-author').attr('placeholder', generator.name())
}
