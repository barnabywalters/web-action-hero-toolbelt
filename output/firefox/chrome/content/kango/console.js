/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
WebnActions_kango.Console=function(){this._consoleService=Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService)};WebnActions_kango.Console.prototype=WebnActions_kango.oop.extend(WebnActions_kango.IConsole,{_consoleService:null,log:function(a){1<arguments.length&&(a=WebnActions_kango.string.format.apply(WebnActions_kango.string,arguments));this._consoleService.logStringMessage(a)}});WebnActions_kango.console=new WebnActions_kango.Console;
