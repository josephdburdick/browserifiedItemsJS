module.exports = function(MyApp)
{
    'use strict';

    var ko = MyApp.vendor.knockout;
    var $ = MyApp.vendor.jquery;
    var _ = MyApp.vendor.underscore;
    var Moment = MyApp.vendor.moment;
    var utils = MyApp.common.helpers;
    var constants = MyApp.calendar.constants;

    // (v)event
    function CalendarEvent(jCalData, parentList) 
    {
        // JS convention - making sure the reference is right.
        var self = this;

        // text used on UI
        self.dateLabel = constants.uitext.dateLabel;
        self.timeLabel = constants.uitext.timeLabel;
        self.statusLabel = constants.uitext.statusLabel;
        self.tagsLabel = constants.uitext.tagsLabel;
        self.locationLabel = constants.uitext.locationLabel;
        self.websiteLabel = constants.uitext.websiteLabel;
        self.speakerLabel = constants.uitext.speakerLabel;
        self.hostLabel = constants.uitext.hostLabel;
        self.audienceLabel = constants.uitext.audienceLabel;
        self.admissionLabel = constants.uitext.admissionLabel;
        self.foodLabel = constants.uitext.foodLabel;
        self.organizerLabel = constants.uitext.organizerLabel;
        self.shareEventLabel = constants.uitext.shareEventLabel;
        self.downloadToiCalLabel = constants.uitext.downloadToiCalLabel;
        self.downloadFlyerLabel = constants.uitext.downloadFlyerLabel;
        self.downloadDocumentLabel = constants.uitext.downloadDocumentLabel;

        // Reference to calendar/parent.
        self.sourceEventList = parentList;

        self.isPopupOpen = ko.observable(true);

        self.initDone = ko.observable(false);

        // Explicit definitions of properties.
        self.uid = ko.observable();
        self.startDate = ko.observable();
        self.endDate = ko.observable();
        self.stampDate = ko.observable();
        self.name = ko.observable();
        self.website = ko.observable();
        self.host = ko.observable();
        self.audience = ko.observable();
        self.food = ko.observable();
        self.admission = ko.observable();
        self.flyer = ko.observable();
        self.additionalDocument = ko.observable();
        self.status = ko.observable();
        self.rrule = ko.observable();

        // These are containers of other properties.
        self.performer = {};
        self.performer.memberOf = {};
        self.organizer = {};
        self.location = {};
        self.location.geo = {};
        self.location.addressDetails = {};
        self.description = {};

        // init here for individual handling of an event
        self.performer.memberOf.organization = ko.observable();
        self.performer.memberOf.department = ko.observable();
        self.performer.givenName = ko.observable();
        self.performer.jobTitle = ko.observable();
        self.performer.identifier = ko.observable();

        self.organizer.phone = ko.observable();
        self.organizer.email = ko.observable();
        self.organizer.givenName = ko.observable();
        self.organizer.identifier = ko.observable();

        self.location.addressDetails.shortLocationName = ko.observable();
        self.location.addressDetails.postalCode = ko.observable();
        self.location.addressDetails.addressCountry = ko.observable();
        self.location.addressDetails.addressRegion = ko.observable();
        self.location.addressDetails.addressCity = ko.observable();
        self.location.addressDetails.streetAddress = ko.observable();

        self.description.plainText = ko.observable();
        self.description.formattedHtml = ko.observable();

        self.performer.profileUrl = ko.observable();
        self.organizer.profileUrl = ko.observable();

        self.location.geo.longitude = ko.observable();
        self.location.geo.latitude = ko.observable();

        self.tags = ko.observable();

        // Flag for the UI display.
        self.isAllDay = ko.observable(false);

        // A unique given (v)event may belong to one or more (v)calendar(s).
        // Only ONE of these instances is presented to the user.
        self.otherParentEventLists = ko.observableArray();

        self.formattedDay = ko.computed(function() 
        {
            var value;
            if (self.initDone() == true && self.startDate() != null)
            {
                // Use of external library
                // Output example : "Wednesday, October 8th"
                value = new Moment(self.startDate()).format('dddd, MMMM Do');
            }
            return value;
        });

        self.formattedStartTime = ko.computed(function() 
        {
            var value;
            if (self.initDone() == true && self.startDate() != null && self.isAllDay() == false)
            {
                // Use of external library
                // Output example : "8:00 AM"
                value = new Moment(self.startDate()).format('LT');
            }
            return value;
        });

        self.formattedEndTime = ko.computed(function() 
        {
            var value;
            if (self.initDone() == true && self.endDate() != null && self.isAllDay() == false)
            {
                // Use of external library
                // Output example : "8:00 AM"
                value = new Moment(self.endDate()).format('LT');
            }
            return value;
        });

        self.formattedTime = ko.computed(function() 
        {
            var value;
            if (self.initDone() == true && self.isAllDay() == false)
            {
                // Output example : "4:00 PM until 5:00 PM"
                var timeRange = [];
                timeRange.push(self.formattedStartTime());

                if (self.formattedEndTime() != null)
                {
                    timeRange.push(self.formattedEndTime());
                    value = timeRange.join(constants.uitext.until);
                }
                else
                {
                    value = timeRange.join('');
                }
            }
            else
            {
                value = constants.uitext.allDay;
            }
            return value;
        });

        self.url = ko.computed(function() 
        {
            var url;
            if (self.initDone() == true && self.uid() != null)
            {
                url = [constants.calendarService.calendar.urlBegin, constants.calendarService.event.content, ((self.sourceEventList != null)?self.sourceEventList.uid():null), ",", self.uid(), constants.calendarService.event.startDateConnector, self.startDate()].join('');
            }
            return url;
        });

        self.location.formattedAddressForMaps = ko.computed(function() 
        {
            var addressPieces = [];
            var fullAddress;

            if (self.initDone() == true && self.location.addressDetails.streetAddress() != null)
            {
                if (self.location.addressDetails.streetAddress() != null)
                {
                    addressPieces.push(self.location.addressDetails.streetAddress());
                }

                if (self.location.addressDetails.addressCity() != null)
                {
                    addressPieces.push(self.location.addressDetails.addressCity());
                }

                var fullZip = [];
                if (self.location.addressDetails.addressRegion() != null)
                {
                    fullZip.push(self.location.addressDetails.addressRegion());
                }
                if (self.location.addressDetails.postalCode() != null)
                {
                    fullZip.push(self.location.addressDetails.postalCode());
                }
                if (fullZip.length > 0)
                {
                    addressPieces.push(fullZip.join(' '));
                }
            }

            if (addressPieces.length > 0)
            {
                fullAddress = addressPieces.join(',');
            }

            return fullAddress;
        });

        self.statusClass = ko.computed(function(){
            var value;
            if( self.status() == "CANCELLED")
            {
                value = "event-overview-cancelled";
            }
            else
            {
                value = "event-overview-confirmed";
            }

            return value;
        });

        self.allParentEventLists = ko.computed(function() 
        {
            var value;
            if (self.initDone() == true && self.sourceEventList != null)
            {
                value = [];
                value.push(self.sourceEventList.name());

                value = value.concat(self.otherParentEventLists());
                
            }
            return value;
        });

        self.performer.formattedName = ko.computed(function() {
            var value;
            if (self.initDone() == true && self.performer.givenName() != null)
            {
                // TO DO : return as array
                value = self.performer.givenName().replace("|||", " ||| "); 
            }
            return value;
        });

        self.formattedTags = ko.computed(function(){
            var value;
            if (self.initDone() == true && self.tags() != null)
            {
                if ($.isArray(self.tags()))
                {
                    value = self.tags().join(', ');
                }
                else
                {
                    value = self.tags();
                }
                return value;
            }
        });

        // Init properties
        refreshValues(self,jCalData);

        self.initDone(true);
    }

    // Parse input and assign values.
    function refreshValues(event,data)
    {
        // Make sure there is data to parse.
        if(data != null && $.isArray(data) && data.length > 0) 
        {
            // Uses a helper method.
            event.uid(utils.getPropertyValue(data[1], "uid"));
            event.startDate(utils.getPropertyValue(data[1], "dtstart"));

            if (event.startDate() != null)
            {
                // All day events are recognizable through the data type of the start date
                // NOT being datetime.
                event.isAllDay(_.findWhere(data[1],{0 : "dtstart"})[2] == "date");
            }

            event.endDate(utils.getPropertyValue(data[1], "dtend"));
            event.stampDate(utils.getPropertyValue(data[1], "dtstamp"));
            event.name(utils.getPropertyValue(data[1], "summary"));
            event.website(utils.getPropertyValue(data[1], "x-website"));
            event.status(utils.getPropertyValue(data[1], "status"));
            event.host(utils.getPropertyValue(data[1], "x-host"));
            event.admission(utils.getPropertyValue(data[1], "x-admission"));
            event.audience(utils.getPropertyValue(data[1], "x-audience"));
            event.food(utils.getPropertyValue(data[1], "x-food"));

            event.performer.memberOf.organization(utils.getPropertyValue(data[1], "x-performer-org"));
            event.performer.memberOf.department(utils.getPropertyValue(data[1], "x-performer-dept"));
            event.performer.givenName(utils.getPropertyValue(data[1], "x-performer"));
            event.performer.jobTitle(utils.getPropertyValue(data[1], "x-performer-title"));
            event.performer.identifier(utils.getPropertyValue(data[1], "x-performer-id"));

            event.organizer.phone(utils.getPropertyValue(data[1], "x-organizer-phone"));
            event.organizer.email(utils.getPropertyValue(data[1], "x-organizer-email"));
            event.organizer.givenName(utils.getPropertyValue(data[1], "x-organizer"));
            event.organizer.identifier(utils.getPropertyValue(data[1], "x-organizer-id"));

            event.location.addressDetails.shortLocationName(utils.getPropertyValue(data[1], "location"));
            event.location.addressDetails.postalCode(utils.getPropertyValue(data[1], "x-postal"));
            event.location.addressDetails.addressCountry(utils.getPropertyValue(data[1], "x-country"));
            event.location.addressDetails.addressRegion(utils.getPropertyValue(data[1], "x-region"));
            event.location.addressDetails.addressCity(utils.getPropertyValue(data[1], "x-city"));
            event.location.addressDetails.streetAddress(utils.getPropertyValue(data[1], "x-street"));

            event.description.plainText(utils.getPropertyValue(data[1], "x-desc-raw"));
            event.description.formattedHtml(utils.getPropertyValue(data[1], "description"));

            // The profile url is only populated if the ID is provided.
            if (event.performer.identifier() != null)
            {
                event.performer.profileUrl(constants.profileSystem.profileUrl + event.performer.identifier());
            }

            // The profile url is only populated if the ID is provided.
            if (event.organizer.identifier() != null)
            {
                event.organizer.profileUrl(constants.profileSystem.profileUrl + event.organizer.identifier());
            }

            // The document url is only populated if the stream ID is provided.
            if(utils.getPropertyValue(data[1], "x-additionalDocument-uid") != null)
            {
                event.additionalDocument(constants.profileSystem.documentUrl + utils.getPropertyValue(data[1], "x-additionalDocument-uid"));
            }

            // The flyer url is only populated if the stream ID is provided.
            if(utils.getPropertyValue(data[1], "x-image-uid") != null)
            {
                event.flyer(constants.profileSystem.documentUrl + utils.getPropertyValue(data[1], "x-image-uid"));
            }

            // Special handling here because the property contains an array as value.
            // Make sure the container exists.
            // The geo coordinates are only populated if the geo tuple is populated.
            if(utils.getPropertyValue(data[1], "geo") != null)
            {
                event.location.geo.longitude(_.findWhere(data[1],{0 : "geo"})[3][0]);
                event.location.geo.latitude(_.findWhere(data[1],{0 : "geo"})[3][1]);
            }

            // There may be none, one or more tags.
            // Several tags would be contained in an array.
            // A single tag would be in a flat string.
            if($.isArray(utils.getPropertyValue(data[1], "x-tags")))
            {
                event.tags = ko.observableArray(ko.utils.arrayMap(_.findWhere(data[1],{0 : "x-tags"})[3],function(item){return item ;}));
            } 
            else
            {
                event.tags = ko.observable(utils.getPropertyValue(data[1], "x-tags"));
            }

            event.rrule(utils.getPropertyValue(data[1], "x-rrule-encoded"));
        }
    }

    function refreshByCopyingValues(destination,source) 
    {
        // Make sure there is data to parse.
        if(destination != null && source != null) 
        {
            destination.sourceEventList = source.sourceEventList;
            destination.isPopupOpen(source.isPopupOpen());
            destination.initDone(source.initDone());

            destination.uid(source.uid());
            destination.startDate(source.startDate());
            destination.isAllDay(source.isAllDay());
            destination.endDate(source.endDate());
            destination.stampDate(source.stampDate());
            destination.name(source.name());
            destination.website(source.website());
            destination.status(source.status());
            destination.host(source.host());
            destination.admission(source.admission());
            destination.audience(source.audience());
            destination.food(source.food());
            destination.performer.memberOf.organization(source.performer.memberOf.organization());
            destination.performer.memberOf.department(source.performer.memberOf.department());
            destination.performer.givenName(source.performer.givenName());
            destination.performer.jobTitle(source.performer.jobTitle());
            destination.performer.identifier(source.performer.identifier());
            destination.organizer.phone(source.organizer.phone());
            destination.organizer.email(source.organizer.email());
            destination.organizer.givenName(source.organizer.givenName());
            destination.organizer.identifier(source.organizer.identifier());
            destination.location.addressDetails.shortLocationName(source.location.addressDetails.shortLocationName());
            destination.location.addressDetails.postalCode(source.location.addressDetails.postalCode());
            destination.location.addressDetails.addressCountry(source.location.addressDetails.addressCountry());
            destination.location.addressDetails.addressRegion(source.location.addressDetails.addressRegion());
            destination.location.addressDetails.addressCity(source.location.addressDetails.addressCity());
            destination.location.addressDetails.streetAddress(source.location.addressDetails.streetAddress());
            destination.description.plainText(source.description.plainText());
            destination.description.formattedHtml(source.description.formattedHtml());
            destination.performer.profileUrl(source.performer.profileUrl());
            destination.organizer.profileUrl(source.organizer.profileUrl());
            destination.additionalDocument(source.additionalDocument());
            destination.flyer(source.flyer());
            destination.location.geo.longitude(source.location.geo.longitude());
            destination.location.geo.latitude(source.location.geo.latitude());
            destination.tags(source.tags());
            destination.rrule(source.rrule());
        }
    }


    // This property is specific to iCal export.
    function optionalOrganizer(event) 
    {
        var optionalOrganizer;
        if (event.organizer.email() != null)
        {
            optionalOrganizer = ["ORGANIZER;CN=\"",
                                event.organizer.givenName(),
                                "\":MAILTO:",
                                event.organizer.email()].join('');
        }
        return optionalOrganizer;
    }

    // Prepares the inside event content of the iCal structure.
    function event2iCal(event, separator) 
    {
        var iCalData = [];
        iCalData.push("BEGIN:VEVENT");
        iCalData.push("UID:" + event.uid());
        iCalData.push("CLASS:PUBLIC");
        iCalData.push("STATUS:" + event.status());
        iCalData.push("URL;VALUE=URI:" + event.url());
        // Use of external library.
        // Output example : "DTSTAMP:20141106T175635Z".
        iCalData.push("DTSTAMP:" + new Moment(event.stampDate()).utc().format('YYYYMMDDTHHmmss') + "Z");
        // Use of external library.
        // Output example : "DTSTART;TZID=America/New_York:20141113T160000".
        if (!event.isAllDay())
        {
            iCalData.push("DTSTART;TZID=America/New_York:" + new Moment(event.startDate()).format('YYYYMMDDTHHmmss'));

            if (event.endDate() != null)
            {
                iCalData.push("DTEND;TZID=America/New_York:" + new Moment(event.endDate()).format('YYYYMMDDTHHmmss'));
            }
            else
            {
                iCalData.push("DTEND;TZID=America/New_York:" + new Moment(event.startDate()).format('YYYYMMDDTHHmmss'));
            }
        }
        else
        {
            iCalData.push("DTSTART;TZID=America/New_York:" + new Moment(event.startDate()).format('YYYYMMDD'));
        }

        // Optional
        if(event.rrule() != null)
        {
            iCalData.push("RRULE:" + event.rrule());
        }

        // This is the only location included - matching current behavior.
        if (event.location.addressDetails.shortLocationName() != null)
        {
            iCalData.push("LOCATION:" + event.location.addressDetails.shortLocationName());
        }

        iCalData.push("SUMMARY:" + event.name());

        // Optional
        if (event.description.plainText() != null)
        {
            iCalData.push("DESCRIPTION:" + event.description.plainText());
        }

        // Optional
        var organizer = optionalOrganizer(event);
        if (organizer != null)
        {
            iCalData.push(organizer);
        }

        if (!event.isAllDay())
        {
            iCalData.push("BEGIN:VALARM");
            iCalData.push("TRIGGER:-PT15M");
            iCalData.push("ACTION:DISPLAY");
            iCalData.push("END:VALARM");
        }

        iCalData.push("END:VEVENT");
        return iCalData.join(separator);
    }

    CalendarEvent.prototype.loadByCopying = function(viewModelData) 
    {
        refreshByCopyingValues(this,viewModelData);
    }

    CalendarEvent.prototype.load = function(jCalData) 
    {
        refreshValues(this,jCalData);
    }

    // Export properties to iCal format
    CalendarEvent.prototype.iCalExport = function(separator) 
    {
            // Triggered at event level,
            // it requires embedding structure of main parent calendar
            // and content of the trigger event itself.
            return [this.sourceEventList.iCalBEGIN(separator),
                    event2iCal(this, separator),
                    this.sourceEventList.iCalEND].join(separator);
    }
    
    return CalendarEvent;
};