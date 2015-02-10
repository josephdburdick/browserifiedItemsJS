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
			serviceUrlNewsBody: "/service/news/summaries/",
			serviceUrlNewsAgendaBody: "/service/news/calendar/",
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
			news1colhighlight: "news-1-col-highlight",
			news2colhighlight: "news-2-col-highlight",
			news2coltext: "news-2-col-text",
			news2colthumbnails: "news-2-col-thumbnails",
			newscombined: "news-combined",
			newsgridfull: "news-grid-full",
			newssidetext: "news-side-text",
			newssidethumbnails: "news-side-thumbnails",
			news1coltextpaging: "news-1-col-text-paging"
		},
		idNames: {
			paginationFirstId: "pagination_first-page",
			paginationLastId: "pagination_last-page",
			paginationPreviousId: "pagination_prev-page",
			paginationNextId: "pagination_next-page",
			newsSetupData: "news-setup-data",
			newsSetupDataLinks: "news-setup-data-links",
			newsModuleConfigBegin: "news-module-",
			newsTemplateIdBegin: "news-overview-template-",
			newsIdBegin: "news-overview-",
			newsloadingIdBegin: "news-loading-",
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
			retrieveDataFail: "News data could not be retrieved",
			retrieveLinksConfigFail: "missing links configuration"
		},
		uitext: {
			latestNews: "Latest News",
			peopleTitle: "People",
			tagsTitle: "Tags",
			dateTitle: "Date",
			searchTitle: "Search",
			showFilters: "Show filters",
			clearFilters: "Clear filters",
			searchAllLabel: "Search in all of the news",
			peopleAllLabel: "Start typing name...",
			filtersTitle: "Filters",
			readMore: "Read More",
			tagsLabel: "Tags:",
			recentNews: "Our Recent News",
			loading: "News Widget Loading...",
			today: "Today",
			previousMonth: "<< month ",
			nextMonth: "month >>",
			noResult: "No items"
		}
	};
});