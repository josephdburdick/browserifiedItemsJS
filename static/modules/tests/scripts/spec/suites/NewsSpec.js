define(['knockout','jquery', 'moment', 'sinon','itemsController','newsConstants','layoutFactory','jasmine','jasmine-jquery'], function(ko, $, Moment, sinon, Controller, constants, layoutHelper) 
{
	var controller;

	function setUpTestingEnvironment(expectedIterations, serverConfig, done)
	{
		var configurationDoneFlag = done;

    	var server = configureFakeServer(serverConfig);

		var currentCount = 0;
		var countExpected = expectedIterations;

		// content of main.js
	    // retrieve configuration
	    var domConfiguration = $(['.', constants.idNames.newsSetupData].join(''));
	    var domLinksContainer = $(['.', constants.idNames.newsSetupDataLinks].join(''));

	    if (domConfiguration != null && domConfiguration.length > 0 && domLinksContainer != null && domLinksContainer.length > 0 && domConfiguration.length == domLinksContainer.length)
	    {
	      //only if the DOM element is found, then the application is started
	      require(['jquery','itemsController','newsConstants','newsList','newsLayout'], function($,Controller,constants) 
	      {
	        // when using news-combined as the template, be aware that the next paging chunks should 
	        // be displayed using the "news-1-col-text" template
	        controller = new Controller();
	        var itemType = 'news';
			spyOn(controller,'renderItems').and.callFake(
			function(params)
			{
				currentCount++;

				var key = params.renderItems.arguments[1].key;
				// spyOn is a mock method that replaces the renderItems() method of the controller
				// so we call here the layout helper to apply the logic to the view model
				// we cannot call renderItems within this loop because of dead looping issues
				new layoutHelper().renderLayout(params.renderItems.arguments[0].itemsFactory.viewModels[key], params.renderItems.arguments[1], params.renderItems.arguments[0]);

				if (countExpected == currentCount)
				{
					configurationDoneFlag();
				}
			});

	        var config;

	        for(var x=0;x<domConfiguration.length;x++)
	        {
	          config = JSON.parse($(domConfiguration[x]).text());
	          $(['.', constants.idNames.newsSetupData].join('')).remove();

	          if ($.isArray(config))
	          {
	            for(var y=0;y<config.length;y++)
	            {
	              controller.displayItems(config[y], domLinksContainer, itemType);
	              server.respond();
	            }
	          }
	          else
	          {
	            controller.displayItems(config, domLinksContainer, itemType);
	            server.respond();
	          }
	          config = null;
	        }
	      });
	    }
	    else
        {
          done();
        }
	}

	function configureFakeServer(responseOption)
	{
		var response;
		var responseDefault = '[{"type":2,"newsId":8413,"userSubmitting":null,"title":"In needle exchange programs, users led the charge against HIV","articleDate":"2014-12-01T13:32:00","publishDate":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}],"taggedUsers":[]},{"type":2,"newsId":8407,"userSubmitting":null,"title":"Why Everything You Think About Aging May Be Wrong","articleDate":"2014-12-01T10:26:00","publishDate":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}],"taggedUsers":[]},{"type":2,"newsId":8406,"userSubmitting":null,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","articleDate":"2014-12-01T08:47:00","publishDate":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}],"taggedUsers":[]},{"type":2,"newsId":8311,"userSubmitting":null,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","articleDate":"2014-11-11T11:58:00","publishDate":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}],"taggedUsers":[]},{"type":2,"newsId":8308,"userSubmitting":null,"title":"Multi-pronged intervention most effective in stemming Ebola","articleDate":"2014-11-11T08:33:00","publishDate":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}],"taggedUsers":[]},{"type":2,"newsId":8306,"userSubmitting":null,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","articleDate":"2014-11-10T14:23:00","publishDate":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}],"taggedUsers":[]},{"type":2,"newsId":8290,"userSubmitting":null,"title":"The palm reading laser scanner that can tell if you REALLY ate your fruit and veg","articleDate":"2014-11-06T11:39:00","publishDate":"2014-11-07T11:41:00","summary":"Uses blue laser light to painlessly scan the skin of a subjects palm • Measures changes in a biomarker known as skin carotenoids","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}],"taggedUsers":[]},{"type":2,"newsId":8279,"userSubmitting":null,"title":"A More Supportive World Can Work Wonders for the Aged","articleDate":"2014-11-05T15:19:00","publishDate":"2014-11-05T15:20:00","summary":"Could seeing only pathology and pathos in seniors be making their situation worse?","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}],"taggedUsers":[]},{"type":2,"newsId":8272,"userSubmitting":null,"title":"Treating schistosomiasis, hitting malaria","articleDate":"2014-11-04T08:15:00","publishDate":"2014-11-05T08:17:00","summary":"Two of the most socioeconomically devastating parasitic diseases in tropical countries — malaria and schistosomiasis — may be closely linked in their infection processes, a recent Yale study has found.","newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":354,"name":"Tropical Disease"},{"keywordId":82,"name":"Modeling"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}],"taggedUsers":[]}]';

		var responseMetadataCalendar = '{"years":[{"year":2001,"months":[{"name":"March","date":"2001-03-01T00:00:00","days":[{"date":"2001-03-21T00:00:00","newsCount":1}],"newsCount":1}],"newsCount":1},{"year":2003,"months":[{"name":"November","date":"2003-11-01T00:00:00","days":[{"date":"2003-11-20T00:00:00","newsCount":1}],"newsCount":1}],"newsCount":1},{"year":2004,"months":[{"name":"March","date":"2004-03-01T00:00:00","days":[{"date":"2004-03-18T00:00:00","newsCount":1}],"newsCount":1},{"name":"September","date":"2004-09-01T00:00:00","days":[{"date":"2004-09-22T00:00:00","newsCount":1}],"newsCount":1}],"newsCount":2},{"year":2005,"months":[{"name":"September","date":"2005-09-01T00:00:00","days":[{"date":"2005-09-26T00:00:00","newsCount":1}],"newsCount":1}],"newsCount":1},{"year":2007,"months":[{"name":"January","date":"2007-01-01T00:00:00","days":[{"date":"2007-01-02T00:00:00","newsCount":1}],"newsCount":1},{"name":"March","date":"2007-03-01T00:00:00","days":[{"date":"2007-03-15T00:00:00","newsCount":1}],"newsCount":1},{"name":"June","date":"2007-06-01T00:00:00","days":[{"date":"2007-06-03T00:00:00","newsCount":1}],"newsCount":1},{"name":"July","date":"2007-07-01T00:00:00","days":[{"date":"2007-07-03T00:00:00","newsCount":1},{"date":"2007-07-18T00:00:00","newsCount":1}],"newsCount":2},{"name":"October","date":"2007-10-01T00:00:00","days":[{"date":"2007-10-22T00:00:00","newsCount":1}],"newsCount":1}],"newsCount":6},{"year":2008,"months":[{"name":"February","date":"2008-02-01T00:00:00","days":[{"date":"2008-02-01T00:00:00","newsCount":1},{"date":"2008-02-11T00:00:00","newsCount":1}],"newsCount":2},{"name":"September","date":"2008-09-01T00:00:00","days":[{"date":"2008-09-22T00:00:00","newsCount":1}],"newsCount":1},{"name":"October","date":"2008-10-01T00:00:00","days":[{"date":"2008-10-06T00:00:00","newsCount":1},{"date":"2008-10-15T00:00:00","newsCount":1}],"newsCount":2},{"name":"December","date":"2008-12-01T00:00:00","days":[{"date":"2008-12-08T00:00:00","newsCount":2},{"date":"2008-12-15T00:00:00","newsCount":1},{"date":"2008-12-17T00:00:00","newsCount":1}],"newsCount":4}],"newsCount":9},{"year":2009,"months":[{"name":"January","date":"2009-01-01T00:00:00","days":[{"date":"2009-01-16T00:00:00","newsCount":1},{"date":"2009-01-20T00:00:00","newsCount":1}],"newsCount":2},{"name":"February","date":"2009-02-01T00:00:00","days":[{"date":"2009-02-10T00:00:00","newsCount":1},{"date":"2009-02-19T00:00:00","newsCount":1}],"newsCount":2},{"name":"March","date":"2009-03-01T00:00:00","days":[{"date":"2009-03-01T00:00:00","newsCount":1},{"date":"2009-03-03T00:00:00","newsCount":1},{"date":"2009-03-25T00:00:00","newsCount":1}],"newsCount":3},{"name":"June","date":"2009-06-01T00:00:00","days":[{"date":"2009-06-22T00:00:00","newsCount":1}],"newsCount":1},{"name":"July","date":"2009-07-01T00:00:00","days":[{"date":"2009-07-01T00:00:00","newsCount":1},{"date":"2009-07-14T00:00:00","newsCount":2},{"date":"2009-07-17T00:00:00","newsCount":1}],"newsCount":4},{"name":"August","date":"2009-08-01T00:00:00","days":[{"date":"2009-08-20T00:00:00","newsCount":2},{"date":"2009-08-21T00:00:00","newsCount":2}],"newsCount":4},{"name":"September","date":"2009-09-01T00:00:00","days":[{"date":"2009-09-09T00:00:00","newsCount":1},{"date":"2009-09-10T00:00:00","newsCount":1},{"date":"2009-09-25T00:00:00","newsCount":2}],"newsCount":4},{"name":"October","date":"2009-10-01T00:00:00","days":[{"date":"2009-10-07T00:00:00","newsCount":1},{"date":"2009-10-08T00:00:00","newsCount":1},{"date":"2009-10-09T00:00:00","newsCount":1},{"date":"2009-10-14T00:00:00","newsCount":1},{"date":"2009-10-17T00:00:00","newsCount":1},{"date":"2009-10-21T00:00:00","newsCount":1},{"date":"2009-10-28T00:00:00","newsCount":1}],"newsCount":7},{"name":"November","date":"2009-11-01T00:00:00","days":[{"date":"2009-11-12T00:00:00","newsCount":1}],"newsCount":1},{"name":"December","date":"2009-12-01T00:00:00","days":[{"date":"2009-12-01T00:00:00","newsCount":1},{"date":"2009-12-02T00:00:00","newsCount":1},{"date":"2009-12-07T00:00:00","newsCount":1},{"date":"2009-12-28T00:00:00","newsCount":1}],"newsCount":4}],"newsCount":32},{"year":2010,"months":[{"name":"January","date":"2010-01-01T00:00:00","days":[{"date":"2010-01-20T00:00:00","newsCount":1}],"newsCount":1},{"name":"February","date":"2010-02-01T00:00:00","days":[{"date":"2010-02-10T00:00:00","newsCount":1},{"date":"2010-02-15T00:00:00","newsCount":2},{"date":"2010-02-16T00:00:00","newsCount":1},{"date":"2010-02-17T00:00:00","newsCount":1},{"date":"2010-02-24T00:00:00","newsCount":3}],"newsCount":8},{"name":"March","date":"2010-03-01T00:00:00","days":[{"date":"2010-03-29T00:00:00","newsCount":1}],"newsCount":1},{"name":"May","date":"2010-05-01T00:00:00","days":[{"date":"2010-05-01T00:00:00","newsCount":1}],"newsCount":1},{"name":"June","date":"2010-06-01T00:00:00","days":[{"date":"2010-06-07T00:00:00","newsCount":1},{"date":"2010-06-08T00:00:00","newsCount":1}],"newsCount":2},{"name":"July","date":"2010-07-01T00:00:00","days":[{"date":"2010-07-09T00:00:00","newsCount":2}],"newsCount":2},{"name":"August","date":"2010-08-01T00:00:00","days":[{"date":"2010-08-01T00:00:00","newsCount":1}],"newsCount":1},{"name":"September","date":"2010-09-01T00:00:00","days":[{"date":"2010-09-01T00:00:00","newsCount":1},{"date":"2010-09-08T00:00:00","newsCount":1},{"date":"2010-09-13T00:00:00","newsCount":1},{"date":"2010-09-27T00:00:00","newsCount":1}],"newsCount":4},{"name":"October","date":"2010-10-01T00:00:00","days":[{"date":"2010-10-07T00:00:00","newsCount":1},{"date":"2010-10-21T00:00:00","newsCount":1}],"newsCount":2},{"name":"November","date":"2010-11-01T00:00:00","days":[{"date":"2010-11-19T00:00:00","newsCount":1}],"newsCount":1},{"name":"December","date":"2010-12-01T00:00:00","days":[{"date":"2010-12-06T00:00:00","newsCount":1}],"newsCount":1}],"newsCount":24},{"year":2011,"months":[{"name":"January","date":"2011-01-01T00:00:00","days":[{"date":"2011-01-06T00:00:00","newsCount":1},{"date":"2011-01-09T00:00:00","newsCount":1},{"date":"2011-01-11T00:00:00","newsCount":1},{"date":"2011-01-13T00:00:00","newsCount":1},{"date":"2011-01-19T00:00:00","newsCount":1}],"newsCount":5},{"name":"February","date":"2011-02-01T00:00:00","days":[{"date":"2011-02-09T00:00:00","newsCount":1}],"newsCount":1},{"name":"March","date":"2011-03-01T00:00:00","days":[{"date":"2011-03-09T00:00:00","newsCount":1},{"date":"2011-03-10T00:00:00","newsCount":1},{"date":"2011-03-15T00:00:00","newsCount":1},{"date":"2011-03-16T00:00:00","newsCount":1},{"date":"2011-03-17T00:00:00","newsCount":1},{"date":"2011-03-30T00:00:00","newsCount":2}],"newsCount":7},{"name":"April","date":"2011-04-01T00:00:00","days":[{"date":"2011-04-11T00:00:00","newsCount":1}],"newsCount":1},{"name":"May","date":"2011-05-01T00:00:00","days":[{"date":"2011-05-05T00:00:00","newsCount":1},{"date":"2011-05-16T00:00:00","newsCount":1},{"date":"2011-05-17T00:00:00","newsCount":1},{"date":"2011-05-31T00:00:00","newsCount":1}],"newsCount":4},{"name":"June","date":"2011-06-01T00:00:00","days":[{"date":"2011-06-20T00:00:00","newsCount":1},{"date":"2011-06-27T00:00:00","newsCount":1},{"date":"2011-06-28T00:00:00","newsCount":1}],"newsCount":3},{"name":"July","date":"2011-07-01T00:00:00","days":[{"date":"2011-07-07T00:00:00","newsCount":1},{"date":"2011-07-08T00:00:00","newsCount":1},{"date":"2011-07-15T00:00:00","newsCount":1},{"date":"2011-07-28T00:00:00","newsCount":1}],"newsCount":4},{"name":"August","date":"2011-08-01T00:00:00","days":[{"date":"2011-08-09T00:00:00","newsCount":1},{"date":"2011-08-22T00:00:00","newsCount":1},{"date":"2011-08-30T00:00:00","newsCount":1}],"newsCount":3},{"name":"September","date":"2011-09-01T00:00:00","days":[{"date":"2011-09-07T00:00:00","newsCount":1},{"date":"2011-09-14T00:00:00","newsCount":1},{"date":"2011-09-19T00:00:00","newsCount":1},{"date":"2011-09-22T00:00:00","newsCount":1}],"newsCount":4},{"name":"October","date":"2011-10-01T00:00:00","days":[{"date":"2011-10-05T00:00:00","newsCount":1},{"date":"2011-10-08T00:00:00","newsCount":1},{"date":"2011-10-10T00:00:00","newsCount":1},{"date":"2011-10-13T00:00:00","newsCount":1},{"date":"2011-10-18T00:00:00","newsCount":1},{"date":"2011-10-24T00:00:00","newsCount":1},{"date":"2011-10-25T00:00:00","newsCount":1},{"date":"2011-10-26T00:00:00","newsCount":1},{"date":"2011-10-27T00:00:00","newsCount":1}],"newsCount":9},{"name":"November","date":"2011-11-01T00:00:00","days":[{"date":"2011-11-01T00:00:00","newsCount":1},{"date":"2011-11-08T00:00:00","newsCount":1},{"date":"2011-11-14T00:00:00","newsCount":1},{"date":"2011-11-15T00:00:00","newsCount":1},{"date":"2011-11-21T00:00:00","newsCount":1},{"date":"2011-11-22T00:00:00","newsCount":1}],"newsCount":6},{"name":"December","date":"2011-12-01T00:00:00","days":[{"date":"2011-12-02T00:00:00","newsCount":1},{"date":"2011-12-12T00:00:00","newsCount":1},{"date":"2011-12-13T00:00:00","newsCount":1},{"date":"2011-12-15T00:00:00","newsCount":1},{"date":"2011-12-16T00:00:00","newsCount":1},{"date":"2011-12-20T00:00:00","newsCount":1}],"newsCount":6}],"newsCount":53},{"year":2012,"months":[{"name":"January","date":"2012-01-01T00:00:00","days":[{"date":"2012-01-09T00:00:00","newsCount":2},{"date":"2012-01-18T00:00:00","newsCount":1},{"date":"2012-01-20T00:00:00","newsCount":1},{"date":"2012-01-27T00:00:00","newsCount":1}],"newsCount":5},{"name":"February","date":"2012-02-01T00:00:00","days":[{"date":"2012-02-01T00:00:00","newsCount":2},{"date":"2012-02-09T00:00:00","newsCount":2},{"date":"2012-02-14T00:00:00","newsCount":1},{"date":"2012-02-16T00:00:00","newsCount":1},{"date":"2012-02-17T00:00:00","newsCount":2},{"date":"2012-02-19T00:00:00","newsCount":1},{"date":"2012-02-23T00:00:00","newsCount":1},{"date":"2012-02-26T00:00:00","newsCount":1}],"newsCount":11},{"name":"March","date":"2012-03-01T00:00:00","days":[{"date":"2012-03-04T00:00:00","newsCount":1},{"date":"2012-03-05T00:00:00","newsCount":1},{"date":"2012-03-06T00:00:00","newsCount":1},{"date":"2012-03-26T00:00:00","newsCount":1},{"date":"2012-03-28T00:00:00","newsCount":1}],"newsCount":5},{"name":"April","date":"2012-04-01T00:00:00","days":[{"date":"2012-04-01T00:00:00","newsCount":1},{"date":"2012-04-04T00:00:00","newsCount":1},{"date":"2012-04-10T00:00:00","newsCount":1},{"date":"2012-04-11T00:00:00","newsCount":1},{"date":"2012-04-26T00:00:00","newsCount":1},{"date":"2012-04-30T00:00:00","newsCount":2}],"newsCount":7},{"name":"June","date":"2012-06-01T00:00:00","days":[{"date":"2012-06-01T00:00:00","newsCount":1},{"date":"2012-06-12T00:00:00","newsCount":1},{"date":"2012-06-15T00:00:00","newsCount":1},{"date":"2012-06-18T00:00:00","newsCount":1},{"date":"2012-06-23T00:00:00","newsCount":1},{"date":"2012-06-25T00:00:00","newsCount":1}],"newsCount":6},{"name":"July","date":"2012-07-01T00:00:00","days":[{"date":"2012-07-05T00:00:00","newsCount":1},{"date":"2012-07-11T00:00:00","newsCount":1},{"date":"2012-07-26T00:00:00","newsCount":1},{"date":"2012-07-30T00:00:00","newsCount":1}],"newsCount":4},{"name":"August","date":"2012-08-01T00:00:00","days":[{"date":"2012-08-01T00:00:00","newsCount":1},{"date":"2012-08-09T00:00:00","newsCount":1}],"newsCount":2},{"name":"September","date":"2012-09-01T00:00:00","days":[{"date":"2012-09-04T00:00:00","newsCount":2},{"date":"2012-09-05T00:00:00","newsCount":1},{"date":"2012-09-06T00:00:00","newsCount":1},{"date":"2012-09-07T00:00:00","newsCount":2},{"date":"2012-09-09T00:00:00","newsCount":1},{"date":"2012-09-10T00:00:00","newsCount":1},{"date":"2012-09-20T00:00:00","newsCount":1},{"date":"2012-09-23T00:00:00","newsCount":1},{"date":"2012-09-24T00:00:00","newsCount":1}],"newsCount":11},{"name":"October","date":"2012-10-01T00:00:00","days":[{"date":"2012-10-16T00:00:00","newsCount":1},{"date":"2012-10-18T00:00:00","newsCount":2},{"date":"2012-10-19T00:00:00","newsCount":2},{"date":"2012-10-22T00:00:00","newsCount":1},{"date":"2012-10-23T00:00:00","newsCount":1},{"date":"2012-10-24T00:00:00","newsCount":2},{"date":"2012-10-31T00:00:00","newsCount":1}],"newsCount":10},{"name":"November","date":"2012-11-01T00:00:00","days":[{"date":"2012-11-01T00:00:00","newsCount":1},{"date":"2012-11-07T00:00:00","newsCount":1},{"date":"2012-11-08T00:00:00","newsCount":1},{"date":"2012-11-13T00:00:00","newsCount":1},{"date":"2012-11-14T00:00:00","newsCount":2},{"date":"2012-11-16T00:00:00","newsCount":1},{"date":"2012-11-19T00:00:00","newsCount":2},{"date":"2012-11-20T00:00:00","newsCount":1},{"date":"2012-11-27T00:00:00","newsCount":1},{"date":"2012-11-30T00:00:00","newsCount":1}],"newsCount":12},{"name":"December","date":"2012-12-01T00:00:00","days":[{"date":"2012-12-05T00:00:00","newsCount":1},{"date":"2012-12-06T00:00:00","newsCount":2},{"date":"2012-12-10T00:00:00","newsCount":1},{"date":"2012-12-19T00:00:00","newsCount":1}],"newsCount":5}],"newsCount":78},{"year":2013,"months":[{"name":"January","date":"2013-01-01T00:00:00","days":[{"date":"2013-01-02T00:00:00","newsCount":1},{"date":"2013-01-03T00:00:00","newsCount":1},{"date":"2013-01-07T00:00:00","newsCount":2},{"date":"2013-01-08T00:00:00","newsCount":1},{"date":"2013-01-09T00:00:00","newsCount":2},{"date":"2013-01-10T00:00:00","newsCount":1},{"date":"2013-01-15T00:00:00","newsCount":2},{"date":"2013-01-16T00:00:00","newsCount":2},{"date":"2013-01-17T00:00:00","newsCount":1},{"date":"2013-01-18T00:00:00","newsCount":1},{"date":"2013-01-22T00:00:00","newsCount":1},{"date":"2013-01-25T00:00:00","newsCount":2},{"date":"2013-01-28T00:00:00","newsCount":1},{"date":"2013-01-30T00:00:00","newsCount":2},{"date":"2013-01-31T00:00:00","newsCount":1}],"newsCount":21},{"name":"February","date":"2013-02-01T00:00:00","days":[{"date":"2013-02-01T00:00:00","newsCount":1},{"date":"2013-02-07T00:00:00","newsCount":1},{"date":"2013-02-08T00:00:00","newsCount":1},{"date":"2013-02-12T00:00:00","newsCount":2},{"date":"2013-02-13T00:00:00","newsCount":1},{"date":"2013-02-25T00:00:00","newsCount":1},{"date":"2013-02-26T00:00:00","newsCount":1},{"date":"2013-02-27T00:00:00","newsCount":1}],"newsCount":9},{"name":"March","date":"2013-03-01T00:00:00","days":[{"date":"2013-03-06T00:00:00","newsCount":1},{"date":"2013-03-07T00:00:00","newsCount":1},{"date":"2013-03-08T00:00:00","newsCount":1},{"date":"2013-03-14T00:00:00","newsCount":2},{"date":"2013-03-15T00:00:00","newsCount":1},{"date":"2013-03-22T00:00:00","newsCount":2},{"date":"2013-03-27T00:00:00","newsCount":1},{"date":"2013-03-28T00:00:00","newsCount":1},{"date":"2013-03-29T00:00:00","newsCount":2}],"newsCount":12},{"name":"April","date":"2013-04-01T00:00:00","days":[{"date":"2013-04-01T00:00:00","newsCount":1},{"date":"2013-04-03T00:00:00","newsCount":2},{"date":"2013-04-08T00:00:00","newsCount":2},{"date":"2013-04-09T00:00:00","newsCount":1},{"date":"2013-04-13T00:00:00","newsCount":1},{"date":"2013-04-14T00:00:00","newsCount":1},{"date":"2013-04-15T00:00:00","newsCount":2},{"date":"2013-04-23T00:00:00","newsCount":2},{"date":"2013-04-26T00:00:00","newsCount":1},{"date":"2013-04-29T00:00:00","newsCount":1}],"newsCount":14},{"name":"May","date":"2013-05-01T00:00:00","days":[{"date":"2013-05-03T00:00:00","newsCount":1},{"date":"2013-05-08T00:00:00","newsCount":1},{"date":"2013-05-11T00:00:00","newsCount":2},{"date":"2013-05-13T00:00:00","newsCount":1},{"date":"2013-05-20T00:00:00","newsCount":1},{"date":"2013-05-22T00:00:00","newsCount":1},{"date":"2013-05-28T00:00:00","newsCount":1}],"newsCount":8},{"name":"June","date":"2013-06-01T00:00:00","days":[{"date":"2013-06-17T00:00:00","newsCount":1},{"date":"2013-06-18T00:00:00","newsCount":1},{"date":"2013-06-27T00:00:00","newsCount":1}],"newsCount":3},{"name":"July","date":"2013-07-01T00:00:00","days":[{"date":"2013-07-03T00:00:00","newsCount":1},{"date":"2013-07-15T00:00:00","newsCount":1},{"date":"2013-07-17T00:00:00","newsCount":1},{"date":"2013-07-19T00:00:00","newsCount":2},{"date":"2013-07-22T00:00:00","newsCount":1},{"date":"2013-07-23T00:00:00","newsCount":1},{"date":"2013-07-26T00:00:00","newsCount":2},{"date":"2013-07-29T00:00:00","newsCount":2},{"date":"2013-07-30T00:00:00","newsCount":1}],"newsCount":12},{"name":"August","date":"2013-08-01T00:00:00","days":[{"date":"2013-08-09T00:00:00","newsCount":1},{"date":"2013-08-14T00:00:00","newsCount":2},{"date":"2013-08-16T00:00:00","newsCount":1},{"date":"2013-08-19T00:00:00","newsCount":1},{"date":"2013-08-21T00:00:00","newsCount":1}],"newsCount":6},{"name":"September","date":"2013-09-01T00:00:00","days":[{"date":"2013-09-03T00:00:00","newsCount":1},{"date":"2013-09-12T00:00:00","newsCount":1},{"date":"2013-09-17T00:00:00","newsCount":1},{"date":"2013-09-19T00:00:00","newsCount":2},{"date":"2013-09-20T00:00:00","newsCount":1},{"date":"2013-09-24T00:00:00","newsCount":2},{"date":"2013-09-27T00:00:00","newsCount":1}],"newsCount":9},{"name":"October","date":"2013-10-01T00:00:00","days":[{"date":"2013-10-01T00:00:00","newsCount":2},{"date":"2013-10-02T00:00:00","newsCount":1},{"date":"2013-10-07T00:00:00","newsCount":1},{"date":"2013-10-09T00:00:00","newsCount":1},{"date":"2013-10-11T00:00:00","newsCount":1},{"date":"2013-10-18T00:00:00","newsCount":1},{"date":"2013-10-21T00:00:00","newsCount":1},{"date":"2013-10-22T00:00:00","newsCount":2},{"date":"2013-10-28T00:00:00","newsCount":1},{"date":"2013-10-31T00:00:00","newsCount":1}],"newsCount":12},{"name":"November","date":"2013-11-01T00:00:00","days":[{"date":"2013-11-04T00:00:00","newsCount":3},{"date":"2013-11-08T00:00:00","newsCount":1},{"date":"2013-11-12T00:00:00","newsCount":2},{"date":"2013-11-21T00:00:00","newsCount":2},{"date":"2013-11-30T00:00:00","newsCount":1}],"newsCount":9},{"name":"December","date":"2013-12-01T00:00:00","days":[{"date":"2013-12-03T00:00:00","newsCount":2},{"date":"2013-12-06T00:00:00","newsCount":1},{"date":"2013-12-10T00:00:00","newsCount":2},{"date":"2013-12-12T00:00:00","newsCount":2},{"date":"2013-12-13T00:00:00","newsCount":1},{"date":"2013-12-17T00:00:00","newsCount":1},{"date":"2013-12-18T00:00:00","newsCount":1}],"newsCount":10}],"newsCount":125},{"year":2014,"months":[{"name":"January","date":"2014-01-01T00:00:00","days":[{"date":"2014-01-06T00:00:00","newsCount":1},{"date":"2014-01-15T00:00:00","newsCount":1},{"date":"2014-01-18T00:00:00","newsCount":1},{"date":"2014-01-27T00:00:00","newsCount":1},{"date":"2014-01-31T00:00:00","newsCount":1}],"newsCount":5},{"name":"February","date":"2014-02-01T00:00:00","days":[{"date":"2014-02-04T00:00:00","newsCount":1},{"date":"2014-02-12T00:00:00","newsCount":8},{"date":"2014-02-13T00:00:00","newsCount":1},{"date":"2014-02-17T00:00:00","newsCount":2},{"date":"2014-02-18T00:00:00","newsCount":2},{"date":"2014-02-24T00:00:00","newsCount":1},{"date":"2014-02-25T00:00:00","newsCount":1}],"newsCount":16},{"name":"March","date":"2014-03-01T00:00:00","days":[{"date":"2014-03-04T00:00:00","newsCount":2},{"date":"2014-03-11T00:00:00","newsCount":1},{"date":"2014-03-17T00:00:00","newsCount":1},{"date":"2014-03-21T00:00:00","newsCount":1},{"date":"2014-03-25T00:00:00","newsCount":2},{"date":"2014-03-27T00:00:00","newsCount":1},{"date":"2014-03-28T00:00:00","newsCount":1}],"newsCount":9},{"name":"April","date":"2014-04-01T00:00:00","days":[{"date":"2014-04-01T00:00:00","newsCount":1},{"date":"2014-04-03T00:00:00","newsCount":1},{"date":"2014-04-07T00:00:00","newsCount":1},{"date":"2014-04-08T00:00:00","newsCount":1},{"date":"2014-04-14T00:00:00","newsCount":1},{"date":"2014-04-24T00:00:00","newsCount":1},{"date":"2014-04-25T00:00:00","newsCount":1}],"newsCount":7},{"name":"May","date":"2014-05-01T00:00:00","days":[{"date":"2014-05-05T00:00:00","newsCount":1},{"date":"2014-05-08T00:00:00","newsCount":1},{"date":"2014-05-15T00:00:00","newsCount":1},{"date":"2014-05-21T00:00:00","newsCount":3},{"date":"2014-05-22T00:00:00","newsCount":1},{"date":"2014-05-23T00:00:00","newsCount":1},{"date":"2014-05-27T00:00:00","newsCount":1},{"date":"2014-05-29T00:00:00","newsCount":1}],"newsCount":10},{"name":"June","date":"2014-06-01T00:00:00","days":[{"date":"2014-06-01T00:00:00","newsCount":1},{"date":"2014-06-02T00:00:00","newsCount":2},{"date":"2014-06-03T00:00:00","newsCount":2},{"date":"2014-06-05T00:00:00","newsCount":2},{"date":"2014-06-11T00:00:00","newsCount":1},{"date":"2014-06-13T00:00:00","newsCount":1},{"date":"2014-06-26T00:00:00","newsCount":1},{"date":"2014-06-27T00:00:00","newsCount":1},{"date":"2014-06-30T00:00:00","newsCount":1}],"newsCount":12},{"name":"July","date":"2014-07-01T00:00:00","days":[{"date":"2014-07-02T00:00:00","newsCount":2},{"date":"2014-07-06T00:00:00","newsCount":1},{"date":"2014-07-09T00:00:00","newsCount":1},{"date":"2014-07-10T00:00:00","newsCount":1},{"date":"2014-07-15T00:00:00","newsCount":1},{"date":"2014-07-16T00:00:00","newsCount":1},{"date":"2014-07-24T00:00:00","newsCount":1}],"newsCount":8},{"name":"August","date":"2014-08-01T00:00:00","days":[{"date":"2014-08-11T00:00:00","newsCount":1},{"date":"2014-08-15T00:00:00","newsCount":1},{"date":"2014-08-18T00:00:00","newsCount":1},{"date":"2014-08-26T00:00:00","newsCount":2},{"date":"2014-08-28T00:00:00","newsCount":1},{"date":"2014-08-29T00:00:00","newsCount":1}],"newsCount":7},{"name":"September","date":"2014-09-01T00:00:00","days":[{"date":"2014-09-02T00:00:00","newsCount":1},{"date":"2014-09-05T00:00:00","newsCount":1},{"date":"2014-09-09T00:00:00","newsCount":1},{"date":"2014-09-12T00:00:00","newsCount":1},{"date":"2014-09-17T00:00:00","newsCount":1},{"date":"2014-09-22T00:00:00","newsCount":1},{"date":"2014-09-25T00:00:00","newsCount":1},{"date":"2014-09-26T00:00:00","newsCount":1}],"newsCount":8},{"name":"October","date":"2014-10-01T00:00:00","days":[{"date":"2014-10-01T00:00:00","newsCount":1},{"date":"2014-10-02T00:00:00","newsCount":1},{"date":"2014-10-03T00:00:00","newsCount":2},{"date":"2014-10-05T00:00:00","newsCount":1},{"date":"2014-10-06T00:00:00","newsCount":1},{"date":"2014-10-07T00:00:00","newsCount":2},{"date":"2014-10-08T00:00:00","newsCount":1},{"date":"2014-10-09T00:00:00","newsCount":1},{"date":"2014-10-17T00:00:00","newsCount":1},{"date":"2014-10-23T00:00:00","newsCount":3},{"date":"2014-10-24T00:00:00","newsCount":1},{"date":"2014-10-25T00:00:00","newsCount":1},{"date":"2014-10-27T00:00:00","newsCount":2},{"date":"2014-10-28T00:00:00","newsCount":6},{"date":"2014-10-30T00:00:00","newsCount":2},{"date":"2014-10-31T00:00:00","newsCount":1}],"newsCount":27},{"name":"November","date":"2014-11-01T00:00:00","days":[{"date":"2014-11-01T00:00:00","newsCount":1},{"date":"2014-11-03T00:00:00","newsCount":2},{"date":"2014-11-04T00:00:00","newsCount":1},{"date":"2014-11-05T00:00:00","newsCount":1},{"date":"2014-11-06T00:00:00","newsCount":1},{"date":"2014-11-10T00:00:00","newsCount":1},{"date":"2014-11-11T00:00:00","newsCount":2}],"newsCount":9},{"name":"December","date":"2014-12-01T00:00:00","days":[{"date":"2014-12-01T00:00:00","newsCount":3}],"newsCount":3}],"newsCount":121}],"daysWithNews":["2001-03-21T00:00:00","2003-11-20T00:00:00","2004-03-18T00:00:00","2004-09-22T00:00:00","2005-09-26T00:00:00","2007-01-02T00:00:00","2007-03-15T00:00:00","2007-06-03T00:00:00","2007-07-03T00:00:00","2007-07-18T00:00:00","2007-10-22T00:00:00","2008-02-01T00:00:00","2008-02-11T00:00:00","2008-09-22T00:00:00","2008-10-06T00:00:00","2008-10-15T00:00:00","2008-12-08T00:00:00","2008-12-15T00:00:00","2008-12-17T00:00:00","2009-01-16T00:00:00","2009-01-20T00:00:00","2009-02-10T00:00:00","2009-02-19T00:00:00","2009-03-01T00:00:00","2009-03-03T00:00:00","2009-03-25T00:00:00","2009-06-22T00:00:00","2009-07-01T00:00:00","2009-07-14T00:00:00","2009-07-17T00:00:00","2009-08-20T00:00:00","2009-08-21T00:00:00","2009-09-09T00:00:00","2009-09-10T00:00:00","2009-09-25T00:00:00","2009-10-07T00:00:00","2009-10-08T00:00:00","2009-10-09T00:00:00","2009-10-14T00:00:00","2009-10-17T00:00:00","2009-10-21T00:00:00","2009-10-28T00:00:00","2009-11-12T00:00:00","2009-12-01T00:00:00","2009-12-02T00:00:00","2009-12-07T00:00:00","2009-12-28T00:00:00","2010-01-20T00:00:00","2010-02-10T00:00:00","2010-02-15T00:00:00","2010-02-16T00:00:00","2010-02-17T00:00:00","2010-02-24T00:00:00","2010-03-29T00:00:00","2010-05-01T00:00:00","2010-06-07T00:00:00","2010-06-08T00:00:00","2010-07-09T00:00:00","2010-08-01T00:00:00","2010-09-01T00:00:00","2010-09-08T00:00:00","2010-09-13T00:00:00","2010-09-27T00:00:00","2010-10-07T00:00:00","2010-10-21T00:00:00","2010-11-19T00:00:00","2010-12-06T00:00:00","2011-01-06T00:00:00","2011-01-09T00:00:00","2011-01-11T00:00:00","2011-01-13T00:00:00","2011-01-19T00:00:00","2011-02-09T00:00:00","2011-03-09T00:00:00","2011-03-10T00:00:00","2011-03-15T00:00:00","2011-03-16T00:00:00","2011-03-17T00:00:00","2011-03-30T00:00:00","2011-04-11T00:00:00","2011-05-05T00:00:00","2011-05-16T00:00:00","2011-05-17T00:00:00","2011-05-31T00:00:00","2011-06-20T00:00:00","2011-06-27T00:00:00","2011-06-28T00:00:00","2011-07-07T00:00:00","2011-07-08T00:00:00","2011-07-15T00:00:00","2011-07-28T00:00:00","2011-08-09T00:00:00","2011-08-22T00:00:00","2011-08-30T00:00:00","2011-09-07T00:00:00","2011-09-14T00:00:00","2011-09-19T00:00:00","2011-09-22T00:00:00","2011-10-05T00:00:00","2011-10-08T00:00:00","2011-10-10T00:00:00","2011-10-13T00:00:00","2011-10-18T00:00:00","2011-10-24T00:00:00","2011-10-25T00:00:00","2011-10-26T00:00:00","2011-10-27T00:00:00","2011-11-01T00:00:00","2011-11-08T00:00:00","2011-11-14T00:00:00","2011-11-15T00:00:00","2011-11-21T00:00:00","2011-11-22T00:00:00","2011-12-02T00:00:00","2011-12-12T00:00:00","2011-12-13T00:00:00","2011-12-15T00:00:00","2011-12-16T00:00:00","2011-12-20T00:00:00","2012-01-09T00:00:00","2012-01-18T00:00:00","2012-01-20T00:00:00","2012-01-27T00:00:00","2012-02-01T00:00:00","2012-02-09T00:00:00","2012-02-14T00:00:00","2012-02-16T00:00:00","2012-02-17T00:00:00","2012-02-19T00:00:00","2012-02-23T00:00:00","2012-02-26T00:00:00","2012-03-04T00:00:00","2012-03-05T00:00:00","2012-03-06T00:00:00","2012-03-26T00:00:00","2012-03-28T00:00:00","2012-04-01T00:00:00","2012-04-04T00:00:00","2012-04-10T00:00:00","2012-04-11T00:00:00","2012-04-26T00:00:00","2012-04-30T00:00:00","2012-06-01T00:00:00","2012-06-12T00:00:00","2012-06-15T00:00:00","2012-06-18T00:00:00","2012-06-23T00:00:00","2012-06-25T00:00:00","2012-07-05T00:00:00","2012-07-11T00:00:00","2012-07-26T00:00:00","2012-07-30T00:00:00","2012-08-01T00:00:00","2012-08-09T00:00:00","2012-09-04T00:00:00","2012-09-05T00:00:00","2012-09-06T00:00:00","2012-09-07T00:00:00","2012-09-09T00:00:00","2012-09-10T00:00:00","2012-09-20T00:00:00","2012-09-23T00:00:00","2012-09-24T00:00:00","2012-10-16T00:00:00","2012-10-18T00:00:00","2012-10-19T00:00:00","2012-10-22T00:00:00","2012-10-23T00:00:00","2012-10-24T00:00:00","2012-10-31T00:00:00","2012-11-01T00:00:00","2012-11-07T00:00:00","2012-11-08T00:00:00","2012-11-13T00:00:00","2012-11-14T00:00:00","2012-11-16T00:00:00","2012-11-19T00:00:00","2012-11-20T00:00:00","2012-11-27T00:00:00","2012-11-30T00:00:00","2012-12-05T00:00:00","2012-12-06T00:00:00","2012-12-10T00:00:00","2012-12-19T00:00:00","2013-01-02T00:00:00","2013-01-03T00:00:00","2013-01-07T00:00:00","2013-01-08T00:00:00","2013-01-09T00:00:00","2013-01-10T00:00:00","2013-01-15T00:00:00","2013-01-16T00:00:00","2013-01-17T00:00:00","2013-01-18T00:00:00","2013-01-22T00:00:00","2013-01-25T00:00:00","2013-01-28T00:00:00","2013-01-30T00:00:00","2013-01-31T00:00:00","2013-02-01T00:00:00","2013-02-07T00:00:00","2013-02-08T00:00:00","2013-02-12T00:00:00","2013-02-13T00:00:00","2013-02-25T00:00:00","2013-02-26T00:00:00","2013-02-27T00:00:00","2013-03-06T00:00:00","2013-03-07T00:00:00","2013-03-08T00:00:00","2013-03-14T00:00:00","2013-03-15T00:00:00","2013-03-22T00:00:00","2013-03-27T00:00:00","2013-03-28T00:00:00","2013-03-29T00:00:00","2013-04-01T00:00:00","2013-04-03T00:00:00","2013-04-08T00:00:00","2013-04-09T00:00:00","2013-04-13T00:00:00","2013-04-14T00:00:00","2013-04-15T00:00:00","2013-04-23T00:00:00","2013-04-26T00:00:00","2013-04-29T00:00:00","2013-05-03T00:00:00","2013-05-08T00:00:00","2013-05-11T00:00:00","2013-05-13T00:00:00","2013-05-20T00:00:00","2013-05-22T00:00:00","2013-05-28T00:00:00","2013-06-17T00:00:00","2013-06-18T00:00:00","2013-06-27T00:00:00","2013-07-03T00:00:00","2013-07-15T00:00:00","2013-07-17T00:00:00","2013-07-19T00:00:00","2013-07-22T00:00:00","2013-07-23T00:00:00","2013-07-26T00:00:00","2013-07-29T00:00:00","2013-07-30T00:00:00","2013-08-09T00:00:00","2013-08-14T00:00:00","2013-08-16T00:00:00","2013-08-19T00:00:00","2013-08-21T00:00:00","2013-09-03T00:00:00","2013-09-12T00:00:00","2013-09-17T00:00:00","2013-09-19T00:00:00","2013-09-20T00:00:00","2013-09-24T00:00:00","2013-09-27T00:00:00","2013-10-01T00:00:00","2013-10-02T00:00:00","2013-10-07T00:00:00","2013-10-09T00:00:00","2013-10-11T00:00:00","2013-10-18T00:00:00","2013-10-21T00:00:00","2013-10-22T00:00:00","2013-10-28T00:00:00","2013-10-31T00:00:00","2013-11-04T00:00:00","2013-11-08T00:00:00","2013-11-12T00:00:00","2013-11-21T00:00:00","2013-11-30T00:00:00","2013-12-03T00:00:00","2013-12-06T00:00:00","2013-12-10T00:00:00","2013-12-12T00:00:00","2013-12-13T00:00:00","2013-12-17T00:00:00","2013-12-18T00:00:00","2014-01-06T00:00:00","2014-01-15T00:00:00","2014-01-18T00:00:00","2014-01-27T00:00:00","2014-01-31T00:00:00","2014-02-04T00:00:00","2014-02-12T00:00:00","2014-02-13T00:00:00","2014-02-17T00:00:00","2014-02-18T00:00:00","2014-02-24T00:00:00","2014-02-25T00:00:00","2014-03-04T00:00:00","2014-03-11T00:00:00","2014-03-17T00:00:00","2014-03-21T00:00:00","2014-03-25T00:00:00","2014-03-27T00:00:00","2014-03-28T00:00:00","2014-04-01T00:00:00","2014-04-03T00:00:00","2014-04-07T00:00:00","2014-04-08T00:00:00","2014-04-14T00:00:00","2014-04-24T00:00:00","2014-04-25T00:00:00","2014-05-05T00:00:00","2014-05-08T00:00:00","2014-05-15T00:00:00","2014-05-21T00:00:00","2014-05-22T00:00:00","2014-05-23T00:00:00","2014-05-27T00:00:00","2014-05-29T00:00:00","2014-06-01T00:00:00","2014-06-02T00:00:00","2014-06-03T00:00:00","2014-06-05T00:00:00","2014-06-11T00:00:00","2014-06-13T00:00:00","2014-06-26T00:00:00","2014-06-27T00:00:00","2014-06-30T00:00:00","2014-07-02T00:00:00","2014-07-06T00:00:00","2014-07-09T00:00:00","2014-07-10T00:00:00","2014-07-15T00:00:00","2014-07-16T00:00:00","2014-07-24T00:00:00","2014-08-11T00:00:00","2014-08-15T00:00:00","2014-08-18T00:00:00","2014-08-26T00:00:00","2014-08-28T00:00:00","2014-08-29T00:00:00","2014-09-02T00:00:00","2014-09-05T00:00:00","2014-09-09T00:00:00","2014-09-12T00:00:00","2014-09-17T00:00:00","2014-09-22T00:00:00","2014-09-25T00:00:00","2014-09-26T00:00:00","2014-10-01T00:00:00","2014-10-02T00:00:00","2014-10-03T00:00:00","2014-10-05T00:00:00","2014-10-06T00:00:00","2014-10-07T00:00:00","2014-10-08T00:00:00","2014-10-09T00:00:00","2014-10-17T00:00:00","2014-10-23T00:00:00","2014-10-24T00:00:00","2014-10-25T00:00:00","2014-10-27T00:00:00","2014-10-28T00:00:00","2014-10-30T00:00:00","2014-10-31T00:00:00","2014-11-01T00:00:00","2014-11-03T00:00:00","2014-11-04T00:00:00","2014-11-05T00:00:00","2014-11-06T00:00:00","2014-11-10T00:00:00","2014-11-11T00:00:00","2014-12-01T00:00:00"]}';
	    var responseImageFirstItem = '[{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","image":"dummy content","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"image":"dummy 2", "newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]}]';
	    var responseImageSecondSlice = '[{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"image": "dummy data 2","newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8413,"ownerId":70481,"title":"In needle exchange programs, users led the charge against HIV","website":"http://yaledailynews.com/blog/2014/12/01/in-needle-exchange-programs-users-led-the-charge-against-hiv/","articleDate":"2014-12-01T13:32:00","scheduledFor":"2014-12-01T13:37:00","summary":"On the 26th World AIDS Day, as groups across campus and organizations across the world pay tribute to activists who were instrumental in stemming the spread of HIV/AIDS, the Yale researchers who pioneered New Haven’s Needle Exchange Program are celebrating those who made the program possible — the substance users themselves.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":409,"name":"HIV/AIDS"},{"keywordId":343,"name":"Epidemiology"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":409,"name":"HIV/AIDS"}]}]},{"hasContent":false,"newsId":8407,"ownerId":70481,"title":"Why Everything You Think About Aging May Be Wrong","website":"http://online.wsj.com/articles/why-everything-you-think-about-aging-may-be-wrong-1417408057","articleDate":"2014-12-01T10:26:00","scheduledFor":"2014-12-01T10:27:00","summary":"As We Get Older, Friendships, Creativity and Satisfaction With Life Can Flourish","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":466,"name":"Aging"}]},{"organizationId":109236,"name":"Social & Behavioral Sciences","website":"http://publichealth.yale.edu/sbs/","keywords":[{"keywordId":472,"name":"Faculty in the News"}]}]},{"hasContent":false,"newsId":8406,"ownerId":70481,"title":"Get Your Palm Read - And Find Out If You\'re Eating Right","website":"http://www.newsweek.com/get-your-palm-read-and-find-out-if-youre-eating-right-287555","articleDate":"2014-12-01T08:47:00","scheduledFor":"2014-12-01T08:48:00","summary":"Did you eat all your fruits and vegetables today?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":470,"name":"Nutrition"}]},{"organizationId":109167,"name":"Chronic Disease Epidemiology","website":"http://medicine.yale.edu/ysph/cde/index.aspx","keywords":[{"keywordId":470,"name":"Nutrition"}]}]},{"hasContent":false,"newsId":8311,"ownerId":70481,"title":"Ebola Panic Brings Back Memories of Early Days of AIDS for Yale Researcher","website":"http://wnpr.org/post/ebola-panic-brings-back-memories-early-days-aids-yale-researcher","articleDate":"2014-11-11T11:58:00","scheduledFor":"2014-11-11T11:59:00","summary":"A Yale researcher says the current panic over Ebola in the U.S. brings back some bad memories.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109169,"name":"Epidemiology of Microbial Diseases","website":"http://publichealth.yale.edu/emd/","keywords":[{"keywordId":314,"name":"Ebola"}]}]},{"hasContent":false,"newsId":8308,"ownerId":70481,"title":"Multi-pronged intervention most effective in stemming Ebola","website":"http://yaledailynews.com/blog/2014/11/11/multi-pronged-intervention-most-effective-in-stemming-ebola/","articleDate":"2014-11-11T08:33:00","scheduledFor":"2014-11-11T08:35:00","summary":"Using data gathered on the ground in Liberia, Yale researchers have been able to run simulations to answer the question: How best can the world stem the Ebola epidemic?","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":219,"name":"Student News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]},{"hasContent":false,"newsId":8306,"ownerId":70481,"title":"Out of Ebola Quarantine, Yale Student Says Health Workers Should Be Treated as Heroes, Not Pariahs","website":"http://www.democracynow.org/2014/11/10/out_of_ebola_quarantine_yale_student","articleDate":"2014-11-10T14:23:00","scheduledFor":"2014-11-10T14:24:00","summary":"Health officials have declared the Dallas region to be free of Ebola after the Centers for Disease Control and Prevention announced it had cleared all 177 people it had been checking for exposure over the past three weeks.","isOriginalArticle":true,"sortOrder":1,"newsAuthors":[],"organizations":[{"organizationId":109082,"name":"School of Public Health","website":"http://publichealth.yale.edu/","keywords":[{"keywordId":472,"name":"Faculty in the News"},{"keywordId":314,"name":"Ebola"}]},{"organizationId":109566,"name":"Center for Infectious Disease Modeling and Analysis","website":"http://cidma.yale.edu","keywords":[]}]}]';

		if (responseOption == null)
		{
			response = responseDefault;
		}
		else
		{
			switch(responseOption)
			{
				case 0:
					response = responseDefault;
				break;
				case 1:
					response = responseImageFirstItem;
				break;
				case 2:
					response = responseImageSecondSlice;
				break;
			}
		}

		var server = sinon.fakeServer.create();

		var url1 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&keywordIds=472";
		var url1b = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageSize=3&keywordIds=472";
		var url1c = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageSize=6&keywordIds=472";
		var url1d = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=1&pageSize=10&keywordIds=472";
		var url1e = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=2&pageSize=10&keywordIds=472";
		var url1f = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=1&pageSize=20&keywordIds=472";
		var url1g = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=2&pageSize=20&keywordIds=472";
		var url2 = "http://dev.profile.yale.edu/service/news/calendar/?organizationIds=109082&keywordIds=472";
		var url2b = "http://dev.profile.yale.edu/service/news/calendar/?organizationIds=109082&pageNumber=1&pageSize=10&keywordIds=472";
		var url2c = "http://dev.profile.yale.edu/service/news/calendar/?organizationIds=109082&pageNumber=2&pageSize=10&keywordIds=472";
		var url2d = "http://dev.profile.yale.edu/service/news/calendar/?organizationIds=109082&pageNumber=1&pageSize=20&keywordIds=472";
		var url3 = "http://dev.profile.yale.edu/service/news/summaries/?userIds=1234&keywordIds=472";
		var url3b = "http://dev.profile.yale.edu/service/news/summaries/?userIds=1234&pageSize=3&keywordIds=472";
		var url4 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&userIds=1234&keywordIds=472";
		var url4b = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&userIds=1234&pageSize=3&keywordIds=472";
		var url5 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&StartDate=2015-02-13T00:00:00-05:00&EndDate=2015-02-13T23:59:59-05:00&keywordIds=472";
		var url6 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&StartDate=2015-02-01T00:00:00-05:00&EndDate=2015-02-28T23:59:59-05:00&keywordIds=472";
		var url7 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&StartDate=2015-01-01T00:00:00-05:00&EndDate=2015-12-31T23:59:59-05:00&keywordIds=472";
		var url8 = "http://dev.profile.yale.edu/service/news/summaries/?userIds=1234&searchQuery=heart%20failure&keywordIds=472";
		var url9 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&searchQuery=heart%20failure&keywordIds=472";
		var url10 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&userIds=1234&searchQuery=heart%20failure&keywordIds=472";
        var url11 = "http://ypms-service-a18.azurewebsites.net/service/news/summaries/?organizationIds=109082&keywordIds=472";
        var url12 = "http://ypms-service-a18.azurewebsites.net/service/news/calendar/?organizationIds=109082&keywordIds=472";
        var url11b = "http://ypms-service-a18.azurewebsites.net/service/news/summaries/?organizationIds=109082&pageSize=5&keywordIds=472";
        var url13 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&keywordIds=472,308";
        var url13b = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=1&pageSize=10&keywordIds=472,308";
        var url14 = "http://dev.profile.yale.edu/service/news/calendar/?organizationIds=109082&keywordIds=472,308";
        var url14b = "http://dev.profile.yale.edu/service/news/calendar/?organizationIds=109082&pageNumber=1&pageSize=10&keywordIds=472,308";

		server.respondWith("GET", url1,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url1b,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url1c,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url1d,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url1e,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url1f,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url1g,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url2,[200, { "Content-Type": "application/json" }, responseMetadataCalendar]);
		server.respondWith("GET", url2b,[200, { "Content-Type": "application/json" }, responseMetadataCalendar]);
		server.respondWith("GET", url2c,[200, { "Content-Type": "application/json" }, responseMetadataCalendar]);
		server.respondWith("GET", url2d,[200, { "Content-Type": "application/json" }, responseMetadataCalendar]);
		server.respondWith("GET", url3,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url3b,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url4,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url4b,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url5,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url6,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url7,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url8,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url9,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url10,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url11,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url11b,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url12,[200, { "Content-Type": "application/json" }, responseMetadataCalendar]);
		server.respondWith("GET", url13,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url13b,[200, { "Content-Type": "application/json" }, response]);
		server.respondWith("GET", url14,[200, { "Content-Type": "application/json" }, responseMetadataCalendar]);
		server.respondWith("GET", url14b,[200, { "Content-Type": "application/json" }, responseMetadataCalendar]);

		return server;
	}

	describe("News Widget", function()
	{
		describe("IMPORTANT : The content of main.js is replicated here, so make sure it reflects the latest code version. This testing uses a mock for interacting with the DOM and retrieving data (returning static data).",function(){});
		describe("The list of tests is not exhaustive. Its purpose is to ensure the consistency of applied configuration and data used on the UI.", function(){});
		describe("The async testing mechanism used relies on a flag returned by the Facade mock. It gives time for the application to load properly before testing the view model's expected values.", function(){});

		// NO CONF BEGIN
		describe("No Configuration available", function()
		{
			// this code should be updated to always reflect the content of main.js
			// because of the need for async flag, there is a small hack added
			beforeEach(function(done) 
		    {
				setUpTestingEnvironment(0, 0, done);
		    });

			it("should not load the whole application if there is no configuration found in the DOM",function(done){
				expect(controller).toBe(undefined);
				done();
			});
		});
		// NO CONF END

		// PARTIAL CONF BEGIN
		describe("Partial Configuration Available", function()
		{
			// this code should be updated to always reflect the content of main.js
			// because of the need for async flag, there is a small hack added
			beforeEach(function(done) 
		    {
		    	jasmine.getFixtures().set('<div id="news-module-news1partial">\
	                <div id="news-overview-news1partial">\
	                    <span data-bind="template: \'news-overview-template-news1partial\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news1partial",\
	                    "displayStyle":"news-side-thumbnails",\
	                    "maxItems":5,\
	                    "organizationId": "109082",\
	                    "coreKeywordIds": "472"}]\
	                </span>\
	            </div>\
	            <div id="news-module-news2partial">\
	                <div id="news-overview-news2partial">\
	                    <span data-bind="template: \'news-overview-template-news2partial\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news2partial",\
	                    "displayStyle":"news-combined",\
	                    "maxItems":10,\
	                    "organizationId": "109082",\
	                    "coreKeywordIds": "472,308",\
	                    "serviceUrlBase": "http://ypms-service-a18.azurewebsites.net"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news2partial"\
	                    href="http://publichealth.yale.edu/news/archive/article.aspx?id="\
	                    style="display: none"></a>\
	                    <a id="keywordBaseLink-news2partial" \
	                    href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" \
	                    style="display: none"></a>\
	                </div>\
	            </div>');

				setUpTestingEnvironment(0, 0, done);
		    });

			it("should not load the whole application if the read more links configuration(s) are not enough compared to the amount of configuration(s)",function(done){
				expect(controller).toBe(undefined);
				done();
			});
		});
		// PARTIAL CONF END

		describe("Full Configuration Available", function() 
		{
			beforeEach(function(done) 
		    {
		    	jasmine.getFixtures().set('<div id="news-module-news1">\
	                <div id="news-overview-news1">\
	                    <span data-bind="template: \'news-overview-template-news1\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news1",\
			            "displayStyle":"news-side-thumbnails",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news1" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news1" href="http://publichealth.yale.edu/news/archive/index.aspx#!" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news1nolimit">\
	                <div id="news-overview-news1nolimit">\
	                    <span data-bind="template: \'news-overview-template-news1nolimit\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news1nolimit",\
			            "displayStyle":"news-side-thumbnails",\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news1nolimit" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news1nolimit" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news4">\
	                <div id="news-overview-news4">\
	                    <span data-bind="template: \'news-overview-template-news4\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news4",\
			            "displayStyle":"news-side-text",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "userId": "1234",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news4" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news4" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news4nolimit">\
	                <div id="news-overview-news4nolimit">\
	                    <span data-bind="template: \'news-overview-template-news4nolimit\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news4nolimit",\
			            "displayStyle":"news-side-text",\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news4nolimit" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news4nolimit" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news5">\
	                <div id="news-overview-news5">\
	                    <span data-bind="template: \'news-overview-template-news5\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news5",\
			            "displayStyle":"news-1-col-highlight",\
			            "maxItems":3,\
			            "userId": "1234",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news5" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news5" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news5nolimit">\
	                <div id="news-overview-news5nolimit">\
	                    <span data-bind="template: \'news-overview-template-news5nolimit\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news5nolimit",\
			            "displayStyle":"news-1-col-highlight",\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news5nolimit" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news5nolimit" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news6">\
	                <div id="news-overview-news6">\
	                    <span data-bind="template: \'news-overview-template-news6\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news6",\
			            "displayStyle":"news-2-col-highlight",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news6" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news6" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news6nolimit">\
	                <div id="news-overview-news6nolimit">\
	                    <span data-bind="template: \'news-overview-template-news6nolimit\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news6nolimit",\
			            "displayStyle":"news-2-col-highlight",\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news6nolimit" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news6nolimit" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news7">\
	                <div id="news-overview-news7">\
	                    <span data-bind="template: \'news-overview-template-news7\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news7",\
			            "displayStyle":"news-2-col-thumbnails",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news7" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news7" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news7nolimit">\
	                <div id="news-overview-news7nolimit">\
	                    <span data-bind="template: \'news-overview-template-news7nolimit\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news7nolimit",\
			            "displayStyle":"news-2-col-thumbnails",\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news7nolimit" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news7nolimit" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news8">\
	                <div id="news-overview-news8">\
	                    <span data-bind="template: \'news-overview-template-news8\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news8",\
			            "displayStyle":"news-2-col-text",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news8" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news8" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news8nolimit">\
	                <div id="news-overview-news8nolimit">\
	                    <span data-bind="template: \'news-overview-template-news8nolimit\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news8nolimit",\
			            "displayStyle":"news-2-col-text",\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news8nolimit" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news8nolimit" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news9">\
	                <div id="news-overview-news9">\
	                    <span data-bind="template: \'news-overview-template-news9\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news9",\
			            "displayStyle":"news-grid-full",\
			            "maxItems":6,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news9" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news9" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news9b">\
	                <div id="news-overview-news9b">\
	                    <span data-bind="template: \'news-overview-template-news9b\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news9b",\
			            "displayStyle":"news-grid-full",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news9b" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news9b" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news9c">\
	                <div id="news-overview-news9c">\
	                    <span data-bind="template: \'news-overview-template-news9c\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news9c",\
			            "displayStyle":"news-grid-full",\
			            "maxItems":null,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news9c" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news9c" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news9nolimit">\
	                <div id="news-overview-news9nolimit">\
	                    <span data-bind="template: \'news-overview-template-news9nolimit\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news9nolimit",\
			            "displayStyle":"news-grid-full",\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news9nolimit" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news9nolimit" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news10">\
	                <div id="news-overview-news10">\
	                    <span data-bind="template: \'news-overview-template-news10\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news10",\
			            "displayStyle":"news-combined",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news10" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news10" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news10page2">\
	                <div id="news-overview-news10page2">\
	                    <span data-bind="template: \'news-overview-template-news10page2\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news10page2",\
			            "displayStyle":"news-combined",\
			            "maxItems":3,\
			            "currentPage": "2",\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news10page2" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news10page2" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news10b">\
	                <div id="news-overview-news10b">\
	                    <span data-bind="template: \'news-overview-template-news10b\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news10b",\
			            "displayStyle":"news-combined",\
			            "maxItems":20,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news10b" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news10b" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news10c">\
	                <div id="news-overview-news10c">\
	                    <span data-bind="template: \'news-overview-template-news10c\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news10c",\
			            "displayStyle":"news-combined",\
			            "maxItems":1,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news10c" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news10c" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news10nolimit">\
	                <div id="news-overview-news10nolimit">\
	                    <span data-bind="template: \'news-overview-template-news10nolimit\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news10nolimit",\
			            "displayStyle":"news-combined",\
			            "maxItems": null,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news10nolimit" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news10nolimit" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>');

				setUpTestingEnvironment(21, 0, done);
		    });

			describe("Basic Use", function() 
			{
				it("should display a loading message to the user", function(done)
				{
					expect($(['#',constants.idNames.newsloadingIdBegin,'news1'].join('')).length == 1).toBe(true);
					expect(controller.renderItems).toHaveBeenCalled();
					done();
				});

				it("should use the service URL specified in constants by default", function(done) 
		        {
		          var key = "news1";
		          var expected = "http://dev.profile.yale.edu";
		          expect(controller.itemsFactory.configs[key].serviceUrlBase).toBe(expected);
		          done();
		        });

				it("should present the date of a News Item in the format 'Monday, December 1st'", function(done) 
		        {
		          var key = "news1";
		          var expected = "Monday, December 1st";
		          expect(controller.itemsFactory.viewModels[key].news()[0].formattedDate()).toBe(expected);
		          done();
		        });
			});

			describe("Links", function() 
			{
				describe("to the other CMS pages", function() 
				{
					it("should present a usable link to the main article", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://publichealth.yale.edu/news/archive/article.aspx?id=" + controller.itemsFactory.viewModels[key].news()[0].id();
			          expect(controller.itemsFactory.viewModels[key].news()[0].url()).toBe(expected);
			          done();
			        });

			        it("should present a link to a page displaying articles with the specific keyword selected - keeping the organization id and core keywords", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://publichealth.yale.edu/news/archive/index.aspx#!organizationIds=109082&pageSize=3&keywordIds=472,343";
			          expect(controller.itemsFactory.viewModels[key].news()[0].tags()[1][1]).toBe(expected);
			          done();
			        });

			        it("should present a link to a page displaying articles with the specific keyword selected - keeping the organization id and core keywords - without duplicating core keywords", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://publichealth.yale.edu/news/archive/index.aspx#!organizationIds=109082&pageSize=3&keywordIds=472";
			          expect(controller.itemsFactory.viewModels[key].news()[1].tags()[0][1]).toBe(expected);
			          done();
			        });
				});

				describe("to data server", function()
				{
					it("should present a link to download data - including organization id and keyword ids", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageSize=3&keywordIds=472";
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids and user id", function(done) 
			        {
			          var key = "news4";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&userIds=1234&pageSize=3&keywordIds=472";
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including keyword ids and user id", function(done) 
			        {
			          var key = "news5";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?userIds=1234&pageSize=3&keywordIds=472";
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids and selected time range - single day", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&StartDate=2015-02-13T00:00:00-05:00&EndDate=2015-02-13T23:59:59-05:00&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "selectedDate": '2015-02-13', 
                                             "relativeOptions": 1});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids and selected time range - full month", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&StartDate=2015-02-01T00:00:00-05:00&EndDate=2015-02-28T23:59:59-05:00&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "selectedDate": '2015-02-13', 
                                             "relativeOptions": 30});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids and selected time range -  full year", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&StartDate=2015-01-01T00:00:00-05:00&EndDate=2015-12-31T23:59:59-05:00&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "selectedDate": '2015-02-13', 
                                             "relativeOptions": 365});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids - selected time range reset", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&StartDate=2015-01-01T00:00:00-05:00&EndDate=2015-12-31T23:59:59-05:00&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "selectedDate": '2015-02-13', 
                                             "relativeOptions": 365});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          var expected1 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "selectedDate": null,
                                             "relativeOptions": 0});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected1);
			          done();
			        });

					it("should present a link to download data - including organization id and keyword ids and search query", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&searchQuery=heart failure&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "searchQuery": "heart failure"});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids - search query was reset", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&searchQuery=heart failure&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "searchQuery": "heart failure"});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          var expected2 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "searchQuery": null});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected2);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids and user id and search query", function(done) 
			        {
			          var key = "news4";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&userIds=1234&searchQuery=heart failure&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "searchQuery": "heart failure"});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including keyword ids and user id and search query", function(done) 
			        {
			          var key = "news5";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?userIds=1234&searchQuery=heart failure&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "searchQuery": "heart failure"});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids and search query and selected time range - single day", function(done) 
			        {
			          var key = "news1";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&StartDate=2015-02-13T00:00:00-05:00&EndDate=2015-02-13T23:59:59-05:00&searchQuery=heart failure&pageNumber=1&pageSize=3&keywordIds=472";
			          controller.displayItems({"key": key,
                                             "selectedDate": '02/13/2015', 
                                             "relativeOptions": 1});
			          controller.displayItems({"key": key,
                                             "searchQuery": "heart failure"});
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          done();
			        });

			        it("should present a link to download data - including organization id and keyword ids - max items changed", function(done) 
			        {
			          var key = "news10";
			          var expected = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=1&pageSize=10&keywordIds=472";
			          expect(controller.itemsFactory.configs[key].url).toBe(expected);
			          controller.displayItems({"key": key,
                                             "maxItems": 20});
			          var expected2 = "http://dev.profile.yale.edu/service/news/summaries/?organizationIds=109082&pageNumber=1&pageSize=20&keywordIds=472";
			          expect(controller.itemsFactory.configs[key].url).toBe(expected2);
			          done();
			        });
				});
		    });

			describe("Search", function(){
				it("should reset current page to 1 when a search query is included", function(done)
				{
		          var key = "news1";
		          var expected = 1;
		          controller.displayItems({"key": key,
		      							"currentPage": 2});
		          controller.displayItems({"key": key,
                                         "searchQuery": "heart failure"});
		          expect(controller.itemsFactory.configs[key].currentPage).toBe(expected);
		          done();
				});
			});

		    describe("Count of Max Items per Page", function(done) 
			{
				describe("A slice is a range of News Items indexes that will be rendered using a given template.", function(){});

				it("news-side-text: should contain all items if no max specified", function(done) 
		        {
		          var key = "news4nolimit";
		          var expected = controller.itemsFactory.viewModels[key].news().length;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-side-text: should not have more items than max specified", function(done) 
		        {
		          var key = "news4";
		          var expected = 3;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-side-text: should have 1 slice of news items", function(done) 
		        {
		          var key = "news4";
		          var expected = 1;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews().length).toBe(expected);
		          done();
		        });

				it("news-1-col-highlight: should contain all items if no max specified", function(done) 
		        {
		          var key = "news5nolimit";
		          var expected = controller.itemsFactory.viewModels[key].news().length;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-1-col-highlight: should not have more items than max specified", function(done) 
		        {
		          var key = "news5";
		          var expected = 3;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-1-col-highlight: should have 1 slice of news items", function(done) 
		        {
		          var key = "news5";
		          var expected = 1;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews().length).toBe(expected);
		          done();
		        });

				it("news-2-col-highlight: should contain all items if no max specified", function(done) 
		        {
		          var key = "news6nolimit";
		          var expected = controller.itemsFactory.viewModels[key].news().length;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-2-col-highlight: should not have more items than max specified", function(done) 
		        {
		          var key = "news6";
		          var expected = 3;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-2-col-highlight: should have 1 slice of news items", function(done) 
		        {
		          var key = "news6";
		          var expected = 1;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews().length).toBe(expected);
		          done();
		        });

				it("news-2-col-thumbnails: should contain all items if no max specified", function(done) 
		        {
		          var key = "news7nolimit";
		          var expected = controller.itemsFactory.viewModels[key].news().length;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-2-col-thumbnails: should not have more items than max specified", function(done) 
		        {
		          var key = "news7";
		          var expected = 3;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-2-col-thumbnails: should have 1 slice of news items", function(done) 
		        {
		          var key = "news7";
		          var expected = 1;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews().length).toBe(expected);
		          done();
		        });

				it("news-2-col-text: should contain all items if no max specified", function(done) 
		        {
		          var key = "news8nolimit";
		          var expected = controller.itemsFactory.viewModels[key].news().length;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-2-col-text: should not have more items than max specified", function(done) 
		        {
		          var key = "news8";
		          var expected = 3;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-2-col-text: should have 1 slice of news items", function(done) 
		        {
		          var key = "news8";
		          var expected = 1;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews().length).toBe(expected);
		          done();
		        });

				it("news-side-thumbnails: should contain all items if no max specified", function(done) 
		        {
		          var key = "news1nolimit";
		          var expected = controller.itemsFactory.viewModels[key].news().length;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-side-thumbnails: should not have more items than max specified", function(done) 
		        {
		          var key = "news1";
		          var expected = 3;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBe(expected);
		          done();
		        });
				it("news-side-thumbnails: should have 1 slice of news items", function(done) 
		        {
		          var key = "news1";
		          var expected = 1;
		          // first and only slice
		          expect(controller.itemsFactory.viewModels[key].allNews().length).toBe(expected);
		          done();
		        });

				it("news-grid-full: should only have 1, 5 or 9 items - scenario 1", function(done) 
		        {
		          var key = "news9b";
		          var expected = 1; // because max items is 6 ; would be 1 if max items < 5
		          countAllItemsAllSlices = controller.itemsFactory.viewModels[key].allNews()[0].length + controller.itemsFactory.viewModels[key].allNews()[1].length + controller.itemsFactory.viewModels[key].allNews()[2].length;
		          expect(countAllItemsAllSlices).toBe(expected);
		          done();
		        });
				it("news-grid-full: should only have 1, 5 or 9 items - scenario 5", function(done) 
		        {
		          var key = "news9";
		          var expected = 5; // because max items is 6 ; would be 1 if max items < 5
		          countAllItemsAllSlices = controller.itemsFactory.viewModels[key].allNews()[0].length + controller.itemsFactory.viewModels[key].allNews()[1].length + controller.itemsFactory.viewModels[key].allNews()[2].length;
		          expect(countAllItemsAllSlices).toBe(expected);
		          done();
		        });
		        it("news-grid-full: should only have 1, 5 or 9 items - scenario 9", function(done) 
		        {
		          var key = "news9c";
		          var expected = 9; // because max items is 6 ; would be 1 if max items < 5
		          countAllItemsAllSlices = controller.itemsFactory.viewModels[key].allNews()[0].length + controller.itemsFactory.viewModels[key].allNews()[1].length + controller.itemsFactory.viewModels[key].allNews()[2].length;
		          expect(countAllItemsAllSlices).toBe(expected);
		          done();
		        });
				it("news-grid-full : should have 3 slices of news items - scenario 1", function(done) 
		        {
		          var key = "news9b";
		          var expected = 3;
		          expect(controller.itemsFactory.viewModels[key].slices().length).toBe(expected);
		          done();
		        });
		        it("news-grid-full : should have 3 slices of news items - scenario 5", function(done) 
		        {
		          var key = "news9";
		          var expected = 3;
		          expect(controller.itemsFactory.viewModels[key].slices().length).toBe(expected);
		          done();
		        });
		        it("news-grid-full : should have 3 slices of news items - scenario 9", function(done) 
		        {
		          var key = "news9c";
		          var expected = 3;
		          expect(controller.itemsFactory.viewModels[key].slices().length).toBe(expected);
		          done();
		        });
			});

			describe("Images and Placeholders", function(done)
			{
				describe("What is being tested here is the configuration injected for template rendering.", function(){});

				it("news-combined: should merge all the News Items as news-1-col-text-paging if none of the News Items of the two first slices has a picture", function(done)
				{
					var key = "news10";
					// the static data set used has no info about images
					// slice 1
		          	expect(controller.itemsFactory.viewModels[key].slices()[0][0]).toBe(0);
		          	expect(controller.itemsFactory.viewModels[key].slices()[0][1]).toBe(0);
		          	// slice 2
		          	expect(controller.itemsFactory.viewModels[key].slices()[1][0]).toBe(0);
		          	expect(controller.itemsFactory.viewModels[key].slices()[1][1]).toBe(0);
		          	// slice 3
		          	expect(controller.itemsFactory.viewModels[key].slices()[2][0]).toBe(1);
		          	expect(controller.itemsFactory.viewModels[key].slices()[2][1]).toBe(null);
		          	done();
				});
			});

			describe("Advanced Filter", function()
			{
				describe("Days/Months/Years with Entries", function()
				{
					it("should return the amount of entries of a day having data", function(done){
						var key = "news10";
						var expected = 2;
						expect(controller.itemsFactory.viewModels[key].hasEntriesByYearMonthDay()['2014']['06']['05']).toBe(expected);
		          		done();
					});

					it("should return undefined for a day having no entries", function(done){
						var key = "news10";
						var expected = undefined;
						expect(controller.itemsFactory.viewModels[key].hasEntriesByYearMonthDay()['2014']['06']['06']).toBe(expected);
		          		done();
					});

					it("should return the total of entries for a given month", function(done){
						var key = "news10";
						var expected = 12;
						expect(controller.itemsFactory.viewModels[key].hasEntriesByYearMonthDay()['2014']['06']['00']).toBe(expected);
		          		done();
					});

					it("should return the total of entries for a given year", function(done){
						var key = "news10";
						var expected = 121;
						expect(controller.itemsFactory.viewModels[key].hasEntriesByYearMonthDay()['2014']['00']['00']).toBe(expected);
		          		done();
					});
				});
			});

			describe("Count of Items per Page - Paging", function(done) 
			{
				it("news-combined: should only have one of the predefined values as count of items per page - non standard value configured", function(done) {
					var key = "news10";
		          	var expected = 10; // set in configuration : 3
		          expect(controller.itemsFactory.viewModels[key].maxItems()).toBe(expected);
		          done();
				});
				it("news-combined: should only have one of the predefined values as count of items per page - standard value configured", function(done) {
					var key = "news10b";
		          	var expected = 20;
		          expect(controller.itemsFactory.viewModels[key].maxItems()).toBe(expected);
		          done();
				});
				it("news-combined : should not have more items than slice specified - non standard value configured - slice 1 [<= comparison to cover all configs]", function(done) 
		        {
		          var key = "news10c";
		          var expected = 2; // max configured was 1 but overwritten by 10 ; slice specifies 2
		          expect(controller.itemsFactory.viewModels[key].allNews()[0].length).toBeLessThan(expected + 1);
		          done();
		        });
		        it("news-combined : should not have more items than max specified - non standard value configured - slice 3 [<= comparison to cover all configs]", function(done) 
		        {
		          var key = "news10c";
		          var expected = 10; // 6 if default, 10 if first slice merged into it
		          // max configured was 1 but overwritten by 10 ; slice specifies all the rest
		          // first and second slice sum up to 6 items already displayed on page
		          expect(controller.itemsFactory.viewModels[key].allNews()[2].length).toBeLessThan(expected + 1);
		          done();
		        });
		        it("news-combined : should have all the items left - no limit configured - slice 3 [<= comparison to cover all configs]", function(done) 
		        {
		          var key = "news10nolimit";
		          var expected = controller.itemsFactory.viewModels[key].news().length; // 6 items are displayed by slices 1 and 2
		          expect(controller.itemsFactory.viewModels[key].allNews()[2].length).toBeLessThan(expected + 1);
		          done();
		        });
				it("news-combined : should have 3 slices of news items", function(done) 
		        {
		          var key = "news10";
		          var expected = 3;
		          expect(controller.itemsFactory.viewModels[key].slices().length).toBe(expected);
		          done();
		        });
				it("news-combined: should use template news-combined if current page is 1", function(done) 
		        {
		          var key = "news10";
		          var expected = "news-combined";
		          expect(controller.itemsFactory.configs[key].displayStyle).toBe(expected);
		          done();
		        });
				it("news-combined: should use template news-1-col-text-paging if current page is > 1", function(done) 
		        {
		          var key = "news10";
		          controller.displayItems({"key": key,
	                                        "currentPage": 3});
		          var expected = "news-1-col-text-paging";
		          expect(controller.itemsFactory.configs[key].displayStyle).toBe(expected);
		          done();
		        });
				it("news-combined: should recalculate total count of pages if count of items displayed on page is changed", function(done){
					var key = "news10b"; // 20 per page set
					var currentTotalNews = controller.itemsFactory.viewModels[key].news().length;
					controller.displayItems({"key":key,
	                                        "maxItems":30});
					var expected = Math.ceil(currentTotalNews / 30);
					expect(controller.itemsFactory.viewModels[key].totalPages()).toBe(expected);
		          	done();
				});
				it("news-combined: should not update to an impossible current page (bigger than total pages)", function(done){
					var key = "news10b"; // 20 per page set
					var expected = controller.itemsFactory.viewModels[key].totalPages();
					controller.displayItems({"key": key,
	                                        "currentPage": 345});

					expect(controller.itemsFactory.viewModels[key].currentPage()).toBe(expected);
		          	done();
				});
				it("news-combined: should recalculate current page number if count of items displayed on page is changed",function(done){
					var key = "news10b"; // 20 per page set
					var expected = 1; //second page starts with item 21 - when 30 per page, that item is on page 1
					controller.displayItems({"key": key,
	                                        "currentPage": 2});
					controller.displayItems({"key":key,
	                                        "maxItems":30});
					expect(controller.itemsFactory.viewModels[key].currentPage()).toBe(expected);
		          	done();
				});
			});
		});



		describe("Image and Placeholders", function() 
		{
			beforeEach(function(done)
		    {
		    	jasmine.getFixtures().set('<div id="news-module-news10img">\
	                <div id="news-overview-news10img">\
	                    <span data-bind="template: \'news-overview-template-news10img\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news10img",\
			            "displayStyle":"news-combined",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news10img" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news10img" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            </div>\
	            </div>');
				
				setUpTestingEnvironment(1, 2, done);
		    });

			describe("What is being tested here is the configuration injected for template rendering.", function(){});

			it("news-combined: should merge first slice into second slice - as news-1-col-thumbnails - if none of the first slice News Items has a picture AND at least one of the News Items of the second slice has a picture", function(done){
				var key = "news10img";
				// slice 1
	          	expect(controller.itemsFactory.viewModels[key].slices()[0][0]).toBe(0);
	          	expect(controller.itemsFactory.viewModels[key].slices()[0][1]).toBe(0);
	          	// slice 2
	          	expect(controller.itemsFactory.viewModels[key].slices()[1][0]).toBe(1);
	          	expect(controller.itemsFactory.viewModels[key].slices()[1][1]).toBe(6);
	          	// slice 3
	          	expect(controller.itemsFactory.viewModels[key].slices()[2][0]).toBe(7);
	          	expect(controller.itemsFactory.viewModels[key].slices()[2][1]).toBe(null);
	          	done();
			});
		});

		describe("Image and Placeholders", function() 
		{
			beforeEach(function(done) 
		    {
		    	jasmine.getFixtures().set('<div id="news-module-news10img">\
	                <div id="news-overview-news10img">\
	                    <span data-bind="template: \'news-overview-template-news10img\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news10img",\
			            "displayStyle":"news-combined",\
			            "maxItems":3,\
			            "organizationId": "109082",\
			            "coreKeywordIds": "472"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news10img" href="http://publichealth.yale.edu/news/archive/article.aspx?id=" style="display: none"></a>\
	                    <a id="keywordBaseLink-news10img" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            </div>\
	            </div>');

				setUpTestingEnvironment(1, 1, done);
		    });

			describe("What is being tested here is the configuration injected for template rendering.", function(){});

			it("news-combined: should display first slice as news-1-col-highlight if at least one News Items has a picture", function(done){
				var key = "news10img";
				// requires another static data set
				// slice 1
	          	expect(controller.itemsFactory.viewModels[key].slices()[0][0]).toBe(1);
	          	expect(controller.itemsFactory.viewModels[key].slices()[0][1]).toBe(2);
	          	// slice 2
	          	expect(controller.itemsFactory.viewModels[key].slices()[1][0]).toBe(3);
	          	expect(controller.itemsFactory.viewModels[key].slices()[1][1]).toBe(4);
	          	// slice 3
	          	expect(controller.itemsFactory.viewModels[key].slices()[2][0]).toBe(7);
	          	expect(controller.itemsFactory.viewModels[key].slices()[2][1]).toBe(null);
	          	done();
			});
		});

		describe("Extra Configuration Available", function() 
		{
			beforeEach(function(done) 
		    {
		    	jasmine.getFixtures().set('<div id="news-module-news1advanced">\
	                <div id="news-overview-news1advanced">\
	                    <span data-bind="template: \'news-overview-template-news1advanced\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news1advanced",\
	                    "displayStyle":"news-side-thumbnails",\
	                    "maxItems":5,\
	                    "organizationId": "109082",\
	                    "coreKeywordIds": "472",\
	                	"serviceUrlBase": "http://ypms-service-a18.azurewebsites.net"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news1advanced" \
	                    href="http://publichealth.yale.edu/news/archive/article.aspx?id=" \
	                    style="display: none"></a>\
	                    <a id="keywordBaseLink-news1advanced" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>\
	            </div>\
	            <div id="news-module-news2advanced">\
	                <div id="news-overview-news2advanced">\
	                    <span data-bind="template: \'news-overview-template-news2advanced\'"></span>\
	                </div>\
	                <span class="news-setup-data" style="display: none">\
	                    [{"key":"news2advanced",\
	                    "displayStyle":"news-combined",\
	                    "maxItems":10,\
	                    "organizationId": "109082",\
	                    "coreKeywordIds": "472,308"}]\
	                </span>\
	                <div class="news-setup-data-links">\
	                    <a id="readMoreBaseLink-news2advanced" \
	                    href="http://publichealth.yale.edu/news/archive/article.aspx?id=" \
	                    style="display: none"></a>\
	                    <a id="keywordBaseLink-news2advanced" href="http://ypms-service-a16.azurewebsites.net/service/news/summaries/?organizationIds=109082&KeywordIds=" style="display: none"></a>\
	                </div>');
					
					setUpTestingEnvironment(2, 0, done);
		    });

			describe("Advanced Use", function(done) 
			{
				it("should overwrite the default service URL if specified in DOM configuration", function(done) 
		        {
		          var key = "news1advanced";
		          var expected = "http://ypms-service-a18.azurewebsites.net";
		          expect(controller.itemsFactory.configs[key].serviceUrlBase).toBe(expected);
		          done();
		        });
			});
		});
	});
});