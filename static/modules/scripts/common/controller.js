module.exports = function(MyApp)
{
    'use strict';
    
    var $ = MyApp.vendor.jquery;
    var _ = MyApp.vendor.underscore;
    var facade = MyApp.common.dataFacade;
    var LayoutFactory = MyApp.common.LayoutFactory;
    var domManager = MyApp.common.domManager;
    var ItemsFactory = MyApp.common.ItemsFactory;

    function Controller()
    {
        var self = this;

        self.itemsFactory = new ItemsFactory();
        self.layoutFactory = new LayoutFactory();

        // array containing all news overview indexes that were set up
        self.initDone = [];

        self.errorMessage = null;

        self.initSingleItemModalDone = false;
    }

    function parseConfig(settings, domLinksElement, controllerReference, itemType)
    {
      var config = {};

      if (itemType == null)
      {
        if (settings.itemType != null)
        {
          itemType = settings.itemType;
        }
        else if (settings.calAndEventUID != null || settings.eventViewModel != null)
        {
          itemType = 'calendarEvent';
        } 
      }

      switch (itemType)
      {
        case 'globalSearch':
          config.key = 'globalSearch';
          config.itemType = settings.itemType;
          config.searchQuery = settings.searchQuery;
        break;
        case 'news':
          var constants = MyApp.news.constants;
          controllerReference.errorMessage = constants.error.retrieveDataFail;
          config.key = settings[constants.config.key];
          config.displayStyle = settings[constants.config.displayStyle];
          config.maxItems = settings[constants.config.maxItemsDisplayed];
          config.organizationId = settings[constants.config.organizationId];
          config.coreKeywordIds = settings[constants.config.coreKeywordIds];
          config.serviceUrlBase = settings[constants.config.serviceUrlBase];
          config.currentPage = settings[constants.config.currentPage];
          config.userId = settings[constants.config.userId];
          config.selectedDate = settings[constants.config.selectedDate];
          config.relativeOptions = settings[constants.config.relativeOptions];
          config.searchQuery = settings[constants.config.searchQuery];

          if (domLinksElement != null)
          {
            config.readMoreBaseLink = domManager.extractLinkValueFromDom(domLinksElement, constants.config.readMoreBaseLink, config.key);
            config.urlBaseForKeywords = domManager.extractLinkValueFromDom(domLinksElement, constants.config.urlBaseForKeywords, config.key);

            if (config.readMoreBaseLink == null || config.urlBaseForKeywords == null)
            {
              console.log(constants.error.retrieveLinksConfigFail);
            }
          }

          if(!_.contains(controllerReference.initDone, config.key))
          {
            if (itemType != null)
            {
              config.itemType = itemType;
            }

            domManager.addLoadingToDom(['#', constants.idNames.newsModuleConfigBegin, config.key].join(''), constants.idNames.newsloadingIdBegin, config.key, constants.uitext.loading);
          }
        break;
        case 'calendar':
        case 'calendarEvent':
          var constants = MyApp.calendar.constants;
          controllerReference.errorMessage = constants.error.retrieveDataFail;
          config.key = settings[constants.config.key];
          config.selectedDate = settings[constants.config.selectedDate];
          config.relativeOptions = settings[constants.config.relativeOptions];
          config.displayStyle = settings[constants.config.displayStyle];
          config.maxItems = settings[constants.config.maxItemsDisplayed];
          config.subDomain = settings[constants.config.subDomain];

          config.eventToDisplay = settings.eventViewModel;

          if (config.selectedDate == null)
          {
            config.selectedDate = settings[constants.config.selectedDateAndTime];
          }

          config.calAndEventUID = settings[constants.config.calAndEventUID];

          if (domLinksElement != null)
          {
            config.readMoreBaseLink = domManager.extractLinkValueFromDom(domLinksElement, constants.config.readMoreBaseLink, config.key);
            if (config.readMoreBaseLink == null)
            {
              console.log(constants.error.retrieveLinksConfigFail);
            }
          }

          if (!_.contains(controllerReference.initDone, config.key))
          {
            if (config.calAndEventUID != null || config.eventToDisplay != null)
            {
              config.itemType = 'calendarEvent';
            } 
            else if (itemType != null)
            {
              config.itemType = itemType;
            }

            if (config.itemType == 'calendarEvent')
            {
              config.key = [config.key, '-event'].join('');
            }

            domManager.addLoadingToDom(['#', constants.idNames.calendarModuleConfigBegin, config.key].join(''), constants.classNames.calendarLoadingIdBegin, config.key, constants.uitext.loading);

            domManager.initKnockoutComponents('daywithentries');
          }
        break;
      }

      return config;
    }

    Controller.prototype.renderItems = function(controller, config)
    {
      if (!_.contains(controller.initDone, config.key))
      {
        controller.initDone.push(config.key);
      }

      var viewModel = controller.itemsFactory.getViewModel(config.key);
      
      if (config.changeDisplayStyle)
      {
        controller.layoutFactory.renderLayout(viewModel, config, controller);
      }
      else
      {
        if (config.itemType == 'calendar')
        {
          controller.layoutFactory.refreshEventBindings(config);
        }
      }
    }

    Controller.prototype.renderSingleItem = function(controller, config)
    {
      controller.itemsFactory.loadSingleItem(config.key, config.itemType, config.eventToDisplay);
      
      // TODO will be replaced by : $('#popup').modal({"backdrop" : "static"})
      controller.itemsFactory.singleItemViewModel.isPopupOpen(true);

      if (controller.initSingleItemModalDone == false)
      {
        controller.layoutFactory.renderModalLayout(controller.itemsFactory.singleItemViewModel, config);
        controller.initSingleItemModalDone = true;
      }

      if (controller.itemsFactory.singleItemViewModel != null)
      {
        var calConfig = {};
        calConfig.key = config.key.slice(0, -6);
        calConfig.selectedDate = controller.itemsFactory.singleItemViewModel.startDate();
        calConfig.itemType = 'calendar';
        if (config.displayStyle != null)
        {
          calConfig.displayStyle = config.displayStyle;
        }
        
        if (config.maxItems != null)
        {
          calConfig.maxItems = config.maxItems;
        }

        if (config.subDomain != null)
        {
          calConfig.subDomain = config.subDomain;
        }
        
        controller.displayItems(calConfig, null, calConfig.itemType);
      }
    }

    Controller.prototype.displayItems = function(settings, domLinksElement, itemType)
    {
      if (settings != null)
      {
        var controller = this;

        if (itemType == null && settings.key != null)
        {
          // retrieve from existing configuration
          itemType = controller.itemsFactory.configs[settings.key].itemType;
        }

        var config = parseConfig(settings, domLinksElement, controller, itemType);

        controller.itemsFactory.configure(config);
        config = controller.itemsFactory.getConfiguration(config.key);

        switch (config.itemType)
        {
          case 'globalSearch':
            var singleConfig;
            // only if some params have changed
            Object.keys(controller.itemsFactory.configs).forEach( function(key) {
              singleConfig = controller.itemsFactory.configs[key];

              // initial call won't contain any params
              switch (singleConfig.itemType)
              {
                case 'calendar':
                break;
                case 'calendarEvent':
                //ignore
                break;
                case 'news':
                  // search params to apply is a case by case
                  controller.displayItems({'key':singleConfig.key, 'searchQuery':config.searchQuery}, null, singleConfig.itemType);
                break;
                case 'faculty':
                break;
              }
            });
          break;
          case 'calendarEvent':
            if (config.eventToDisplay != null)
            {
              // the details of the event were embedded in the configuration
              // hack to overcome limitiations of current calendar server implementation
              // should be removed in the upgrade, when only the events' summaries get downloaded at first
              
              // no call to calendar data server
              controller.itemsFactory.loadSingleItem(config.key, config.itemType, config.eventToDisplay);

              if (controller.initSingleItemModalDone == false)
              {
                controller.layoutFactory.renderModalLayout(controller.itemsFactory.singleItemViewModel, config);
                controller.initSingleItemModalDone = true;
              }
              else
              {
                controller.itemsFactory.singleItemViewModel.isPopupOpen(true);
              }
            }
            else
            {
              facade
              .getServerData(config.url, config.key, controller.itemsFactory.itemsLoaded.bind(controller.itemsFactory), controller, controller.errorMessage)
              .then(
                $.when(controller.itemsFactory.ready(config.key))
                .done(function () {controller.renderSingleItem(controller, config); })
              );
            }
          break;
          default:
            if (config.loadAgendaMetadata)
            {
              // bind() will set the reference returned by "this" in the callback
              facade
              .getServerData(config.urlAgendaMetadata, config.key, controller.itemsFactory.agendaMetadataLoaded.bind(controller.itemsFactory), controller, controller.errorMessage);
            }

            if (config.loadItems)
            {
              // make sure the orchestrated tasks wait for the ViewModel to be loaded first
              facade
              .getServerData(config.url, config.key, controller.itemsFactory.itemsLoaded.bind(controller.itemsFactory), controller, controller.errorMessage)
              .then(
                $.when(controller.itemsFactory.ready(config.key))
                .done(function () {controller.renderItems(controller, config); })
              );
            }
          break;
        }
      }
    }

    return Controller;
};