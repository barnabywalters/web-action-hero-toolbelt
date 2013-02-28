function WebActionsExtension() {
    var self = this;
    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
        self.onToolbarButtonPress();
    });
}

WebActionsExtension.prototype = {
    onToolbarButtonPress: function() {
        kango.ui.optionsPage.open();
    }
};

var extension = new WebActionsExtension();