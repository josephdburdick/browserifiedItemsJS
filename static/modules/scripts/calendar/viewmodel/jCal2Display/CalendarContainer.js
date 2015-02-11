module.exports = function(MyApp) 
{
	'use strict';

    var ko = MyApp.vendor.knockout;
    //var kojquery = MyApp.vendor.knockoutjquery;
    var $ = MyApp.vendor.jquery;
    var _ = MyApp.vendor.underscore;
    var Moment = MyApp.vendor.moment;
    var utils = MyApp.common.helpers;
    var constants = MyApp.calendar.constants;
    var CalendarEventList = MyApp.calendar.viewmodel.jCal2Display.CalendarEventList;

    // A (v)calendars container contains an array of no, one or more (v)calendar(s).
    function CalendarContainer(key) 
	{
        // JS convention - making sure the reference is right.
        var self = this;

        self.initDone = ko.observable(false);

        self.loadingDoneFlag = null;

        // text used on UI
        self.noResult = constants.uitext.noResult;
        self.moreEvents = constants.uitext.moreEvents;
        self.today = constants.uitext.today;
        self.previousWeek = constants.uitext.previousWeek;
        self.nextWeek = constants.uitext.nextWeek;

        // when refresh event triggered - needs to know "identity" of calendar
        self.key = ko.observable(key);

        // Explicit definitions of properties.
        // init to function needed computed properties, values are populated later
	    self.startDate = ko.observable();
	    self.endDate = ko.observable();
        self.eventLists = ko.observableArray();

        self.hasEntriesByYearMonthDay = ko.observableArray();

        // the time range visible to the user may not be the same as the one loaded in the model
        self.displayedStartDate = ko.observable();
        self.displayedEndDate = ko.observable();
        self.displayedSelectedDate = ko.observable();

        self.selectedYear = ko.observable();
        self.selectedMonth = ko.observable();
        self.selectedDay = ko.observable();

        // Array that holds the index(es) of calendars selected for display by the user.
        self.displayedCalendarsFilter = ko.observableArray();
        // String that holds the search term entered by the user.
        self.textQueryFilter = ko.observable('').extend({ rateLimit: 50 });

        // flag used to make sure that the UI setup is reloaded too
        self.triggerRepaintData = ko.observable(0);

        self.maxItems = ko.observable();

        self.moreEventsLink = ko.observable();

        // TODO will be removed when bootstrap modal used
        self.isPopupOpen = ko.observable(false);

        // Output examples :
        // - "November 30-December 31, 2014"
        // - "December 31, 2014-January 8, 2015"
        // - "December 31, 2014"
        // - "December 30-31, 2014"
        // Scenarios behind (same order as above) :
        // * Same year, different month, different day
        // * Different year, different month, different day
        // * Same year, same month, same day
        // * Same year, same month, different day
        self.formattedDayRange = ko.computed(function() 
        {
            var value = [];

            // make sure the core data is populated
            if (self.startDate() != null && self.endDate() != null)
            {
                // Use of external library
                var start = new Moment(self.startDate());
                var end = new Moment(self.endDate());

                // Flags to identify how "wide" the time range is
                var differentYear = (start.format('YYYY') != end.format('YYYY'));
                var differentMonth = (start.format('M') != end.format('M'));
                var differentDay = (start.format('D') != end.format('D'));

                // The first half of the time range differs ONLY
                // if the two dates are in different years,
                // then the year needs to be added explicitely.
                if (differentYear == true)
                {
                    value.push(start.format('MMMM D, YYYY'));
                } 
                else 
                {
                    value.push(start.format('MMMM D'));
                }
 
                // The second half of the time range ALWAYS includes the year.
                // It will then tailor to include only changing data (day & month, day only, nothing).
                if (differentMonth == true)
                {
                    // If month is different, day is implicitly different too.
                    // Year is ALWAYS included.
                    value.push(end.format('-MMMM D, YYYY'));
                }
                else
                {
                    // Same month.
                    if (differentDay == true)
                    {
                        value.push(end.format('-D, YYYY'));
                    }
                    else
                    {
                        // Same month, same day.
                        value.push(end.format(', YYYY'));
                    }
                }
                
            }
            return value.join('');
        });
        
        // The events presented to the user are in a list that is not organized by calendar,
        // only by date and time.
        // Use of external library (_).
        self.allEventsByDay = ko.computed(function()
        {
            var eventsByDay = groupUniqueEventsByDay(self, self.textQueryFilter(), self.displayedCalendarsFilter(), self.displayedStartDate(), self.displayedEndDate(), self.maxItems(), true);

            // Use of helper function.
            // _ data is returned in dictionaries and Knockout works better with arrays.
            return utils.mapDictionaryToArray(eventsByDay);
        });
	}

    function groupUniqueEventsByDay(container, searchFilter, selectedKeys, displayedStartDate, displayedEndDate, maxItems, applyFormattedDate)
    {
        var eventsByDay;

        if (container.initDone() && container.eventLists() != null && container.eventLists().length > 0)
        {
            var uniqueEvents;

            if(selectedKeys.length === 1)
            {
                // ONLY one calendar displayed on the UI.
                uniqueEvents = container.eventLists()[selectedKeys[0]].events();
            }
            else
            {
                // Several calendars displayed on the UI.
                var allEvents = [];

                // Get the calendar events of the calendars selected for display on the UI.
                ko.utils.arrayForEach(selectedKeys, function(calKey) 
                {
                     ko.utils.arrayPushAll(allEvents, container.eventLists()[calKey].events());       
                });

                // Get distinct events.
                uniqueEvents = _.uniq(allEvents,false,function(event){return event.uid();});       
            }

            var filteredEventsByDisplayedDates = _.filter(uniqueEvents, function(event)
                                                {
                                                    var match = false;

                                                    if (event.startDate() >= displayedStartDate)
                                                       // && event.startDate() <= displayedEndDate
                                                     //   && event.endDate() >= displayedStartDate
                                                     //   && event.endDate() <= displayedEndDate)
                                                    {
                                                        match = true;
                                                    }

                                                    return match;
                                                });

            // Apply text filtering to distinct events.
            var filteredEvents;
            if (searchFilter != null)
            {
                filteredEvents = _.filter(
                                filteredEventsByDisplayedDates, 
                                function(event)
                                {
                                    // Get all the properties of an event.
                                    var allFlatProperties = _.functions(event);

                                    // Flag whether the text was found in one of the property values.
                                    var partialMatch = false;
                                    var unwrappedValue;

                                    for(var i=0;i<allFlatProperties.length;i++)
                                    {
                                        // console.log(allFlatProperties[i]);

                                        if(partialMatch == false)
                                        {
                                            // A property is a function, call it and get its result (the value).
                                            unwrappedValue = _.result(event,allFlatProperties[i]);

                                            // If the value is populated, check if the text search for is partialMatch.
                                            if(unwrappedValue != null && typeof(unwrappedValue) == "string")
                                            {
                                                partialMatch = (unwrappedValue.toLowerCase().indexOf(searchFilter.toLowerCase()) > -1);
                                            }
                                        }
                                    }
                                    return partialMatch;
                                });
            }
            else
            {
                filteredEvents = filteredEventsByDisplayedDates;
            }

            // Sort the event by date (the property used contains both date AND time).
            var sortedEvents = _.sortBy(filteredEvents,function(event){return event.startDate();});

            var subsetSortedEvents;
            if (maxItems != null && maxItems < sortedEvents.length + 1)
            {
                subsetSortedEvents = sortedEvents.slice(1, maxItems+1);
            }
            else
            {
                subsetSortedEvents = sortedEvents;
            }

            if (applyFormattedDate)
            {
                // Group events by day.
                eventsByDay = _.groupBy(subsetSortedEvents,function(event){return event.formattedDay();});
            }
            else
            {
                // Group events by day.
                eventsByDay = _.groupBy(subsetSortedEvents,function(event){return new Moment(event.startDate()).format('YYYY-MM-DD');});
            }
        }

        return eventsByDay;
    }

    // Assign all the logical parents to a given (v)event :
    // A unique given (v)event may belong to one or more (v)calendar(s).
    // Only one of these instances is presented to the user.
    function identifySharedEvents(container, data)
    {
        // Make sure there are calendars
        if (container.eventLists != null && container.eventLists().length > 0 && container.displayedStartDate() != null && container.displayedEndDate() != null)
        {
            // Gather all the events/children of all the calendars
            var allEvents = [];
            container.displayedCalendarsFilter.removeAll();

            for(var calKey=0;calKey<container.eventLists().length;calKey++)
            {
                for(var eventIndex=0;eventIndex<container.eventLists()[calKey].events().length;eventIndex++)
                {
                    allEvents.push(container.eventLists()[calKey].events()[eventIndex]);
                }

                // Make all the calendars displayed by default.
                // It requires the indexes to be added as string, not integer.
                container.displayedCalendarsFilter.push(calKey);
            }

            // Group all the events by unique Event UID.
            var eventsByUid = _.groupBy(allEvents,function(event){return event.uid();});

            // For each unique Event UID, make sure all the events have all the parents assigned.
            // The first parent has been assigned in the parent property.
            // The others are added in the otherParents property.
            _.each(eventsByUid,function(sameUidEvents,uidKey)
            {
                // If the (v)event has more than one parent.
                if (sameUidEvents.length > 1)
                {
                    // Extract the parent properties of all the events listed.
                    var severalParents = _.pluck(sameUidEvents, 'sourceEventList');

                    _.each(sameUidEvents,function(event)
                    {
                        _.each(severalParents,function(parent)
                        {
                            // Add the reference to other parents that are not the main one.
                            if(event.sourceEventList !== parent)
                            {
                                event.otherParentEventLists.push(parent.name());
                            }
                        });
                    });
                }
            });
        }
    };

    function reload(container, newjCalData) 
    {
        // snapshot current situation
        // search string entered by user
        var searchQuery = container.textQueryFilter();
        // indexes of checked calendars
        var visibleCalendars = container.displayedCalendarsFilter();
        // corresponding names of checked calendars
        var visibleCalNames = visibleCalendars.map(function(calKey){return container.eventLists()[calKey].name();});

        // reset all
        container.displayedCalendarsFilter([]);
        container.textQueryFilter("");

        refreshValues(container, newjCalData);

        restoreFiltering(container, searchQuery, visibleCalendars, visibleCalNames);
    };

    function restoreFiltering(container, searchQuery, visibleCalendars, visibleCalNames)
    {
        var shouldBeRestored = true;
        // check if the selected calendars have the same index and name in the new data
        for(var index=0;index<visibleCalendars.length;index++)
        {
            var indexToCheck = visibleCalendars[index];

            if(container.eventLists().length > indexToCheck)
            {
                if (container.eventLists()[indexToCheck].name() != visibleCalNames[index])
                {
                    shouldBeRestored = false;
                }
            } 
            else 
            {
                shouldBeRestored = false;
            }
        }

        if(shouldBeRestored)
        {
            // if so, re-apply selection
            // else, leave everything selected
            container.displayedCalendarsFilter(visibleCalendars);
        }

        // re-apply text search
        container.textQueryFilter(searchQuery);

        // toggle flag to trigger UI repaint of data
        container.triggerRepaintData(container.triggerRepaintData()+1);
    };

    // Parse input and re-assign values to existing containers.
    function refreshValues(container, jCalData) 
    {
        // syntax to refresh the observable data : assign new value using varName(newValue)

        // Make sure there is data to parse.
        if(jCalData != null && $.isArray(jCalData) && jCalData.length > 0) 
        {
            // uses a helper method
            container.startDate(utils.getPropertyValue(jCalData[1], "dtstart"));
            container.endDate(utils.getPropertyValue(jCalData[1], "dtend"));

            // default values
            container.displayedStartDate(utils.getPropertyValue(jCalData[1], "dtstart"));
            container.displayedEndDate(utils.getPropertyValue(jCalData[1], "dtend"));
            
            try 
            {
                container.eventLists(ko.utils.arrayMap(jCalData[2], function(calendar){return new CalendarEventList(calendar, container);}));
            } 
            catch(err)
            {
                // The property is called as a function - keep interface consistency.
                container.eventLists();
            }

            identifySharedEvents(container,jCalData);
        }
    };

    function refreshHasEntriesIndex(container, jsonData, displayedSelectedDate) 
    {
        // Make sure there is data received
        // the data itself is not used here because it is not separate from the entries data
        // only filtering (visual data) updated here
        if(jsonData != null && $.isArray(jsonData) && jsonData.length > 0) 
        {
            var eventsByDay = groupUniqueEventsByDay(container, null, container.displayedCalendarsFilter(), container.startDate(), container.endDate(), null, false);
            eventsByDay = utils.mapDictionaryToArray(eventsByDay);

            var eventsByYearMonthDay = [];

            var start = new Moment(container.startDate());

            // current year only, current month only
            container.selectedYear(start.format('YY'));
            eventsByYearMonthDay[container.selectedYear()] = [];
            container.selectedMonth(start.format('MM'));
            eventsByYearMonthDay[container.selectedYear()]['00'] = [];
            eventsByYearMonthDay[container.selectedYear()][container.selectedMonth()] = [];
            container.selectedDay(new Moment(displayedSelectedDate).format('DD'));
            var currentDay;
            var totalMonth = 0;
            var totalYear = 0;

            for(var i=0;i<eventsByDay.length;i++)
            {
                currentDay = new Moment(eventsByDay[i].key).format('DD');
                eventsByYearMonthDay[container.selectedYear()][container.selectedMonth()][currentDay] = eventsByDay[i].value.length;
                totalMonth += eventsByDay[i].value.length;
                currentDay = null;
            }

            eventsByYearMonthDay[container.selectedYear()][container.selectedMonth()]['00'] = totalMonth;
            
            totalYear += totalMonth;
            eventsByYearMonthDay[container.selectedYear()]['00']['00'] = totalYear;

            container.hasEntriesByYearMonthDay(eventsByYearMonthDay);
        }
    };

    CalendarContainer.prototype.setTimeRangeDisplayed = function(selectedDate)
    {
        if (selectedDate != null)
        {
            var selDate = new Moment(selectedDate);
            this.displayedStartDate(selDate.startOf('days').format());
            this.displayedEndDate(selDate.endOf('days').format());
            this.displayedSelectedDate(selectedDate);
        }
    };

    CalendarContainer.prototype.load = function(jCalData, countToDisplay, moreEventsLink, needsAgenda, displayedSelectedDate, deferredLoading) 
    {
        this.loadingDoneFlag = deferredLoading;

        if (this.initDone() == false)
        {
            // bindings were init as empty
            refreshValues(this,jCalData);

            this.maxItems(countToDisplay);
            this.moreEventsLink(moreEventsLink);

            this.initDone(true);
        }
        else
        {
            reload(this, jCalData);
        }

        // this needs to take place AFTER restoring checkboxes
        if (this.loadingDoneFlag != null)
        {
            this.loadingDoneFlag.resolve(true);
        }

        if (needsAgenda)
        {
            refreshHasEntriesIndex(this, jCalData, displayedSelectedDate);
            
            this.setTimeRangeDisplayed(displayedSelectedDate);
        }
    };

    CalendarContainer.prototype.open = function(event) 
    {
        // tried to reduce amount of calls, but eventually bugs
        this.triggerRepaintData(ref.triggerRepaintData()+1);

        this.isPopupOpen(true);
    };

    return CalendarContainer;
};