/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.IO=function(){};kango.IO.prototype=kango.oop.extend(kango.IOBase,{getExtensionFileUrl:function(a){return safari.extension.baseURI+a},getResourceUrl:function(a){return this.getExtensionFileUrl(a)}});kango.io=new kango.IO;
