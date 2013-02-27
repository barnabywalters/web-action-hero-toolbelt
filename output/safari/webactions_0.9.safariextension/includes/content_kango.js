/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
var kango={event:{MESSAGE:"message"},lang:{evalInSandbox:function(b,d,c){for(var a in d)d.hasOwnProperty(a)&&(arguments.callee[a]=d[a]);eval("(function(){"+c+"\n})();")}},browser:{getName:function(){return null}},console:{log:function(b){"undefined"!=typeof opera?opera.postError(b):console.log(b)}},io:{},xhr:{send:function(b,d){var c=b.contentType;if("xml"==c||"json"==c)b.contentType="text";kango.invokeAsyncCallback("kango.xhr.send",b,function(a){if(""!=a.response&&null!=a.response)if("json"==c)try{a.response=
JSON.parse(a.response)}catch(g){a.response=null}else if("xml"==c)try{var e=null,e="undefined"!=typeof DOMParser?DOMParser:window.DOMParser,f=new e;a.response=f.parseFromString(a.response,"text/xml")}catch(h){a.response=null}b.contentType=c;d(a)})}},_init:function(b){"undefined"==typeof kango.dispatchMessage&&this._initMessaging();(new kango.UserscriptEngineClient).run(window,b,window==window.top)}};


// Merged from /Users/barnabywalters/Documents/Programming/web-actions/src/js/safari/includes/content_kango.part.js

kango.browser.getName=function(){return"safari"};kango.io.getResourceUrl=function(c){return safari.extension.baseURI+c};
kango._initMessaging=function(){var c=[];safari.self.addEventListener("message",function(a){for(var a={name:a.name,data:a.message,origin:"background",source:kango,target:kango},b=0;b<c.length;b++)c[b](a)});kango.dispatchMessage=function(a,b){safari.self.tab.dispatchMessage(a,b);return!0};kango.addEventListener=function(a,b){if("message"==a){for(var d=0;d<c.length;d++)if(c[d]==b)return;c.push(b)}};(new kango.InvokeAsyncModule).init(kango);(new kango.MessageTargetModule).init(kango)};
