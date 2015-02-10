define(['knockout','moment','jquery','underscore','peopleConstants'],function(ko,Moment,$,_,constants)
{
    'use strict';

    // (v)peopleEntry
    function peopleEntry(peopleData, parent) 
    {
        // JS convention - making sure the reference is right.
        var self = this;
        self.container = parent;

        self.initDone = ko.observable(false);

        // Explicit definitions of properties.
        self.id = ko.observable();
        self.name = ko.observable();
        self.suffix = ko.observable();
        self.jobTitle = ko.observable();
        self.summary = ko.observable();
        self.phone = ko.observable();
        self.fax = ko.observable();
        
        self.image = ko.observable();

        self.url = ko.observable();

        // Init properties
        refreshValues(self,peopleData);

        self.initDone(true);
    }

    // Parse input and assign values.
    function refreshValues(peopleEntry,data)
    {
        // Make sure there is data to parse.
        //  && $.isArray(data) && data.length > 0
        if(data != null) 
        {
            // Uses a helper method.
            peopleEntry.id(data.peopleId);
            peopleEntry.name(data.title);
            peopleEntry.summary(data.summary);
            peopleEntry.phone(data.phone);
            peopleEntry.fax(data.phone);
            peopleEntry.image(data.image);

            peopleEntry.url([peopleEntry.container.readMoreBaseLink(), peopleEntry.id()].join(''));
        }
    }

    peopleEntry.prototype.load = function(peopleData) 
    {
        refreshValues(this,peopleData);
    }
    
    return peopleEntry;
});