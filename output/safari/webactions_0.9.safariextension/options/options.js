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
    
    // Load a template str by name
    function loadTemplate(name) {
        return $('script.template#' + name).text();
    }
    
    // Generate navigation and hidey-showey tabs
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
    
    // Given a .verb element and a verb obj, ensure ul.services exists and
    // populate it
    function populateVerbServiceList(el, verb) {
        if ($(el).children('table.services').length === 0)
            var serviceList = $('<table />').attr('class', 'services');
        else
            var serviceList = $(el).children('ul.services');
        
        verb.services.forEach(function (service, i) {
            var template = loadTemplate('service-item-template');
            template = template.split('{name}').join(service.name);
            template = template.split('{url}').join(service.url);
            
            var el = $(template);
            
            if (verb.default === i)
                el.children('.service-default').attr('checked', 'checked');
            
            serviceList.append(el);
        });
    }
    
    function addDeletionControls(el) {
        el.find('.deletion-control').append($('<button />')
            .text('-')
            .click(function () {
                $(this).closest('.service').remove();
            }));
    }
    
    // Given a .verb element, set up all the service add/edit UI
    function setUpVerbServiceUI(el) {
        e = $(el);
        
        var serviceTable = e.children('.services');
        
        // Add deletion controls
        addDeletionControls(serviceTable);
        
        // Add a plus button which adds an empty row based on the template
        serviceTable.append($(loadTemplate('add-service-template'))
                .find('.add-service-control')
                .click(function () {
                    templ = loadTemplate('service-item-template');
                    templ = templ.split('{url}').join('');
                    templ = templ.split('{name}').join('');
                    
                    row = $(templ);
                    
                    addDeletionControls(row);
                    
                    $(this).before(row);
                }));
    }
    
    // Init the config UI
    function setUpUI(config) {
        var actionVerbs = $('#web-actions');
        
        config.verbs.forEach(function (verb) {
            if (verb.section === 'web-actions') {
                var verbEl = $('<section/>')
                    .attr('class', 'verb')
                    .attr('data-verb', verb.name)
                    .append('<h3>' + verb.name + '</h3>');
                
                populateVerbServiceList(verbEl, verb);
                
                actionVerbs.append(verbEl);
            } else {
                // section-specific verbs
                var verbEl = $('section#'
                        + verb.section
                        + ' .verb[data-verb='
                        + verb.name
                        + ']');
                
                populateVerbServiceList(verbEl, verb);
            }
        });
        
        // Activate URL list editing
        $('.verb').toArray().forEach(setUpVerbServiceUI);
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
