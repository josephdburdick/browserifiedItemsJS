module.exports = function(MyApp) 
{
  var $ = MyApp.vendor.jquery;
  var newsConstants = MyApp.news.constants;
  var calendarConstants = MyApp.calendar.constants;
  var Controller = MyApp.common.ItemsController;
  var uiEventListeners = MyApp.external.uiMain;

  // gets configuration from DOM
  // calls controller
	'use strict';

  $(document).ready(function() 
  {
    var atLeastOneFound = false;
    var controller = new Controller();

    // retrieve configuration
    var domConfigurationNews = $(['.', newsConstants.idNames.newsSetupData].join(''));
    var domLinksContainerNews = $(['.', newsConstants.idNames.newsSetupDataLinks].join(''));

    if (domConfigurationNews != null && domConfigurationNews.length > 0 && domLinksContainerNews != null && domLinksContainerNews.length > 0 && domConfigurationNews.length == domLinksContainerNews.length)
    {
      atLeastOneFound = true;

      // when using news-combined as the template, be aware that the next paging chunks should 
      // be displayed using the "news-1-col-text" template
      var config;
      var itemType = 'news';

      for(var x=0;x<domConfigurationNews.length;x++)
      {
        config = JSON.parse($(domConfigurationNews[x]).text());
        $(['.', newsConstants.idNames.newsSetupData].join('')).remove();
        $(['.', newsConstants.idNames.newsSetupDataLinks].join('')).remove();

        if ($.isArray(config))
        {
          for(var y=0;y<config.length;y++)
          {
            controller.displayItems(config[y], domLinksContainerNews, itemType);
          }
        }
        else
        {
          controller.displayItems(config, domLinksContainerNews, itemType);
        }
        config = null;
      }
    }

    var domConfiguration = $(['.', calendarConstants.idNames.calendarSetupData].join(''));
    var domLinksContainer = $(['.', calendarConstants.idNames.calendarSetupDataLinks].join(''));

    if (domConfiguration != null && domConfiguration.length > 0 && domLinksContainer != null && domLinksContainer.length > 0 && domConfiguration.length == domLinksContainer.length)
    {
      atLeastOneFound = true;
 
      // when using news-combined as the template, be aware that the next paging chunks should 
      // be displayed using the "news-1-col-text" template
      var config;
      var itemType = 'calendar';

      for(var x=0;x<domConfiguration.length;x++)
      {
        config = JSON.parse($(domConfiguration[x]).text());
        $(['.', calendarConstants.idNames.calendarSetupData].join('')).remove();

        if ($.isArray(config))
        {
          for(var y=0;y<config.length;y++)
          {
            controller.displayItems(config[y], domLinksContainer, itemType);
          }
        }
        else
        {
          controller.displayItems(config, domLinksContainer, itemType);
        }
        config = null;
      }
    // TODO bootstrap modal :
    // remove knockout-jquery-ui + jquery-ui dependency config.require.js and its appearance in Container
    // remove isPopupOpen in Container
    // add data-toggle and data-target tags to href links that lead to events
    // switch event template used
    }

    if (!atLeastOneFound)
    {
      // call Joe's code if nothing else found
      uiEventListeners.init();
    }
  });
};