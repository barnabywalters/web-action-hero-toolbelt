/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.ui.BrowserButton=function(a){this.superclass.apply(this,arguments);var b=this;chrome.browserAction.onClicked.addListener(function(){b._onClicked()});this._initDetails(a)};
kango.ui.BrowserButton.prototype=kango.oop.extend(kango.ui.ButtonBase,{_popupHostUrl:"kango-ui/remote_popup_host.html",_popupDetails:null,_onClicked:function(){return this.fireEvent(this.event.COMMAND)},_initDetails:function(a){kango.lang.isObject(a)&&(kango.lang.isString(a.icon)&&this.setIcon(a.icon),kango.lang.isString(a.caption)&&this.setCaption(a.caption),kango.lang.isString(a.tooltipText)&&this.setTooltipText(a.tooltipText),kango.lang.isObject(a.popup)&&this.setPopup(a.popup))},setTooltipText:function(a){chrome.browserAction.setTitle({title:a.toString()})},
setCaption:function(){},setIcon:function(a){chrome.browserAction.setIcon({path:kango.io.getFileUrl(a)})},setBadgeValue:function(a){chrome.browserAction.setBadgeText({text:null!=a&&0!=a?a.toString():""})},setBadgeBackgroundColor:function(){},setPopup:function(a){this._popupDetails=a;var b="";null!=a&&kango.lang.isString(a.url)&&(b=kango.io.isLocalUrl(a.url)?a.url:this._popupHostUrl);chrome.browserAction.setPopup({popup:b})},getPopupDetails:function(){return this._popupDetails},setContextMenu:function(){}});
