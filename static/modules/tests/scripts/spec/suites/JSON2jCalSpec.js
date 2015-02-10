define(['knockout','jquery','calendarContainer/json2jCal','jasmine','jasmine-jquery'], function(ko,$,Container) 
{
  describe("Calendar Widget - Data Layer", function() 
  {
    // for a better readability of the test data, use http://jsonlint.com/ to indent it
    describe("To jCal", function() 
    {
      describe("Exposing Container", function() 
      {
        var container;

        it("should return empty if the container is not populated", function() 
        {
          // json2jcal-emptycal-old.json
          var data = 
          {
              "vcalendars": {}
          };
          container = new Container(data.vcalendars);

          // json2jcal-emptycal-expected.json
          var expected = 
          [
              "vcalendars",
              [],
              []
          ];

          expect(container.jCalExport()).toBe(JSON.stringify(expected));
        });

        it("should return the start date", function() 
        {
          // json2jcal-startdate-old.json
          var data = 
          {
              "vcalendars": {
                  "@dtstart": "2014-10-07"
              }
          };
          
          container = new Container(data.vcalendars);

          // json2jcal-startdate-expected.json
          var expected = 
          [
              "vcalendars",
              [
                  [
                      "dtstart",
                      {},
                      "date",
                      "2014-10-07"
                  ]
              ],
              []
          ];

          expect(container.jCalExport()).toBe(JSON.stringify(expected));
        });

        it("should return the end date", function() 
        {
          var data = {"vcalendars":{
            "@dtend":"2014-10-07"
          }};
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[["dtend",{},"date","2014-10-07"]],[]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the selected date", function() 
        {
          var data = {"vcalendars":{
            "@dtsel":"2014-10-07"
          }};
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[["x-dtsel",{},"date","2014-10-07"]],[]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return all the properties", function() 
        {
          var data = {"vcalendars":{
            "@dtstart":"2014-10-07",
            "@dtend":"2014-10-07",
            "@dtsel":"2014-10-07"
          }};
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[["dtstart",{},"date","2014-10-07"],["dtend",{},"date","2014-10-07"],["x-dtsel",{},"date","2014-10-07"]],[]]';

          expect(container.jCalExport()).toBe(expected);
        });

      });

      describe("Exposing Calendar", function() 
      {
        var container;

        it("should return the UID", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14"
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-uid",{},"text","54275d1d-7754-4c21-95b1-6974869daa14"]],[]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the name", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-calname":"Cal-CME Eligible"
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-name",{},"text","Cal-CME Eligible"]],[]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should not contain the name", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14"
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-uid",{},"text","54275d1d-7754-4c21-95b1-6974869daa14"]],[]]]]';

          expect(container.jCalExport()).not.toMatch("x-name");
        });

        it("should return the description", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-caldesc":"test"
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-desc",{},"text","test"]],[]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return all the properties", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-calname":"Cal-CME Eligible",
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14",
                "@x-wr-caldesc":"test"
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-uid",{},"text","54275d1d-7754-4c21-95b1-6974869daa14"],["x-name",{},"text","Cal-CME Eligible"],["x-desc",{},"text","test"]],[]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the list of events with UIDs", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14",
                "vevent":[
                {
                  "@uid":"cad4d79b-bdb9-4dc6-b6a7-199e9234d17f",
                  "@dtstart":"2014-10-09T07:00:00"
                },
                {
                  "@uid":"cad4d79b-bdb9-4dc6-b6a7-199e9234d15f",
                  "@dtstart":"2014-10-08T07:00:00"
                },
                {
                  "@uid":"cad4d79b-bdb9-4dc6-b6a7-199e9234d35f",
                  "@dtstart":"2014-10-08T06:00:00"
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-uid",{},"text","54275d1d-7754-4c21-95b1-6974869daa14"]],[["vevent",[["uid",{},"text","cad4d79b-bdb9-4dc6-b6a7-199e9234d17f"],["dtstart",{},"date-time","2014-10-09T07:00:00"]]],["vevent",[["uid",{},"text","cad4d79b-bdb9-4dc6-b6a7-199e9234d15f"],["dtstart",{},"date-time","2014-10-08T07:00:00"]]],["vevent",[["uid",{},"text","cad4d79b-bdb9-4dc6-b6a7-199e9234d35f"],["dtstart",{},"date-time","2014-10-08T06:00:00"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return empty if there are no events", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14"
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-uid",{},"text","54275d1d-7754-4c21-95b1-6974869daa14"]],[]]]]';

          expect(container.jCalExport()).toBe(expected);
        });
      });

      describe("Exposing Event", function()
      {
        var container;

        it("should return the website", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14",
                "vevent":[
                {
                  "@uid":"cad4d79b-bdb9-4dc6-b6a7-199e9234d15f",
                  "@status":"CONFIRMED",
                  "@class":"PUBLIC",
                  "@dtstart":"2014-10-08T07:00:00",
                  "@dtend":"2014-10-08T08:00:00",
                  "@location":"Hope Building, 110",
                  "tag":"Grand Rounds",
                  "@url":"http://orthopaedics.yale.edu/",
                  "xml":
                  {
                    "p":
                    [
                    {"k":"contact","v":"Jodi Canapp"},
                    { "k": "admission", "v": "Free"}
                    ]
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-uid",{},"text","54275d1d-7754-4c21-95b1-6974869daa14"]],[["vevent",[["uid",{},"text","cad4d79b-bdb9-4dc6-b6a7-199e9234d15f"],["dtstart",{},"date-time","2014-10-08T07:00:00"],["dtend",{},"date-time","2014-10-08T08:00:00"],["class",{},"text","PUBLIC"],["status",{},"text","CONFIRMED"],["x-website",{},"text","http://orthopaedics.yale.edu/"],["x-tags",{},"text","Grand Rounds"],["location",{},"text","Hope Building, 110"],["x-admission",{},"text","Free"],["x-organizer",{},"text","Jodi Canapp"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the start time (:30)", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "@dtstart":"2014-10-08T07:30:00"
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["dtstart",{},"date-time","2014-10-08T07:30:00"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the summary", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "@summary":"Mickey"
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["summary",{},"text","Mickey"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the all day event", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent": {
                  "@uid": "65",
                  "@status": "CONFIRMED",
                  "@class": "PUBLIC",
                  "@dtstamp": "2014-11-11 16:33:02Z",
                  "@dtstart": "2014-11-27",
                  "@dtend": "2014-11-28",
                  "@summary": "Thanksgiving"
                }
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["uid",{},"text","65"],["dtstamp",{},"date-time","2014-11-11 16:33:02Z"],["dtstart",{},"date","2014-11-27"],["dtend",{},"date","2014-11-28"],["summary",{},"text","Thanksgiving"],["class",{},"text","PUBLIC"],["status",{},"text","CONFIRMED"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the details of the recurring event", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14",
                "vevent":[
                {
                  "@uid":"cad4d79b-bdb9-4dc6-b6a7-199e9234d15f",
                  "@status":"CONFIRMED",
                  "@class":"PUBLIC",
                  "@dtstart":"2014-10-08T07:00:00",
                  "@dtend":"2014-10-08T08:00:00",
                  "@location":"Hope Building, 110",
                  "tag":"Grand Rounds",
                  "rrule": {
                    "@encoded": "FREQ=WEEKLY;INTERVAL=1;BYDAY=WE",
                    "freq": "WEEKLY",
                    "interval": "1",
                    "byday": "WE"
                  },
                  "xml":
                  {
                    "p":
                    [
                    {"k":"contact","v":"Jodi Canapp"},
                    { "k": "admission", "v": "Free"}
                    ]
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-uid",{},"text","54275d1d-7754-4c21-95b1-6974869daa14"]],[["vevent",[["uid",{},"text","cad4d79b-bdb9-4dc6-b6a7-199e9234d15f"],["dtstart",{},"date-time","2014-10-08T07:00:00"],["dtend",{},"date-time","2014-10-08T08:00:00"],["class",{},"text","PUBLIC"],["status",{},"text","CONFIRMED"],["x-tags",{},"text","Grand Rounds"],["location",{},"text","Hope Building, 110"],["rrule",{},"recur",{"freq":"WEEKLY","interval":"1","byday":"WE"}],["x-rrule-encoded",{},"text","FREQ=WEEKLY;INTERVAL=1;BYDAY=WE"],["x-admission",{},"text","Free"],["x-organizer",{},"text","Jodi Canapp"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the department name of the performer", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "xml":
                  {
                    "p":
                    [
                    { "k": "speaker_ou", "v": "Pediatrics"}
                    ]
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["x-performer-dept",{},"text","Pediatrics"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the organization name of the performer", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "xml":
                  {
                    "p":
                    [
                    { "k": "speaker_o", "v": "Gastroenterology & Hepatology"}
                    ]
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["x-performer-org",{},"text","Gastroenterology & Hepatology"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the food details", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "xml":
                  {
                    "p":
                    [
                    { "k": "food","v": "1"}
                    ]
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["x-food",{},"text","Refreshments will be served."]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should ignore if the property food is populated with 0", function() {
         var data = {
          "vcalendars":{
            "vcalendar":[
            {
              "vevent":[
              {
                "xml":
                {
                  "p":
                  [
                  { "k": "food","v": "0"}
                  ]
                }
              }
              ]
            }
            ]
          }
        };
        container = new Container(data.vcalendars);

        var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[]]]]]]';

        expect(container.jCalExport()).toBe(expected);
        });

        it("should return the geo coordinates", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "xml":
                  {
                    "p":
                    [
                    {"k": "lat","v": "41.3019767"},
                    {"k": "lng","v": "-72.933582"}
                    ]
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["geo",{},"float",["-72.933582","41.3019767"]]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the basic (default) HTML description", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "description":'<div xmlns="http://www.w3.org/1999/xhtml"><br /> <br /> &#xA0;<br /> &#xA0;<br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;</div>'
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["description",{},"text","<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><br /> <br /> &#xA0;<br /> &#xA0;<br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;</div>"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the plain text description", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "descriptionText": 'blah blah blah'
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["x-desc-raw",{},"text","blah blah blah"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the image stream UID", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "xml":
                  {
                    "flyer": {"@stream":"7b55b3c2-fd3a-4ba7-aad9-2362563eae8e","@photo":"0"}
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["x-image-uid",{},"text","7b55b3c2-fd3a-4ba7-aad9-2362563eae8e"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should return the additional document stream UID", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "xml":
                  {
                    "flyer": {"@stream":"7b55b3c2-fd3a-4ba7-aad9-2362563eae8e","@photo":"1"}
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["x-additionalDocument-uid",{},"text","7b55b3c2-fd3a-4ba7-aad9-2362563eae8e"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should support a list of several tags", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "vevent":[
                {
                  "tag":"Conference,Culture,Meeting"
                }
                ]
              }
              ]
            }
          };

          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[],[["vevent",[["x-tags",{},"text","Conference,Culture,Meeting"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });

        it("should not return properties containing the @ character", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14",
                "vevent":[
                {
                  "@uid":"cad4d79b-bdb9-4dc6-b6a7-199e9234d15f",
                  "xml":
                  {
                    "p":
                    [
                    {"k":"postal","v":"06510"},
                    {"k":"street","v":"315 Cedar St"},
                    {"k": "lat","v": "41.3019767"},
                    {"k": "lng","v": "-72.933582"}
                    ]
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          expect(container.jCalExport()).not.toMatch('@');
        });

        it("should return all the properties", function() {
          var data = {
            "vcalendars":{
              "vcalendar":[
              {
                "@x-wr-relcalid":"54275d1d-7754-4c21-95b1-6974869daa14",
                "vevent":[
                {
                  "@uid":"cad4d79b-bdb9-4dc6-b6a7-199e9234d15f",
                  "@status":"CONFIRMED",
                  "@class":"PUBLIC",
                  "@dtstamp":"2014-07-08T11:00:00",
                  "@dtstart":"2014-10-08T07:00:00",
                  "@dtend":"2014-10-08T08:00:00",
                  "@location":"Hope Building, 110",
                  "@summary":"Yoga weekend",
                  "@url":"http://orthopaedics.yale.edu/",
                  "tag":"Grand Rounds",
                  "description":'<div xmlns="http://www.w3.org/1999/xhtml"><br /> <br /> &#xA0;<br /> &#xA0;<br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;</div>',
                  "descriptionText": 'blah blah blah',
                  rrule: {
                    "@encoded": "FREQ=WEEKLY;INTERVAL=1;BYDAY=WE;UNTIL=20141231",
                    "freq": "WEEKLY",
                    "interval": "1",
                    "byday": "WE",
                    "until": "20141231"
                  },
                  "xml":
                  {
                    "flyer": 
                    [
                    {"@stream":"7b55b3c2-fd3a-4ba7-aad9-2362563eae8e","@photo":"0"},
                    {"@stream":"7b55b3c2-9999-4ba7-aad9-2362563eae8e","@photo":"1"}
                    ],
                    "p":
                    [
                    {"k":"contact","v":"Jodi Canapp"},
                    {"k": "speaker_o", "v": "Gastroenterology & Hepatology"},
                    {"k": "audience","v": "Department Only"},
                    {"k":"contact_id","v":"a68fc696-8a25-4fcf-8991-b39fc7248322"},
                    {"k": "contact_phone","v": "203-785-5439"},
                    {"k": "speaker_host","v": "Department of Pediatrics"},
                    {"k": "food","v": "1"},
                    {"k": "admission", "v": "Free"},
                    {"k": "contact_email","v": "susana.cruz@yale.edu"},
                    {"k": "speaker","v": "Steven Grossmann, MD, PhD"},
                    {"k": "speaker_title","v": "Chair"},
                    {"k": "speaker_ou","v": "Division of Hematology, Oncology and Palliative Care"},
                    {"k": "speaker_o","v": "Virginia Commonwealth University"},
                    {"k": "speaker_id","v": "026016c9-ec73-486c-abcb-14665cc2fe1a"},
                    {"k": "postal","v": "06510-3218"},
                    {"k": "street","v": "330 Cedar St"},
                    {"k": "city","v": "New Haven"},
                    {"k": "region","v": "CT"},
                    {"k": "country","v": "US"},
                    {"k": "lat","v": "41.3024134"},
                    {"k": "lng","v": "-72.9338189"}
                    ]
                  }
                }
                ]
              }
              ]
            }
          };
          container = new Container(data.vcalendars);

          var expected = '["vcalendars",[],[["vcalendar",[["x-uid",{},"text","54275d1d-7754-4c21-95b1-6974869daa14"]],[["vevent",[["uid",{},"text","cad4d79b-bdb9-4dc6-b6a7-199e9234d15f"],["dtstamp",{},"date-time","2014-07-08T11:00:00"],["dtstart",{},"date-time","2014-10-08T07:00:00"],["dtend",{},"date-time","2014-10-08T08:00:00"],["summary",{},"text","Yoga weekend"],["class",{},"text","PUBLIC"],["status",{},"text","CONFIRMED"],["x-website",{},"text","http://orthopaedics.yale.edu/"],["x-image-uid",{},"text","7b55b3c2-fd3a-4ba7-aad9-2362563eae8e"],["x-additionalDocument-uid",{},"text","7b55b3c2-9999-4ba7-aad9-2362563eae8e"],["description",{},"text","<div xmlns=\\"http://www.w3.org/1999/xhtml\\"><br /> <br /> &#xA0;<br /> &#xA0;<br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;<br /> <br /> &#xA0;</div>"],["x-desc-raw",{},"text","blah blah blah"],["x-food",{},"text","Refreshments will be served."],["x-tags",{},"text","Grand Rounds"],["location",{},"text","Hope Building, 110"],["rrule",{},"recur",{"freq":"WEEKLY","interval":"1","byday":"WE","until":"20141231"}],["x-rrule-encoded",{},"text","FREQ=WEEKLY;INTERVAL=1;BYDAY=WE;UNTIL=20141231"],["x-admission",{},"text","Free"],["x-audience",{},"text","Department Only"],["x-postal",{},"text","06510-3218"],["x-country",{},"text","US"],["x-region",{},"text","CT"],["x-city",{},"text","New Haven"],["x-street",{},"text","330 Cedar St"],["geo",{},"float",["-72.9338189","41.3024134"]],["x-host",{},"text","Department of Pediatrics"],["x-organizer",{},"text","Jodi Canapp"],["x-organizer-id",{},"text","a68fc696-8a25-4fcf-8991-b39fc7248322"],["x-organizer-phone",{},"text","203-785-5439"],["x-organizer-email",{},"text","susana.cruz@yale.edu"],["x-performer",{},"text","Steven Grossmann, MD, PhD"],["x-performer-id",{},"text","026016c9-ec73-486c-abcb-14665cc2fe1a"],["x-performer-title",{},"text","Chair"],["x-performer-org",{},"text","Gastroenterology & Hepatology"],["x-performer-dept",{},"text","Division of Hematology, Oncology and Palliative Care"]]]]]]]';

          expect(container.jCalExport()).toBe(expected);
        });
      });
    });
  });  
});