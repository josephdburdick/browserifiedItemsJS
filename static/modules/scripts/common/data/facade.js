module.exports = function(MyApp) 
{
    'use strict';

    var _ = MyApp.vendor.underscore;
    var $ = MyApp.vendor.jquery;
    var Moment = MyApp.vendor.moment;

	// makes the requests to the calendar server
  	function getServerData(serviceUrl, key, callback, controller, errorMsg)
    {
        return $.ajax({
            url: serviceUrl,
            type: 'get',
            dataType: 'json',
            success: function(response) {callback(response, key, controller); },
            // Error callback      
            error: function(jxhr, status, err) 
            {
                console.log(errorMsg);
                console.log(err + " " + this.url);
            }
        });
    }

	return {
        getServerData: getServerData
    };
};