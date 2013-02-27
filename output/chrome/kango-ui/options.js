/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.ui.OptionsPage=function(){};kango.ui.OptionsPage.prototype=kango.oop.extend(kango.ui.IOptionsPage,{open:function(b){var a=kango.getExtensionInfo();return"undefined"!=typeof a.options_page?(a=kango.io.getExtensionFileUrl(a.options_page),"undefined"!=typeof b&&(a+="#"+b),kango.browser.tabs.create({url:a,focused:!0}),!0):!1}});kango.ui.optionsPage=new kango.ui.OptionsPage;
