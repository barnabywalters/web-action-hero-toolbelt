// ==UserScript==
// @name Web Actions Shim
// @include *
// ==/UserScript==

var WebActionHero = (function () {
    // Private
    var $; // Zepto
    
    // Public
    return {
        init: function() {
            
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