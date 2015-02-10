define([],function() 
{
	// does not include text contained directly in the HTML of the templates
	return {
		config: {
			key: "key",
			displayStyle: "displayStyle",
			// should remain maxItems for compatibility purposes
			maxItemsDisplayed: "maxItems",
			readMoreBaseLink: "readMoreBaseLink",
			serviceUrlBase: "serviceUrlBase",
			serviceUrlBaseDefault: "http://dev.profile.yale.edu",
			serviceUrlpeopleBody: "/service/people/summaries/",
			serviceUrlpeopleAgendaBody: "/service/people/calendar/",
			serviceUrlOrganizationIdLabel: "organizationIds",
			serviceUrlKeywordsLabel: "keywordIds",
			serviceUrlStartDateLabel: "StartDate",
			serviceUrlEndDateLabel: "EndDate",
			serviceUrlSearchQueryLabel: "searchQuery",
			serviceUrlUserIdLabel: "userIds",
			serviceUrlPageNumberLabel: "pageNumber",
			serviceUrlPageSizeLabel: "pageSize",
			currentPage: "currentPage",
			organizationId: "organizationId",
			coreKeywordIds: "coreKeywordIds",
			moreKeywordIds: "moreKeywordIds",
			urlBaseForKeywords: "keywordBaseLink",
			userId: "userId",
			selectedDate: "selectedDate",
			relativeOptions: "relativeOptions",
			searchQuery: "searchQuery"
		},
		templates : {
			people2coltext: "people-2-col-text"
		},
		idNames: {
			paginationFirstId: "pagination_first-page",
			paginationLastId: "pagination_last-page",
			paginationPreviousId: "pagination_prev-page",
			paginationNextId: "pagination_next-page",
			peopleSetupData: "people-setup-data",
			peopleSetupDataLinks: "people-setup-data-links",
			peopleModuleConfigBegin: "people-module-",
			peopleTemplateIdBegin: "people-overview-template-",
			peopleIdBegin: "people-overview-",
			peopleloadingIdBegin: "people-loading-",
		},
		classNames: {
			countPerPageLinks: "countPerPage",
			countPerPageLinks2: "countPerPage20",
			countPerPageLinks3: "countPerPage30",
			countPerPageLinks4: "countPerPage40",
			countPerPageLinks1: "countPerPage10",
			countPerPageLinksWithDot: ".countPerPage",
			pagination: "pagination",
			nextMonthLink: "next-month-link",
			previousMonthLink: "previous-month-link",
			todayLink: "today-link",
			groupNavigationLinks: ".navigation-link",
			specificDateLink: "specific-date-link"
		},
		paging: {
			showing: "Showing ",
			begin: "Page ",
			middle: " of ",
			perPage: " per Page",
			options: {
				o1: "10",
				o2: "20",
				o3: "30",
				o4: "40"
			}
		},
		error: {
			retrieveDataFail: "people data could not be retrieved",
			retrieveLinksConfigFail: "missing links configuration"
		},
		uitext: {
			latestpeople: "Latest people",
			peopleTitle: "People",
			searchTitle: "Search",
			showFilters: "Show filters",
			clearFilters: "Clear filters",
			searchAllLabel: "Search in all of the people",
			peopleAllLabel: "Start typing name...",
			filtersTitle: "Filters",
			readMore: "Read More",
			recentpeople: "Our Recent people",
			loading: "people Widget Loading...",
			today: "Today",
			previousMonth: "<< month ",
			nextMonth: "month >>",
			noResult: "No items"
		}
	};
});