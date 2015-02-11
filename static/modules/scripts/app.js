var MyApp = {};

// all of this gets shimmed from package.json and bower components
MyApp.vendor = {};
MyApp.vendor.jquery = require('jquery');
var jQuery = require('jquery');
global.jQuery = jQuery;
global.$ = jQuery;
MyApp.vendor.jqueryui = require('jquery-ui');
MyApp.vendor.knockout = require('knockout');
//MyApp.vendor.knockoutjquerydialog = require('./vendor/dialog');
MyApp.vendor.moment = require('moment');
MyApp.vendor.underscore = require('underscore');
global.Modernizr = require('browsernizr');
MyApp.vendor.modernizr = require('browsernizr'); //modernizr for browserify
MyApp.vendor.bootstrap = require('bootstrap');
MyApp.vendor.bootstrapSelect = require('bootstrap-select');
MyApp.vendor.jLazyLoad = require('./vendor/joe/jquery-lazyloadsrcset');
MyApp.vendor.bootstrapDatePicker = require('bootstrap-datepicker');
MyApp.vendor.picturefill = require('picturefill');
MyApp.vendor.jVisible = require('./vendor/joe/jquery.visible');

// joe's code... TBD
MyApp.external = {};
MyApp.external.uiMain = require('./common/UI/main')(MyApp);

MyApp.calendar = {};
MyApp.calendar.constants = require('./calendar/constants')();

MyApp.news = {};
MyApp.news.constants = require('./news/constants')();

MyApp.common = {};
MyApp.common.components = {};
MyApp.common.components.dayWithEntries = require('./common/components/dayWithEntriesComponent')(MyApp);
MyApp.common.helpers = require('./common/utils/helpers')(MyApp);
MyApp.common.dataFacade = require('./common/data/facade')(MyApp);
MyApp.common.domManager = require('./common/gui/domManager')(MyApp);

MyApp.calendar.viewmodel = {};
MyApp.calendar.viewmodel.json2jCal = {};
MyApp.calendar.viewmodel.json2jCal.PropertyDetails = require('./calendar/viewmodel/json2jCal/PropertyDetails')();
MyApp.calendar.viewmodel.json2jCal.Property = require('./calendar/viewmodel/json2jCal/Property')(MyApp);
MyApp.calendar.viewmodel.json2jCal.CalendarEvent = require('./calendar/viewmodel/json2jCal/CalendarEvent')(MyApp);
MyApp.calendar.viewmodel.json2jCal.CalendarEventList = require('./calendar/viewmodel/json2jCal/CalendarEventList')(MyApp);
MyApp.calendar.viewmodel.json2jCal.CalendarContainer = require('./calendar/viewmodel/json2jCal/CalendarContainer')(MyApp);
MyApp.calendar.viewmodel.jCal2Display = {};
MyApp.calendar.viewmodel.jCal2Display.CalendarEvent = require('./calendar/viewmodel/jCal2Display/CalendarEvent')(MyApp);
MyApp.calendar.viewmodel.jCal2Display.CalendarEventList = require('./calendar/viewmodel/jCal2Display/CalendarEventList')(MyApp);
MyApp.calendar.viewmodel.jCal2Display.CalendarContainer = require('./calendar/viewmodel/jCal2Display/CalendarContainer')(MyApp);
MyApp.calendar.templates = {};
MyApp.calendar.templates.calendarsselect = require('../templates/calendar/calendars-select-template.html');
MyApp.calendar.templates.calendarssearch = require('../templates/calendar/calendars-search-template.html');
MyApp.calendar.templates.calendarsnavigation = require('../templates/calendar/calendars-navigation-template.html');
MyApp.calendar.templates.eventdetails = require('../templates/calendar/event-details-template.html');
MyApp.calendar.templates.eventstable = require('../templates/calendar/events-table-template.html');
MyApp.calendar.templates.eventstablelist = require('../templates/calendar/events-table-list-template.html');
MyApp.calendar.templates.eventslistagenda = require('../templates/calendar/events-list-agenda-template.html');
MyApp.calendar.templates.eventslistspeaker = require('../templates/calendar/events-list-speaker-template.html');
MyApp.calendar.templates.eventslistshortlocation = require('../templates/calendar/events-list-shortlocationname-template.html');
MyApp.calendar.templates.eventslistthumbnails = require('../templates/calendar/events-list-thumbnails-template.html');

MyApp.calendar.eventListeners = require('./calendar/ui/eventListeners')(MyApp);
MyApp.calendar.layout = require('./calendar/ui/layout')(MyApp);

MyApp.news.viewmodel = {};
MyApp.news.viewmodel.NewsEntry = require('./news/viewmodel/NewsEntry')(MyApp);
MyApp.news.viewmodel.NewsList = require('./news/viewmodel/NewsList')(MyApp);
MyApp.news.templates = {};
MyApp.news.templates.news1colhighlight = require('../templates/news/news-1-col-highlight-template.html');
MyApp.news.templates.news2colhighlight = require('../templates/news/news-2-col-highlight-template.html');
MyApp.news.templates.news2coltext = require('../templates/news/news-2-col-text-template.html');
MyApp.news.templates.news2colthumbnails = require('../templates/news/news-2-col-thumbnails-template.html');
MyApp.news.templates.newscombined = require('../templates/news/news-combined-template.html');
MyApp.news.templates.newscombinedfilter = require('../templates/news/news-combined-filter-template.html');
MyApp.news.templates.newsgridfull = require('../templates/news/news-grid-full-template.html');
MyApp.news.templates.newssidetext = require('../templates/news/news-side-text-template.html');
MyApp.news.templates.newssidethumbnails = require('../templates/news/news-side-thumbnails-template.html');
MyApp.news.templates.news1coltextpaging = require('../templates/news/news-1-col-text-paging-template.html');
MyApp.news.templates.news1colhighlight = require('../templates/news/news-1-col-highlight-template.html');
MyApp.news.datePickerManager = require('./news/ui/datePickerManager')(MyApp);
MyApp.news.eventListeners = require('./news/ui/eventListeners')(MyApp);
MyApp.news.layout = require('./news/ui/layout')(MyApp);

MyApp.common.ItemsBehavior = require('./common/viewmodel/BehaviorStrategy')(MyApp);
MyApp.common.ItemsFactory = require('./common/viewmodel/ItemsFactory')(MyApp);
MyApp.common.LayoutFactory = require('./common/gui/LayoutFactory')(MyApp);
MyApp.common.ItemsController = require('./common/controller')(MyApp);


require('./common/main')(MyApp);