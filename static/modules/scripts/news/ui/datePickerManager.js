module.exports = function(MyApp)
{
    var ko = MyApp.vendor.knockout;
    var Moment = MyApp.vendor.moment;
    var domManager = MyApp.common.domManager;
    var constants = MyApp.news.constants;
    var controller = MyApp.common.ItemsController;

	function initDatePicker(key, controller)
    {
		ko.bindingHandlers.datepicker = {
            init: function(element, valueAccessor, allBindingsAccessor) 
            {
              //initialize datepicker with some optional options
              //var options = {format: 'mm/dd/yyyy', todayHighlight: true};
              $(element).datepicker(showDaysWithEntriesOptions(valueAccessor()));
              
              //when a user changes the date, update the view model
              ko.utils.registerEventHandler(element, "changeDate", function(event) 
              {
                var value = valueAccessor();
                if (ko.isObservable(value.selectedDate)) 
                {
                    if (event.date != null)
                    {
                        value.selectedDate(event.date);
                        controller.displayItems({"key": key,
                                                 "selectedDate": event.date, 
                                                 "relativeOptions": 1});
                    }
                    else
                    {
                        value.selectedDate(null);
                        controller.displayItems({"key": key,
                                                 "selectedDate": null, 
                                                 "relativeOptions": 0});
                    } 
                }           
              });

              ko.utils.registerEventHandler(element, "changeMonth", function(event) 
              {
                var value = valueAccessor();
                if (ko.isObservable(value.selectedDate)) 
                {
                    value.selectedDate(event.date);
                    controller.displayItems({"key": key,
                                             "selectedDate": event.date, 
                                             "relativeOptions": 30});
                    }                
              });

              ko.utils.registerEventHandler(element, "changeYear", function(event) 
              {
                var value = valueAccessor();
                if (ko.isObservable(value.selectedDate)) 
                {
                    value.selectedDate(event.date);
                    controller.displayItems({"key": key,
                                             "selectedDate": event.date, 
                                             "relativeOptions": 365});
                    }          
              });
            },
            update: function(element, valueAccessor)   
            {
                var widget = $(element).data("datepicker");
                 //when the view model is updated, update the widget
                if (widget) 
                {
                    widget.setValue();            
                }
            }
        };
    }

    function showDaysWithEntriesOptions(viewModel)
    {
        var firstYear;
        var lastYear = viewModel.hasEntriesByYearMonthDay().length;

        for(var y1=0;y1<viewModel.hasEntriesByYearMonthDay().length;y1++)
        {
            if(firstYear == null)
            {
                if (viewModel.hasEntriesByYearMonthDay()[y1] != null)
                {
                    firstYear = [y1].join('');
                }
            }
        }

        // do not provide today functionality because today may be disabled (no data)
        return {
            format: 'mm/dd/yyyy',
            todayBtn: false,
            clearBtn: false,
            todayHighlight: true,
            startDate: new Date(['01','01',firstYear].join('/')),
            endDate: new Date(['12','31',lastYear].join('/')),
            beforeShowDay: function (date)
            {
                var count;
                // the formats offered by getDate(), getMonth() etc are not the ones expected
                // by the array
                var calDate = new Moment(date);

                if (calDate.format('MM') == new Moment(viewModel.selectedDate()).format('MM'))
                {
                    if (viewModel.hasEntriesByYearMonthDay() != null 
                    && viewModel.hasEntriesByYearMonthDay()[calDate.format('YYYY')] != null
                    && viewModel.hasEntriesByYearMonthDay()[calDate.format('YYYY')][calDate.format('MM')] != null
                    && viewModel.hasEntriesByYearMonthDay()[calDate.format('YYYY')][calDate.format('MM')][calDate.format('DD')] != null)
                    {
                        count = viewModel.hasEntriesByYearMonthDay()[calDate.format('YYYY')][calDate.format('MM')][calDate.format('DD')];
                    }
                    else
                    {
                        count = 0;
                    }
                }
                else
                {
                    count = 0;
                }

                if (count > 0)
                {
                    return {
                      classes: 'active'
                    }
                }
                else
                {
                    return {
                      classes: 'disabled'
                    }
                }
            },
            beforeShowMonth: function (date)
            {
                // alert(date);
            }
        }
    }

    function refreshDatePicker(key, selectedDate)
    {
        if (selectedDate != null)
        {
            var selDate = new Moment(selectedDate);
            // that format has january index 0
            var date = new Date(selDate.format('YYYY'), selDate.format('MM') - 1, selDate.format('DD'));
            $(['#', constants.idNames.newsModuleConfigBegin, key, ' .calendar'].join(''))
            .datepicker('setDate',date);
        }
        else
        {
            $(['#', constants.idNames.newsModuleConfigBegin, key, ' .calendar'].join(''))
            .datepicker('setDate', null);
        }
    }

    return {
        init: initDatePicker,
        refresh: refreshDatePicker
    };
};