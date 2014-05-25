var $ = require('jquery')
var Baba = require('./generators/baba-dynamic-site-text')

module.exports = {
	init: function(vm) {
		var importGenerator = require('./import')

		$('.popup button.dismiss').click(function() {
			$.magnificPopup.close()
		})

		$('#import-grammar').magnificPopup({
			type: 'inline',
			preloader: false,
			closeBtnInside: false,
			removalDelay: 300,
			mainClass: 'mfp-transition-zoom-in',
			callbacks: {
				open: function() {
					setTimeout(function() {
						$('#popup-import input[name=gist-uri]').focus()
					}, 100)
				},
				afterClose: function() {
					var gistUri = $('#popup-import input[name=gist-uri]')
					var gistUriVal = gistUri.val()
					gistUri.val('')

					if (gistUriVal) {
						importGenerator.fromGist(gistUriVal)
							.done(function(ret) {
								module.exports.alert('The grammar <strong>' + ret.grammar.name + '</strong> by <strong>' + ret.grammar.author + '</strong> was successfully imported.')
								vm.generator = ret
							})
							.fail(function(ret) {
								module.exports.alert(ret, 'error')
							})
						return
					}

					var jsonText = $('#popup-import textarea')
					var jsonTextVal = jsonText.val()
					jsonText.val('')

					if (jsonTextVal) {
						importGenerator.fromJson(jsonTextVal)
							.done(function(ret) {
								module.exports.alert('The grammar <strong>' + ret.grammar.name + '</strong> by <strong>' + ret.grammar.author + '</strong> was successfully imported.')
								vm.generator = ret
							})
							.fail(function(ret) {
								module.exports.alert(ret, 'error')
							})
					}
				},
			},
		})
		$('#popup-import input[name=gist-uri], #popup-prompt input').keydown(function(ev) {
			if (ev.keyCode === 13) {
				$.magnificPopup.close()
			}
		})
	},
	alert: function(text, iconClass, buttonText) {
		var deferred = $.Deferred()

		var btnText
		switch (iconClass) {
		default:
		case 'info':
		case 'success':
			btnText = Baba.generator.confirm()
			break
		case 'error':
		case 'warn':
			btnText = Baba.generator.error()
			break
		}

		$('#popup-alert .text').html(text)
		$('#popup-alert .icon').attr('class', 'icon ' + (iconClass || 'info'))
		$('#popup-alert button').text(buttonText || btnText)

		$.magnificPopup.open({
			mainClass: 'mfp-transition-zoom-in',
			removalDelay: 300,
			preloader: false,
			closeBtnInside: false,
			callbacks: {
				open: function() {
					$('#popup-confirm button').click(function() {
						return deferred.resolve()
					})
					setTimeout(function() {
						$('#popup-alert button').focus()
					}, 100)
				}
			},
			items: {
				type: 'inline',
				src: '#popup-alert',
			},
		})

		return deferred.promise()
	},
	confirm: function(text) {
		var deferred = $.Deferred()

		$('#popup-confirm .text').html(text)
		$('#popup-confirm .btn.yes').text(Baba.generator.yes())
		$('#popup-confirm .btn.no').text(Baba.generator.no())

		$.magnificPopup.open({
			mainClass: 'mfp-transition-zoom-in',
			removalDelay: 300,
			preloader: false,
			closeBtnInside: false,
			callbacks: {
				open: function() {
					$('#popup-confirm .btn.yes').click(function() {
						return deferred.resolve()
					})
					$('#popup-confirm .btn.no').click(function() {
						return deferred.reject()
					})
					setTimeout(function() {
						$('#popup-alert .btn.yes').focus()
					}, 100)
				}
			},
			items: {
				type: 'inline',
				src: '#popup-confirm',
			},
		})

		return deferred.promise()
	},
	prompt: function(text, buttonText) {
		var deferred = $.Deferred()

		$('#popup-prompt .text').html(text)
		$('#popup-prompt button').text(buttonText || 'Submit')

		$.magnificPopup.open({
			mainClass: 'mfp-transition-zoom-in',
			removalDelay: 300,
			preloader: false,
			closeBtnInside: false,
			callbacks: {
				open: function() {
					setTimeout(function() {
						$('#popup-prompt input').focus()
					}, 100)
				},
				close: function() {
					return deferred.resolve($('#popup-prompt input').val())
				},
			},
			items: {
				type: 'inline',
				src: '#popup-prompt',
			},
		})

		return deferred.promise()
	},
}
