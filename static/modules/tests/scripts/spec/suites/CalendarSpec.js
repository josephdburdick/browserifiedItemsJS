define(['knockout','jquery','moment', 'sinon','itemsController','calendarContainer/jCal2Display','calendarConstants','calendarEventListeners','layoutFactory','jasmine','jasmine-jquery'], function(ko,$, Moment, sinon, Controller, Container, calendarConstants, calendarEventListeners, layoutHelper)
{
    var controller;

    function setUpTestingEnvironment(expectedIterations, done)
    {
        var configurationDoneFlag = done;

        // var clock = sinon.useFakeTimers((new Date('2015-01-23')).getTime(), "Date");

        var server = configureFakeServer();

        var currentCount = 0;
        var countExpected = expectedIterations;

        // content of main.js
        // retrieve configuration
        var domConfiguration = $(['.', calendarConstants.idNames.calendarSetupData].join(''));
        var domLinksContainer = $(['.', calendarConstants.idNames.calendarSetupDataLinks].join(''));

        if (domConfiguration != null && domConfiguration.length > 0 && domLinksContainer != null && domLinksContainer.length > 0 && domConfiguration.length == domLinksContainer.length)
        {
          require(['jquery','calendarConstants','calendarContainer/json2jCal','calendarContainer/jCal2Display','calendarEvent/jCal2Display','calendarLayout'], function($, calendarConstants) 
        {
            // when using news-combined as the template, be aware that the next paging chunks should 
            // be displayed using the "news-1-col-text" template
            controller = new Controller();
            var itemType = 'calendar';
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

            // this was added because spying on renderItems() fails - from single calendar event that then creates the background calendar
            spyOn(controller,'renderSingleItem').and.callFake(
            function(params)
            {
                currentCount++;
                if (countExpected == currentCount)
                {
                    configurationDoneFlag();
                }
            });

            var config;

            for(var x=0;x<domConfiguration.length;x++)
            {
              config = JSON.parse($(domConfiguration[x]).text());
                $(['.', calendarConstants.idNames.calendarSetupData].join('')).remove();

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

    function configureFakeServer()
    {
      // when handling a single event, the server responds without a vcalendars container
      var responseOneEvent = {"vcalendar":{"@x-wr-relcalid":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493","@x-wr-calname":"Yale School of Public Health","@x-wr-caldesc":"http://tools.medicine.yale.edu/calendar/group.ics?id=f7eddf79-9d09-46f8-bc04-ad9e83c8c493&u=00000000-0000-0000-0000-000000000000&h=c5ce5a83-4858-6e2a-ac80-c2de86735fc5","vevent":[{"@uid":"92e56d42-ea4d-4cb8-b89a-0e377fdf849e","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2014-08-12 13:38:56Z","@dtstart":"2015-01-20T11:30:00","@dtend":"2015-01-20T13:00:00","@summary":"Faculty Meeting","@location":"LEPH 216","xml":{"p":[{"k":"street","v":"60 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3034356"},{"k":"lng","v":"-72.9315612"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3201"},{"k":"audience","v":"Restricted (Call)"},{"k":"admission","v":"free"},{"k":"contact","v":"Alyson Zeitlin"},{"k":"contact_id","v":"b2246506-5014-4c34-a50d-b0410f8c9301"},{"k":"contact_phone","v":"203-785-7373"},{"k":"contact_email","v":"alyson.zeitlin@yale.edu"}],"override":[{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"3754004d-110a-4aa5-bd54-ff477591a242"}]}}]}};

        var responseOneWeek = {"vcalendars":{"@http":"http://tools.medicine.yale.edu/ysph/calendar/","@service":"http://tools.medicine.yale.edu/ysph/calendar/","@path":"http://tools.medicine.yale.edu/ysph/calendar/","@format":"l","@dtstart":"2015-01-15","@dtend":"2015-01-21","@dtsel":"2015-01-15","@create":"0","@group":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493","vcalendar":{"@x-wr-relcalid":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493","@x-wr-calname":"Yale School of Public Health","@x-wr-caldesc":"http://tools.medicine.yale.edu/calendar/group.ics?id=f7eddf79-9d09-46f8-bc04-ad9e83c8c493&u=00000000-0000-0000-0000-000000000000&h=c5ce5a83-4858-6e2a-ac80-c2de86735fc5","vevent":[{"@uid":"92e56d42-ea4d-4cb8-b89a-0e377fdf849e","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2014-08-12 13:38:56Z","@dtstart":"2015-01-20T11:30:00","@dtend":"2015-01-20T13:00:00","@summary":"Faculty Meeting","@location":"LEPH 216","xml":{"p":[{"k":"street","v":"60 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3034356"},{"k":"lng","v":"-72.9315612"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3201"},{"k":"audience","v":"Restricted (Call)"},{"k":"admission","v":"free"},{"k":"contact","v":"Alyson Zeitlin"},{"k":"contact_id","v":"b2246506-5014-4c34-a50d-b0410f8c9301"},{"k":"contact_phone","v":"203-785-7373"},{"k":"contact_email","v":"alyson.zeitlin@yale.edu"}],"override":[{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"3754004d-110a-4aa5-bd54-ff477591a242"}]}},{"@uid":"75817bdc-3c3e-4926-95c3-ea673cc7062e","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-05 17:52:24Z","@dtstart":"2015-01-20T12:00:00","@dtend":"2015-01-20T13:00:00","@summary":"Funding your Internship","@location":"Conference Room","description":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Do you want to apply for funding for your unpaid internship this summer? This workshop will review the funding process and provide resources for your funding application.</div>","descriptionText":"Do you want to apply for funding for your unpaid internship this summer? This workshop will review the funding process and provide resources for your funding application.","descriptionHtml":{"div":{"@xmlns":"http://www.w3.org/1999/xhtml","#text":"Do you want to apply for funding for your unpaid internship this summer? This workshop will review the funding process and provide resources for your funding application."}},"xml":{"p":[{"k":"street","v":"47 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3030755"},{"k":"lng","v":"-72.9315593"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3209"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"free"},{"k":"contact","v":"Kelly Shay"},{"k":"contact_id","v":"01b1ff2b-b080-4450-a2c1-5442dad0482d"},{"k":"contact_email","v":"kelly.shay@yale.edu"}],"override":[{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"3edac1c4-1f55-4ac1-ba89-7934261a34d0"}]}},{"@uid":"9d1105d6-ce83-44a3-843b-52bab7e909eb","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-05 17:52:01Z","@dtstart":"2015-01-16T12:00:00","@dtend":"2015-01-16T13:00:00","@summary":"Resume & Cover Letter Workshop","@location":"Career Services Conference Room","description":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Need to polish that resume &amp; cover letter? This workshop will review tips for making your resume and cover letter stand out!<br />\n<br />\nAll current YSPH students are welcome, but this is targeted for 2nd years.</div>","descriptionText":"Need to polish that resume & cover letter? This workshop will review tips for making your resume and cover letter stand out!\n\nAll current YSPH students are welcome, but this is targeted for 2nd years.","descriptionHtml":{"div":{"@xmlns":"http://www.w3.org/1999/xhtml","#text":["Need to polish that resume & cover letter? This workshop will review tips for making your resume and cover letter stand out!","\r\nAll current YSPH students are welcome, but this is targeted for 2nd years."],"br":[null,null]}},"xml":{"p":[{"k":"street","v":"47 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3030755"},{"k":"lng","v":"-72.9315593"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3209"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"free"},{"k":"contact","v":"Kelly Shay"},{"k":"contact_id","v":"01b1ff2b-b080-4450-a2c1-5442dad0482d"},{"k":"contact_email","v":"kelly.shay@yale.edu"}],"override":[{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"3edac1c4-1f55-4ac1-ba89-7934261a34d0"}]}},{"@uid":"ee1adec9-261a-44b3-abcd-443d1aad2fdc","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2014-12-12 20:00:13Z","@dtstart":"2015-01-19","@dtend":"2015-01-20","@url":"http://http//publichealth.yale.edu/about/gateways/students/MPH/calendar14-15.aspx","@summary":"Martin Luther King Day - Classes do not meet","tag":"Announcements and Notices","xml":{"p":[{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"Not Applicable"},{"k":"contact","v":"Sarah Harmon"},{"k":"contact_id","v":"d31f81f1-df29-4747-ba41-243997cd0430"},{"k":"contact_email","v":"sarah.harmon@yale.edu"}],"override":{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"}}},{"@uid":"aacf1aec-66d6-4f0b-8ee7-cff8adcaff4b","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-13 17:26:50Z","@dtstart":"2015-01-15T12:00:00","@dtend":"2015-01-15T13:00:00","@summary":"YSPH Epidemiology of Microbial Diseases Seminar Series: \"Ebola Panel Discussion: Lessons Learned about Treatment and Control in the US and Abroad\"","@location":"LEPH 101","tag":["Announcements and Notices","Lectures and Seminars"],"xml":{"flyer":{"@stream":"f5aa10f4-e328-4e1c-8ab6-8dda3cbe90c6","@photo":"0"},"p":[{"k":"street","v":"60 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3037124"},{"k":"lng","v":"-72.9321268"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3201"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"n/a"},{"k":"food","v":"1"},{"k":"contact","v":"Kimberly Rogers"},{"k":"contact_id","v":"356e1f60-c611-4df0-a488-5d2c6425d0b4"},{"k":"contact_phone","v":"5-2912"},{"k":"contact_email","v":"kimberly.rogers@yale.edu"},{"k":"speaker","v":"Multiple Speakers"},{"k":"speaker_host","v":"S. Parikh/V. Pitzer"}],"override":[{"@id":"1a953431-005a-4656-8178-6d04111cb3ec"},{"@id":"54275d1d-7754-4c21-95b1-6974869daa14"},{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"a71e3432-6a54-4e47-93c2-6d079e904f93"},{"@id":"a803d72d-8c79-48ac-971a-1ef56f708ecb"}]}},{"@uid":"7028a6b6-2f3d-49fa-a918-404544c5e687","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2014-12-12 19:58:59Z","@dtstart":"2015-01-16","@dtend":"2015-01-17","@url":"http://http//publichealth.yale.edu/about/gateways/students/MPH/calendar14-15.aspx","@summary":"Monday classes meet on Friday","tag":"Announcements and Notices","xml":{"p":[{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"Not Applicable"},{"k":"contact","v":"Sarah Harmon"},{"k":"contact_id","v":"d31f81f1-df29-4747-ba41-243997cd0430"},{"k":"contact_email","v":"sarah.harmon@yale.edu"}],"override":{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"}}},{"@uid":"acce51c7-a471-4de2-9468-47675044f635","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2014-12-10 14:55:49Z","@dtstart":"2015-01-20T11:00:00","@dtend":"2015-01-20T15:30:00","@url":"http://tools.medicine.yale.edu/resource/?id=c520f463-c914-4405-8609-fbe0094f76df&d=2015-01-09","@summary":"YSPH Faculty Photo Shoot","@location":"LEPH, Weinerman Room, 3rd Floor","description":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Headshots for faculty, research scientists and lecturers will be taken. There will be two walk in periods and scheduled appointments. Click link above to schedule your sitting.\n<p>11 to 11:30&#x2014;walk-ins before the faculty meeting</p>\n<p>11:30 to 12:30&#x2014;scheduled appointments</p>\n<p>12:30 to 1:15&#x2014;walk-ins from after the faculty meeting</p>\n<p>1:15 to 3:30&#x2014;scheduled headshots&#xA0;</p>\n</div>","descriptionText":"Headshots for faculty, research scientists and lecturers will be taken. There will be two walk in periods and scheduled appointments. Click link above to schedule your sitting.11 to 11:30—walk-ins before the faculty meeting\n\n11:30 to 12:30—scheduled appointments\n\n12:30 to 1:15—walk-ins from after the faculty meeting\n\n1:15 to 3:30—scheduled headshots ","descriptionHtml":{"div":{"@xmlns":"http://www.w3.org/1999/xhtml","#text":"Headshots for faculty, research scientists and lecturers will be taken. There will be two walk in periods and scheduled appointments. Click link above to schedule your sitting.\r\n","p":["11 to 11:30—walk-ins before the faculty meeting","11:30 to 12:30—scheduled appointments","12:30 to 1:15—walk-ins from after the faculty meeting","1:15 to 3:30—scheduled headshots "]}},"xml":{"flyer":{"@stream":"bd323f36-75f3-45f3-bd0e-c7ec961f319a","@photo":"0"},"p":[{"k":"street","v":"60 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3037124"},{"k":"lng","v":"-72.9321268"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3201"},{"k":"audience","v":"Restricted (Call)"},{"k":"admission","v":"free"},{"k":"contact","v":"Denise Meyer"},{"k":"contact_id","v":"363fecbb-ab9d-4e0c-b58c-815c550abdcd"},{"k":"contact_email","v":"denise.meyer@yale.edu"}],"override":[{"@id":"1a953431-005a-4656-8178-6d04111cb3ec"},{"@id":"ad15239b-0035-42d5-8d33-06eeab873833"},{"@id":"cff047cf-02f1-4e8e-bab5-88b5a4d24177"},{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"e5a07cde-228f-4814-826e-580a5ef20d94"},{"@id":"e5447deb-3b3b-4c31-a0de-aa6cc85ac8fb"},{"@id":"3754004d-110a-4aa5-bd54-ff477591a242"}]}},{"@uid":"0639b3d3-e6f1-4e74-92c6-acc1f22ac8fb","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-13 16:29:38Z","@dtstart":"2015-01-15T18:00:00","@dtend":"2015-01-15T19:00:00","@summary":"School of Management Presents: \"Colloquium in Healthcare Leadership: A Conversation with Richard D'Aquila, MPH (YSPH '79)\"","@location":"Beaumont Room, SHM L-221-A","tag":"Lectures and Seminars","xml":{"p":[{"k":"street","v":"333 Cedar St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3032184"},{"k":"lng","v":"-72.9340036"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3206"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"Free"},{"k":"contact","v":"Judith Gargiulo"},{"k":"contact_id","v":"a9cee108-b79b-4065-a725-d2c57fb51ade"},{"k":"contact_email","v":"judi.gargiulo@yale.edu"},{"k":"speaker","v":"Richard D'Aquila, MPH "},{"k":"speaker_title","v":"Executive VP, Yale-New Haven Health System"},{"k":"speaker_ou","v":"President and COO, Yale-New Haven Hospital"},{"k":"speaker_host","v":"Yale SOM"}],"override":[{"@id":"e5447deb-3b3b-4c31-a0de-aa6cc85ac8fb"},{"@id":"a71e3432-6a54-4e47-93c2-6d079e904f93"},{"@id":"00648f65-9526-456f-ab31-10d2eb9d9aa4"},{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"}]}},{"@uid":"b541248b-3d21-4c23-80ee-ae9a53138d6b","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-06 17:20:25Z","@dtstart":"2015-01-19","@dtend":"2015-01-20","@url":"http://publichealth.yale.edu/downs","@summary":"Downs Fellowship Proposal Due","@location":"All proposals should be emailed to Anjuli Bodyk by deadline 12pm","tag":"Deadlines","description":"<div xmlns=\"http://www.w3.org/1999/xhtml\">The Downs Fellowship committee allow all interested applications to submit their proposal&#xA0;to the program coordinator. Each application will then be matched with a Downs Committee member to have a private meeting to review the draft before submitting final application.&#xA0;<br />\n<br />\nFor questions, please contact Anjuli Bodyk.&#xA0;</div>","descriptionText":"The Downs Fellowship committee allow all interested applications to submit their proposal to the program coordinator. Each application will then be matched with a Downs Committee member to have a private meeting to review the draft before submitting final application. \n\nFor questions, please contact Anjuli Bodyk. ","descriptionHtml":{"div":{"@xmlns":"http://www.w3.org/1999/xhtml","#text":["The Downs Fellowship committee allow all interested applications to submit their proposal to the program coordinator. Each application will then be matched with a Downs Committee member to have a private meeting to review the draft before submitting final application. ","\r\nFor questions, please contact Anjuli Bodyk. "],"br":[null,null]}},"xml":{"p":[{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"N/A"},{"k":"contact","v":"Anjuli Bodyk"},{"k":"contact_id","v":"6acd2f21-5981-4bf0-b842-6b0cb902ddde"},{"k":"contact_phone","v":"203-737-1997"},{"k":"contact_email","v":"anjuli.bodyk@yale.edu"},{"k":"speaker_o","v":"Downs Fellowship Committee"}],"override":[{"@id":"6566661c-c4ad-4f2f-97f5-e0a5d006c4a1"},{"@id":"a803d72d-8c79-48ac-971a-1ef56f708ecb"},{"@id":"3edac1c4-1f55-4ac1-ba89-7934261a34d0"},{"@id":"062b575b-2bbb-45e1-a396-dcda82cc4982"},{"@id":"a71e3432-6a54-4e47-93c2-6d079e904f93"},{"@id":"0e74d588-a934-44ac-a7eb-2f8261e6cffe"},{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"}]}}]}}};
        var responseOneMonth = {"vcalendars":{"@http":"http://tools.medicine.yale.edu/ysph/calendar/","@service":"http://tools.medicine.yale.edu/ysph/calendar/","@path":"http://tools.medicine.yale.edu/ysph/calendar/","@format":"l","@dtstart":"2015-01-01","@dtend":"2015-01-31","@dtsel":"2015-01-30","@create":"0","@group":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493","vcalendar":{"@x-wr-relcalid":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493","@x-wr-calname":"Yale School of Public Health","@x-wr-caldesc":"http://tools.medicine.yale.edu/calendar/group.ics?id=f7eddf79-9d09-46f8-bc04-ad9e83c8c493&u=00000000-0000-0000-0000-000000000000&h=c5ce5a83-4858-6e2a-ac80-c2de86735fc5","vevent":[{"@uid":"92e56d42-ea4d-4cb8-b89a-0e377fdf849e","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-23 13:38:56Z","@dtstart":"2015-01-23T11:30:00","@dtend":"2015-01-23T13:00:00","@summary":"Faculty Meeting","@location":"LEPH 216","xml":{"p":[{"k":"street","v":"60 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3034356"},{"k":"lng","v":"-72.9315612"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3201"},{"k":"audience","v":"Restricted (Call)"},{"k":"admission","v":"free"},{"k":"contact","v":"Alyson Zeitlin"},{"k":"contact_id","v":"b2246506-5014-4c34-a50d-b0410f8c9301"},{"k":"contact_phone","v":"203-785-7373"},{"k":"contact_email","v":"alyson.zeitlin@yale.edu"}],"override":[{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"3754004d-110a-4aa5-bd54-ff477591a242"}]}},{"@uid":"75817bdc-3c3e-4926-95c3-ea673cc7062e","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-05 17:52:24Z","@dtstart":"2015-01-20T12:00:00","@dtend":"2015-01-20T13:00:00","@summary":"Funding your Internship","@location":"Conference Room","description":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Do you want to apply for funding for your unpaid internship this summer? This workshop will review the funding process and provide resources for your funding application.</div>","descriptionText":"Do you want to apply for funding for your unpaid internship this summer? This workshop will review the funding process and provide resources for your funding application.","descriptionHtml":{"div":{"@xmlns":"http://www.w3.org/1999/xhtml","#text":"Do you want to apply for funding for your unpaid internship this summer? This workshop will review the funding process and provide resources for your funding application."}},"xml":{"p":[{"k":"street","v":"47 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3030755"},{"k":"lng","v":"-72.9315593"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3209"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"free"},{"k":"contact","v":"Kelly Shay"},{"k":"contact_id","v":"01b1ff2b-b080-4450-a2c1-5442dad0482d"},{"k":"contact_email","v":"kelly.shay@yale.edu"}],"override":[{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"3edac1c4-1f55-4ac1-ba89-7934261a34d0"}]}},{"@uid":"9d1105d6-ce83-44a3-843b-52bab7e909eb","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-05 17:52:01Z","@dtstart":"2015-01-16T12:00:00","@dtend":"2015-01-16T13:00:00","@summary":"Resume & Cover Letter Workshop","@location":"Career Services Conference Room","description":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Need to polish that resume &amp; cover letter? This workshop will review tips for making your resume and cover letter stand out!<br />\n<br />\nAll current YSPH students are welcome, but this is targeted for 2nd years.</div>","descriptionText":"Need to polish that resume & cover letter? This workshop will review tips for making your resume and cover letter stand out!\n\nAll current YSPH students are welcome, but this is targeted for 2nd years.","descriptionHtml":{"div":{"@xmlns":"http://www.w3.org/1999/xhtml","#text":["Need to polish that resume & cover letter? This workshop will review tips for making your resume and cover letter stand out!","\r\nAll current YSPH students are welcome, but this is targeted for 2nd years."],"br":[null,null]}},"xml":{"p":[{"k":"street","v":"47 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3030755"},{"k":"lng","v":"-72.9315593"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3209"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"free"},{"k":"contact","v":"Kelly Shay"},{"k":"contact_id","v":"01b1ff2b-b080-4450-a2c1-5442dad0482d"},{"k":"contact_email","v":"kelly.shay@yale.edu"}],"override":[{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"3edac1c4-1f55-4ac1-ba89-7934261a34d0"}]}},{"@uid":"ee1adec9-261a-44b3-abcd-443d1aad2fdc","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2014-12-12 20:00:13Z","@dtstart":"2015-01-19","@dtend":"2015-01-20","@url":"http://http//publichealth.yale.edu/about/gateways/students/MPH/calendar14-15.aspx","@summary":"Martin Luther King Day - Classes do not meet","tag":"Announcements and Notices","xml":{"p":[{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"Not Applicable"},{"k":"contact","v":"Sarah Harmon"},{"k":"contact_id","v":"d31f81f1-df29-4747-ba41-243997cd0430"},{"k":"contact_email","v":"sarah.harmon@yale.edu"}],"override":{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"}}},{"@uid":"aacf1aec-66d6-4f0b-8ee7-cff8adcaff4b","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-13 17:26:50Z","@dtstart":"2015-01-15T12:00:00","@dtend":"2015-01-15T13:00:00","@summary":"YSPH Epidemiology of Microbial Diseases Seminar Series: \"Ebola Panel Discussion: Lessons Learned about Treatment and Control in the US and Abroad\"","@location":"LEPH 101","tag":["Announcements and Notices","Lectures and Seminars"],"xml":{"flyer":{"@stream":"f5aa10f4-e328-4e1c-8ab6-8dda3cbe90c6","@photo":"0"},"p":[{"k":"street","v":"60 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3037124"},{"k":"lng","v":"-72.9321268"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3201"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"n/a"},{"k":"food","v":"1"},{"k":"contact","v":"Kimberly Rogers"},{"k":"contact_id","v":"356e1f60-c611-4df0-a488-5d2c6425d0b4"},{"k":"contact_phone","v":"5-2912"},{"k":"contact_email","v":"kimberly.rogers@yale.edu"},{"k":"speaker","v":"Multiple Speakers"},{"k":"speaker_host","v":"S. Parikh/V. Pitzer"}],"override":[{"@id":"1a953431-005a-4656-8178-6d04111cb3ec"},{"@id":"54275d1d-7754-4c21-95b1-6974869daa14"},{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"a71e3432-6a54-4e47-93c2-6d079e904f93"},{"@id":"a803d72d-8c79-48ac-971a-1ef56f708ecb"}]}},{"@uid":"7028a6b6-2f3d-49fa-a918-404544c5e687","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2014-12-12 19:58:59Z","@dtstart":"2015-01-16","@dtend":"2015-01-17","@url":"http://http//publichealth.yale.edu/about/gateways/students/MPH/calendar14-15.aspx","@summary":"Monday classes meet on Friday","tag":"Announcements and Notices","xml":{"p":[{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"Not Applicable"},{"k":"contact","v":"Sarah Harmon"},{"k":"contact_id","v":"d31f81f1-df29-4747-ba41-243997cd0430"},{"k":"contact_email","v":"sarah.harmon@yale.edu"}],"override":{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"}}},{"@uid":"acce51c7-a471-4de2-9468-47675044f635","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2014-12-10 14:55:49Z","@dtstart":"2015-01-20T11:00:00","@dtend":"2015-01-20T15:30:00","@url":"http://tools.medicine.yale.edu/resource/?id=c520f463-c914-4405-8609-fbe0094f76df&d=2015-01-09","@summary":"YSPH Faculty Photo Shoot","@location":"LEPH, Weinerman Room, 3rd Floor","description":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Headshots for faculty, research scientists and lecturers will be taken. There will be two walk in periods and scheduled appointments. Click link above to schedule your sitting.\n<p>11 to 11:30&#x2014;walk-ins before the faculty meeting</p>\n<p>11:30 to 12:30&#x2014;scheduled appointments</p>\n<p>12:30 to 1:15&#x2014;walk-ins from after the faculty meeting</p>\n<p>1:15 to 3:30&#x2014;scheduled headshots&#xA0;</p>\n</div>","descriptionText":"Headshots for faculty, research scientists and lecturers will be taken. There will be two walk in periods and scheduled appointments. Click link above to schedule your sitting.11 to 11:30—walk-ins before the faculty meeting\n\n11:30 to 12:30—scheduled appointments\n\n12:30 to 1:15—walk-ins from after the faculty meeting\n\n1:15 to 3:30—scheduled headshots ","descriptionHtml":{"div":{"@xmlns":"http://www.w3.org/1999/xhtml","#text":"Headshots for faculty, research scientists and lecturers will be taken. There will be two walk in periods and scheduled appointments. Click link above to schedule your sitting.\r\n","p":["11 to 11:30—walk-ins before the faculty meeting","11:30 to 12:30—scheduled appointments","12:30 to 1:15—walk-ins from after the faculty meeting","1:15 to 3:30—scheduled headshots "]}},"xml":{"flyer":{"@stream":"bd323f36-75f3-45f3-bd0e-c7ec961f319a","@photo":"0"},"p":[{"k":"street","v":"60 College St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3037124"},{"k":"lng","v":"-72.9321268"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3201"},{"k":"audience","v":"Restricted (Call)"},{"k":"admission","v":"free"},{"k":"contact","v":"Denise Meyer"},{"k":"contact_id","v":"363fecbb-ab9d-4e0c-b58c-815c550abdcd"},{"k":"contact_email","v":"denise.meyer@yale.edu"}],"override":[{"@id":"1a953431-005a-4656-8178-6d04111cb3ec"},{"@id":"ad15239b-0035-42d5-8d33-06eeab873833"},{"@id":"cff047cf-02f1-4e8e-bab5-88b5a4d24177"},{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"},{"@id":"e5a07cde-228f-4814-826e-580a5ef20d94"},{"@id":"e5447deb-3b3b-4c31-a0de-aa6cc85ac8fb"},{"@id":"3754004d-110a-4aa5-bd54-ff477591a242"}]}},{"@uid":"0639b3d3-e6f1-4e74-92c6-acc1f22ac8fb","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-13 16:29:38Z","@dtstart":"2015-01-15T18:00:00","@dtend":"2015-01-15T19:00:00","@summary":"School of Management Presents: \"Colloquium in Healthcare Leadership: A Conversation with Richard D'Aquila, MPH (YSPH '79)\"","@location":"Beaumont Room, SHM L-221-A","tag":"Lectures and Seminars","xml":{"p":[{"k":"street","v":"333 Cedar St"},{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"lat","v":"41.3032184"},{"k":"lng","v":"-72.9340036"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"postal","v":"06510-3206"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"Free"},{"k":"contact","v":"Judith Gargiulo"},{"k":"contact_id","v":"a9cee108-b79b-4065-a725-d2c57fb51ade"},{"k":"contact_email","v":"judi.gargiulo@yale.edu"},{"k":"speaker","v":"Richard D'Aquila, MPH "},{"k":"speaker_title","v":"Executive VP, Yale-New Haven Health System"},{"k":"speaker_ou","v":"President and COO, Yale-New Haven Hospital"},{"k":"speaker_host","v":"Yale SOM"}],"override":[{"@id":"e5447deb-3b3b-4c31-a0de-aa6cc85ac8fb"},{"@id":"a71e3432-6a54-4e47-93c2-6d079e904f93"},{"@id":"00648f65-9526-456f-ab31-10d2eb9d9aa4"},{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"}]}},{"@uid":"b541248b-3d21-4c23-80ee-ae9a53138d6b","@status":"CONFIRMED","@class":"PUBLIC","@dtstamp":"2015-01-06 17:20:25Z","@dtstart":"2015-01-19","@dtend":"2015-01-20","@url":"http://publichealth.yale.edu/downs","@summary":"Downs Fellowship Proposal Due","@location":"All proposals should be emailed to Anjuli Bodyk by deadline 12pm","tag":"Deadlines","description":"<div xmlns=\"http://www.w3.org/1999/xhtml\">The Downs Fellowship committee allow all interested applications to submit their proposal&#xA0;to the program coordinator. Each application will then be matched with a Downs Committee member to have a private meeting to review the draft before submitting final application.&#xA0;<br />\n<br />\nFor questions, please contact Anjuli Bodyk.&#xA0;</div>","descriptionText":"The Downs Fellowship committee allow all interested applications to submit their proposal to the program coordinator. Each application will then be matched with a Downs Committee member to have a private meeting to review the draft before submitting final application. \n\nFor questions, please contact Anjuli Bodyk. ","descriptionHtml":{"div":{"@xmlns":"http://www.w3.org/1999/xhtml","#text":["The Downs Fellowship committee allow all interested applications to submit their proposal to the program coordinator. Each application will then be matched with a Downs Committee member to have a private meeting to review the draft before submitting final application. ","\r\nFor questions, please contact Anjuli Bodyk. "],"br":[null,null]}},"xml":{"p":[{"k":"city","v":"New Haven"},{"k":"region","v":"CT"},{"k":"country","v":"US"},{"k":"dirty","v":"0"},{"k":"override","v":"0"},{"k":"audience","v":"Yale Only"},{"k":"admission","v":"N/A"},{"k":"contact","v":"Anjuli Bodyk"},{"k":"contact_id","v":"6acd2f21-5981-4bf0-b842-6b0cb902ddde"},{"k":"contact_phone","v":"203-737-1997"},{"k":"contact_email","v":"anjuli.bodyk@yale.edu"},{"k":"speaker_o","v":"Downs Fellowship Committee"}],"override":[{"@id":"6566661c-c4ad-4f2f-97f5-e0a5d006c4a1"},{"@id":"a803d72d-8c79-48ac-971a-1ef56f708ecb"},{"@id":"3edac1c4-1f55-4ac1-ba89-7934261a34d0"},{"@id":"062b575b-2bbb-45e1-a396-dcda82cc4982"},{"@id":"a71e3432-6a54-4e47-93c2-6d079e904f93"},{"@id":"0e74d588-a934-44ac-a7eb-2f8261e6cffe"},{"@id":"f7eddf79-9d09-46f8-bc04-ad9e83c8c493"}]}}]}}};

        var server = sinon.fakeServer.create();

        var url1w = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-02-05&e=2015-02-11&output=json";
        var url2w = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-02-05&e=2015-02-11&output=json";
        var url3m = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-02-01&e=2015-02-28&output=json";
        var url4w = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-23&e=2015-01-29&output=json";
        var url5w = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-30&e=2015-02-05&output=json";
        var url6m = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-23&e=2015-01-29&output=json";
        var url7w = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-16&e=2015-01-22&output=json";
        var url8m = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-01-01&e=2015-01-31&output=json";
        var url9w = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-15&e=2015-01-21&output=json";
        var url10m = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2014-12-01&e=2014-12-31&output=json";
        var url11w = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-02-06&e=2015-02-12&output=json";
        var url12w = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-02-06&e=2015-02-12&output=json";
        var url13w = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-01-20&e=2015-01-26&output=json";
        var url14w = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-20&e=2015-01-26&output=json";
        var url15w = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-01-23&e=2015-01-29&output=json";
        var url16w = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-23&e=2015-01-29&output=json";
        var url17w = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-01-15&e=2015-01-21&output=json";
        var url15d = "http://tools.medicine.yale.edu/calendar/event?id=1da4f391-167a-4437-8515-d9cb69a64727&output=json";



        server.respondWith("GET", url1w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url2w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url3m,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneMonth)]);
        server.respondWith("GET", url4w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url5w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url6m,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneMonth)]);
        server.respondWith("GET", url7w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url8m,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneMonth)]);
        server.respondWith("GET", url9w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url10m,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneMonth)]);
        server.respondWith("GET", url11w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url12w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url13w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url14w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url15w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url16w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url17w,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneWeek)]);
        server.respondWith("GET", url15d,[200, { "Content-Type": "application/json" }, JSON.stringify(responseOneEvent)]);

        return server;
    }

    describe("Calendar Widget", function() 
    {
        describe("IMPORTANT : The content of main.js is replicated here, so make sure it reflects the latest code version. This testing uses a mock for interacting with the DOM and retrieving data (returning static data).",function(){});
        describe("The list of tests is not exhaustive. Its purpose is to ensure the consistency of applied configuration and data used on the UI.", function(){});
        describe("The async testing mechanism used relies on a flag returned by the Facade mock. It gives time for the application to load properly before testing the view model's expected values.", function(){});

        describe("No Configuration available", function()
        {
            // this code should be updated to always reflect the content of main.js
            // because of the need for async flag, there is a small hack added
            beforeEach(function(done) 
            {
                // for testing purposes only - applied to the mock
                // the mock will confirm status done when it has been queried twice for data (key1 and key2)
                setUpTestingEnvironment(0, done);
            });

            it("should not load the whole application if there is no configuration found in the DOM",function(done){
                expect(controller).toBe(undefined);
                done();
            });
        });

        describe("Partial Configuration Available", function()
        {
            // this code should be updated to always reflect the content of main.js
            // because of the need for async flag, there is a small hack added
            beforeEach(function(done) 
            {
                jasmine.getFixtures().set('<div id="event-content">\
                <span data-bind="template: \'event-details-template\'"></span>\
            </div>\
            <div id="calendar-module-cal1">\
                <div id="calendar-navigation-cal1">\
                    <span data-bind="template: \'calendar-navigation-template-cal1\'"></span>\
                </div>\
                <div id="calendar-search-options-cal1">\
                    <span data-bind="template: \'calendar-search-template-cal1\'"></span>\
                </div>\
                <div id="calendar-filter-options-cal1">\
                    <span data-bind="template: \'calendar-select-template-cal1\'"></span>\
                </div>\
                <div id="calendar-content-cal1">\
                    <!-- template behind is chosen by the layout -->\
                    <span data-bind="template: \'calendar-content-template-cal1\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":"cal1",\
                "displayStyle":"events-list-speaker",\
                "selectedDate": "2015-01-23",\
                "maxItems":20}]\
                </span>\
                <div class="calendar-setup-data-links">\
                    <a id="readMoreBaseLink-cal1" href="http://lemonde.fr" style="display: none"></a>\
                </div>\
            </div>\
            <div id="calendar-module-2">\
                <div id="calendar-navigation-2">\
                    <span data-bind="template: \'calendar-navigation-template-2\'"></span>\
                </div>\
                <div id="calendar-filter-options-2">\
                    <span data-bind="template: \'calendar-select-template-2\'"></span>\
                </div>\
                <div id="calendar-search-options-2">\
                    <span data-bind="template: \'calendar-search-template-2\'"></span>\
                </div>\
                <div id="calendar-content-2">\
                    <!-- template behind is chosen by the layout -->\
                    <span data-bind="template: \'calendar-content-template-2\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":2,\
                "displayStyle":"events-table",\
                "selectedDate": "2015-01-23",\
                "maxItems":3,\
                "subDomain":"ysph"}]\
                </span>\
            </div>');

                // for testing purposes only - applied to the mock
                // the mock will confirm status done when it has been queried twice for data (key1 and key2)
                setUpTestingEnvironment(0, done);
            });

            it("should not load the whole application if the read more links configuration(s) are not enough compared to the amount of configuration(s)",function(done){
                expect(controller).toBe(undefined);
                done();
            });
        });

        describe("Full Configuration Available", function() 
        {
          beforeEach(function(done) 
          {
              jasmine.getFixtures().set('<div id="calendar-module-3">\
              <div id="calendar-navigation-3">\
                  <span data-bind="template: \'calendar-navigation-template-3\'"></span>\
              </div>\
              <div id="calendar-filter-options-3">\
                  <span data-bind="template: \'calendar-select-template-3\'"></span>\
              </div>\
              <div id="calendar-search-options-3">\
                  <span data-bind="template: \'calendar-search-template-3\'"></span>\
              </div>\
              <div id="calendar-content-3">\
                  <span data-bind="template: \'calendar-content-template-3\'"></span>\
              </div>\
              <span class="calendar-setup-data" style="display: none">\
              [{"key":"3",\
              "displayStyle":"events-table",\
              "calAndEventUID": "1da4f391-167a-4437-8515-d9cb69a64727",\
              "maxItems":1,\
              "selectedDate": "2015-01-23",\
              "subDomain":"ysph"}]\
              </span>\
              <div class="calendar-setup-data-links">\
                  <a id="readMoreBaseLink-3" href="http://lemonde.fr" style="display: none"></a>\
              </div>\
          </div>');
              // for testing purposes only - applied to the mock
              // the mock will confirm status done when it has been queried twice for data (key1 and key2)
              setUpTestingEnvironment(1, done);
          });

          it("should present a link to download data for a single event", function (done) 
          {
              var key = "3-event";
              var expected = "http://tools.medicine.yale.edu/calendar/event?id=1da4f391-167a-4437-8515-d9cb69a64727&output=json";
              expect(controller.itemsFactory.configs[key].url).toBe(expected);
              done();
          });
        });

        describe("Full Configuration Available", function() 
        {
            describe("In order to test whether the DOM classnames and identifiers of menu elements are as expected, it would require loading templates. Currently out of scope in the testing.", function(){});

            beforeEach(function(done) 
            {
                jasmine.getFixtures().set('<div id="event-content">\
                <span data-bind="template: \'event-details-template\'"></span>\
            </div>\
            <div id="calendar-module-cal1">\
                <div id="calendar-search-options-cal1">\
                    <span data-bind="template: \'calendar-search-template-cal1\'"></span>\
                </div>\
                <div id="calendar-filter-options-cal1">\
                    <span data-bind="template: \'calendar-select-template-cal1\'"></span>\
                </div>\
                <div id="calendar-content-cal1">\
                    <span data-bind="template: \'calendar-content-template-cal1\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":"cal1",\
                "displayStyle":"events-list-speaker",\
                "selectedDate": "2015-01-15",\
                "maxItems":20}]\
                </span>\
                <div class="calendar-setup-data-links">\
                    <a id="readMoreBaseLink-cal1" href="http://lemonde.fr" style="display: none"></a>\
                </div>\
            </div>\
            <div id="calendar-module-2">\
                <div id="calendar-navigation-2">\
                    <span data-bind="template: \'calendar-navigation-template-2\'"></span>\
                </div>\
                <div id="calendar-filter-options-2">\
                    <span data-bind="template: \'calendar-select-template-2\'"></span>\
                </div>\
                <div id="calendar-search-options-2">\
                    <span data-bind="template: \'calendar-search-template-2\'"></span>\
                </div>\
                <div id="calendar-content-2">\
                    <span data-bind="template: \'calendar-content-template-2\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":"2",\
                "displayStyle":"events-list-agenda",\
                "maxItems":3,\
                "selectedDate": "2015-01-15",\
                "relativeOptions" : 30,\
                "subDomain":"ysph"}]\
                </span>\
                <div class="calendar-setup-data-links">\
                </div>\
            </div>\
            <div id="calendar-module-2b">\
                <div id="calendar-navigation-2b">\
                    <span data-bind="template: \'calendar-navigation-template-2b\'"></span>\
                </div>\
                <div id="calendar-filter-options-2b">\
                    <span data-bind="template: \'calendar-select-template-2b\'"></span>\
                </div>\
                <div id="calendar-search-options-2b">\
                    <span data-bind="template: \'calendar-search-template-2b\'"></span>\
                </div>\
                <div id="calendar-content-2b">\
                    <span data-bind="template: \'calendar-content-template-2b\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":"2b",\
                "displayStyle":"events-list-agenda",\
                "maxItems":3,\
                "selectedDate": "2015-01-15",\
                "subDomain":"ysph"}]\
                </span>\
                <div class="calendar-setup-data-links">\
                </div>\
            </div>\
            <div id="calendar-module-cal3">\
                <div id="calendar-navigation-cal3">\
                    <span data-bind="template: \'calendar-navigation-template-cla3\'"></span>\
                </div>\
                <div id="calendar-filter-options-cal3">\
                    <span data-bind="template: \'calendar-select-template-cal3\'"></span>\
                </div>\
                <div id="calendar-search-options-cal3">\
                    <span data-bind="template: \'calendar-search-template-cal3\'"></span>\
                </div>\
                <div id="calendar-content-cal3">\
                    <span data-bind="template: \'calendar-content-template-cal3\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":"cal3",\
                "displayStyle":"events-table",\
                "maxItems":3,\
                "selectedDate": "2015-01-15",\
                "subDomain":"ysph"}]\
                </span>\
                <div class="calendar-setup-data-links">\
                </div>\
            </div>\
            <div id="calendar-module-cal4">\
                <div id="calendar-navigation-cal4">\
                    <span data-bind="template: \'calendar-navigation-template-cla3\'"></span>\
                </div>\
                <div id="calendar-filter-options-cal4">\
                    <span data-bind="template: \'calendar-select-template-cal4\'"></span>\
                </div>\
                <div id="calendar-search-options-cal4">\
                    <span data-bind="template: \'calendar-search-template-cal4\'"></span>\
                </div>\
                <div id="calendar-content-cal4">\
                    <span data-bind="template: \'calendar-content-template-cal4\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":"cal4",\
                "displayStyle":"events-table-list",\
                "maxItems":3,\
                "selectedDate": "2015-01-15",\
                "subDomain":"ysph"}]\
                </span>\
                <div class="calendar-setup-data-links">\
                </div>\
            </div>\
            <div id="calendar-module-cal5">\
                <div id="calendar-navigation-cal5">\
                    <span data-bind="template: \'calendar-navigation-template-cla3\'"></span>\
                </div>\
                <div id="calendar-filter-options-cal5">\
                    <span data-bind="template: \'calendar-select-template-cal5\'"></span>\
                </div>\
                <div id="calendar-search-options-cal5">\
                    <span data-bind="template: \'calendar-search-template-cal5\'"></span>\
                </div>\
                <div id="calendar-content-cal5">\
                    <span data-bind="template: \'calendar-content-template-cal5\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":"cal5",\
                "displayStyle":"events-list-shortlocationname",\
                "maxItems":3,\
                "selectedDate": "2015-01-20",\
                "subDomain":"ysph"}]\
                </span>\
                <div class="calendar-setup-data-links">\
                </div>\
            </div>\
            <div id="calendar-module-cal6">\
                <div id="calendar-navigation-cal6">\
                    <span data-bind="template: \'calendar-navigation-template-cla3\'"></span>\
                </div>\
                <div id="calendar-filter-options-cal6">\
                    <span data-bind="template: \'calendar-select-template-cal6\'"></span>\
                </div>\
                <div id="calendar-search-options-cal6">\
                    <span data-bind="template: \'calendar-search-template-cal6\'"></span>\
                </div>\
                <div id="calendar-content-cal6">\
                    <span data-bind="template: \'calendar-content-template-cal6\'"></span>\
                </div>\
                <span class="calendar-setup-data" style="display: none">\
                [{"key":"cal6",\
                "displayStyle":"events-list-thumbnails",\
                "maxItems":3,\
                "selectedDate": "2015-01-15",\
                "subDomain":"ysph"}]\
                </span>\
                <div class="calendar-setup-data-links">\
                </div>\
            </div>');
                // for testing purposes only - applied to the mock
                // the mock will confirm status done when it has been queried twice for data (key1 and key2)
                setUpTestingEnvironment(7, done);
            });

            describe("Basic Use", function() 
            {
                it("should display a loading message to the user", function(done)
                {
                    expect($(['#',calendarConstants.classNames.calendarLoadingIdBegin,'cal1'].join('')).length == 1).toBe(true);
                    done();
                });

                it("should include a read more link if provided in the configuration", function(done){
                    var key = "cal1";
                    var expected = $(['#',calendarConstants.config.readMoreBaseLink,'-cal1'].join('')).attr('href');
                    expect(controller.itemsFactory.viewModels[key].moreEventsLink()).toBe(expected);
                    done();
                });

                it("should not include a read more link if not specified in the configuration", function(done){
                    var key = "2";
                    var expected = undefined;
                    expect($(['#',calendarConstants.config.readMoreBaseLink,'-2'].join('')).length).toBe(0);
                    expect(controller.itemsFactory.viewModels[key].moreEventsLink()).toBe(expected);
                    done();
                });
            });

            describe("Links", function() 
            {
                describe("to the other CMS pages", function() 
                {
                    it("should present a link to share the event", function(done){
                        var key = "cal1";
                        var expected = "http://tools.medicine.yale.edu/calendar/event?id=f7eddf79-9d09-46f8-bc04-ad9e83c8c493,92e56d42-ea4d-4cb8-b89a-0e377fdf849e&dtstart=2015-01-20T11:30:00";
                        expect(controller.itemsFactory.viewModels[key].eventLists()[0].events()[0].url()).toBe(expected);
                        done();
                    });
                });

                describe("to the calendar server", function()
                {
                    it("should present a link to download data for a week - date specified explicitely", function (done) 
                    {
                        var key = "cal1";
                        controller.displayItems({key: key,
                                             selectedDate: '01/23/2015',
                                             relativeOptions: 0});
                        var expected = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-23&e=2015-01-29&output=json";
                        expect(controller.itemsFactory.configs[key].url).toBe(expected);
                        done();
                    });

                    it("should present a link to download data for a week - next week, date specified explicitely", function (done) 
                    {
                        var key = "cal1";
                        controller.displayItems({key: key,
                                             selectedDate: '01/23/2015',
                                             relativeOptions: 0});
                        controller.displayItems({key: key,
                                             relativeOptions: 7});
                        var expected = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-30&e=2015-02-05&output=json";
                        expect(controller.itemsFactory.configs[key].url).toBe(expected);
                        done();
                    });

                    it("should present a link to download data for a week - last week, date specified explicitely", function (done) 
                    {
                        var key = "cal1";
                        controller.displayItems({key: key,
                                             selectedDate: '01/23/2015',
                                             relativeOptions: 0});
                        controller.displayItems({key: key,
                                             relativeOptions: -7});
                        var expected = "http://tools.medicine.yale.edu/calendar/?f=l&d=2015-01-16&e=2015-01-22&output=json";
                        expect(controller.itemsFactory.configs[key].url).toBe(expected);
                        done();
                    });

                    it("should present a link to download data for a month - date specified explicitely", function (done) 
                    {
                        var key = "2";
                        controller.displayItems({key: key,
                                             selectedDate: '01/23/2015',
                                             relativeOptions: 0});
                        var expected = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-01-01&e=2015-01-31&output=json";
                        expect(controller.itemsFactory.configs[key].url).toBe(expected);
                        done();
                    });

                    it("should present a link to download data for a month - next month, date specified explicitely", function (done) 
                    {
                        var key = "2";
                        controller.displayItems({"key": key,
                                             selectedDate: '01/23/2015',
                                             relativeOptions: 0});
                        controller.displayItems({"key": key,
                                             relativeOptions: 30});
                        var expected = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2015-02-01&e=2015-02-28&output=json";
                        expect(controller.itemsFactory.configs[key].url).toBe(expected);
                        done();
                    });

                    it("should present a link to download data for a month - previous month, date specified explicitely", function (done) 
                    {
                        var key = "2";
                        controller.displayItems({key: key,
                                             selectedDate: '01/23/2015',
                                             relativeOptions: 0});
                        controller.displayItems({key: key,
                                             relativeOptions: -30});
                        var expected = "http://tools.medicine.yale.edu/ysph/calendar/?f=l&d=2014-12-01&e=2014-12-31&output=json";
                        expect(controller.itemsFactory.configs[key].url).toBe(expected);
                        done();
                    });
                });
                
            });

            describe("Filtering", function(done)
            {
                it ("should return the appropriate amount of filtered events - search text applied", function(done)
                {
                    var key = "cal1";
                    var expected = 0;
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay().length).toBeGreaterThan(expected);
                    controller.itemsFactory.viewModels[key].textQueryFilter('grumpyqwerty');
                    controller.itemsFactory.viewModels[key].triggerRepaintData('435467');

                    // give the time to the application to re-run the filtering on the exposed list of events
                    setTimeout(function(){completeSearchFilteringTest(done, key, expected);}, 3000);
                });

                it ("should return the appropriate amount of filtered events - selecting calendar checkboxes applied", function(done)
                {
                    var key = "cal1";
                    var expected = 0;
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay().length).toBeGreaterThan(expected);
                    controller.itemsFactory.viewModels[key].displayedCalendarsFilter([]);

                    expect(controller.itemsFactory.viewModels[key].allEventsByDay().length).toBe(expected); 
                    done();

                    // give the time to the application to re-run the filtering on the exposed list of events
                    //setTimeout(function(){completeCalendarCheckboxesTest(done, key, expected);}, 1000);
                });
            });

            describe("Templates",function()
            {
                // formatted range . start and end dates
                it("events-list-agenda: data is loaded for a whole Month ; date displayed is a single day", function (done) 
                {
                    var key = "2b";
                    //controller.displayItems({key: key,
                      //                   selectedDate: '01/23/2015',
                        //                 relativeOptions: 0});
                    var expected = "January 1-31, 2015";
                    var expectedDay = "Thursday, January 15th";
                    expect(controller.itemsFactory.viewModels[key].formattedDayRange()).toBe(expected);
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay().length).toBe(5);
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay()[0].key).toBe(expectedDay);
                    done();
                });

                it("events-list-agenda: data is loaded for a whole Month ; next month has same day of the new month selected by default", function (done) 
                {
                    // can't test the change in data because it's returned by the mock
                    var key = "2";
                    //controller.displayItems({key: key,
                      //                   selectedDate: '01/23/2015',
                        //                 relativeOptions: 0});
                   // controller.displayItems({key: key,
                     //                        relativeOptions: 30});
                    var expectedDayBegin = "2015-02-15T00:00:00-05:00";
                    var expectedDayEnd = "2015-02-15T23:59:59-05:00";
                    expect(controller.itemsFactory.viewModels[key].displayedStartDate()).toBe(expectedDayBegin);
                    expect(controller.itemsFactory.viewModels[key].displayedEndDate()).toBe(expectedDayEnd);
                    done();
                });

                it("events-list-agenda: should be able to check whether specific day has entries", function (done) 
                {
                    var key = "2";
                    //controller.displayItems({key: key,
                      //                   selectedDate: '01/23/2015',
                        //                 relativeOptions: 0});
                    var expected = 1;
                    expect(controller.itemsFactory.viewModels[key].hasEntriesByYearMonthDay()['15']['01']['23']).toBe(expected);
                    done();
                });

                it("events-list-agenda: should be able to check whether specific month has entries", function (done) 
                {
                    var key = "2";
                    //controller.displayItems({key: key,
                      //                   selectedDate: '01/23/2015',
                        //                 relativeOptions: 0});
                    var expected = 9;
                    expect(controller.itemsFactory.viewModels[key].hasEntriesByYearMonthDay()['15']['01']['00']).toBe(expected);
                    done();
                });

                it("events-list-agenda: should be able to check whether specific year has entries", function (done) 
                {
                    var key = "2";
                    controller.displayItems({key: key,
                                         selectedDate: '01/23/2015',
                                         relativeOptions: 0});
                    var expected = 9;
                    expect(controller.itemsFactory.viewModels[key].hasEntriesByYearMonthDay()['15']['00']['00']).toBe(expected);
                    done();
                });

                it("events-table: data is loaded for a week ; date displayed is a week range", function (done) 
                {
                    var key = "cal3";
                    var expected = "January 15-21, 2015";
                    var expectedDay = "Thursday, January 15th";
                    //controller.displayItems({key: key,
                    //                     selectedDate: '01/20/2015',
                    //                     relativeOptions: 0});
                    expect(controller.itemsFactory.viewModels[key].formattedDayRange()).toBe(expected);
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay()[0].key).toBe(expectedDay);
                    done();
                });

                it("events-table-list: data is loaded for a week ; date displayed is a week range", function (done) 
                {
                    var key = "cal4";
                    var expected = "January 15-21, 2015";
                    var expectedDay = "Thursday, January 15th";
                   // controller.displayItems({key: key,
                   //                      selectedDate: '01/20/2015',
                   //                      relativeOptions: 0});
                    expect(controller.itemsFactory.viewModels[key].formattedDayRange()).toBe(expected);
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay()[0].key).toBe(expectedDay);
                    done();
                });

                it("events-list-speaker: data is loaded for a week ; date displayed is a week range", function (done) 
                {
                    var key = "cal1";
                    var expected = "January 15-21, 2015";
                    var expectedDay = "Thursday, January 15th";
                    //controller.displayItems({key: key,
                     //                    selectedDate: '01/20/2015',
                      //                   relativeOptions: 0});
                    expect(controller.itemsFactory.viewModels[key].formattedDayRange()).toBe(expected);
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay()[0].key).toBe(expectedDay);
                    done();
                });

                it("events-list-shortlocationname: data is loaded for a week ; date displayed is a week range", function (done) 
                {
                    var key = "cal5";
                    var expected = "January 15-21, 2015";
                    var expectedDay = "Tuesday, January 20th";
                    expect(controller.itemsFactory.viewModels[key].formattedDayRange()).toBe(expected);
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay()[0].key).toBe(expectedDay);
                    done();
                });

                it("events-list-thumbnails: data is loaded for a week ; date displayed is a week range", function (done) 
                {
                    var key = "cal6";
                    var expected = "January 15-21, 2015";
                    var expectedDay = "Thursday, January 15th";
                   // controller.displayItems({key: key,
                    //                     selectedDate: '01/20/2015',
                     //                    relativeOptions: 0});
                    expect(controller.itemsFactory.viewModels[key].formattedDayRange()).toBe(expected);
                    expect(controller.itemsFactory.viewModels[key].allEventsByDay()[0].key).toBe(expectedDay);
                    done();
                });
            });

            function completeSearchFilteringTest(done, key, expected)
            {
                expect(controller.itemsFactory.viewModels[key].allEventsByDay().length).toBe(expected); 
                done();
            }

            describe("Count of Max Items per Page", function(done) {});
        });
    });
});