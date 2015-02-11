module.exports = function() 
{
	'use strict';

	// Container having a value that may be :
	// - a flat string (example : "CONFIRMED").
	// - an array of key/value pairs (example : {"freq":"WEEKLY","interval":"1","byday":"WE"}).
    function PropertyDetails(value) 
	{
		// JS convention - making sure the reference is right.
        var self = this;

        // Properties
	    self.value = value;
	}

	// Export properties to jCal format.
	// Output example - if simple : "2014-10-07"
	// Output example - if array : {"freq":"WEEKLY","interval":"1","byday":"WE"}
	PropertyDetails.prototype.jCalExport = function() 
	{
		return this.value;
	}
	
	return PropertyDetails;
};