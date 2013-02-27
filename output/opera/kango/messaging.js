/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.MessageRouter=function(){var b=this;opera.extension.onmessage=function(a){b._onMessage(a)}};
kango.MessageRouter.prototype={_onMessage:function(b){var a=JSON.parse(b.data),a={name:a.name,data:a.data,origin:"tab",source:{dispatchMessage:function(a,c){b.source.postMessage(JSON.stringify({name:a,data:c}));return!0}},target:kango.browser.getTabFromUrl(b.origin)};this.onmessage(a)},onmessage:function(){},dispatchMessage:function(b,a){var d={name:b,data:a,origin:"background",source:kango,target:kango},c=this;window.setTimeout(function(){c.onmessage(d)},1);return!0}};
