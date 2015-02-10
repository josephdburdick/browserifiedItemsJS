define(['knockout','moment','underscore', 'jquery','newsEntry','newsConstants'], function(ko,Moment,_,$,NewsEntry,constants) 
{
	'use strict';

    // A (v)calendars container contains an array of no, one or more (v)calendar(s).
    function NewsList(key) 
	{
        // JS convention - making sure the reference is right.
        var self = this;

        self.loadingDoneFlag = null;

        // text used in the UI
        self.noResult = constants.uitext.noResult;
        self.latestNews = constants.uitext.latestNews;
        self.readMore = constants.uitext.readMore;
        self.tagsLabel = constants.uitext.tagsLabel;
        self.showing = constants.paging.showing;
        self.peopleTitle = constants.uitext.peopleTitle;
        self.tagsTitle = constants.uitext.tagsTitle;
        self.dateTitle = constants.uitext.dateTitle;
        self.searchTitle = constants.uitext.searchTitle;
        self.filtersTitle = constants.uitext.filtersTitle;
        self.showFilters = constants.uitext.showFilters;
        self.clearFilters = constants.uitext.clearFilters;
        self.searchAllLabel = constants.uitext.searchAllLabel;
        self.peopleAllLabel = constants.uitext.peopleAllLabel;
        self.today = constants.uitext.today;
        self.previousWeek = constants.uitext.previousMonth;
        self.nextWeek = constants.uitext.nextMonth;

        // flag to distinguish between constructor and refresh of data
        self.initDone = ko.observable(false);
        self.initAgendaDone = ko.observable(false);

        self.hasEntriesByYearMonthDay = ko.observableArray();

        self.selectedYear = ko.observable();
        self.selectedMonth = ko.observable();
        self.selectedDay = ko.observable();

        self.selectedDate = ko.observable();

        // flag used to make sure that the UI is reloaded too
        // when data is filtered or refreshed
        self.triggerRepaintData = ko.observable(0);

        // is used by children to create read more links of news items
        self.readMoreBaseLink = ko.observable();

        // label displayed on top of the list, unless it is on the side
        self.name = ko.observable(constants.recentNews);

        // when refresh event triggered - needs to know "identity" of calendar
        self.key = ko.observable(key);

        // init to function needed computed properties, values are populated later
        self.news = ko.observableArray();

        self.maxItems = ko.observable();

        self.maxItemsOptions = [constants.paging.options.o1,
                                constants.paging.options.o2,
                                constants.paging.options.o3,
                                constants.paging.options.o4];
        self.maxItemsOptionsClassNames = [];
        self.maxItemsOptionsClassNames[constants.paging.options.o1] = constants.classNames.countPerPageLinks1;
        self.maxItemsOptionsClassNames[constants.paging.options.o2] = constants.classNames.countPerPageLinks2;
        self.maxItemsOptionsClassNames[constants.paging.options.o3] = constants.classNames.countPerPageLinks3;
        self.maxItemsOptionsClassNames[constants.paging.options.o4] = constants.classNames.countPerPageLinks4;
        self.maxItemsOptionsClassNames[null] = constants.classNames.countPerPageLinksAll;

        self.moreNewsLink = ko.observable();
        
        self.keywordBaseUrl = ko.observable();
        self.coreKeywords = ko.observable();

        // slices allow to group chunks of data and have specific treatments applied to them
        self.slices = ko.observableArray();
        // per default there is only one slice will all the items in it
        self.slices.push([0,null]);

        self.currentPage = ko.observable(1);

        self.totalPages = ko.observable(1);

        self.currentItemDisplayedOptions = ko.computed(function(){
            var otherOptions = [];
            var label;

            if (self.maxItems() != null)
            {
                label = [self.maxItems(), constants.paging.perPage].join('')
            }
            else
            {
                label = constants.paging.displayAll;
            }
            // applying attribute class via Knockout OVERWRITES current content
            otherOptions.push([label,
            ['dropdown-toggle',
            constants.classNames.countPerPageLinks, 
            self.maxItemsOptionsClassNames[self.maxItems()]].join(' ')]);

            return otherOptions;
        });


        self.maxItemsOptions = ko.computed(function(){
            var otherOptions = [];
            var label;
            for(var k=0;k<self.maxItemsOptions.length;k++)
            {
                if (self.maxItems() != self.maxItemsOptions[k])
                {
                    if (self.maxItemsOptions[k] != null)
                    {
                        label = [self.maxItemsOptions[k], constants.paging.perPage].join('')
                    }
                    else
                    {
                        label = constants.paging.displayAll;
                    }
                    otherOptions.push([label,
                    [constants.classNames.countPerPageLinks, 
                    self.maxItemsOptionsClassNames[self.maxItemsOptions[k]]].join(' ')]);
                }
            }
            return otherOptions;
        });

        self.formattedPage = ko.computed(function()
        {
            return [constants.paging.begin, 
                    self.currentPage(), 
                    constants.paging.middle, 
                    self.totalPages()].join('');
        });

        self.allNews = ko.computed(function()
        {
            var filteredNews = [];

            if (self.news() != null && self.triggerRepaintData() != null)
            {
                var sliceBegin;
                var sliceEnd;
                var countSliced = 0;

                for(var h=0;h<self.slices().length;h++)
                {
                    if (self.slices()[h][0] != null)
                    {
                        sliceBegin = self.slices()[h][0] -1; // logic starts at 1, code at 0
                    }
                    else
                    {
                        sliceBegin = 0;
                    }

                    if (self.slices()[h][1] != null)
                    {
                        // slice size defined
                        if (self.maxItems() != null )
                        {
                            // there is an upper limit to display
                            if (self.slices()[h][1] + countSliced > self.maxItems())
                            {
                                // the count of items included already plus the new slice is too much
                                sliceEnd = sliceBegin;
                            }
                            else
                            {
                                // the size of the new slice is within boundaries, add
                                sliceEnd = sliceBegin + self.slices()[h][1];
                            }
                        } 
                        else
                        {
                            // there is no limit in display, include all the slice
                            sliceEnd = sliceBegin + self.slices()[h][1]; 
                        }
                    }
                    else
                    {
                        // slice contains everything else
                        if (self.maxItems() != null)
                        {
                            // there is an upper limit to display
                            if (countSliced > self.maxItems())
                            {
                                // the count of items included is already the limit
                                sliceEnd = sliceBegin;
                            }
                            else
                            {
                                // set to the max amount allowed
                                sliceEnd = self.maxItems();
                            }
                        }
                        else
                        {
                            // no limit in display, include all
                            sliceEnd = self.news().length + 1;
                        }
                    }
                    
                    // console.log(sliceBegin + " to " + sliceEnd);
                    filteredNews.push(self.news().slice(sliceBegin,sliceEnd));
                    countSliced = countSliced + sliceEnd - sliceBegin;
                    // console.log(" sliced " + countSliced);
                    sliceBegin = null;
                    sliceEnd = null;
                }
            }

            return filteredNews;
        });

        self.selectedDay = ko.computed(function()
        {
            var day;
            if (self.initDone() && self.selectedDate() != null)
            {
                var selDate = new Moment(self.selectedDate());
                day = selDate.format('DD');
            }
            return day;
        });

        self.selectedMonth = ko.computed(function()
        {
            var month;
            if (self.initDone() && self.selectedDate() != null)
            {
                var selDate = new Moment(self.selectedDate());
                month = selDate.format('MM');
            }
            return month;
        });

        self.selectedYear = ko.computed(function()
        {
            var year;
            if (self.initDone() && self.selectedDate() != null)
            {
                var selDate = new Moment(self.selectedDate());
                year = selDate.format('YYYY');
            }
            return year;
        });
	}

    // takes place when filtering has been removed (and gets restored after)
    function refreshHasEntriesIndex(container, jsonData, selectedDate) 
    {
        // Make sure there is data to parse.
        if(jsonData != null && $.isArray(jsonData.years) && jsonData.years.length > 0) 
        {
            var entriesByYearMonthDay = [];
            var currentDay;
            var currentDayDigits;
            var currentMonth;
            var currentMonthDigits;
            var currentYear;
            var currentYearDigits;

            // loop on received data
            for(var y=0;y<jsonData.years.length;y++)
            {
                currentYear = jsonData.years[y];
                currentYearDigits = new Moment([currentYear.year, '01', '01'].join()).format('YYYY');
                entriesByYearMonthDay[currentYearDigits] = [];
                entriesByYearMonthDay[currentYearDigits]['00'] = [];
                entriesByYearMonthDay[currentYearDigits]['00']['00'] = currentYear.newsCount;

                for(var m=0;m<currentYear.months.length;m++)
                {
                    currentMonth = currentYear.months[m];
                    currentMonthDigits = new Moment(currentMonth.date).format('MM');
                    entriesByYearMonthDay[currentYearDigits][currentMonthDigits] = [];
                    entriesByYearMonthDay[currentYearDigits][currentMonthDigits]['00'] = currentMonth.newsCount;

                    for(var d=0;d<currentMonth.days.length;d++)
                    {
                        currentDay = currentMonth.days[d];
                        currentDayDigits = new Moment(currentDay.date).format('DD');
                        entriesByYearMonthDay[currentYearDigits][currentMonthDigits][currentDayDigits] = currentDay.newsCount;

                        currentDay = null;
                        currentDayDigits = null;
                    }

                    currentMonth = null;
                    currentMonthDigits = null;
                }

                currentYear = null;
            }
            
            container.hasEntriesByYearMonthDay(entriesByYearMonthDay);

            container.initAgendaDone(true);

        }
    };

    // a reload of data is the same as a refresh
    function reload(container, newNewsData, maxItems) 
    {
        refreshValues(container, newNewsData);
    };

    // Parse input and re-assign values to existing containers.
    function refreshValues(container, newsData) 
    {
        // syntax to refresh the observable data : assign new value using varName(newValue)

        // Make sure there is data to parse.
        if(newsData != null && $.isArray(newsData)) 
        {   
            try 
            {
                container.news(ko.utils.arrayMap(newsData, function(entry){return new NewsEntry(entry, container);}));
            } 
            catch(err)
            {
                container.news();
            }
        }
        else
        {
            if(newsData != null && newsData.collection != null && $.isArray(newsData.collection)) 
            {   
                try 
                {
                    container.news(ko.utils.arrayMap(newsData.collection, function(entry){return new NewsEntry(entry, container);}));
                } 
                catch(err)
                {
                    container.news();
                }
            }
            else
            {
                container.news();
            }
        }

        if (container.loadingDoneFlag != null)
        {
            container.loadingDoneFlag.resolve(true);
        }

        if (newsData != null && newsData.totalItemCount != null)
        {
            var total;
            if (container.maxItems() != null)
            {
                total = Math.ceil(newsData.totalItemCount / container.maxItems());

                if (total < 1)
                {
                    total = 1;
                }
            }
            else
            {
                total = 1;
            } 

            // current page was updated first, make sure its value is within threasholds
            if (container.currentPage() > total)
            {
                container.currentPage(total);
            }

            container.totalPages(total);
        }
    };

    NewsList.prototype.loadAgendaMetadata = function(agendaData, selectedDate)
    {
        if (this.initAgendaDone() == false)
        {
            refreshHasEntriesIndex(this, agendaData, selectedDate);
        }

        if (selectedDate != null)
        {
            this.selectedDate(selectedDate);
        }
    };

    NewsList.prototype.load = function(newsData, maxItems, currentPage, readMoreBaseLink, keywordBaseUrl, coreKeywords, deferredLoading) 
    {
        this.loadingDoneFlag = deferredLoading;

        // string to int
        var maxItemsValue = parseInt(maxItems);
        if (isNaN(maxItemsValue))
        {
            maxItemsValue = null;
        }

        this.maxItems(maxItemsValue);

        if (currentPage != null)
        {
            this.currentPage(currentPage);
        }

        if (this.initDone() == false)
        {
            this.readMoreBaseLink(readMoreBaseLink);
            this.keywordBaseUrl(keywordBaseUrl);

            this.coreKeywords(coreKeywords);
            
            // bindings were init as empty
            refreshValues(this,newsData);

            this.initDone(true);
        }
        else
        {
            reload(this, newsData, maxItemsValue, currentPage);
        }
    };

    return NewsList;
});