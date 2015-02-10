define(['domManager','newsConstants','newsEventListeners', 'newsDatePickerManager','uiMain'], function(domManager, constants, newsEventListeners, datePickerManager, uiEventListeners){

    'use strict';

    function atLeastOneImage(subset)
    {
        var hasImage = false;

        for(var t=0;t<subset.length;t++)
        {
            if (!hasImage)
            {
                hasImage = (subset[t].image() != null);
            }
        }

        return hasImage;
    }

    function initNewsBindings(viewModel, newsDisplayStyle, key, controller) 
    {
        // remove default or previous values
        // other templates were maybe applied before
        viewModel.slices.removeAll();
        viewModel.slices.push([1,null]);

        switch (newsDisplayStyle)
        {
            // unique calendar content are needed because of different styles applied
            // if same container reused, styles specified get merged
            case constants.templates.news1colhighlight:
            break;
            case constants.templates.news2colhighlight:
            break;
            case constants.templates.news2coltext:
            break;
            case constants.templates.news2colthumbnails:
            break;
            case constants.templates.newscombined:
                // the first implementation was also using nested templates
                // BUT cannot communicate which one is current index of nested template

                // because of default slicing applied at the beginning of the method
                // there is only one slice containing all the items
                // note: slice starts with index 0 (not 1)
                var hasImage = atLeastOneImage(viewModel.allNews()[0].slice(1 - 1,2));

                if (hasImage)
                {
                    // remove default or previous values
                    // other templates were maybe applied before
                    viewModel.slices.removeAll();
                    // default scenario : at least one of the entries of first slice has an image
                    // first news is 1-col-highlight
                    viewModel.slices.push([1,2]);
                    // next news displayed as 4-col-thumbnails
                    viewModel.slices.push([3,4]);
                    // can't loop dynamically over "all slices BUT the first"
                    // conditional Knockout if not working
                    viewModel.slices.push([7,null]);
                }
                else
                {
                    // no image populated for slice 1
                    // check slice 2 in a similar way
                    // note: slice starts with index 0 (not 1)
                    hasImage = atLeastOneImage(viewModel.allNews()[0].slice(2 - 1,4));

                    if (hasImage)
                    {
                        // remove default or previous values
                        // other templates were maybe applied before
                        viewModel.slices.removeAll();
                        // slice 1 and two get merged together
                        // first news is 1-col-highlight
                        viewModel.slices.push([0,0]);
                        // next news displayed as 4-col-thumbnails
                        viewModel.slices.push([1,6]);
                        viewModel.slices.push([7,null]);
                    }
                    else
                    {
                        // remove default or previous values
                        // other templates were maybe applied before
                        viewModel.slices.removeAll();
                        // slice 1, 2 and 3 are merged together
                        // first news is 1-col-highlight
                        viewModel.slices.push([0,0]);
                        // next news displayed as 4-col-thumbnails
                        viewModel.slices.push([0,0]);
                        viewModel.slices.push([1,null]);
                    }
                }

                // force refresh of data set, since we modified the content of the array, not the array itself
                viewModel.triggerRepaintData(346);
            break;
            case constants.templates.newsgridfull:
                // the first implementation was also using nested templates
                // BUT cannot communicate which one is current index of nested template
                
                // remove default or previous values
                // other templates were maybe applied before
                viewModel.slices.removeAll();
                // 1-col-highlight
                viewModel.slices.push([1,1]);
                // 1-col-thumbnails
                viewModel.slices.push([2,4]);
                // 1-col-text
                viewModel.slices.push([6,4]);
                // force refresh of data set, since we modified the content of the array, not the array itself
                viewModel.triggerRepaintData(345);
            break;
            case constants.templates.newssidetext:

            break;
            case constants.templates.newssidethumbnails:

            break;
            case constants.templates.news1coltextpaging:

            break;
            default:

            break;
        }
    }

    return {
        init: initNewsBindings
    };
});