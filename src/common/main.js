function WebActionsExtension() {
    var self = this;
    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
        self._onCommand();
    });
}

WebActionsExtension.prototype = {
    _onCommand: function() {
        kango.browser.tabs.create({url: 'http://kangoextensions.com/'});
    }
};

var extension = new WebActionsExtension();