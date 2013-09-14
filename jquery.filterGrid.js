/*

 FilterGrid .1

 Provide an easy way to set up filtering using the Quicksand library for animation.

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
            linkSelector: '.fg_link',
            linkGroupSelector: '.fg_group',
            linkFilterType: 'single',
            quicksandFile: '/jscripts/jquery.quicksand.js',
            quicksandDuration: 750,
            quicksandEasing: 'swing',
            quicksandAttribute: 'data-id',
            quicksandAdjustHeight: 'auto',
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
        $(options.linkSelector).click(function(e){

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
                $(options.linkSelector + '.active').removeClass('active');
                $linkSelector.addClass("active");
            }

            // Create the selector for all items that should be shown
            $(options.linkGroupSelector).each(function(){
                var i = 0,
                    find = '';
                $(options.linkSelector + '.active').each(function(){
                    var newFilter = $(this).parent().attr("class");
    
                    if (i > 0) {
                        find += ',';
                    }
    
                    find += "li[data-type~=" + newFilter + "]";
                    i++;
                });
            });

            // Find items based on the generated selector
            var $filteredPortfolio = $portfolioClone.find(find);

            // Call quicksand
            $(options.cloneSelector).quicksand( $filteredPortfolio, {
                duration: options.duration,
                easing: options.easing,
                adjustHeight: options.adjustHeight,
                adjustWidth : options.adjustWidth,
                useScaling: options.useScaling
            });

        });

        return this;
    }

    $(function(){
        $(".filter_grid").filterGrid();
    })
})(jQuery);

