module.exports = function(MyApp) 
 {
    'use strict';

    var ko = MyApp.vendor.knockout;
    var Moment = MyApp.vendor.moment;
    var $ = MyApp.vendor.jquery;
    var bootstrap = MyApp.vendor.bootstrap;
    var datePickerManager = MyApp.news.datePickerManager;
    var constants = MyApp.news.constants;

    function init(key, controller)
    {
        // remove previous listeners to not overload functionality
        // scenario not covered : two paged lists of news
        $(['#', constants.idNames.newsIdBegin, key,' [role="menu"]'].join('')).off('click',constants.classNames.countPerPageLinksWithDot);
        $(['#', constants.idNames.newsIdBegin, key,' .', constants.classNames.pagination].join('')).off('click', ['#', constants.idNames.paginationNextId].join(''));
        $(['#', constants.idNames.newsIdBegin, key,' .', constants.classNames.pagination].join('')).off('click', ['#', constants.idNames.paginationPreviousId].join(''));
        $(['#', constants.idNames.newsIdBegin, key,' .', constants.classNames.pagination].join('')).off('click', ['#', constants.idNames.paginationFirstId].join(''));
        $(['#', constants.idNames.newsIdBegin, key,' .', constants.classNames.pagination].join('')).off('click', ['#', constants.idNames.paginationLastId].join(''));

        // change amount of items displayed on the page
        $(['#', constants.idNames.newsIdBegin, key,' [role="menu"]'].join('')).on('click',['.', constants.classNames.countPerPageLinks].join(''), function () 
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                if (_.contains(element.classList,constants.classNames.countPerPageLinks1))
                {
                    controller.displayItems({"key":context.$root.key(),
                                            "maxItemsDisplayed":constants.paging.options.o1});
                } 
                else if (_.contains(element.classList,constants.classNames.countPerPageLinks2))
                {
                    controller.displayItems({"key":context.$root.key(),
                                            "maxItemsDisplayed":constants.paging.options.o2});
                } 
                else if (_.contains(element.classList,constants.classNames.countPerPageLinks3))
                {
                    controller.displayItems({"key":context.$root.key(),
                                            "maxItemsDisplayed":constants.paging.options.o3});
                }
                else if (_.contains(element.classList,constants.classNames.countPerPageLinks4))
                {
                    controller.displayItems({"key":context.$root.key(),
                                            "maxItemsDisplayed":constants.paging.options.o4});
                }
            }
        });

        // change current page number
        // the DOM item clicked makes this syntax better than the one used above
        $(['#', constants.idNames.newsIdBegin, key,' .', constants.classNames.pagination].join('')).on('click',['#', constants.idNames.paginationNextId].join(''), function () 
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                controller.displayItems({"key": context.$root.key(),
                                        "currentPage": context.$root.currentPage() + 1});
            }
        });

        $(['#', constants.idNames.newsIdBegin, key,' .', constants.classNames.pagination].join('')).on('click',['#', constants.idNames.paginationPreviousId].join(''), function () 
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                controller.displayItems({"key": context.$root.key(),
                                        "currentPage": context.$root.currentPage() - 1});
            }
        });

        $(['#', constants.idNames.newsIdBegin, key,' .', constants.classNames.pagination].join('')).on('click',['#', constants.idNames.paginationFirstId].join(''), function () 
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                controller.displayItems({"key": context.$root.key(),
                                        "currentPage": 1});
            }
        });

        $(['#', constants.idNames.newsIdBegin, key,' .', constants.classNames.pagination].join('')).on('click',['#', constants.idNames.paginationLastId].join(''), function () 
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                controller.displayItems({"key": context.$root.key(),
                                        "currentPage": context.$root.totalPages()});
            }
        });

        $(['#', constants.idNames.newsIdBegin, key,' form'].join('')).on('click', '.btn', function(e)
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                controller.displayItems({"key": context.$root.key(),
                                        "searchQuery": $(['#', constants.idNames.newsIdBegin, key,' #search-query'].join('')).val()});
            }
        });

        $(['#', constants.idNames.newsIdBegin, key,' #search-query'].join('')).on('keypress', '', function(e)
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null && e.which == 13)
            {
                controller.displayItems({"key": context.$root.key(),
                                        "searchQuery": $(element).val()});
            }
        });

        $(['#', constants.idNames.newsIdBegin, key,' .search-news--clear-filters'].join('')).on('click', '', function(e)
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                // clear ui
                $(['#', constants.idNames.newsIdBegin, key,' #search-query'].join('')).val('');
                controller.displayItems({"key": context.$root.key(),
                        "selectedDate": null,
                        "searchQuery": null});

                datePickerManager.refresh(context.$root.key(), null);
            }
        });
    }

    return {
        init: init
    };
};