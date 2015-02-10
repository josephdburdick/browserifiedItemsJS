define(['knockout','jquery','moment','underscore','calendarConstants'], function(ko, $, Moment, _, constants) 
 {
    'use strict';

    function init(key, controller)
    {
        // Prevent user from unchecking all the checkboxes
        // syntax not working : $('input[type="checkbox"]').on('click',function(e) 
        $(['#', constants.idNames.containerFilterCheckboxes, key].join(''))
        .on('click', '', function (event) 
        {
             // "this" is the element that was clicked
             // get knockout data binded to it
             var context = ko.contextFor(this);
            if (context) 
            {
                atLeastOneCalendarChecked(key);
            }
        });

        // TODO check which browsers need it (NOT chrome)
        // make sure the clearing of the search field triggers Knockout binding
        var searchBox = ['#', constants.idNames.containerFilterSearch, key,' .searchBox'].join('');
        $(searchBox)
        .on('mouseup', function(e)
        {
            var $input = $(this),
            oldValue = $input.val();
            if (oldValue === '')
            {
                return;
            }

            setTimeout(function()
            {
                var newValue = $input.val();
                if (newValue === '')
                {
                    $(searchBox).val('');
                    $(searchBox).trigger('keyup change');
                    $(searchBox).trigger('blur');
                }
            }, 1);
        });
        searchBox = null;

        $(['#', constants.idNames.calendarModuleConfigBegin, key].join(''))
        .on('click', constants.classNames.groupNavigationLinks, function () 
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                if(_.contains(element.classList, constants.classNames.eventLink))
                {
                    controller.displayItems({eventViewModel: context.$data, 
                            selectedDate: context.$data.startDate(), 
                            relativeOptions: 0, 
                            calAndEventUID: [context.$data.sourceEventList.uid(), context.$data.uid()].join(',')});
                }
            }
        });

        $(['#', constants.idNames.calendarModuleConfigBegin, key,' [role="navigation"]'].join(''))
        .on('click', constants.classNames.groupNavigationLinks, function () 
        {
            var element = this;
            var context = ko.contextFor(element);

            if (element != null && context != null)
            {
                if (_.contains(element.classList,constants.classNames.todayLink))
                {
                    // today has to be specified explicitely
                    controller.displayItems({key: context.$data.key(),
                                             selectedDate: new Moment(), 
                                             relativeOptions: 0});
                } 
                else if (_.contains(element.classList,constants.classNames.specificDateLink))
                {
                    controller.displayItems({key: context.$data.key(),
                                             selectedDate: '02/13/2015',
                                             relativeOptions: 0});
                }
                else if(_.contains(element.classList,constants.classNames.previousWeekLink))
                {
                    controller.displayItems({key: context.$data.key(), 
                        relativeOptions: -7});
                } 
                else if(_.contains(element.classList,constants.classNames.nextWeekLink))
                {
                    controller.displayItems({key: context.$data.key(),
                                 relativeOptions: 7});
                }
                else if(_.contains(element.classList,constants.classNames.previousMonthLink))
                {
                    controller.displayItems({key: context.$data.key(), 
                        relativeOptions: -30});
                } 
                else if(_.contains(element.classList,constants.classNames.nextMonthLink))
                {
                    controller.displayItems({key: context.$data.key(),
                                 relativeOptions: 30});
                }
            }
        });
    };

    // counts the amount of checked and unchecked checkboxes
    // enables/disables accordingly
    function atLeastOneCalendarChecked(key)
    {
        var checkboxes = ['#', constants.idNames.containerFilterCheckboxes, key,' [role="filters"]'].join('');
        var selectedCheckboxes = ['#', constants.idNames.containerFilterCheckboxes, key,' [role="filters"]:checked'].join('');

        $(checkboxes).attr('disabled', false);

        if($(selectedCheckboxes).length == 1)
        {
             $(selectedCheckboxes).attr('disabled', true);
        }
        else if($(selectedCheckboxes).length == 0)
        {
            if($(checkboxes).length > 0)
            {
                $(checkboxes)[0].checked = true;
                $(checkboxes)[0].disabled = true;
            }
        }

        selectedCheckboxes = null;
        checkboxes = null;
    };

    return {
        init: init,
        refresh: atLeastOneCalendarChecked
    };
});