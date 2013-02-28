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
    function loadTemplate(name) {
        return $('script.template#' + name).text();
    }
    
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
    
    function addVerbServiceList(el, verb) {
        var serviceList = $('<ul />');
        
        verb.services.forEach(function (service, i) {
            var template = loadTemplate('service-item-template');
            template.split('{name}').join(service.name);
            template.split('{url}').join(service.url);
            
            var el = $(template);
            
            if (verb.default === i)
                el.children('.service-default').attr('checked', 'checked');
            
            serviceList.append(el);
        });
    }
    
    function setUpUI(config) {
        var actionVerbs = $('#web-actions');
        
        config.verbs.forEach(function (verb) {
            if (verb.section === 'web-actions') {
                var verbEl = $('<section/>')
                    .attr('class', 'verb')
                    .attr('data-verb', verb.name)
                    .append('<h3>' + verb.name + '</h3>');
                
                addVerbServiceList(verbEl, verb);
                
                actionVerbs.append(verbEl);
            } else {
                // TODO: section-specific verbs
            }
        });
        
        // TODO: Activate URL list editing
    }
    
    function saveVerbs() {
        // TODO
    }
    
    // Public
    return {
        init: function (config) {
            makeContents();
            
            setUpUI(config || { verbs: [] });
        }
    };
}());

KangoAPI.onReady(function () {
    kango.invokeAsync('kango.storage.getItem', 'config', extension.config.init);
});
