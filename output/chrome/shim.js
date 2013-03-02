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
        '<div style="display:inline-block; padding-right: 0.33em; border:#555 solid 1px; border-radius: 0.3em;" class="web-action-hero-toolbelt-button">',
        '<button>Verb This</button>',
        '<select style="width: 1.5em;">',
        '<option selected disabled>Select a service:</option>',
        '</select>',
        '</div>'
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

    function getActionDispatcher(delegateURL, withURL) {
        var dispatch = delegateURL.split('{url}').join(encodeURIComponent(withURL));

        return function() {
            window.open(dispatch);
        };
    }

    // Goes through all <action> elements, replaces their fallback content with
    // a verb UI
    function activateWebActions() {
        $('action').each(function(i, e) {
            var el = $(e);
            var ui = $(webActionTemplate);
            var button = ui.find('button');
            var options = ui.find('select');
            var url = el.attr('with');

            var verb = getVerb(el.attr('do'));

            button.text(verb.name);

            verb.services.forEach(function(service, i) {
                if (i === verb.default) {
                    button.attr('title', service.name);
                    button.click(getActionDispatcher(service.url, url));
                } else {
                    var option = $('<option />');
                    option.text(service.name);
                    option.attr('data-dispatch-url', service.url);

                    options.append(option);
                }
            });

            options.change(function() {
                dispatch = getActionDispatcher(url, $(this).attr('data-dispatch-url'));
                dispatch();
            });

            kango.console.log('There are ' + options.children().length + ' options');
            if (options.children().length === 1) {
                options.remove();
            }

            // Replace contents of <action> with ui
            el.replaceWith(ui);
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