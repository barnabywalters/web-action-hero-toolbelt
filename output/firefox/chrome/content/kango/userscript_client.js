/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
WebnActions_kango.UserscriptEngineClient=function(){};WebnActions_kango.UserscriptEngineClient.prototype={run:function(c,b,a){var d=this;WebnActions_kango.invokeAsync("kango.userscript.getScripts",c.document.URL,b,a,function(a){for(var b in a)a.hasOwnProperty(b)&&d.executeScript(c,a[b].join("\n\n"))})},executeScript:function(c,b){try{var a=new WebnActions_kango.UserscriptApi(c);a.kango=WebnActions_kango;WebnActions_kango.lang.evalInSandbox(c,a,b)}catch(d){WebnActions_kango.console.log("US: "+d.message+"\n"+d.stack||"")}}};WebnActions_kango.UserscriptApi=function(){};
WebnActions_kango.UserscriptApi.prototype={};
