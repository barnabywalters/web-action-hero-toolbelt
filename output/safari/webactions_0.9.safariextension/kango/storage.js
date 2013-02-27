/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.SimpleStorage=function(){};kango.SimpleStorage.prototype={getItem:function(a){return localStorage.getItem(a)},setItem:function(a,b){localStorage.setItem(a,b)},removeItem:function(a){localStorage.removeItem(a)},clear:function(){localStorage.clear()},getKeys:function(){for(var a=localStorage.length,b=Array(a),c=0;c<a;c++)b[c]=localStorage.key(c);return b}};kango.simpleStorage=new kango.SimpleStorage;
