module.exports = function(MyApp)
{
    'use strict';

    var ko = MyApp.vendor.knockout;
    var Moment = MyApp.vendor.moment;
    var $ = MyApp.vendor.jquery;
    var _ = MyApp.vendor.underscore;
    var constants = MyApp.news.constants;

    // (v)newsEntry
    function NewsEntry(newsData, parent) 
    {
        // JS convention - making sure the reference is right.
        var self = this;
        self.container = parent;

        self.initDone = ko.observable(false);

        // Explicit definitions of properties.
        self.id = ko.observable();
        self.date = ko.observable();
        self.name = ko.observable();
        self.description = ko.observable();
        
        self.image = ko.observable();

        self.tags = ko.observableArray();

        self.url = ko.observable();

        self.formattedDate = ko.computed(function() 
        {
            var value;
            if (self.initDone() == true && self.date() != null)
            {
                // Use of external library
                // Output example : "Wednesday, October 8th"
                value = new Moment(self.date()).format('dddd, MMMM Do');
            }
            return value;
        });

        // Init properties
        refreshValues(self,newsData);

        self.initDone(true);
    }

    // Parse input and assign values.
    function refreshValues(newsEntry,data)
    {
        // Make sure there is data to parse.
        //  && $.isArray(data) && data.length > 0
        if(data != null) 
        {
            // Uses a helper method.
            newsEntry.id(data.newsId);
            newsEntry.date(data.articleDate);
            newsEntry.name(data.title);
            newsEntry.description(data.summary);
            newsEntry.image(data.image);

            newsEntry.url([newsEntry.container.readMoreBaseLink(), newsEntry.id()].join(''));
            
            // There may be none, one or more tags.
            // Several tags would be contained in an array.
            // A single tag would be in a flat string.
            if(data.organizations != null && data.organizations[0].keywords != null)
            {
                var temp = [];
                for(var r=0;r<data.organizations[0].keywords.length;r++)
                {
                    if (data.organizations[0].keywords[r] != null)
                    {
                        temp.push({label: data.organizations[0].keywords[r].name, id: data.organizations[0].keywords[r].keywordId});
                    }
                }

                for(var r=0;r<temp.length;r++)
                {
                    // the check is not made on the URL in case the service URL also contains numbers
                    if (newsEntry.container.coreKeywords().indexOf(temp[r].id) < 0)
                    {
                        // make sure the keyword id is not already included in the base url
                        newsEntry.tags.push([temp[r].label, newsEntry.container.keywordBaseUrl() + temp[r].id]);
                    }
                    else
                    {
                        // the keyword is not being added because it's already there
                        // remove the last comma
                        // this scenario only happens if there is at least one keyword listed already
                        newsEntry.tags.push([temp[r].label, 
                                            newsEntry.container.keywordBaseUrl().substring(0, newsEntry.container.keywordBaseUrl().length -1)]);
                    }
                }
            }
        }
    }

    NewsEntry.prototype.load = function(newsData) 
    {
        refreshValues(this,newsData);
    }
    
    return NewsEntry;
};