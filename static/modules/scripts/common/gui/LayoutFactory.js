module.exports = function(MyApp)
{
	'use strict';

	function LayoutFactory()
	{
		var self = this;
	}

	function getLayoutHelper(key, itemType)
  	{
	    var item;

	    switch(itemType)
	    {
	      case "news":
	        item = MyApp.news.layout;
	      break;
	      case "calendar":
	      case "calendarEvent":
	      	item = MyApp.calendar.layout;
	      break;
	    }

	    return item;
	}

	function getEventListeners(key, itemType)
  	{
	    var item;

	    switch(itemType)
	    {
	      case "news":
	        item = MyApp.news.eventListeners;
	      break;
	      case "calendar":
	      case "calendarEvent":
	      	item = MyApp.calendar.eventListeners;
	      break;
	    }

	    return item;
	}

	LayoutFactory.prototype.renderLayout = function(viewModel, config, controllerReference)
	{
        getLayoutHelper(config.key, config.itemType).init(viewModel, config.displayStyle, config.key, controllerReference);
	}

	LayoutFactory.prototype.renderModalLayout = function(viewModel, config)
	{
		getLayoutHelper(config.key, config.itemType).initModal(viewModel);
	}

	LayoutFactory.prototype.refreshEventBindings = function(config)
	{
		getEventListeners(config.key, config.itemType).refresh(config.key);
	}

	return LayoutFactory;
};