define(['moment','helpers','calendarProperty/json2jCal'],
function(Moment, utils, Property) 
{
    'use strict';

    // (v)event
    // Most of the processing done here is parsing and flattening the key-value pairs into properties.
    // Output example of a property : ["dtstart",{},"date","2014-10-07"].
    function CalendarEvent(jsonData, parentList) 
    {
        // JS convention - making sure the reference is right.
        var self = this;

        // own properties
        self.properties = [];

        // The image is extracted from the flyer array which contains 0, 1 or 2 entries (max).
        // The image is defined by the photo flag set to false.
        // It may be anywhere in the array.
        self.image = function() 
        {
            var found = false;
            var value;
            if (typeof jsonData.xml !== "undefined" && typeof jsonData.xml.flyer !== "undefined")
            {
                if(jsonData.xml.flyer.length > 1)
                {
                    if (jsonData.xml.flyer[0]['@photo'] == "0")
                    {
                        found = true;
                        value = jsonData.xml.flyer[0]['@stream'];
                    }

                    if (found == false)
                    {
                        if (jsonData.xml.flyer[1]['@photo'] == "0")
                        {
                            found = true;
                            value = jsonData.xml.flyer[1]['@stream'];
                        }
                    }
                }
                else 
                {
                    if (jsonData.xml.flyer['@photo'] == "0")
                    {
                        found = true;
                        value = jsonData.xml.flyer['@stream'];
                    }
                }
            }
            return value;
        };

        // The additional document is extracted from the flyer array which contains 0, 1 or 2 entries (max).
        // The additional document is defined by the photo flag set to true.
        // It may be anywhere in the array.
        self.additionalDocument = function() 
        {
            var found = false;
            var value;
            if (typeof jsonData.xml !== "undefined" && typeof jsonData.xml.flyer !== "undefined")
            {
                if(jsonData.xml.flyer.length > 1)
                {
                    if (jsonData.xml.flyer[0]['@photo'] == "1")
                    {
                        found = true;
                        value = jsonData.xml.flyer[0]['@stream'];
                    }

                    if (found == false)
                    {
                        if (jsonData.xml.flyer[1]['@photo'] == "1")
                        {
                            found = true;
                            value = jsonData.xml.flyer[1]['@stream'];
                        }
                    }
                }
                else 
                {
                    if (jsonData.xml.flyer['@photo'] == "1")
                    {
                        found = true;
                        value = jsonData.xml.flyer['@stream'];
                    }
                }
            }

            return value;
        };

        // If the flag for food is true, its string equivalent is populated.
        self.food = function() 
        {
            var food;
            if (typeof jsonData.xml !== "undefined" && typeof jsonData.xml.p !== "undefined")
            {
                if(utils.getValueOfKey(jsonData.xml.p, 'food') == "1")
                {
                    food = "Refreshments will be served.";
                }
            }
            return food;
        };

        // There may be none, one (flat string) or several tags (array).
        self.tags = function() 
        {
            var values;
            var input = jsonData.tag;

            if(typeof input == 'object' && input != null)
            {
                values = input.map(function(item){return item ;});
            } 
            else if (typeof input == 'string')
            {
                values = input;
            } 
            else 
            {
                values = null;
            }
            return values;
        };

        // The recurring rule (rrule) may contain :
        // - freq : a frequency
        // - byday : a day of the week definition associated to the frequency (e.g. Sunday)
        // - interval : an interval
        // - until : a deadline (date)
        // - count : a count of occurences
        self.rrule = function() 
        {
            var rrule;
            var values = {};
            if (typeof jsonData.rrule !== "undefined")
            {
                if (jsonData.rrule.freq != null)
                {
                    values.freq = jsonData.rrule.freq;
                }

                if (jsonData.rrule.interval != null)
                {
                    values.interval = jsonData.rrule.interval;
                }

                if (jsonData.rrule.byday != null)
                {
                    values.byday = jsonData.rrule.byday;
                }

                if (jsonData.rrule.until != null)
                {
                    values.until = jsonData.rrule.until;
                }

                if (jsonData.rrule.count != null)
                {
                    values.count = jsonData.rrule.count;
                }

                rrule = new Property('rrule',{},'recur',values);
            }
            return rrule;
        };

        // The recurring rule (rrule) is also presented in a condensed form.
        // This is what is included in the iCal format.
        // It is not part of the standard set of jCal descriptors (because it can be rebuild from the rrule property),
        // hence the x-... naming pattern.
        self.rruleEncoded = function() 
        {
            var rrule;
            var values = {};
            if (typeof jsonData.rrule !== "undefined")
            {
                if (jsonData.rrule['@encoded'] != null)
                {
                    rrule = new Property('x-rrule-encoded',{},'text',jsonData.rrule['@encoded']);
                }
            }
            return rrule;
        };

        // parse input and assign values.
         function init(data) 
        {
            self.properties.push(new Property('uid',{},'text',utils.getArrayValue(data,'@uid')));
            self.properties.push(new Property('dtstamp',{},'date-time',utils.getArrayValue(data,'@dtstamp')));

            // Use of external library.
            var start = new Moment(data['@dtstart']);
            // Decide whether it is a date-time or a date value.
            if(!(start.get('h') == "0" && start.get('m') == "0"))
            {
                self.properties.push(new Property('dtstart',{},'date-time',utils.getArrayValue(data,'@dtstart')));
            } 
            else 
            {
                self.properties.push(new Property('dtstart',{},'date',utils.getArrayValue(data,'@dtstart')));
            }
            
            // Use of external library.
            var end = new Moment(data['@dtend']);
            // Decide whether it is a date-time or a date value.
            if(!(end.get('h') == "0" && end.get('m') == "0"))
            {
                self.properties.push(new Property('dtend',{},'date-time',utils.getArrayValue(data,'@dtend')));
            } 
            else 
            {
                self.properties.push(new Property('dtend',{},'date',utils.getArrayValue(data,'@dtend')));
            }

            self.properties.push(new Property('summary',{},'text',utils.getArrayValue(data,'@summary')));
            self.properties.push(new Property('class',{},'text',utils.getArrayValue(data,'@class')));
            self.properties.push(new Property('status',{},'text',utils.getArrayValue(data,'@status')));
            self.properties.push(new Property('x-website',{},'text',utils.getArrayValue(data,'@url')));
            self.properties.push(new Property('x-image-uid',{},'text',self.image()));
            self.properties.push(new Property('x-additionalDocument-uid',{},'text',self.additionalDocument()));
            self.properties.push(new Property('description',{},'text',data.description));
            self.properties.push(new Property('x-desc-raw',{},'text',data.descriptionText));
            self.properties.push(new Property('x-food',{},'text', self.food()));
            self.properties.push(new Property('x-tags',{},'text', self.tags()));
            self.properties.push(new Property('location',{},'text',utils.getArrayValue(data,'@location')));

            if (self.rrule() != null)
            {
                self.properties.push(self.rrule());
            }

            if (self.rruleEncoded() != null)
            {
                self.properties.push(self.rruleEncoded());
            }

            // Parse nested key-value pairs.
            if (typeof data.xml !== "undefined" && typeof data.xml.p !== "undefined")
            {
                self.properties.push(new Property('x-admission',{},'text', utils.getValueOfKey(data.xml.p, 'admission')));
                self.properties.push(new Property('x-audience',{},'text', utils.getValueOfKey(data.xml.p, 'audience')));
                self.properties.push(new Property('x-postal',{},'text', utils.getValueOfKey(data.xml.p, 'postal')));
                self.properties.push(new Property('x-country',{},'text', utils.getValueOfKey(data.xml.p, 'country')));
                self.properties.push(new Property('x-region',{},'text', utils.getValueOfKey(data.xml.p, 'region')));
                self.properties.push(new Property('x-city',{},'text', utils.getValueOfKey(data.xml.p, 'city')));
                self.properties.push(new Property('x-street',{},'text', utils.getValueOfKey(data.xml.p, 'street')));
                self.properties.push(new Property('geo',{},'float', [ utils.getValueOfKey(data.xml.p, 'lng'), 
                                                                      utils.getValueOfKey(data.xml.p, 'lat')]));
                self.properties.push(new Property('x-host',{},'text', utils.getValueOfKey(data.xml.p, 'speaker_host')));
                self.properties.push(new Property('x-organizer',{},'text', utils.getValueOfKey(data.xml.p, 'contact')));
                self.properties.push(new Property('x-organizer-id',{},'text', utils.getValueOfKey(data.xml.p, 'contact_id')));
                self.properties.push(new Property('x-organizer-phone',{},'text', utils.getValueOfKey(data.xml.p, 'contact_phone')));
                self.properties.push(new Property('x-organizer-email',{},'text', utils.getValueOfKey(data.xml.p, 'contact_email')));
                self.properties.push(new Property('x-performer',{},'text', utils.getValueOfKey(data.xml.p, 'speaker')));
                self.properties.push(new Property('x-performer-id',{},'text', utils.getValueOfKey(data.xml.p, 'speaker_id')));
                self.properties.push(new Property('x-performer-title',{},'text', utils.getValueOfKey(data.xml.p, 'speaker_title')));
                self.properties.push(new Property('x-performer-org',{},'text', utils.getValueOfKey(data.xml.p, 'speaker_o')));
                self.properties.push(new Property('x-performer-dept',{},'text', utils.getValueOfKey(data.xml.p, 'speaker_ou')));
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
    CalendarEvent.prototype.jCalExport = function() 
    {
        var output = [];
        var populatedProperties = [];

        var underReview = this.properties;

        if (underReview != null)
        {
            for (var i=0;i<underReview.length;i++)
            {
                if (underReview[i].jCalExport() != null)
                {
                    populatedProperties.push(underReview[i].jCalExport());
                }
            }
        }

        // Container name
        output.push("vevent");

        //Properties
        output.push(populatedProperties);

        return output;
    }

    return CalendarEvent;
});