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
        if ($(el).find('table.services').length === 0)
            var serviceList = $('<table />').attr('class', 'services');
        else
            var serviceList = $(el).children('ul.services');
        
        verb.services.forEach(function (service, i) {
            var template = loadTemplate('service-item-template');
            template = template.split('{name}').join(service.name);
            template = template.split('{url}').join(service.url);
            template = template.split('{verb}').join(verb.name);
            
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
                var curVerb = $(this).closest('.verb');
                $(this).closest('.service').remove();
                ensureDefaultService(curVerb);
            }));
    }
    
    // Given a .verb, ensures that there’s a checked default service. Sets first
    // one if none found.
    function ensureDefaultService(el) {
        if ($(el).find('.services .service-default:checked').length !== 0)
            return;
        
        $(el).find('.services .service-default').first().attr('checked', 'checked');
    }
    
    // Given a .verb element, set up all the service add/edit UI
    function setUpVerbServiceUI(el) {
        var e = $(el);
        var verb = e.attr('data-verb');
        
        var serviceTable = e.find('.services');
        
        // Add deletion controls
        addDeletionControls(serviceTable);
        
        // Add a plus button which adds an empty row based on the template
        serviceTable.append($(loadTemplate('add-service-template'))
                .find('.add-service-control')
                .click(function () {
                    templ = loadTemplate('service-item-template');
                    templ = templ.split('{url}').join('');
                    templ = templ.split('{name}').join('');
                    templ = templ.split('{verb}').join(verb);
                    
                    row = $(templ);
                    
                    addDeletionControls(row);
                    
                    $(this).before(row);
                    
                    ensureDefaultService(el);
                }));
    }
    
    // Given a managable .verb, add deletion and name customisation UI
    function setUpVerbUI(el) {
        
    }
    
    // Init the config UI
    function setUpUI(config) {
        var actionVerbs = $('#section-web-actions');
        
        // TODO: Set up add-new-verb UI
        var verbContainer = actionVerbs.find('.verbs');
        var addVerbButton = $(loadTemplate('add-verb-template'))
            .click(function () {
                var templ = loadTemplate('verb-template');
                var el = $(templ.split('{name}').join('new-verb'));
                
                verbContainer.append(el);
                setUpVerbServiceUI(el);
                setUpVerbUI(el);
            });
        
        verbContainer.after(addVerbButton);
        
        config.verbs.forEach(function (verb) {
            if (verb.section === 'web-actions') {
                var templ = loadTemplate('verb-template');
                var verbEl = $(templ.split('{name}').join(verb.name));
                
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
                ensureDefaultService(verbEl);
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
