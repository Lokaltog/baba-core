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
						$('#popup-import-grammar input[name=gist-uri]').focus()
					}, 100)
				},
				afterClose: function() {
					var gistUri = $('#popup-import-grammar input[name=gist-uri]')
					var gistUriVal = gistUri.val()
					gistUri.val('')

					if (gistUriVal) {
						importGenerator.fromGist(gistUriVal)
							.done(function(ret) {
								module.exports.alert('The grammar <strong>' + ret.grammar.name + '</strong> by <strong>' + ret.grammar.author + '</strong> was successfully imported.')
								vm.generator = ret
							})
							.fail(function(ret) {
								module.exports.alert(ret)
							})
						return
					}

					var jsonText = $('#popup-import-grammar textarea')
					var jsonTextVal = jsonText.val()
					jsonText.val('')

					if (jsonTextVal) {
						importGenerator.fromJson(jsonTextVal)
							.done(function(ret) {
								module.exports.alert('The grammar <strong>' + ret.grammar.name + '</strong> by <strong>' + ret.grammar.author + '</strong> was successfully imported.')
								vm.generator = ret
							})
							.fail(function(ret) {
								module.exports.alert(ret)
							})
					}
				},
			},
		})
		$('#popup-import-grammar input[name=gist-uri]').keydown(function(ev) {
			if (ev.keyCode === 13) {
				$.magnificPopup.close()
			}
		})
	},
	alert: function(text, iconClass, buttonText) {
		$('#popup-alert .text').html(text)
		$('#popup-alert .btn').text((buttonText || 'OK'))
		$('#popup-alert .icon').attr('class', 'icon ' + (iconClass || 'info'))

		$.magnificPopup.open({
			mainClass: 'mfp-transition-zoom-in',
			removalDelay: 300,
			preloader: false,
			closeBtnInside: false,
			callbacks: {
				open: function() {
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
	},
}
