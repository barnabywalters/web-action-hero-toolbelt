/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.Lang=function(){};kango.Lang.prototype=kango.oop.extend(kango.LangBase,{createHTMLSandbox:function(d,b){return b(window)},evalInSandbox:function(d,b,e){var c="",a;for(a in b)b.hasOwnProperty(a)&&("window"!=a&&"document"!=a)&&(c+="var "+a+'=api["'+a+'"];');eval("(function(){return function(api){"+c+e+"\n}})();").call(d,b)}});kango.lang=new kango.Lang;
