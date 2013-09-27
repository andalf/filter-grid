/*

 FilterGrid 0.8

 Provide an easy way to set up filtering using the Quicksand library for movement.

 Made to work with Quicksand 1.2

 Copyright (c) 2013 Andy McFarland


 Dual licensed under the MIT and GPL version 2 licenses.
 http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
 http://github.com/jquery/jquery/blob/master/GPL-LICENSE.txt

 */

(function($) {
    $.fn.filterGrid = function (options) {

        var defaultOptions = {
            cloneSelector: '.fg_items',
            linkGroupSelector: '.fg_group',
            linkFilterType: 'single',
            linkFilterJoinAttribute: '',
            linkFilterSecondaryType: 'secondary',
            filterButtonId: '',
            filterButtonBelowWidth: '',
            resizeOnCallback: '',
            quicksandFile: '/jscripts/jquery.quicksand.js',
            quicksandDuration: 750,
            quicksandEasing: 'swing',
            quicksandAttribute: 'data-id',
            quicksandAdjustHeight: 'dynamic',
            quicksandAdjustWidth: 'auto',
            quicksandUseScaling: true,
            quicksandSelector: '> *',
            quicksandDx: 0,
            quicksandDy: 0
        };

        options = $.extend(defaultOptions, $(this).data(), options);

        // load quicksand
        $.getScript(options.quicksandFile, function() {
            console.log('Quicksand loaded.');
        });

        $(window).load(function(){

            // Clone grid items to get a second collection for Quicksand plugin
            var $portfolioClone = $(options.cloneSelector).clone();

            resizeItems($portfolioClone);
            var resizeTimer;
            $(window).resize(function(){
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function(){ resizeItems($portfolioClone) }, 100);
            });

            if (options.filterButtonId != '') {
                var actionSelector = options.linkGroupSelector + ' a, #' + options.filterButtonId;
            } else {
                var actionSelector = options.linkGroupSelector + ' a';
            }

            checkWidth();
            var checkTimer;
            $(window).resize(function(){
                clearTimeout(checkTimer);
                checkTimer = setTimeout(checkWidth, 100);
            });

            // Attempt to call Quicksand on every click event handler
            $(actionSelector).click(function(e){

                // Prevent the browser jump to the link anchor
                e.preventDefault();

                $linkSelector = $(this);
                $linkSelectorOriginal = $(this);
                if (options.linkFilterJoinAttribute != '') {
                    $linkSelector = $('a[data-'+options.linkFilterJoinAttribute+'="'+$linkSelector.data(options.linkFilterJoinAttribute)+'"]');
                }

                if (options.linkFilterType == 'multiple') {
                    if ($linkSelector.hasClass('active') == true) {
                        $linkSelector.removeClass('active');
                    } else {
                        $linkSelector.addClass("active");
                    }
                } else {
                    $(options.linkGroupSelector + ' a.active').removeClass('active');
                    $linkSelector.addClass("active");
                }

                if (options.filterButtonId == '' ||
                    (options.filterButtonId != '' && $linkSelectorOriginal.attr('id') == options.filterButtonId) ||
                    (options.filterButtonBelowWidth != '' && options.filterButtonBelowWidth < $(window).width())) {

                    // Create the selector for all items that should be shown
                    var g = 0,
                        find = new Array();
                    $(options.linkGroupSelector).each(function(){

                        if ($(this).data('type') != options.linkFilterSecondaryType) {
                            var i = 0;
                            find[g] = new Array();
                            $('a.active', $(this)).each(function(){
                                var newFilter = $(this).parent().attr("class");
                                find[g][i] = newFilter;
                                i++;
                            });
                            g++;
                        }
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

                    // Show all items if no links are selected
                    if (selectors == '') {
                        selectors = 'li';
                    }

                    // Find items based on the generated selector
                    var $filteredPortfolio = $portfolioClone.find(selectors);

                    // Call quicksand
                    $(options.cloneSelector).quicksand( $filteredPortfolio, {
                        duration: options.quicksandDuration,
                        easing: options.quicksandEasing,
                        adjustHeight: options.quicksandAdjustHeight,
                        adjustWidth : options.quicksandAdjustWidth,
                        useScaling: options.quicksandUseScaling
                    }, function() {
                        if (options.resizeOnCallback == true) {
                            resizeItems($portfolioClone);
                        }
                    });
                }
            });

            return this;
        });

        // Show/Hide filter button based on window width
        function checkWidth(){
            if ($(window).width() > options.filterButtonBelowWidth) {
                $('#'+options.filterButtonId).hide();
            } else {
                $('#'+options.filterButtonId).show();
            }
        }

        // Resize all items to the same height
        function resizeItems($portfolioClone){
            var gridItemHeight = 0, thisHeight = 0;
            $portfolioClone.find('li').css('height','');
            $(options.cloneSelector + ' li').css('height','');
            $(options.cloneSelector).css('height','');
            $(options.cloneSelector).each(function() {
                $('li', this).each(function() {
                    thisHeight = $(this).height();
                    if(gridItemHeight < thisHeight) {
                        gridItemHeight = thisHeight;
                    }
                });
            });
            if (gridItemHeight != 0) {
                $(options.cloneSelector + ' li').css('height', gridItemHeight);
                $portfolioClone.find('li').css('height', gridItemHeight);
            }
        }

    }

    $(function(){
        $(".filter_grid").each(function(){
            $(this).filterGrid();
        });
    })
})(jQuery);

