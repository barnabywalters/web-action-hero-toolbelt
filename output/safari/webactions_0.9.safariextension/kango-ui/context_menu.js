/*
Built using Kango - Cross-browser extension framework
http://kangoextensions.com/
*/
kango.ui.ContextMenuItem=function(a){this.superclass.apply(this,arguments);this.init(a)};
kango.ui.ContextMenuItem.prototype=kango.oop.extend(kango.ui.ContextMenuItemBase,{init:function(a){this.addItem("item1",a.caption,a.context||"all")},addItem:function(a,c){safari.application.addEventListener("contextmenu",kango.lang.bind(function(b){b.contextMenu.appendContextMenuItem(a,c)},this),!1);safari.application.addEventListener("command",kango.lang.bind(function(b){b.command==a&&this.fireEvent(this.event.CLICK,{})},this),!1)}});kango.ContextMenuModule=function(){};
kango.ContextMenuModule.prototype.init=function(){var a=kango.getExtensionInfo();"undefined"!=typeof a.context_menu_item&&(kango.ui.contextMenuItem=new kango.ui.ContextMenuItem(a.context_menu_item))};kango.registerModule(kango.ContextMenuModule);
