define(['jquery','knockout'],function($, ko) 
{
    'use strict';

    function addTemplateToDom(name, template) 
    {
        // the id will be created, should not be already in the DOM
        if (!document.getElementById(name)) 
        {
            var templateElement = document.createElement('script');
            templateElement.type = "text/html";
            templateElement.id = name;
            templateElement.innerHTML = template;
            document.head.appendChild(templateElement);
        }
    }

    // removes the physical DOM node
    // removes the Knockout bindings applied to its destination (containing the data-bind to the template)
    function removeTemplateFromDom(name, destination) 
    {
        // the id will be created, should not be already in the DOM
        if (document.getElementById(name)) 
        {
            var element = document.getElementById(name);
            var destination = document.getElementById(destination);
            ko.cleanNode(destination);
            document.head.removeChild(element);
        }
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

    function initKnockoutComponents(componentNameDayHasEntries)
    {
        if (!ko.components.isRegistered(componentNameDayHasEntries))
        {
            ko.components.register(componentNameDayHasEntries, { require: 'dayWithEvents' });
        }
    }

    function applyKnockoutBindings(viewModel, destinationIdentifier, isFatal)
    {
        if ($(['#',destinationIdentifier].join('')).length > 0)
        {
            ko.applyBindings(viewModel, document.getElementById(destinationIdentifier));
        }
        else
        {
            if (isFatal)
            {
                console.log(['The destination ', destinationIdentifier,' was not found in the DOM.'].join(''));
            }
        }
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