/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
WebnActions_kango.Storage=function(){};
WebnActions_kango.Storage.prototype=WebnActions_kango.oop.extend(WebnActions_kango.IStorage,{getItem:function(a){a=WebnActions_kango.simpleStorage.getItem(a);return"undefined"!=typeof a&&null!=a?JSON.parse(a):null},setItem:function(a,b){if("undefined"!=typeof b){var c=JSON.stringify(b);"undefined"!=typeof c&&WebnActions_kango.simpleStorage.setItem(a,c)}else return this.removeItem(a)},removeItem:function(a){return WebnActions_kango.simpleStorage.removeItem(a)},clear:function(){return WebnActions_kango.simpleStorage.clear()},getKeys:function(){for(var a=[],b=WebnActions_kango.simpleStorage.getKeys(),
c=0;c<b.length;c++){var d=b[c];0!=d.indexOf(this.SYSTEM_STORAGE_PREFIX)&&a.push(d)}return a}});WebnActions_kango.storage=new WebnActions_kango.Storage;WebnActions_kango.SystemStorage=function(){this.PREFIX=WebnActions_kango.storage.SYSTEM_STORAGE_PREFIX};WebnActions_kango.SystemStorage.prototype={PREFIX:null,getItem:function(a){return WebnActions_kango.simpleStorage.getItem(this.PREFIX+a)},setItem:function(a,b){return WebnActions_kango.simpleStorage.setItem(this.PREFIX+a,b)},removeItem:function(a){return WebnActions_kango.simpleStorage.removeItem(this.PREFIX+a)}};WebnActions_kango.systemStorage=new WebnActions_kango.SystemStorage;


// Merged from /Users/barnabywalters/Documents/Programming/web-actions/src/js/firefox/WebnActions_kango/jsonstorage.part.js

WebnActions_kango.PrefStorage=function(){this._preferenceBranch=Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch(this.PREFERENCE_BRANCH_NAME)};
WebnActions_kango.PrefStorage.prototype={_preferenceBranch:null,PREFERENCE_BRANCH_NAME:"extensions.WebActions_kango.storage.",setItem:function(a,b){return this._preferenceBranch.setCharPref(a,JSON.stringify(b))},getItem:function(a){var b=this._preferenceBranch.getPrefType(a),c=null;b==this._preferenceBranch.PREF_STRING?c=this._preferenceBranch.getCharPref(a):b==this._preferenceBranch.PREF_INT?c=this._preferenceBranch.getIntPref(a):b==this._preferenceBranch.PREF_BOOL&&(c=this._preferenceBranch.getBoolPref(a));return"undefined"!=
typeof c&&null!=c?JSON.parse(c):null},removeItem:function(a){try{return this._preferenceBranch.clearUserPref(a)}catch(b){return!1}},getKeys:function(){return this._preferenceBranch.getChildList("",{})},clear:function(){return this._preferenceBranch.deleteBranch("")}};(function(){var a=new WebnActions_kango.PrefStorage,b=a.getKeys();if(0<b.length){for(var c=0;c<b.length;c++)WebnActions_kango.storage.setItem(b[c],a.getItem(b[c]));a.clear()}})();
