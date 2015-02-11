module.exports = function(MyApp)
{
    'use strict';

    var ko = MyApp.vendor.knockout;
    var $ = MyApp.vendor.jquery;
    var CalendarEvent = MyApp.calendar.viewmodel.jCal2Display.CalendarEvent;
    var utils = MyApp.common.helpers;

    // A (v)calendar contains an array of no, one or more (v)event(s).
    function CalendarEventList(jCalData) 
    {
        // JS convention - making sure the reference is right.
        var self = this;

        // These explicit definitions are needed, they are accessed by events (children).
        self.uid = ko.observable();
        self.name = ko.observable();
        self.url = ko.observable();
        self.events = ko.observableArray();

        // Init properties
        refreshValues(self, jCalData);
    }

    // Parse input and assign values.
    function refreshValues(calendar,data) 
    {
        // Make sure there is data to parse.
        if(data != null && $.isArray(data) && data.length > 0) 
        {
            // uses a helper method
            calendar.uid(utils.getPropertyValue(data[1], "x-uid"));
            calendar.name(utils.getPropertyValue(data[1], "x-name"));
            calendar.url(utils.getPropertyValue(data[1], "x-url"));
            
            try 
            {
                // Make sure properties are populated BEFORE events/children are created.
                // The reference of the parent is passed to the child.
                calendar.events(ko.utils.arrayMap(data[2],function(event){return new CalendarEvent(event,calendar);}));
            } 
            catch(err)
            {
                // The property is called as a function - keep interface consistency.
                calendar.events();
            }
        }
    }

    // Hard-coded begin of iCal syntax.
    CalendarEventList.prototype.iCalBEGIN = function(separator) 
    { 
        return ["BEGIN:VCALENDAR",
                "METHOD:PUBLISH",
                "PRODID:-//Yale//Univariant//EN",
                "VERSION:2.0",
                "CALSCALE:GREGORIAN",
                "METHOD:PUBLISH"].join(separator);
    }

    // Hard-coded end of iCal syntax.
    CalendarEventList.prototype.iCalEND = "END:VCALENDAR";

    // Export properties to iCal format
    CalendarEventList.prototype.iCalExport = function(separator)
    {
        return [this.iCalBEGIN(separator),
                this.iCalEND].join(separator);
    }
    
    return CalendarEventList;
};