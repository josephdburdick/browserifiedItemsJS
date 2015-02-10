define(['jquery'],function($) 
{
    'use strict';

    function addTemplateToDom(name, template) 
    {
    }

    // removes the physical DOM node
    // removes the Knockout bindings applied to its destination (containing the data-bind to the template)
    function removeTemplateFromDom(name, destination) 
    {
    }

    function addLoadingToDom(destinationWithDash, genericIdentifier, keyToAppend, content)
    {
      $(destinationWithDash).prepend(["<div id='", genericIdentifier, keyToAppend, "'>", "[key: '",keyToAppend,"'] ", content, "</div>"].join(''));
    }

    function removeFromDom(genericIdentifier, keyToAppend)
    {
        $(['#',genericIdentifier, keyToAppend].join('')).remove();
    }

    function extractLinkValueFromDom(domContainer, genericIdentifier, keyToAppend)
    {
        return $(domContainer)
            .find(['#', genericIdentifier, '-', keyToAppend].join(''))
            .attr('href');
    }

    function applyKnockoutBindings(viewModel, destinationIdentifier, isFatal)
    {
    }

    function initKnockoutComponents(componentNameDayHasEntries)
    {
    }

    return {
        addTemplate: addTemplateToDom,
        removeTemplate: removeTemplateFromDom,
        removeFromDom: removeFromDom,
        addLoadingToDom: addLoadingToDom,
        extractLinkValueFromDom: extractLinkValueFromDom,
        applyKnockoutBindings: applyKnockoutBindings,
        initKnockoutComponents: initKnockoutComponents
    };
});