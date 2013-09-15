/*

 FilterGrid 0.3

 Provide an easy way to set up filtering using the Quicksand library for movement.

 Made to work with Quicksand 1.2

 Copyright (c) 2013 Andy McFarland


 Dual licensed under the MIT and GPL version 2 licenses.
 http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
 http://github.com/jquery/jquery/blob/master/GPL-LICENSE.txt

 */

(function($) {
    $.fn.filterGrid = function () {

        var options = {
            cloneSelector: '.fg_item',
            linkGroupSelector: '.fg_group',
            linkFilterType: 'single',
            quicksandFile: '/jscripts/jquery.quicksand.js',
            quicksandDuration: 750,
            quicksandEasing: 'swing',
            quicksandAttribute: 'data-id',
            quicksandAdjustHeight: 'dynamic',
            quicksandUseScaling: true,
            quicksandSelector: '> *',
            quicksandDx: 0,
            quicksandDy: 0
        };

        options = $.extend({}, options, $(this).data());

        // load quicksand
        $.getScript(options.quicksandFile, function() {
            console.log('Quicksand loaded.');
        });

        // Clone grid items to get a second collection for Quicksand plugin
        var $portfolioClone = $(options.cloneSelector).clone();

        // Attempt to call Quicksand on every click event handler
        $(options.linkGroupSelector + ' a').click(function(e){

            // Prevent the browser jump to the link anchor
            e.preventDefault();

            $linkSelector = $(this);

            if (options.linkFilterType == 'multiple') {
                if ($linkSelector.hasClass('active')) {
                    $linkSelector.removeClass('active');
                } else {
                    $linkSelector.addClass("active");
                }
            } else {
                $(options.linkGroupSelector + ' a.active').removeClass('active');
                $linkSelector.addClass("active");
            }

            // Create the selector for all items that should be shown
            var g = 0,
                find = new Array();
            $(options.linkGroupSelector).each(function(){
                var i = 0;
                find[g] = new Array();
                $('a.active', $(this)).each(function(){
                    var newFilter = $(this).parent().attr("class");
                    find[g][i] = newFilter;
                    i++;
                });
                g++;
            });

            var i, i2, i3, i4, selectors = '', usedCategories = new Array(), ucCount = 0;
            for (i = 0; i < find.length; i++) {
                for (i2 = 0; i2 < find[i].length; i2++) {
                    if (find[i][i2].length > 0) {
                        for (i3 = 0; i3 < find.length; i3++) {
                            for (i4 = 0; i4 < find[i3].length; i4++) {
                                if (find[i3] != find[i] && find[i3][i4].length > 0) {
                                    if (selectors != '') {
                                        selectors += ',';
                                    }
                                    selectors += "li[data-type~=" + find[i][i2] + "][data-type~=" + find[i3][i4] + "]";
                                    usedCategories[ucCount] = find[i][i2];
                                    ucCount++;
                                }
                            }
                        }
                        if ($.inArray(find[i][i2], usedCategories) == -1) {
                            if (selectors != '') {
                                selectors += ',';
                            }
                            selectors += "li[data-type~=" + find[i][i2] + "]";
                            usedCategories[ucCount] = find[i][i2];
                            ucCount++;
                        }
                    }
                }
            }
            console.log(selectors);



            // Find items based on the generated selector
            var $filteredPortfolio = $portfolioClone.find(selectors);

            // Call quicksand
            $(options.cloneSelector).quicksand( $filteredPortfolio, {
                duration: options.quicksandDuration,
                easing: options.quicksandEasing,
                adjustHeight: options.quicksandAdjustHeight,
                adjustWidth : options.quicksandAdjustWidth,
                useScaling: options.quicksandUseScaling
            });

        });

        return this;
    }

    $(function(){
        $(".filter_grid").filterGrid();
    })
})(jQuery);

