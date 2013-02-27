/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
var kango={event:{MESSAGE:"message"},lang:{evalInSandbox:function(b,d,c){for(var a in d)d.hasOwnProperty(a)&&(arguments.callee[a]=d[a]);eval("(function(){"+c+"\n})();")}},browser:{getName:function(){return null}},console:{log:function(b){"undefined"!=typeof opera?opera.postError(b):console.log(b)}},io:{},xhr:{send:function(b,d){var c=b.contentType;if("xml"==c||"json"==c)b.contentType="text";kango.invokeAsyncCallback("kango.xhr.send",b,function(a){if(""!=a.response&&null!=a.response)if("json"==c)try{a.response=
JSON.parse(a.response)}catch(g){a.response=null}else if("xml"==c)try{var e=null,e="undefined"!=typeof DOMParser?DOMParser:window.DOMParser,f=new e;a.response=f.parseFromString(a.response,"text/xml")}catch(h){a.response=null}b.contentType=c;d(a)})}},_init:function(b){"undefined"==typeof kango.dispatchMessage&&this._initMessaging();(new kango.UserscriptEngineClient).run(window,b,window==window.top)}};


// Merged from /Users/barnabywalters/Documents/Programming/web-actions/src/js/chrome/includes/content_kango.part.js

kango.browser.getName=function(){return"chrome"};kango.io.getResourceUrl=function(a){return chrome.extension.getURL(a)};
kango._initMessaging=function(){var a=[],e=chrome.extension.connect({name:window==window.top?"main":Math.random().toString()});e.onMessage.addListener(function(c){c.source=c.target=kango;for(var b=0;b<a.length;b++)a[b](c)});kango.dispatchMessage=function(a,b){e.postMessage({name:a,data:b,origin:"tab",source:null,target:null});return!0};kango.addEventListener=function(c,b){if("message"==c){for(var d=0;d<a.length;d++)if(a[d]==b)return;a.push(b)}};(new kango.InvokeAsyncModule).init(kango);(new kango.MessageTargetModule).init(kango)};
