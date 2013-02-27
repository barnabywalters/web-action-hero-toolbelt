/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
WebnActions_kango.BackgroundScriptEngine=function(){};
WebnActions_kango.BackgroundScriptEngine.prototype={_sandbox:null,_window:null,init:function(a){var b=this;this._sandbox=WebnActions_kango.lang.createHTMLSandbox("background.html",function(c){b._initScripts(c,a)})},getContext:function(){return this._window},_initScripts:function(a,b){this._window=a;a.kango=b;var c=a.document,d=WebnActions_kango.getExtensionInfo().background_scripts;if("undefined"!=typeof d){var e=0,f=function(){var a=c.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",WebnActions_kango.io.getExtensionFileUrl(d[e]));
var b=function(){e++;e<d.length&&f()};"undefined"!=typeof a.onreadystatechange?a.onreadystatechange=function(){"complete"==a.readyState&&b()}:a.onload=b;c.body.appendChild(a)};f()}}};WebnActions_kango.BackgroundScriptModule=function(){};WebnActions_kango.BackgroundScriptModule.prototype.init=function(a){WebnActions_kango.backgroundScript=new WebnActions_kango.BackgroundScriptEngine;WebnActions_kango.addEventListener(WebnActions_kango.event.READY,function(){WebnActions_kango.backgroundScript.init(a)})};WebnActions_kango.registerModule(WebnActions_kango.BackgroundScriptModule);
