define(['jquery','calendarPropertyDetails/json2jCal'],
function($,PropertyDetails) 
{
	'use strict';

	// Container providing the structure [valueName, valueParameters, valueDataType, valueContent].
	// This structure is needed to comply to the jCal RFC expectations.
    function Property(name, params, type, value) 
	{
		// JS convention - making sure the reference is right.
        var self = this;

        self.propertyDetails = [
					        	new PropertyDetails(name),
					        	new PropertyDetails(params),
					        	new PropertyDetails(type),
					        	new PropertyDetails(value)
        					];
	}

	// Export properties to jCal format.
	// Output example - if simple : ["dtstart",{},"date","2014-10-07"].
	// Output example - if array value : ["rrule",{},"recur",{"freq":"WEEKLY","interval":"1","byday":"WE"}].
	Property.prototype.jCalExport = function() 
	{
		// may or may not be exported
		var underReview = this.propertyDetails;
		// export content
		var output;

		// Exclude values that are null/undefined/were not populated.
		// These are either a :
		// - property structure where the value entry (4th position) is a flat string.
		// - property structure where the value entry (4th position) is an array of key/value pairs.
		// 
		// In the latter case, the $ isArray function is needed because typeof array returns 'object'.
		if (underReview[3].value == null || (underReview[3].value != null && $.isArray(underReview[3].value) && ((underReview[3].value[0] == null && underReview[3].value[1] == null))))
		{
			output = null;
		} 
		else 
		{
			// Overwrites the default print out as "value" : "contentValue" with "contentValue" only - in the case of a flat string content.
			// Nested key-value pairs are expected to be printed as "key":"value" as specified in the jCal RFC.
			output = [];
			output.push(underReview[0].jCalExport());
			output.push(underReview[1].jCalExport());
			output.push(underReview[2].jCalExport());
			output.push(underReview[3].jCalExport());
		}
		
		return output;
	}
	
	return Property;
});