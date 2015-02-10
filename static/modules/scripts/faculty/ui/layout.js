define(['domManager','peopleConstants','peopleEventListeners', 'peopleDatePickerManager','uiMain'], function(domManager, constants, peopleEventListeners, datePickerManager, uiEventListeners){

    'use strict';

    function atLeastOneImage(subset)
    {
        var hasImage = false;

        for(var t=0;t<subset.length;t++)
        {
            if (!hasImage)
            {
                hasImage = (subset[t].image() != null);
            }
        }

        return hasImage;
    }

    function initPeopleBindings(viewModel, peopleDisplayStyle, key, controller) 
    {
        // make sure the template does not exist already in the DOM
        domManager.removeTemplate([constants.idNames.peopleTemplateIdBegin, key].join(''), 
                                [constants.idNames.peopleIdBegin, key].join(''));

        datePickerManager.init(key, controller);

        // remove default or previous values
        // other templates were maybe applied before
        viewModel.slices.removeAll();
        viewModel.slices.push([1,null]);

        switch (peopleDisplayStyle)
        {
            case constants.templates.people2coltext:
            default:
                require(['text!templates/faculty/people-2-col-text-template.html','domManager', 'peopleConstants'], 
                function(people2ColTextTemplate, domManager, constants)
                {
                    domManager.addTemplate([constants.idNames.peopleTemplateIdBegin, key].join(''), 
                    people2ColTextTemplate);

                    // specifying the destination of the data in the DOM allows using Knockout-jquery-ui
                    // components without conflicts (KO error : "you cannot do multiple bindings...")
                    domManager.applyKnockoutBindings(viewModel,[constants.idNames.peopleIdBegin, key].join(''), true);

                    // remove loading message currently displayed to user
                    domManager.removeFromDom(constants.idNames.peopleloadingIdBegin, key);

                    peopleEventListeners.init(key, controller);

                    // require is async and this call needs to happen last
                    uiEventListeners.init();
                });
            break;
        }
    }

    return {
        init: initPeopleBindings
    };
});