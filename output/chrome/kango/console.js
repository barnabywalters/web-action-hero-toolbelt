/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.Console=function(){};kango.Console.prototype=kango.oop.extend(kango.IConsole,{log:function(a){1<arguments.length&&(a=kango.string.format.apply(kango.string,arguments));console.log(a)}});kango.console=new kango.Console;
