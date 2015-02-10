define(['knockout','moment','underscore', 'jquery','PeopleEntry','peopleConstants'], function(ko, Moment, _, $, PeopleEntry, constants) 
{
	'use strict';

    // A (v)calendars container contains an array of no, one or more (v)calendar(s).
    function peopleList(key) 
	{
        // JS convention - making sure the reference is right.
        var self = this;

        self.loadingDoneFlag = null;

        // text used in the UI
        self.noResult = constants.uitext.noResult;
        self.latestpeople = constants.uitext.latestpeople;
        self.readMore = constants.uitext.readMore;
        self.showing = constants.paging.showing;
        self.peopleTitle = constants.uitext.peopleTitle;
        self.searchTitle = constants.uitext.searchTitle;
        self.filtersTitle = constants.uitext.filtersTitle;
        self.showFilters = constants.uitext.showFilters;
        self.clearFilters = constants.uitext.clearFilters;
        self.searchAllLabel = constants.uitext.searchAllLabel;
        self.peopleAllLabel = constants.uitext.peopleAllLabel;

        // flag to distinguish between constructor and refresh of data
        self.initDone = ko.observable(false);
        self.initAgendaDone = ko.observable(false);

        // flag used to make sure that the UI is reloaded too
        // when data is filtered or refreshed
        self.triggerRepaintData = ko.observable(0);

        // is used by children to create read more links of people items
        self.readMoreBaseLink = ko.observable();

        // label displayed on top of the list, unless it is on the side
        self.name = ko.observable(constants.recentpeople);

        // when refresh event triggered - needs to know "identity" of calendar
        self.key = ko.observable(key);

        // init to function needed computed properties, values are populated later
        self.people = ko.observableArray();

        self.maxItems = ko.observable();

        self.morepeopleLink = ko.observable();

        // slices allow to group chunks of data and have specific treatments applied to them
        self.slices = ko.observableArray();
        // per default there is only one slice will all the items in it
        self.slices.push([0,null]);

        self.currentPage = ko.observable(1);

        self.totalPages = ko.observable(1);

        self.formattedPage = ko.computed(function()
        {
            return [constants.paging.begin, 
                    self.currentPage(), 
                    constants.paging.middle, 
                    self.totalPages()].join('');
        });

        self.allPeople = ko.computed(function()
        {
            var filteredPeople = [];

            if (self.people() != null && self.triggerRepaintData() != null)
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
                            sliceEnd = self.people().length + 1;
                        }
                    }
                    
                    // console.log(sliceBegin + " to " + sliceEnd);
                    filteredPeople.push(self.people().slice(sliceBegin,sliceEnd));
                    countSliced = countSliced + sliceEnd - sliceBegin;
                    // console.log(" sliced " + countSliced);
                    sliceBegin = null;
                    sliceEnd = null;
                }
            }

            return filteredPeople;
        });
	}

    // a reload of data is the same as a refresh
    function reload(container, newpeopleData, maxItems) 
    {
        refreshValues(container, newpeopleData);
    };

    // Parse input and re-assign values to existing containers.
    function refreshValues(container, peopleData) 
    {
        // syntax to refresh the observable data : assign new value using varName(newValue)

        // Make sure there is data to parse.
        if(peopleData != null && $.isArray(peopleData)) 
        {   
            try 
            {
                container.people(ko.utils.arrayMap(peopleData, function(entry){return new PeopleEntry(entry, container);}));
            } 
            catch(err)
            {
                container.people();
            }
        }
        else
        {
            if(peopleData != null && peopleData.collection != null && $.isArray(peopleData.collection)) 
            {   
                try 
                {
                    container.people(ko.utils.arrayMap(peopleData.collection, function(entry){return new PeopleEntry(entry, container);}));
                } 
                catch(err)
                {
                    container.people();
                }
            }
            else
            {
                container.people();
            }
        }

        if (container.loadingDoneFlag != null)
        {
            container.loadingDoneFlag.resolve(true);
        }

        if (peopleData != null && peopleData.totalItemCount != null)
        {
            var total;
            if (container.maxItems() != null)
            {
                total = Math.ceil(peopleData.totalItemCount / container.maxItems());

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

    peopleList.prototype.loadAgendaMetadata = function(agendaData, selectedDate)
    {
        if (this.initAgendaDone() == false)
        {
        }
    };

    peopleList.prototype.load = function(peopleData, maxItems, currentPage, readMoreBaseLink, keywordBaseUrl, coreKeywords, deferredLoading) 
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
            
            // bindings were init as empty
            refreshValues(this,peopleData);

            this.initDone(true);
        }
        else
        {
            reload(this, peopleData, maxItemsValue, currentPage);
        }
    };

    return peopleList;
});