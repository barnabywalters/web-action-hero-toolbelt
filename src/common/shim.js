// ==UserScript==
// @name Web Actions Shim
// @include *
// @require zepto.min.js
// @require URI.js
// ==/UserScript==

var WebActionHero = (function() {
	// Private
	var $; // Zepto
	var verbs;
	var webActionTemplate = [
		'<div style="z-index: 9999999999; display:inline-block; background: #eee; padding-right: 0.33em; border:#555 solid 1px; border-radius: 0.3em; box-shadow: #aaa 0 0 6px;" class="web-action-hero-toolbelt-button toolbelt-web-action">',
			'<button class="toolbelt-web-action-button" style="min-height: 2em;">Verb This</button> ',
			'<select class="toolbelt-web-action-select" style="width: 1.5em;">',
				'<option disabled>Select a service:</option>',
			'</select>',
		'</div>'
	].join('');
	var inlineWebActionTemplate = [
		'<div style="z-index: 9999999999; display:block; background: #eee; border:#555 solid 1px; border-radius: 0.3em; width: 100%; height: 2em;" class="web-action-hero-toolbelt-inline toolbelt-inline-web-action"><div class="toolbelt-iframe-placeholder">',
			'<button class="toolbelt-inline-web-action-button" style="width: 90%;">Verb This</button> ',
			'<select class="toolbelt-inline-web-action-select" style="width: 10%">',
				'<option disabled>Select a service:</option>',
			'</select>',
		'</div></div>'
	].join('');

	function parseQueryString(url) {
		var uri = new URI(url);
		return uri.search(true);
	}

	function parseQueryStringFragment(url) {
		var uri = new URI(url);
		var fragment = '?' + uri.fragment();
		var fragURI = new URI(fragment);

		return fragURI.search(true);
	}

	// Array of replacement objects r with r.verb and r.replace(zepto).
	// r.replace does in-place replacement, probably calling getWebAction
	var replacements = [
		{
			verb: 'twitter-reply', // reply UI on twitter.com
			replace: function($) {
				$("a.js-action-reply").each(function(i, e) {
					var el = $(e);
					var tweet = el.parents('.tweet');
					var url = "https://twitter.com/"
							+ tweet.data('screen-name')
							+ "/status/"
							+ tweet.attr('data-item-id');

					var webActionEl = $(getWebAction('twitter-reply', url));

					el.replaceWith(webActionEl);
				});
			}
		},
		{
			verb: 'twitter-retweet', // retweet UI on twitter.com
			replace: function($) {
				$("a.js-toggle-rt").each(function(i, e) {
					var el = $(e);
					var tweet = el.parents(".tweet");
					var url = "https://twitter.com/"
							+ tweet.data('screen-name')
							+ "/status/"
							+ tweet.attr('data-item-id');

					var webActionEl = $(getWebAction('twitter-retweet', url));

					el.replaceWith(webActionEl);
				});
			}
		},
		{
			verb: 'twitter-favourite', // favourite UI on twitter.com
			replace: function($) {
				$("a.js-toggle-fav").each(function(i, e) {
					var el = $(e);
					var tweet = el.parents('.tweet');
					var url = "https://twitter.com/"
							+ tweet.data('screen-name')
							+ "/status/"
							+ tweet.attr('data-item-id');

					var webActionEl = $(getWebAction('twitter-favourite', url));

					el.replaceWith(webActionEl);
				});
			}
		},
		{
			verb: 'tw-tweet', // Tweet buttons across the web
			replace: function($) {
				$('.twitter-share-button, .twitter-mention-button, .twitter-hashtag-button')
						.each(function(i, e) {
					var el = $(e);
					var url = el.attr('data-url') || document.location.href;

					/**
					 * if I find buttons still using iframes (they seem to not be)
					 * then use parseQueryStringFragment to get properties
					 */

					var webActionEl = $(getWebAction('tw-tweet', url));

					el.siblings('[abtwitterbadge]').remove();
					el.replaceWith(webActionEl);
				});
			}
		},
		{
			verb: 'tw-follow', // Twitter follow buttons across the web
			replace: function($) {
				$('a.twitter-follow-button').each(function(i, e) {
					var el = $(e);
					var url = el.attr('href');
					var webActionEl = $(getWebAction('tw-follow', url));
					el.replaceWith(webActionEl);
				});

				$('iframe.twitter-follow-button').each(function(i, e) {
					var el = $(e);
					var properties = parseQueryStringFragment(el.attr('src'));
					var url = 'https://twitter.com/' + properties.screen_name;

					var webActionEl = $(getWebAction('tw-follow', url));
					el.replaceWith(webActionEl);
				});
			}
		},
		{
			verb: 'fb-like', // Facebook Like buttons across the web
			replace: function($) {
				// TODO: Not sure if this is working
				$('.fb-like').each(function(i, e) {
					var el = $(e);
					var url = el.attr('href') || document.location.href;
					
					var webActionEl = $(getWebAction('fb-like', url));
					el.replaceWith(webActionEl);
				});
			}
		},
		{
			verb: 'g-plus-one', // Google +1 buttons across the web
			replace: function ($) {
				$('.g-plusone').each(function (i, e) {
					var el = $(e);
					var url = el.attr('data-href');
					
					var webActionEl = $(getWebAction('g-plus-one', url));
					el.siblings('[abgoogle]').remove();
					el.replaceWith(webActionEl);
				})
			}
		}
	];

	// Returns the verb object or null for verb name
	function getVerb(name) {
		for (var i = 0; i < verbs.length; i++) {
			if (verbs[i].name === name) {
				return verbs[i];
			}
		}

		return null;
	}

	// Checks to see if there are valid (name and url nonempty) service(s)
	// defined for a given verb
	function verbDefined(name) {
		var verb = getVerb(name);

		if (verb === null)
			return false;

		if (verb.services.length === 0)
			return false;

		if (verb.services.every(function(service) {
			return service.name === '' || service.url === ''
					|| service.name === null || service.url === null;
		}))
			return false;

		return true;
	}

	// Returns web action markup for a given verb and link
	function getWebAction(verb, link) {
		return '<action do="' + verb + '" with="' + link + '">THIS WAS REPLACED</action>';
	}

	function main(config) {
		kango.console.log('main() called with config:');
		kango.console.log(config);

		verbs = config.verbs;
		replace();
		activateWebActions();
		
		if (verbDefined('sel-quote') !== false)
			startSelectionHandler();
	}
	
	// Container function which calls functions which do UI/button customisation,
	// replacing them with web action elements
	function replace() {
		var toReplace = replacements.filter(function(item) {
			return verbDefined(item.verb);
		});

		toReplace.forEach(function(replacement) {
			kango.console.log('Replacing for verb ' + replacement.verb);
			replacement.replace($);
		});
	}

	function getActionDispatcher(delegateURL, replace) {
		if (typeof replace === 'string') {
			var dispatch = delegateURL.split('{url}').join(encodeURIComponent(replace));
		} else if (typeof replace === 'object') {
			var dispatch = delegateURL;
			for (var placeholder in replace) {
				dispatch = dispatch.split('{' + placeholder + '}').join(encodeURIComponent(replace[placeholder]));
			}
		}
		
		var f = function(event) {
			console.log('Dispatching web action to ' + dispatch);
			window.open(dispatch);
		};
		
		f.url = dispatch;
		
		return f;
	}
	
	function activateButtonWebAction(e) {
		var el = $(e);
		var ui = $(webActionTemplate);
		var button = ui.find('button');
		var options = ui.find('select');
		var url = el.attr('with');
		
		if (!verbDefined(el.attr('do')))
			return;
		
		var verb = getVerb(el.attr('do'));
		
		button.text(verb.name);
		
		verb.services.forEach(function(service, i) {
			if (i === verb.default) {
				button.attr('title', service.name);
				button.text(service.name);
				button.click(getActionDispatcher(service.url, url));
			} else {
				var option = $('<option />');
				option.text(service.name);
				option.attr('data-dispatch-url', service.url);

				options.append(option);
			}
		});

		options.change(function() {
			dispatch = getActionDispatcher(this.getAttribute('data-dispatch-url'), url);
			dispatch();
		});

		kango.console.log('There are ' + options.children().length + ' options');
		if (options.children().length === 1) {
			options.remove();
		}

		// Replace contents of <action> with ui
		el.replaceWith(ui);
	}
	
	function replaceContainerWithIframe(el, url) {
		var ifr = document.createElement('iframe');
		ifr.seamless = true;
		ifr.scrolling = 'no';
		ifr.src = url;
		ifr.style.width = '100%';
		
		window.addEventListener('message', function (event) {
			// TODO: check origin, etc matches url
			console.log(event.source);
			
			if (event.source == ifr) {
				console.log('The message was from our iframe');
			}
		}, false);
		
		var replace = el[0].querySelector('.toolbelt-iframe-placeholder');
		replace.parentElement.replaceChild(ifr, replace);
	}
	
	function activateInlineWebAction(e) {
		var el = $(e);
		var ui = $(inlineWebActionTemplate);
		var button = ui.find('button');
		var options = ui.find('select');
		var url = el.attr('with');
		
		if (!verbDefined(el.attr('do')))
			return;
		
		var verb = getVerb(el.attr('do'));
		
		button.text(verb.name);
		
		verb.services.forEach(function(service, i) {
			if (i === verb.default) {
				button.attr('title', service.name);
				button.text(service.name);
				button.click(function () {
					replaceContainerWithIframe(ui, service.url);
				});
			} else {
				var option = $('<option />');
				option.text(service.name);
				option.attr('data-dispatch-url', service.url);

				options.append(option);
			}
		});

		options.change(function() {
			replaceContainerWithIframe(ui, this.getAttribute('data-dispatch-url'));
		});
		
		if (options.children().length === 1) {
			options.remove();
		}

		// Replace contents of <action> with ui
		el.replaceWith(ui);
	}
	
	// Goes through all <action> elements, replaces their fallback content with
	// a verb UI
	function activateWebActions() {
		$('action').each(function(i, e) {
			if (e.hasAttribute('inline')) {
				console.log('Activating inline action on', e);
				activateInlineWebAction(e);
			} else {
				console.log('Activating button action on', e);
				activateButtonWebAction(e);
			}
		});
	}
	
	function startSelectionHandler() {
		$('body').children().on('mouseup', function (event) {
			$('#web-actions-selection').remove();
			
			var s = window.getSelection();
			
			if (s.isCollapsed)
				return;
			
			console.log('Starting isCollapsed log');
			
			var r = s.getRangeAt(0);
			
			var selText = r.toString();
			var htmlCont = document.createElement('div');
			htmlCont.appendChild(r.cloneContents());
			var selHTML = htmlCont.innerHTML;
			
			// TODO: Better way of determining URL using this as a fallback.
			// Possibles:
			// * Find closest child web action and use it’s @with
			// * Find closest ancestor containing a[class|=u-url] and use href
			var url = document.location.href;
			
			var replace = {
				url: url,
				text: selText,
				html: selHTML
			};
			
			console.log(replace);
			
			var verb = getVerb('sel-quote');
			
			// TODO: Make a function which generates this UI for all cases
			var ui = $(webActionTemplate);
			var button = ui.find('button');
			var options = ui.find('select');
			
			button.text(verb.name);

			verb.services.forEach(function(service, i) {
				if (i === verb.default) {
					button.attr('title', service.name);
					button.text(service.name);
					button.click(getActionDispatcher(service.url, replace));
				} else {
					var option = $('<option />');
					option.text(service.name);
					option.attr('data-dispatch-url', service.url);

					options.append(option);
				}
			});

			options.change(function() {
				var o = this.item(this.selectedIndex);
				dispatch = getActionDispatcher(o.getAttribute('data-dispatch-url'), replace);
				kango.invokeAsync('kango.browser.tabs.create', {url: dispatch.url});
			});
			
			// ui is the web action, now create a positioned container for it
			// with events to destroy it when it is unfocused
			
			var startEl = r.startContainer.nodeType === Node.TEXT_NODE
				? r.startContainer.parentNode
				: r.startContainer;
			
			var coords = $(startEl).offset();
			
			var c = document.createElement('div');
			c.setAttribute('id', 'web-actions-selection');
			c.style.position = 'absolute';
			c.style.top = (coords.top) + 'px';
			c.style.left = (coords.left) + 'px';
			c.style.zIndex = 9999999999;
			
			c.appendChild(ui[0]);
			
			document.body.appendChild(c);
		});
	}
	
	// Public
	return {
		init: function() {
			kango.invokeAsync('kango.storage.getItem', 'config', main);
		},
		setZepto: function(zepto) {
			$ = zepto;
		}
	};
}());

WebActionHero.setZepto(Zepto);
window.setTimeout(WebActionHero.init, 1);