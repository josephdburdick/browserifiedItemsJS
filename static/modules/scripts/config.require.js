// Define a reference name for modules, and paths to load the module files.
require.config({
  // The reference path is the HTML file where it is included.
  baseUrl: 'static/modules/',
  paths: 
  {
    'jquery': 'scripts/vendor/jquery',
    'jquery-ui': 'scripts/vendor/jquery-ui',
    'knockout': 'scripts/vendor/knockout',
    'knockout-jquery' : 'scripts/vendor/knockout-jqueryui',
    'knockout-jquery/dialog' : 'scripts/vendor/dialog',
    'moment': 'scripts/vendor/moment',
    'underscore': 'scripts/vendor/underscore',
    'calendarContainer/jCal2Display': 'scripts/calendar/viewmodel/jCal2Display/CalendarContainer',
    'calendarEventList/jCal2Display': 'scripts/calendar/viewmodel/jCal2Display/CalendarEventList',
    'calendarEvent/jCal2Display': 'scripts/calendar/viewmodel/jCal2Display/CalendarEvent',
    'calendarContainer/json2jCal': 'scripts/calendar/viewmodel/json2jCal/CalendarContainer',
    'calendarEventList/json2jCal': 'scripts/calendar/viewmodel/json2jCal/CalendarEventList',
    'calendarEvent/json2jCal': 'scripts/calendar/viewmodel/json2jCal/CalendarEvent',
    'calendarProperty/json2jCal': 'scripts/calendar/viewmodel/json2jCal/Property',
    'calendarPropertyDetails/json2jCal': 'scripts/calendar/viewmodel/json2jCal/PropertyDetails',
    'calendarEventListeners': 'scripts/calendar/ui/eventListeners',
    'calendarConstants': 'scripts/calendar/constants',
    'calendarLayout': 'scripts/calendar/ui/layout',
    'dayWithEvents': 'scripts/common/components/dayWithEntriesComponent',
    'helpers': 'scripts/common/utils/helpers',
    'domManager': 'scripts/common/gui/domManager',
    'newsConstants': 'scripts/news/constants',
    'newsEntry': 'scripts/news/viewmodel/NewsEntry',
    'newsList': 'scripts/news/viewmodel/NewsList',
    'newsLayout': 'scripts/news/ui/layout',
    'itemsController': 'scripts/common/controller',
    'newsEventListeners': 'scripts/news/ui/eventListeners',
    'itemsMain' : 'scripts/common/main',
    'itemsFactory': 'scripts/common/viewmodel/ItemsFactory',
    'itemsBehavior' : 'scripts/common/viewmodel/BehaviorStrategy',
    'layoutFactory' : 'scripts/common/gui/LayoutFactory',
    'uiMain' : 'scripts/common/UI/main',
    'modernizr' : 'scripts/vendor/joe/modernizr',
    'bootstrap': 'scripts/vendor/joe/bootstrap.min',
    'picturefill': 'scripts/vendor/joe/picturefill.min',
    'bootstrapSelect': 'scripts/vendor/joe/bootstrap-select',
    'jLazyLoad': 'scripts/vendor/joe/jquery-lazyloadsrcset',
    'jVisible': 'scripts/vendor/joe/jquery.visible',
    'bootstrapDatePicker': 'scripts/vendor/joe/bootstrap-datepicker',
    'newsDatePickerManager': 'scripts/news/ui/datePickerManager',
    'dataFacade': 'scripts/common/data/facade'
  }
})

require(['itemsMain']);
