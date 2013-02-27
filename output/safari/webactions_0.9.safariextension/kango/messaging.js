/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.MessageRouter=function(){safari.application.addEventListener("message",kango.lang.bind(this._onMessage,this),!1)};
kango.MessageRouter.prototype={_onMessage:function(a){if(a.target instanceof SafariBrowserTab)this.onmessage({name:a.name,data:a.message,origin:"tab",target:kango.browser.getKangoTab(a.target),source:{dispatchMessage:function(b,c){a.target.page.dispatchMessage(b,c);return!0}}});else kango.console.log("Messaging supported only for SafariBrowserTab targets")},onmessage:function(){},dispatchMessage:function(a,b){var c={name:a,data:b,origin:"background",source:kango,target:kango},d=this;window.setTimeout(function(){d.onmessage(c)},
1);return!0}};
