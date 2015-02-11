module.exports = function(MyApp) 
{
	'use strict';

	var $ = MyApp.vendor.jquery;
	var utils = MyApp.common.helpers;
	var CalendarEventList = MyApp.calendar.viewmodel.json2jCal.CalendarEventList;
	var Property = MyApp.calendar.viewmodel.json2jCal.Property;

	// A (v)calendars container contains an array of no, one or more (v)calendar(s).
    function CalendarContainer(jsonData) 
	{
		// JS convention - making sure the reference is right.
        var self = this;

        // Children
        self.calendars = [];

        // Own properties
	    self.properties = [
	    					new Property('dtstart',{},'date', utils.getArrayValue(jsonData,'@dtstart')),
	    					new Property('dtend',{},'date',utils.getArrayValue(jsonData,'@dtend')),
	    					new Property('x-dtsel',{},'date',utils.getArrayValue(jsonData,'@dtsel'))
	    				];

	    // Parse input and assign values.
	    function init(data) 
        {
        	try 
            {
            	// The data received may be a single calendar or an array of calendars.
                if($.isArray(data.vcalendar))
                {
                    self.calendars = data.vcalendar.map(function(vcalendar){return new CalendarEventList(vcalendar,self);});
                } 
                else 
                {
                    self.calendars.push(new CalendarEventList(data.vcalendar,self));
                }
            } 
            catch(err)
            {
                self.calendars = [];
            }
        };

        // Init properties
        init(jsonData);
	}

	// Export properties to jCal format.
	//
	// Expected structure :
	// 	[[
	//     "containerName",
	//     [["containerPropertyName1",{},"dataType","value"],
	//      ["containerPropertyName2",{},"dataType","value2"],
	//      ...],
	//     [[
	//         "childContainerName",
	//         [["childContainerPropertyName1",{},"dataType","value3"],
	//          ["childContainerPropertyName2",{},"dataType","value4"],
	//          ...],
	//         [[
	//             ...
	//         ]]
	//     ]]
	// ]]
	CalendarContainer.prototype.jCalExport = function() 
	{
		var output = [];
		var populatedPropertiesOnly = [];
		var populatedCalendarsOnly = [];

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

		underReview = this.calendars;
		if (underReview != null)
		{
			for (var j=0;j<underReview.length;j++)
			{
				if (underReview[j].jCalExport() != null)
				{
					populatedCalendarsOnly.push(underReview[j].jCalExport());
				}
			}
		}

		// Container name
		output.push("vcalendars");

		// Properties
		output.push(populatedPropertiesOnly);
		
		// Children
		output.push(populatedCalendarsOnly);

		// JSON data is only valid with double quotes (not single quotes).
		return JSON.stringify(output);
	}
	
	return CalendarContainer;
};