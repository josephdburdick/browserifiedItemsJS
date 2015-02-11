module.exports = function() 
{
	// does not include text contained directly in the HTML of the templates
	return {
		config: {
			key: "key",
			displayStyle: "displayStyle",
			// should remain maxItems for compatibility purposes
			maxItemsDisplayed: "maxItems",
			readMoreBaseLink: "readMoreBaseLink",
			selectedDate: "selectedDate",
			relativeOptions: "relativeOptions",
			subDomain: "subDomain",
			selectedDateAndTime: "selectedDateAndTime",
			calAndEventUID: "calAndEventUID",
			uniqueEventViewModelRef: "uniqueEventViewModelRef"
		},
		templates : {
			eventstable: "events-table",
			eventstablelist: "events-table-list",
			eventslistspeaker: "events-list-speaker",
			eventslistshortlocationname: "events-list-shortlocationname",
			eventslistthumbnails: "events-list-thumbnails",
			eventslistagenda: "events-list-agenda"
		},
		idNames: {
			containerFilterCheckboxes: 'calendar-filter-options-',
			containerFilterSearch: 'calendar-search-options-',
			eventListTemplateIdBegin: "calendar-content-template-",
			eventListIdBegin: "calendar-content-",
			eventDetailsTemplateId: "event-details-template",
			eventDetailsId: "event-content",
			eventListFilterTemplateIdBegin: "calendar-select-template-",
			eventListSearchTemplateIdBegin: "calendar-search-template-",
			eventListNavigationTemplateIdBegin: "calendar-navigation-template-",
			eventListFilterIdBegin: "calendar-filter-options-",
			eventListSearchIdBegin: "calendar-search-options-",
			eventListNavigationIdBegin: "calendar-navigation-",
			calendarModuleConfigBegin: "calendar-module-",
			calendarSetupData: 'calendar-setup-data',
			calendarSetupDataLinks: 'calendar-setup-data-links'
		},
		classNames: {
			calendarLoadingIdBegin: "calendar-loading-",
			eventLink: 'event-link',
			directEventLink: 'specific-event-link',
			directDateLink: 'specific-date-link',
			nextWeekLink: 'next-week-link',
			previousWeekLink: 'previous-week-link',
			nextMonthLink: 'next-month-link',
			previousMonthLink: 'previous-month-link',
			todayLink: 'today-link',
			specificDateLink: 'specific-date-link',
			groupNavigationLinks: '.navigation-link',
			groupExternalLinks: '.external .event-link'
		},
		calendarService: {
			calendar: {
					urlBegin: 'http://tools.medicine.yale.edu/',
					content: 'calendar/?f=l&d=',
					contentWithSubDomain: '/calendar/?f=l&d=',
					endDateConnector: "&e="
			},
			event: {
				content: 'calendar/event?id=',
				startDateConnector: "&dtstart="
			},
			jsonFormat: "&output=json"
		},
		profileSystem: {
			profileUrl: "http://tools.medicine.yale.edu/phonebook?id=",
			documentUrl: "http://tools.medicine.yale.edu/portal/stream?id="
		},
		error: {
			retrieveDataFail: "Calendar data could not be retrieved",
			retrieveLinksConfigFail: "missing Calendar links configuration"
		},
		uitext: {
			allDay: "All Day",
			until: " until ",
			noResult: "No events",
			moreEvents: "More Events",
			today: "Today",
			previousWeek: "<< ",
			nextWeek: " >>",
			dateLabel: "Date",
			timeLabel: "Time",
			statusLabel: "Status",
			tagsLabel: "Tag(s)",
			locationLabel: "Location",
			websiteLabel: "Website",
			speakerLabel: "Speaker",
			hostLabel: "Host",
			audienceLabel: "Audience",
			admissionLabel: "Admission",
			foodLabel: "Food",
			organizerLabel: "Organizer",
			shareEventLabel: "Share Event",
			downloadToiCalLabel: "Download event to your personal calendar (iCal)",
			downloadFlyerLabel: "Download flyer",
			downloadDocumentLabel: "Download document",
			loading: "Calendar Widget Loading..."
		}
	};
};