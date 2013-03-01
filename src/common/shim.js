// ==UserScript==
// @name Web Actions Shim
// @include *
// ==/UserScript==

var WebActionHero = {};

// Include Zepto under own namespace to prevent meddling with site scripts
var oldZepto = window.Zepto;
var oldDollar = window.$;

docment.write('<script src="//cdnjs.cloudflare.com/ajax/libs/zepto/1.0rc1/zepto.min.js"></script>');

WebActionHero.$ = Zepto;

window.Zepto = oldZepto;
window.$ = oldDollar;

// Do the main stuff after a short time
document.setTimeout(WebActionHero.main, 700);

// TODO: Implement this
WebActionHero.main = function () {
    // Load Config
    
    // Replace markup with replacements with <action> elements
    
    // Add UI to all <action> elements
};