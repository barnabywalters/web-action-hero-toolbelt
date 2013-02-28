/*function saveURL(evt) {
  kango.invokeAsync('kango.storage.setItem', $(evt.target).attr('id'), evt.target.value);
  
  $('#notice').text('Unsaved Changes Made!').toggleClass('unsaved');
  window.setTimeout(function () {
    $('#notice').text('Changes Saved').toggleClass('unsaved');
  }, 200);
}*/

var extension = extension || {};

extension.config = (function () {
    // Private
    function makeContents() {
        var contentsList = $('body > header > nav > ul');
        
        $('body > section').each(function (i, el) {
            var anchor = $('<a href="#'
                    + $(el).attr('id')
                    + '">'
                    + $(el).children('h2')[0].textContent
                    + '</a>');
            
            anchor.click(function() {
                $('body > section').hide();
                $($(this).attr('href')).show();
            });
            
            contentsList.append($('<li/>').append(anchor));
        }).hide();
        
        $('#section-about').show();
    }
    
    function saveVerbs() {
        
    }
    
    // Public
    return {
        init: function () {
            makeContents();
        }
    };
}());

KangoAPI.onReady(function () {
  extension.config.init();
});
