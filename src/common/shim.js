// ==UserScript==
// @name Web Actions Shim
// @include *
// ==/UserScript==

var WebActionHero = (function () {
    // Private
    var $; // Zepto
    var verbs;
    var webActionTemplate = [
        '<div style="background:#222; display:inline-block; padding-right: 0.33em; border:#555 solid 1px; border-radius: 0.3em;" class="web-action-hero-toolbelt-button">',
            '<button style="padding:0.5em">Verb This</button>',
            '<select style="width: 1.5em;"></select>',
        '</div>'
    ].join();
    
    // Returns the verb object or null for verb name
    function verb(name) {
        for (v in verbs) {
            if (v.name === name)
                return v;
        }
        
        return null;
    }
    
    // Checks to see if there are valid (name and url nonempty) service(s)
    // defined for a given verb
    function verbDefined(name) {
        var verb = verb(name);
        
        if (verb === null)
            return false;
        
        if (verb.services.length === 0)
            return false;
        
        if (verb.services.every(function (service) {
            return service.name === '' || service.url === ''
                || service.name === null || service.url === null;
        }))
            return false;
        
        return true;
    }
    
    function main(config) {
        verbs = config.verbs;
        replace();
        activateWebActions();
    }
    
    // Container function which calls functions which do UI/button customisation,
    // replacing them with web action elements
    function replace() {
        // TODO
    }
    
    // Goes through all <action> elements, replaces their fallback content with
    // a verb UI
    function activateWebActions() {
        // TODO
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

// Include Zepto under own namespace to prevent meddling with site scripts
var oldZepto = window.Zepto;
var oldDollar = window.$;

docment.write('<script src="//cdnjs.cloudflare.com/ajax/libs/zepto/1.0rc1/zepto.min.js"></script>');

WebActionHero.setZepto(Zepto);

window.Zepto = oldZepto;
window.$ = oldDollar;

WebActionHero.init();