module.exports = function(MyApp)
{
    'use strict';

    var domManager = MyApp.common.domManager;
    var constants = MyApp.calendar.constants;
    var calendarsSelectTemplate = MyApp.calendar.calendarsselect;
    var calendarsSearchTemplate = MyApp.calendar.templates.calendarssearch;
    var calendarsNavigationTemplate = MyApp.calendar.templates.calendarsnavigation;
    var eventDetailsTemplate = MyApp.calendar.templates.eventdetails;
    var eventListeners = MyApp.calendar.eventListeners;
    var eventsTableTemplate = MyApp.calendar.templates.eventstable;
    var eventsTableListTemplate = MyApp.calendar.templates.eventstablelist;
    var eventsListAgendaTemplate = MyApp.calendar.templates.eventslistagenda;
    var eventsListSpeakerTemplate = MyApp.calendar.templates.eventslistspeaker;
    var eventsListShortLocationNameTemplate = MyApp.calendar.templates.eventslistshortlocationname;
    var eventsListThumbnailsTemplate = MyApp.calendar.templates.eventslistthumbnails;

    function initCalendarBindings(viewModel, displayStyle, key, controller) 
    {
        switch (displayStyle)
        {
            // unique calendar content are needed because of different styles applied
            // if same container reused, different styles specified get merged
            case constants.templates.eventstable:
                domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, key].join(''), eventsTableTemplate);
                domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListIdBegin, key].join(''), true);
                // remove loading message currently displayed to user
                domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, key);

                eventListeners.init(key, controller);
            break;
            case constants.templates.eventstablelist:
                domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, key].join(''), 
                                    eventsTableListTemplate);
                domManager.applyKnockoutBindings(viewModel, 
                    [constants.idNames.eventListIdBegin, key].join(''), true);
                // remove loading message currently displayed to user
                domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, key);

                eventListeners.init(key, controller);
            break;
            case constants.templates.eventslistagenda:
                domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, key].join(''), eventsListAgendaTemplate);
                domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListIdBegin, key].join(''), true);
                // remove loading message currently displayed to user
                domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, key);

                eventListeners.init(key, controller);
            break;
            case constants.templates.eventslistspeaker:
                domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, key].join(''), eventsListSpeakerTemplate);
                domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListIdBegin, key].join(''), true);
                // remove loading message currently displayed to user
                domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, key);

                eventListeners.init(key, controller);
            break;
            case constants.templates.eventslistshortlocationname:
                domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, key].join(''), eventsListShortLocationNameTemplate);
                domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListIdBegin, key].join(''), true);
                // remove loading message currently displayed to user
                domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, key);

                eventListeners.init(key, controller);
            break;
            case constants.templates.eventslistthumbnails:
                domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, key].join(''), eventsListThumbnailsTemplate);
                domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListIdBegin, key].join(''), true);
                // remove loading message currently displayed to user
                domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, key);

                eventListeners.init(key, controller);
            break;
            default:
                domManager.addTemplate([constants.idNames.eventListTemplateIdBegin, key].join(''), eventsTableTemplate);
                domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListIdBegin, key].join(''), true);
                // remove loading message currently displayed to user
                domManager.removeFromDom(constants.classNames.calendarLoadingIdBegin, key);

                eventListeners.init(key, controller);
            break;
        }

        domManager.addTemplate([constants.idNames.eventListFilterTemplateIdBegin, key].join(''), calendarsSelectTemplate);

        domManager.addTemplate([constants.idNames.eventListSearchTemplateIdBegin, key].join(''), calendarsSearchTemplate);

        if (displayStyle != constants.templates.eventslistagenda)
        {
            // in the case of the eventsAgenda template, the navigation is already embedded in the template
            // so make sure it doesn't get duplicated
            domManager.addTemplate([constants.idNames.eventListNavigationTemplateIdBegin, key].join(''), calendarsNavigationTemplate);
        }

        // specifying the destination of the data in the DOM allows using Knockout-jquery-ui
        // components without conflicts (KO error : "you cannot do multiple bindings...")
        domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListFilterIdBegin, key].join(''), false);

        domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListSearchIdBegin, key].join(''), false);

        if (displayStyle != constants.templates.eventslistagenda)
        {
            domManager.applyKnockoutBindings(viewModel, [constants.idNames.eventListNavigationIdBegin, key].join(''), false);
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
};