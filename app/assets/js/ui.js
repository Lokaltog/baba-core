var $ = require('jquery')

module.exports = function() {
	var Baba = require('./generators/baba-dynamic-site-text')

	// init catchprase generator
	$('.catchphrase .text')
		.text(Baba.generator.catchphrase() + '!')
		.click(function() {
			$(this).text(Baba.generator.catchphrase() + '!')
		})

	// dynamic name/author
	$('#generator-name').attr('placeholder', Baba.generator.generator())
	$('#generator-author').attr('placeholder', Baba.generator.name())
}
