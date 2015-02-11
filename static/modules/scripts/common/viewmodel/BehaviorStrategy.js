module.exports = function(MyApp)
{
	'use strict';

	var Moment = MyApp.vendor.moment;

	function BehaviorStrategy(itemType)
	{
		var self = this;

		switch (itemType)
		{
			case 'news':
				// this call only works if the module has been loaded already
				var constants = MyApp.news.constants;
				self.pagedTemplateNameFirstPage = constants.templates.newscombined;
				self.pagedTemplateOtherPages = constants.templates.news1coltextpaging;
				self.urlDefaultValue = constants.config.serviceUrlBaseDefault;
				self.pagingOption1 = constants.paging.options.o1;
				self.pagingOption2 = constants.paging.options.o2;
				self.pagingOption3 = constants.paging.options.o3;
				self.pagingOption4 = constants.paging.options.o4;
				self.urlItemsBody = constants.config.serviceUrlNewsBody;
				self.urlCalendarMetadataBody = constants.config.serviceUrlNewsAgendaBody;
				self.urlKeywordsLabel = constants.config.serviceUrlKeywordsLabel;
				self.urlPageSizeLabel = constants.config.serviceUrlPageSizeLabel;
				self.urlPageNumberLabel = constants.config.serviceUrlPageNumberLabel;
				self.urlSearchQueryLabel = constants.config.serviceUrlSearchQueryLabel;
				self.urlOrganizationIdLabel = constants.config.serviceUrlOrganizationIdLabel;
				self.urlUserIdLabel = constants.config.serviceUrlUserIdLabel;
				self.urlStartDateLabel = constants.config.serviceUrlStartDateLabel;
				self.urlEndDateLabel = constants.config.serviceUrlEndDateLabel;
			break;
			case 'calendar':
			case 'calendarEvent':
				var constants = MyApp.calendar.constants;
				self.pagedTemplateNameFirstPage = constants.templates.eventslistagenda;
				self.pagedTemplateOtherPages = constants.templates.eventslistagenda;
				self.urlDefaultValue = constants.calendarService.calendar.urlBegin;
				self.urlItemsBody = constants.calendarService.calendar.content;
				self.urlSingleItemBody = constants.calendarService.event.content;
				self.urlItemsBodyWithSubDomain = constants.calendarService.calendar.contentWithSubDomain;
				self.endDateConnector = constants.calendarService.calendar.endDateConnector;
				self.startDateConnector = constants.calendarService.calendar.startDateConnector;
				self.jsonFormatEnding = constants.calendarService.jsonFormat;
			break;
		}
	}

	BehaviorStrategy.prototype.initialSetup = function(config)
    {
    	// reset action flags
    	config.loadDone = false;
		config.loadItems = true;
		config.loadAgendaMetadata = null;
		config.changeDisplayStyle = true;

		if (config.serviceUrlBase == null)
		{
			// use default service url if no overwrite supplied by user
			config.serviceUrlBase = this.urlDefaultValue;
		}

		if (config.itemType == 'calendar')
		{
			if (config.selectedDate == null)
			{
				config.selectedDate = new Moment();
			}
		}

		config = this.initPaging(config);

		switch (config.itemType)
		{
			case 'calendar':
			case 'calendarEvent':
				config.url = this.setupCalendarServerUrl(config);
			break;
			default:
				// populate reference urls used throughout the app lifetime
				config.url = this.setupUrl(config, config.serviceUrlBase, true, false, false);
				config.urlAgendaMetadata = this.setupUrl(config, config.serviceUrlBase, false, true, false);
				config.urlBaseForKeywords = this.setupUrl(config, config.urlBaseForKeywords, false, false, true);
			break;
		}

		return config;
    }

    BehaviorStrategy.prototype.refreshSetup = function(source, update)
    {
    	// source are the stored configuration settings
    	// update are the configuration settings received by the app
    	// during runtime, base urls are not changed ; templates neither, unless controlled by paging
		if (source.key != null)
		{
			// reset action flags
			source.loadDone = false;
			source.loadItems = null;
			source.loadAgendaMetadata = false;
			source.changeDisplayStyle = false;

			if (update.selectedDate !== undefined && update.selectedDate != source.selectedDate)
			{
				source.loadItems = true;

			  if (update.selectedDate == null)
			  {
			  	// selected date not undefined and still null means the null value was added explicitely
			    source.selectedDate = null;
			    // make sure that if the selected date has been reset, the time range will be too
			    update.relativeOptions = 0;
			  }
			  else
			  {
			    source.selectedDate = new Moment(update.selectedDate);
			  }
			}

			if (update.relativeOptions != null)
			{
				source.loadItems = true;

				// no support for resetting relativeOptions by null, only using 0
				source.relativeOptions = update.relativeOptions;
				// make sure selected date was refreshed first
				// momentjs needs independant references to manipulate
				var selStartDate = new Moment(source.selectedDate);
				var selEndDate = new Moment(source.selectedDate);

				switch (update.relativeOptions)
				{
					case 1:
					    source.selectedStartDate = selStartDate.startOf('days');
					    source.selectedEndDate = selEndDate.endOf('days');
					break;
					case 30:
					  source.selectedStartDate = selStartDate.startOf('months');
					  source.selectedEndDate = selEndDate.endOf('months');
					break;
					case 365:
					  source.selectedStartDate = selStartDate.startOf('years');
					  source.selectedEndDate = selEndDate.endOf('years');
					break;
					case 0:
					  source.selectedStartDate = null;
					  source.selectedEndDate = null;
					break;
				}

			  	// make sure the user will see some results
			  	source.currentPage = 1;
			}

			if (update.searchQuery !== undefined && update.searchQuery != source.searchQuery)
			{
				source.loadItems = true;
			  	// the value has been specified in the parameters received - if null, means reset of the query
			  	source.searchQuery = update.searchQuery;
			  	// make sure the user will see some results
			  	source.currentPage = 1;
			}

			source = this.refreshPaging(source, update);

			if (source.loadItems)
			{
				switch (source.itemType)
				{
					case 'calendar':
						source.url = this.setupCalendarServerUrl(source);
					break;
					default:
						// refresh urls because parameters are likely to have changed
						source.url = this.setupUrl(source, source.serviceUrlBase, true, false, false);
						source.urlBaseForKeywords = this.setupUrl(source, source.urlBaseForKeywords, false, false, true);
						// no need to refresh calendar metadata url - only used at initial load 
					break;
				}
			}
		}

      return source;
    }

	BehaviorStrategy.prototype.initPaging = function(config)
    {
      if (config.displayStyle == this.pagedTemplateNameFirstPage || config.displayStyle == this.pagedTemplateOtherPages)
      {
      	switch (config.itemType)
      	{
      		case 'calendar':
      		break;
      		default:
      			config.loadAgendaMetadata = true;
      		break;
      	}

		if (config.maxItems != this.pagingOption1 && config.maxItems != this.pagingOption2 && config.maxItems != this.pagingOption3 && config.maxItems != this.pagingOption4)
		{
		// set a default value if the value from user does not fit in expected choices
			config.maxItems = this.pagingOption1;
		}

        if (config.currentPage == null)
        {
          config.currentPage = 1;
        }
      }
      else
      {
        config.loadAgendaMetadata = false;
      }

      return config;
    }

    BehaviorStrategy.prototype.refreshPaging = function(source, update)
    {
    	if (source.displayStyle == this.pagedTemplateNameFirstPage || source.displayStyle == this.pagedTemplateOtherPages)
		{
			if (update.currentPage != null && update.currentPage != source.currentPage)
			{
				// change of page
				if (update.currentPage == 1)
	            {
	            	if (source.displayStyle != this.pagedTemplateNameFirstPage)
		            {
		              // from another page back to page 1
		              source.changeDisplayStyle = true;
		              source.displayStyle = this.pagedTemplateNameFirstPage;
		            }
	            }
	            else
	            {
	            	if (source.displayStyle != this.pagedTemplateNameOtherPages)
		            {
		              // from page 1 to another page
		              source.changeDisplayStyle = true;
		              source.displayStyle = this.pagedTemplateOtherPages;
		            }
	            }

	            source.currentPage = update.currentPage;
	            source.loadItems = true;
			}
			else if (update.maxItems !== undefined && update.maxItems != source.maxItems)
			{
				// change of count of items per page
				if (update.maxItems != null)
				{
					// count of items per page is limited
					if (source.maxItems != null)
		            {
		            	// if previous configuration not Display All, items need to be downloaded
		            	source.loadItems = true;
		            }

		            // since the amount of items displayed per page has changed
		            // we need to recalculate the current page index
		            // step 1 - identify the index (called IS) of the first item currently displayed on the page visible to user
		            // IS = ((currentPageIndex - 1) * OLDitemsPerPage) + 1
		            // step 2 - the IS from previous calculation tells which new current page the item is now on
		            // we deduce the index of current page from it using
		            // NewCurrentPage = ((IS -1)/ NEWitemsPerPage) + 1
		            var indexOfFirstItem = source.maxItems * (source.currentPage - 1) + 1;
		            var newPageIndex = ((indexOfFirstItem - 1)/update.maxItems) + 1;
		            
		            // round down (in other words Page 6.3 means Page 6)
		            update.currentPage = Math.floor(newPageIndex);

		            if (update.currentPage == 1)
		            {
		            	if (source.displayStyle != this.pagedTemplateNameFirstPage)
			            {
			              // from another page back to page 1
			              source.changeDisplayStyle = true;
			              source.displayStyle = this.pagedTemplateNameFirstPage;
			            }
		            }
		            else
		            {
		            	if (source.displayStyle == this.pagedTemplateNameFirstPage)
			            {
			              // from page 1 to another page
			              source.changeDisplayStyle = true;
			              source.displayStyle = news1coltextpaging;
			            }
		            }

		            source.currentPage = update.currentPage;
				}

				source.maxItems = update.maxItems;
			}

			if (source.itemType == 'calendar')
			{
				// check whether the new date is within the loaded time range, else reload
	            if (source.startDate != null && source.endDate != null && update.selectedDate >= source.startDate && update.selectedDate <= source.endDate)
	            {
	              source.loadEvents = false;
	            }
			}
		}

      // changes have been applied to the saved configuration
      return source;
    }

    BehaviorStrategy.prototype.setupUrl = function(config, baseUrl, downloadItems, downloadAgendaMetadata, appendMoreKeywords)
    {
      var base = baseUrl;
      // this is the default join character used for urls
      var firstJoinCharacter = '';

      if (base != null)
      {
        // the joining character depends on first or not parameter
        var isFirst = true;

        if (downloadItems || downloadAgendaMetadata)
        {
        	// this is the join character used when dealing with service urls
			firstJoinCharacter = '?';

			if (base.slice(-1) == "/")
			{
				// make sure the base is not already ending with a slash, as one will be added automatically
				base = base.substring(0, base.length - 1);
			}

			if (downloadItems)
			{
				// this is the base for downloading items
				base = [base, this.urlItemsBody].join('');
			}
			else
			{
				// this is the base for downloading calendar metadata about items
				base = [base, this.urlCalendarMetadataBody].join('');
			}
        }
        else
        {
        	// default behavior for urls
        	if (base.slice(-1) != "/" && base.slice(-1) != "!")
	        {
	        	// we expect slash or ! as a valid ending for a base
	        	// if not found add slash
	          	base = [base, "/"].join('');
	        }
        }

        // temporary container for attaching the content to the label
        var tempMiddle;

        if(config.organizationId != null)
        {
        	// setting is configured - reflect this in all urls
	        tempMiddle = null;
	        tempMiddle = [this.urlOrganizationIdLabel, config.organizationId].join('=');

			// append to the base
			if (isFirst)
			{
			base = [base, tempMiddle].join(firstJoinCharacter);
			isFirst = false;
			}
			else
			{
			base = [base, tempMiddle].join('&');
			}
        }

        if(config.userId != null)
        {
          tempMiddle = null;
          tempMiddle = [this.urlUserIdLabel, config.userId].join('=');

          if (isFirst)
          {
            base = [base, tempMiddle].join(firstJoinCharacter);
            isFirst = false;
          }
          else
          {
            base = [base, tempMiddle].join('&');
          }
        }

        if(config.selectedStartDate != null && config.selectedEndDate != null)
        {
          if (downloadItems)
          {
          	// these settings only apply to url for downloading items
        	tempMiddle = null;
          	tempMiddle = [this.urlStartDateLabel, config.selectedStartDate.format()].join('=');

            // does not apply to agenda URL
            if (isFirst)
            {
              base = [base, tempMiddle].join(firstJoinCharacter);
              isFirst = false;
            }
            else
            {
              base = [base, tempMiddle].join('&');
            }

          	tempMiddle = null;
          	tempMiddle = [this.urlEndDateLabel, config.selectedEndDate.format()].join('=');

            // does not apply to agenda URL
            if (isFirst)
            {
              base = [base, tempMiddle].join(firstJoinCharacter);
              isFirst = false;
            }
            else
            {
              base = [base, tempMiddle].join('&');
            }
          }
        }

        if(config.searchQuery != null)
        {
          tempMiddle = null;
          tempMiddle = [this.urlSearchQueryLabel, config.searchQuery].join('=');

          if (isFirst)
          {
            base = [base, tempMiddle].join(firstJoinCharacter);
            isFirst = false;
          }
          else
          {
            base = [base, tempMiddle].join('&');
          }
        }

        if(config.currentPage != null && config.maxItems != null)
        {
        	// current page only makes sense coupled with the count of items per page
			tempMiddle = null;
			tempMiddle = [this.urlPageNumberLabel, config.currentPage].join('=');

			if (isFirst)
			{
				base = [base, tempMiddle].join(firstJoinCharacter);
				isFirst = false;
			}
			else
			{
				base = [base, tempMiddle].join('&');
			}
        }

        if(config.maxItems != null)
        {
          tempMiddle = null;
          tempMiddle = [this.urlPageSizeLabel, config.maxItems].join('=');

          if (isFirst)
          {
            base = [base, tempMiddle].join(firstJoinCharacter);
            isFirst = false;
          }
          else
          {
            base = [base, tempMiddle].join('&');
          }
        }

        if (config.coreKeywordIds != null)
        {
          tempMiddle = null;
          // keywords supplied through settings MUST be separated by commas
          tempMiddle = [this.urlKeywordsLabel, config.coreKeywordIds].join('=');

          // append keywords definition without content
          if (isFirst)
          {
            base = [base, tempMiddle].join(firstJoinCharacter);
            isFirst = false;
          }
          else
          {
            base = [base, tempMiddle].join('&');
          }

          if (appendMoreKeywords)
          {
          	// prepare for adding more keywords
            base = [base, ','].join('');
          }
        }
        else if (appendMoreKeywords)
        {
          tempMiddle = null;
          // currently no value so only prepare for adding more keywords
          tempMiddle = [this.urlKeywordsLabel, '='].join('');

          if (isFirst)
          {
            base = [base, tempMiddle].join(firstJoinCharacter);
            isFirst = false;
          }
          else
          {
            base = [base, tempMiddle].join('&');
          }
        }
      }

      return base;
    }

    // creates the request URL for the calender server
    // the request may be :
    // - for calendar data without subdomain (most frequent)
    // - for calendar data with a subdomain (single calendar, less frequent)
    // - for event data without subdomain (when viewing a specific event, triggered by external link only for now)
    // - for event data with a subdomain (similar)
    BehaviorStrategy.prototype.setupCalendarServerUrl = function(config)
    {
      var url;
      var startDate;
      var endDate;

      if (config.calAndEventUID == null)
      {
        // dealing with a time range
        // http://tools.medicine.yale.edu/calendar/?f=l&d=START_DATE&e=END_DATE&output=json
        var serviceUrlBegin;

        // applies to both event and calendar
        if (config.subDomain != null)
        {
          serviceUrlBegin = [ config.serviceUrlBase, config.subDomain, this.urlItemsBodyWithSubDomain].join('');
        }
        else
        {
          serviceUrlBegin = [ config.serviceUrlBase, config.subDomain, this.urlItemsBody].join('');
        }

        startDate = new Moment(config.selectedDate);

        if (startDate.isValid() == true)
        {
          endDate = new Moment(config.selectedDate);
        }
        else 
        {
            // default init, date is today
            startDate = new Moment();
            endDate = new Moment();
        }

        if (config.displayStyle != this.pagedTemplateNameFirstPage)
        {
          switch (config.relativeOptions)
          {
              case +7:
                // next week : (today + 7) + 7
                startDate.add(7, 'days');
                endDate.add(13, 'days');
              break;
              case -7:
                // previous week : (today - 7) + 7
                startDate.subtract(7, 'days');
                endDate.subtract(1, 'days');
              break;
              case 0:
                // today + 7
                endDate.add(6, 'days');
              break;
              default:
                // selectedDate + 7
                endDate.add(6, 'days');
              break;
          }

          // days are kept, safe to save after changes
          config.selectedDate = startDate.format('YYYY-MM-DD');
        }
        else
        {
          // add one month and then retrieve one day to have the date of the last day of the month
          // the moment library takes care of the variation on the total count of days per month
          switch (config.relativeOptions)
          {
              case +30:
                // from current selected date add a month
                startDate.add(1, 'months');
                // do not save later because the value will be changed to the first of the month
                // needs to be a copy
                config.selectedDate = startDate.format('YYYY-MM-DD');
                endDate.add(1, 'months');
                // download the whole month range
                startDate.startOf('month');
                endDate.endOf('month');
              break;
              case -30:
                startDate.subtract(1, 'months');
                config.selectedDate = startDate.format('YYYY-MM-DD');
                endDate.subtract(1, 'months');
                startDate.startOf('month');
                endDate.endOf('month');
              break;
              case 0:
              default:
                config.selectedDate = startDate.format('YYYY-MM-DD');
                startDate.startOf('month');
                endDate.endOf('month');
              break;
          }
        }

        url = [serviceUrlBegin, startDate.format('YYYY-MM-DD'), this.endDateConnector, endDate.format('YYYY-MM-DD'), this.jsonFormatEnding].join('');
        config.startDate = startDate;
        config.endDate = endDate;
      }
      else
      {
        // dealing with a specific event
        // http://tools.medicine.yale.edu/calendar/event?id=CALENDAR_UID,EVENT_UID&dtstart=START_TIMESTAMP&output=json
        url = [config.serviceUrlBase, this.urlSingleItemBody, config.calAndEventUID, this.jsonFormatEnding].join('');
      }

      return url;
    }

    return BehaviorStrategy;
};