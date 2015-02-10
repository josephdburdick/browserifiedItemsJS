define([], function()
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
	        // this call only works if the module has been loaded already
	        item = require('newsLayout');
	      break;
	      case "calendar":
	      case "calendarEvent":
	      	item = require('calendarLayout');
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
	        // this call only works if the module has been loaded already
	        item = require('newsEventListeners');
	      break;
	      case "calendar":
	      case "calendarEvent":
	      	item = require('calendarEventListeners');
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
});