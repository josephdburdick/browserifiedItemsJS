module.exports = function(MyApp) 
{
    var _ = MyApp.vendor.underscore;
    var $ = MyApp.vendor.jquery;

    // Retrieve value associated with supplied key.
    // If key not found, undefined is returned.
    //
    // Data retrieved for key-value pairs is an array
    // that contains custom format key-value pairs :
    // {k: "street", v: "330 Cedar St"}
    function getValueOfKey(array, key) 
    {
        'use strict';
        var value;

        if (array != null && _.isArray(array))
        {
            var result = _.where(array,{k:key});

            if(_.isArray(result))
            {
                if (result.length > 0)
                {
                    value = result[0].v;
                } 
                else 
                {
                    value = null;
                }
            }
            else
            {
                value = result;
            }
        }

        return value;
    }

    // handles property not provided
    function getValueOfProperty(array,property)
    {
        'use strict';
        var value;

        if(array != null && property != null)
        {
            if (array.hasOwnProperty(property))
            {
                value = array[property];
            }
        }

        return value;
    }

    // Retrieve value associated with supplied key.
    // Value is stored in an array structure (name, parameters, data type, value).
    // If key not found, undefined is returned.
    function getPropertyValue(array, key) 
    {
        'use strict';
        var value;
        if (array != null && _.isArray(array))
        {
            // _ official doc : "If no match is found, or if list is empty, undefined will be returned".
            var valueObject = _.findWhere(array,{0 : key});

            if(valueObject != null)
            {
                value = valueObject[3];
            }
        }
        return value;
    }

    // Turn a dictionary into an array.
    function mapDictionaryToArray(dictionary) 
    {
        'use strict';

        var result = [];

        if (dictionary!= null)
        {
            for (var key in dictionary) 
            {
                // make sure it's not an inherited or unexpected property
                if (dictionary.hasOwnProperty(key)) 
                {
                    result.push({ key: key, value: dictionary[key] }); 
                }  
            }
        }

        return result;
    }

    return {
        mapDictionaryToArray: mapDictionaryToArray,
        getPropertyValue: getPropertyValue,
        getArrayValue: getValueOfProperty,
        getValueOfKey: getValueOfKey
    };
};