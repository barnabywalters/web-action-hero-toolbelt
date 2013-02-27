/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.UserscriptEngineClient=function(){};kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new kango.UserscriptApi(c);a.kango=kango;kango.lang.evalInSandbox(c,a,b)}catch(d){kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};kango.UserscriptApi=function(){};
kango.UserscriptApi.prototype={};
