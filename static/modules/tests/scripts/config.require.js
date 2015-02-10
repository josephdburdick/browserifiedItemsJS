// Define a reference name for modules, and paths to load the module files.
require.config({
  // The reference path is the HTML file where it is included.
  baseUrl: '../../../modules/scripts',
  paths: {
    'jasmine': 'vendor/jasmine',
    'jasmine-html': 'vendor/jasmine-html',
    'jasmine-jquery': 'vendor/jasmine-jquery',
    'boot':'vendor/boot',
    'jquery': 'vendor/jquery',
    'jquery-ui': 'vendor/jquery-ui',
    'knockout': 'vendor/knockout',
    'knockout-jquery' : 'vendor/knockout-jqueryui',
    'knockout-jquery/dialog' : 'vendor/dialog',
    'moment': 'vendor/moment',
    'underscore': 'vendor/underscore',
    'sinon': 'vendor/sinon',
    'lolex': 'vendor/lolex',
    'calendarContainer/jCal2Display': 'calendar/viewmodel/jCal2Display/CalendarContainer',
    'calendarEventList/jCal2Display': 'calendar/viewmodel/jCal2Display/CalendarEventList',
    'calendarEvent/jCal2Display': 'calendar/viewmodel/jCal2Display/CalendarEvent',
    'calendarContainer/json2jCal': 'calendar/viewmodel/json2jCal/CalendarContainer',
    'calendarEventList/json2jCal': 'calendar/viewmodel/json2jCal/CalendarEventList',
    'calendarEvent/json2jCal': 'calendar/viewmodel/json2jCal/CalendarEvent',
    'calendarProperty/json2jCal': 'calendar/viewmodel/json2jCal/Property',
    'calendarPropertyDetails/json2jCal': 'calendar/viewmodel/json2jCal/PropertyDetails',
    'calendarEventListeners': 'calendar/ui/eventListeners',
    'calendarConstants': 'calendar/constants',
    'calendarLayout': '../tests/scripts/mocks/calendar/layoutMock',
    'helpers': 'common/utils/helpers',
    'domManager': '../tests/scripts/mocks/domManagerMock',
    'newsConstants': 'news/constants',
    'newsEntry': 'news/viewmodel/NewsEntry',
    'newsList': 'news/viewmodel/NewsList',
    'newsLayout': '../tests/scripts/mocks/news/layoutMock',
    'newsEventListeners': 'news/ui/eventListeners',
    'itemsController': 'common/controller',
    'itemsFactory': 'common/viewmodel/ItemsFactory',
    'itemsBehavior' : 'common/viewmodel/BehaviorStrategy',
    'layoutFactory' : 'common/gui/LayoutFactory',
    'uiMain' : 'common/UI/main',
    'modernizr' : 'vendor/joe/modernizr',
    'bootstrap': 'vendor/joe/bootstrap.min',
    'picturefill': 'vendor/joe/picturefill.min',
    'bootstrapSelect': 'vendor/joe/bootstrap-select',
    'jLazyLoad': 'vendor/joe/jquery-lazyloadsrcset',
    'jVisible': 'vendor/joe/jquery.visible',
    'bootstrapDatePicker': 'vendor/joe/bootstrap-datepicker',
    'newsDatePickerManager': '../tests/scripts/mocks/news/datePickerManagerMock',
    'dataFacade': 'common/data/facade'
  },
  // Global variables
  // required to run jasmine-jquery "manually"
   shim: {
        'jasmine': {
        exports: 'jasmine'
      },
      'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmine'
      },
      'jasmine-jquery': {
        deps: ['jasmine'],
        exports: 'jasmine'
      },
      'boot': {
        deps: ['jasmine', 'jasmine-html'],
        exports: 'jasmine'
      },
      'lolex': {
        exports: 'lolex'
      }
  }
});

 // Define all of your specs here. These are RequireJS modules.
 // Specs to execute.
  var specs = [
       '../tests/scripts/spec/suites/CalendarSpec',
    '../tests/scripts/spec/suites/jCal2DisplaySpec',
    '../tests/scripts/spec/suites/JSON2jCalSpec',
    '../tests/scripts/spec/suites/NewsSpec',
    '../tests/scripts/spec/suites/GlobalSearchSpec'
  ];

//requirejs(['spec/testAppManual']);

  // Load Jasmine - This will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use the
  // AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
  // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
  // initialize the HTML Reporter and execute the environment.
  require(['boot'], function () {

    // Load the specs
    require(specs, function () {

      // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
      window.onload();
    });
  });