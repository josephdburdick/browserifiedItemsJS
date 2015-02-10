define(['domManager','calendarConstants','text!templates/calendar/calendars-select-template.html','text!templates/calendar/calendars-search-template.html','text!templates/calendar/calendars-navigation-template.html','text!templates/calendar/event-details-template.html'],
function(domManager, constants, calendarsSelectTemplate, calendarsSearchTemplate, calendarsNavigationTemplate, eventDetailsTemplate)
{
    'use strict';

    function initCalendarBindings(viewModel, displayStyle, calendarKey, controller) 
    {
        switch (displayStyle)
        {
            // unique calendar content are needed because of different styles applied
            // if same container reused, different styles specified get merged
            case constants.templates.eventstable:
                require(['text!templates/calendar/events-table-template.html','domManager','calendarEventListeners'],
                function(eventsTableTemplate, domManager, eventListeners)
                {
                    domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, calendarKey].join(''), 
                                        eventsTableTemplate);
                    domManager.applyKnockoutBindings(viewModel, 
                        [constants.idNames.eventListIdBegin, calendarKey].join(''), true);
                    // remove loading message currently displayed to user
                    domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, calendarKey);

                    eventListeners.init(calendarKey, controller);
                });
            break;
            case constants.templates.eventstablelist:
                require(['text!templates/calendar/events-table-list-template.html','domManager','calendarEventListeners'],
                function(eventsTableListTemplate, domManager, eventListeners)
                {
                    domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, calendarKey].join(''), 
                                        eventsTableListTemplate);
                    domManager.applyKnockoutBindings(viewModel, 
                        [constants.idNames.eventListIdBegin, calendarKey].join(''), true);
                    // remove loading message currently displayed to user
                    domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, calendarKey);

                    eventListeners.init(calendarKey, controller);
                });
            break;
            case constants.templates.eventslistagenda:
                require(['text!templates/calendar/events-list-agenda-template.html','domManager','calendarEventListeners'],
                function(eventsListAgendaTemplate, domManager, eventListeners)
                {
                    domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, calendarKey].join(''), 
                                        eventsListAgendaTemplate);
                    domManager.applyKnockoutBindings(viewModel, 
                        [constants.idNames.eventListIdBegin, calendarKey].join(''), true);
                    // remove loading message currently displayed to user
                    domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, calendarKey);

                    eventListeners.init(calendarKey, controller);
                });
            break;
            case constants.templates.eventslistspeaker:
                require(['text!templates/calendar/events-list-speaker-template.html','domManager','calendarEventListeners'],
                function(eventsListSpeakerTemplate, domManager, eventListeners)
                {
                    domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, calendarKey].join(''), 
                                        eventsListSpeakerTemplate);
                    domManager.applyKnockoutBindings(viewModel, 
                        [constants.idNames.eventListIdBegin, calendarKey].join(''), true);
                    // remove loading message currently displayed to user
                    domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, calendarKey);

                    eventListeners.init(calendarKey, controller);
                });
            break;
            case constants.templates.eventslistshortlocationname:
                require(['text!templates/calendar/events-list-shortlocationname-template.html','domManager','calendarEventListeners'],
                function(eventsListShortLocationNameTemplate, domManager, eventListeners)
                {
                    domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, calendarKey].join(''), 
                                        eventsListShortLocationNameTemplate);
                    domManager.applyKnockoutBindings(viewModel, 
                        [constants.idNames.eventListIdBegin, calendarKey].join(''), true);
                    // remove loading message currently displayed to user
                    domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, calendarKey);

                    eventListeners.init(calendarKey, controller);
                });
            break;
            case constants.templates.eventslistthumbnails:
                require(['text!templates/calendar/events-list-thumbnails-template.html','domManager','calendarEventListeners'],
                function(eventsListThumbnailsTemplate, domManager, eventListeners)
                {
                    domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, calendarKey].join(''), 
                                        eventsListThumbnailsTemplate);
                    domManager.applyKnockoutBindings(viewModel, 
                        [constants.idNames.eventListIdBegin, calendarKey].join(''), true);
                    // remove loading message currently displayed to user
                    domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, calendarKey);

                    eventListeners.init(calendarKey, controller);
                });
            break;
            default:
                require(['text!templates/calendar/events-table-template.html','domManager','calendarEventListeners'],
                function(eventsTableTemplate, domManager, eventListeners)
                {
                    domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, calendarKey].join(''), 
                                        eventsTableTemplate);
                    domManager.applyKnockoutBindings(viewModel, 
                        [constants.idNames.eventListIdBegin, calendarKey].join(''), true);
                    // remove loading message currently displayed to user
                    domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, calendarKey);

                    eventListeners.init(calendarKey, controller);
                });
            break;
        }

        domManager.addTemplate([constants.idNames.eventListFilterTemplateIdBegin, calendarKey].join(''), 
                                calendarsSelectTemplate);

        domManager.addTemplate([constants.idNames.eventListSearchTemplateIdBegin, calendarKey].join(''), 
                                calendarsSearchTemplate);

        if (displayStyle != constants.templates.eventslistagenda)
        {
            // in the case of the eventsAgenda template, the navigation is already embedded in the template
            // so make sure it doesn't get duplicated
            domManager.addTemplate([constants.idNames.eventListNavigationTemplateIdBegin, calendarKey].join(''), 
                                calendarsNavigationTemplate);
        }

        // specifying the destination of the data in the DOM allows using Knockout-jquery-ui
        // components without conflicts (KO error : "you cannot do multiple bindings...")
        domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListFilterIdBegin, calendarKey].join(''), false);

        domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListSearchIdBegin, calendarKey].join(''), false);

        if (displayStyle != constants.templates.eventslistagenda)
        {
            domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListNavigationIdBegin, calendarKey].join(''), false);
        }
    }

    function initEventBindings(viewModel) 
    {
        domManager.addTemplate(constants.idNames.eventDetailsTemplateId, eventDetailsTemplate);

        domManager.applyKnockoutBindings(viewModel, constants.idNames.eventDetailsId, true);
    }

    return {
        init: initCalendarBindings,
        initModal: initEventBindings
    };
});