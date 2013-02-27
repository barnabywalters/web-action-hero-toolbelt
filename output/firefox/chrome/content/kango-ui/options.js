/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
WebnActions_kango.ui.OptionsPage=function(){var a=WebnActions_kango.getExtensionInfo();if("undefined"!=typeof a.options_page){var b=this._optionsUrl=WebnActions_kango.io.getExtensionFileUrl(a.options_page).toLowerCase();WebnActions_kango.browser.addEventListener("DOMContentLoaded",function(a){0==a.url.toLowerCase().indexOf(b)&&(a.window.kango=WebnActions_kango)})}};
WebnActions_kango.ui.OptionsPage.prototype=WebnActions_kango.oop.extend(WebnActions_kango.ui.IOptionsPage,{_optionsUrl:"",open:function(a){if(""!=this._optionsUrl){var b=this._optionsUrl;"undefined"!=typeof a&&(b+="#"+a);WebnActions_kango.browser.tabs.create({url:b,focused:!0,reuse:!0});return!0}return!1}});WebnActions_kango.ui.optionsPage=new WebnActions_kango.ui.OptionsPage;
