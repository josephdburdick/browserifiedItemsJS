module.exports = function(MyApp) 
{
    'use strict';

    var ko = MyApp.vendor.knockout;

    function DayWithEntriesViewModel(params) 
    {
        // JS convention - making sure the reference is right.
        var self = this;

        self.year = params.year;
        self.month = params.month;
        self.day = params.day;
        self.parent = params.parent;

        self.count = ko.computed(function() 
        {
            var count;
            if (self.parent.hasEntriesByYearMonthDay() != null 
                && self.parent.hasEntriesByYearMonthDay()[self.year()] != null
                && self.parent.hasEntriesByYearMonthDay()[self.year()][self.month()] != null
                && self.parent.hasEntriesByYearMonthDay()[self.year()][self.month()][self.day] != null)
            {
                count = self.parent.hasEntriesByYearMonthDay()[self.year()][self.month()][self.day];
            }
            else
            {
                count = 0;
            }
            return count;
        });
    }
 
    return {
        viewModel: DayWithEntriesViewModel,
        template: "<div data-bind=\"text: 'The count of ' + year() + '/' + month() + '/' + day + ' is ' + count()\"></div>"
    };
};