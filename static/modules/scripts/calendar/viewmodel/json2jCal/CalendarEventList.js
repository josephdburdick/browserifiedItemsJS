define(['jquery','helpers','calendarEvent/json2jCal','calendarProperty/json2jCal'],
    function($, utils, CalendarEvent, Property) 
{
    'use strict';

    // A (v)calendar contains an array of no, one or more (v)event(s).
    function CalendarEventList(jsonData) 
    {
        // JS convention - making sure the reference is right.
        var self = this;

        // Children
        self.events = [];

        // Own properties
        self.properties = [
            new Property('x-uid',{},'text',utils.getArrayValue(jsonData,'@x-wr-relcalid')),
            new Property('x-name',{},'text',utils.getArrayValue(jsonData,'@x-wr-calname')),
            new Property('x-desc',{},'text',utils.getArrayValue(jsonData,'@x-wr-caldesc'))
        ];

        // Parse input and assign values.
        function init(data) 
        {
            try 
            {
                // The jsonData received may be a single event or an array of events.
                if($.isArray(data.vevent))
                {
                    self.events = data.vevent.map(function(event){return new CalendarEvent(event,self);});
                } else 
                {
                    self.events.push(new CalendarEvent(data.vevent,self));
                }
            } 
            catch(err)
            {
                // look here for debugging no calendar event data
                // very likely parsing-assigning problem in CalendarEvent.js
                self.events = [];
            }
        };

        // Init properties
        init(jsonData);
    }

    // Export properties to jCal format.
    //
    // Expected structure :
    //  [[
    //     "containerName",
    //     [["containerPropertyName1",{},"jsonDataType","value"],
    //      ["containerPropertyName2",{},"jsonDataType","value2"],
    //      ...],
    //     [[
    //         "childContainerName",
    //         [["childContainerPropertyName1",{},"jsonDataType","value3"],
    //          ["childContainerPropertyName2",{},"jsonDataType","value4"],
    //          ...],
    //         [[
    //             ...
    //         ]]
    //     ]]
    // ]]
    CalendarEventList.prototype.jCalExport = function() 
    {
        var output = [];
        var populatedPropertiesOnly = [];
        var populatedEventsOnly = [];

        var underReview = this.properties;

        if (underReview != null)
        {
            for (var i=0;i<underReview.length;i++)
            {
                if (underReview[i].jCalExport() != null)
                {
                    populatedPropertiesOnly.push(underReview[i].jCalExport());
                }
            }
        }
        
        underReview = null;
        underReview = this.events;

        if (underReview != null)
        {
            for (var j=0;j<underReview.length;j++)
            {
                populatedEventsOnly.push(underReview[j].jCalExport());
            }
        }

        if (populatedPropertiesOnly.length > 0 || populatedEventsOnly.length > 0)
        {
            // Container name
            output.push("vcalendar");

            // Properties
            output.push(populatedPropertiesOnly);

            // Children
            output.push(populatedEventsOnly);
        }
        else
        {
            output = null;
        }

        return output;
    };
    return CalendarEventList;
});