module.exports = function(MyApp)
{
	'use strict';

  var Moment = MyApp.vendor.moment;
  var Behavior = MyApp.common.ItemsBehavior;

	function ItemsFactory()
	{
		var self = this;

		// the reference that will be updated to refresh KO bindings
    self.viewModels = [];

    // keep track of the initial configuration that contains most of the parameters
    // used throughout the lifetime of the application
    self.configs = [];

    // handling and update of the configuration settings
    self.behaviors = [];

    // promises on which the controller orchestrates the layout rendering
    self.deferredLoadings = [];

    // only one modal at a time
    // the reference will be updated to refresh KO bindings
    self.singleItemViewModel = null;
    self.singleItemType = null;
	}

	ItemsFactory.prototype.getConfiguration = function(key)
	{
		return this.configs[key];
	}

	ItemsFactory.prototype.getViewModel = function(key)
	{
		return this.viewModels[key];
	}

	ItemsFactory.prototype.ready = function(key)
	{
    // always overwrite and create a new one
    this.deferredLoadings[key] = $.Deferred();

		return this.deferredLoadings[key].promise();
	}

  function createItem(key, itemType)
  {
    var item;

    switch(itemType)
    {
      case "news":
        // this call only works if the module has been loaded already
        var NewsList = MyApp.news.viewmodel.NewsList;
        item = new NewsList(key);
      break;
      case "calendar":
        var Container = MyApp.calendar.viewmodel.jCal2Display.CalendarContainer;
        item = new Container(key);
      break;
      case "calendarEvent":
        var CalendarEvent = MyApp.calendar.viewmodel.jCal2Display.CalendarEvent;
        item = new CalendarEvent();
      break;
    }

    return item;
  }

  ItemsFactory.prototype.agendaMetadataLoaded = function(jsonData, key)
  {
    var config = this.configs[key];

    if (this.viewModels[key] == null)
    {
      this.viewModels[key] = createItem(key, config.itemType);
    }
    
    this.viewModels[key].loadAgendaMetadata(jsonData, this.configs[key].selectedDate);
  }

  ItemsFactory.prototype.itemsLoaded = function(jsonData, key)
  {
    var config = this.configs[key];
    var itemTypeToCreate = config.itemType;

    if (config.itemType == 'calendarEvent')
    {
      // data received from the server is an event in a calendar in a container
      itemTypeToCreate = 'calendar';
    }

    if (this.viewModels[key] == null)
    {
      this.viewModels[key] = createItem(key, itemTypeToCreate);
    }

    switch (config.itemType)
    {
      case 'calendar':
        var jsonContainer = MyApp.calendar.viewmodel.json2jCal.CalendarContainer;
        var interfaceContainer = new jsonContainer(jsonData.vcalendars);
        var jCalData = interfaceContainer.jCalExport();

        // TODO make sure that selected date parameter is null when template not agenda one
        this.viewModels[config.key].load($.parseJSON(jCalData), config.maxItems, config.readMoreBaseLink, true, config.selectedDate, this.deferredLoadings[key]);
      break;
      case 'calendarEvent':
        var jsonContainer = MyApp.calendar.viewmodel.json2jCal.CalendarContainer;
        // the server does not include a vcalendars container when requested for a single event
        var interfaceContainer = new jsonContainer(jsonData);
        var jCalData = interfaceContainer.jCalExport();

        this.viewModels[config.key].load($.parseJSON(jCalData), config.maxItems, config.readMoreBaseLink, true, config.selectedDate, this.deferredLoadings[key]);
      break;
      default:
        this.viewModels[key].load(jsonData, config.maxItems, config.currentPage, config.readMoreBaseLink, config.urlBaseForKeywords, config.coreKeywordIds, this.deferredLoadings[key]);
      break;
    }

    this.configs[key].loadDone = true;
  }

  ItemsFactory.prototype.loadSingleItem = function(key, itemType, viewModel)
  {
    if ((this.singleItemViewModel == null && this.singleItemType == null) || this.singleItemType != itemType)
    {
      this.singleItemViewModel = createItem(key, itemType);
      this.singleItemType = itemType;
    }

    if (viewModel == null && this.viewModels[key] != null && itemType == 'calendarEvent')
    {
      viewModel = this.viewModels[key].eventLists()[0].events()[0];
    }

    this.singleItemViewModel.loadByCopying(viewModel);
  }

  ItemsFactory.prototype.configure = function(update)
  {
    if (update.itemType != 'globalSearch')
    {
      if (this.configs[update.key] == null)
      {
        if (this.behaviors[update.key] == null)
        {
          this.behaviors[update.key] = new Behavior(update.itemType);
        }

        // save configuration for later re-use
          this.configs[update.key] = this.behaviors[update.key].initialSetup(update);
      }
      else
      {
        this.configs[update.key] = this.behaviors[update.key].refreshSetup(this.configs[update.key], update);
      }

      if (!this.configs[update.key].loadItems)
      {
        switch (update.itemType)
        {
          case 'calendar':
            this.viewModels[update.key].setTimeRangeDisplayed(this.configs[update.key].selectedDate);
          break;
          default:
            // force refresh of Knockout bindings by updating the ViewModel only
            this.viewModels[update.key].load(null, this.configs[update.key].maxItems, this.configs[update.key].currentPage, null, null);
          break;
        }
      }
    }
    else
    {
      this.configs[update.key] = update;
    }
  }

	return ItemsFactory;
};