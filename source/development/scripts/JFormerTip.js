/**
 * jquery.simpletip 1.3.1. A simple tooltip plugin
 *
 * Copyright (c) 2009 Craig Thompson
 * http://craigsworks.com
 *
 * Licensed under GPLv3
 * http://www.opensource.org/licenses/gpl-3.0.html
 *
 * Launch  : February 2009
 * Version : 1.3.1
 * Released: February 5, 2009 - 11:04am
 */
(function($){

    function Simpletip(elem, conf)
    {
        var self = this;
        elem = jQuery(elem);
      
        var wrappedContent = ['<span class="tipArrow"></span><div class="tipContent">',conf.content.html(),'</div>'].join('');

        var tooltip = jQuery(conf.content)
        .addClass(conf.baseClass)
        .addClass( (conf.fixed) ? conf.fixedClass : '' )
        .addClass( (conf.persistent) ? conf.persistentClass : '' )
        .html(wrappedContent);

        // Add an event listener that listens for a window resize and repositions the element
        jQuery(window).resize(function(){
            if(tooltip.is(':visible')) {
                self.updatePos();
            }
            
        });

        if(!conf.hidden) tooltip.show();
        else tooltip.hide();

        if(!conf.persistent)
        {
            elem.hover(
                function(event){
                    self.show(event)
                },
                function(){
                    self.hide()
                }
                );

            if(!conf.fixed)
            {
                elem.mousemove( function(event){
                    if(tooltip.css('display') !== 'none') self.updatePos(event);
                });
            };
        }
        else
        {
            elem.click(function(event)
            {
                if(event.target === elem.get(0))
                {
            //if(tooltip.css('display') !== 'none')
            // self.hide();
            // else
            //self.show();
            }
            });

            jQuery(window).mousedown(function(event)
            {
                if(tooltip.css('display') !== 'none')
                {
                    var check = (conf.focus) ? jQuery(event.target).parents('.tooltip').andSelf().filter(function(){
                        return this === tooltip.get(0)
                    }).length : 0;
                //if(check === 0) self.hide();
                };
            });
        };


        jQuery.extend(self,
        {
            getVersion: function()
            {
                return [1, 2, 0];
            },

            getParent: function()
            {
                return elem;
            },

            getTooltip: function()
            {
                return tooltip;
            },

            getPos: function()
            {
                return tooltip.position();
            },

            setPos: function(posX, posY)
            {
                var elemPos = elem.position();

                if(typeof posX == 'string') posX = parseInt(posX) + elemPos.left;
                if(typeof posY == 'string') posY = parseInt(posY) + elemPos.top;

                tooltip.css({
                    left: posX,
                    top: posY
                });

                return self;
            },

            show: function(event)
            {
                var onbefore = conf.onBeforeShow();
                if(onbefore === false){
                    return false;
                }
                self.updatePos( (conf.fixed) ? null : event );

                switch(conf.showEffect)
                {
                    case 'fade':
                        tooltip.fadeIn(conf.showTime); break;
                    case 'slide':
                        tooltip.slideDown(conf.showTime, self.updatePos); break;
                    case 'custom':
                        conf.showCustom.call(tooltip, conf.showTime); break;
                    default:
                    case 'none':
                        tooltip.show(); break;
                };

                tooltip.addClass(conf.activeClass);

                conf.onShow.call(self);

                jQuery(document).trigger('blurTip', [tooltip, 'show']);

                return self;
            },

            hide: function()
            {
                conf.onBeforeHide.call(self);

                switch(conf.hideEffect)
                {
                    case 'fade':
                        tooltip.fadeOut(conf.hideTime); break;
                    case 'slide':
                        tooltip.slideUp(conf.hideTime); break;
                    case 'custom':
                        conf.hideCustom.call(tooltip, conf.hideTime); break;
                    default:
                    case 'none':
                        tooltip.hide(); break;
                };

                tooltip.removeClass(conf.activeClass);

                conf.onHide.call(self);

                jQuery(document).trigger('blurTip', [tooltip, 'hide']);

                return self;
            },

            update: function(content)
            {
                
                //tooltip.html(content);

                return self;
            },

            load: function(uri, data)
            {
                conf.beforeContentLoad.call(self);

                tooltip.load(uri, data, function(){
                    conf.onContentLoad.call(self);
                });

                return self;
            },

            boundryCheck: function(posX, posY)
            {
                var newX = posX + tooltip.outerWidth();
                var newY = posY + tooltip.outerHeight();

                var windowWidth = jQuery(window).width() + jQuery(window).scrollLeft();
                var windowHeight = jQuery(window).height() + jQuery(window).scrollTop();

                return [(newX >= windowWidth), (newY >= windowHeight)];
            },

            updatePos: function(event)
            {
                var tooltipWidth = tooltip.outerWidth();
                var tooltipHeight = tooltip.outerHeight();

                if(!event && conf.fixed)
                {
                    if(conf.position.constructor == Array)
                    {
                        posX = parseInt(conf.position[0]);
                        posY = parseInt(conf.position[1]);
                    }
                    else if(jQuery(conf.position).attr('nodeType') === 1)
                    {
                        var offset = jQuery(conf.position).position();
                        posX = offset.left;
                        posY = offset.top;
                    }
                    else
                    {
                        var elemPos = elem.position();
                        var elemWidth = elem.outerWidth();
                        var elemHeight = elem.outerHeight();
                        var posX = '';
                        var posY = '';
                        switch(conf.position)
                        {
                            case 'top':
                                posX = elemPos.left - (tooltipWidth / 2) + (elemWidth / 2);
                                posY = elemPos.top - tooltipHeight;
                                break;

                            case 'bottom':
                                posX = elemPos.left - (tooltipWidth / 2) + (elemWidth / 2);
                                posY = elemPos.top + elemHeight;
                                break;

                            case 'left':
                                posX = elemPos.left - tooltipWidth;
                                posY = elemPos.top - (tooltipHeight / 2) + (elemHeight / 2);
                                break;

                            case 'right':
                                posX = elemPos.left + elemWidth;
                                posY = elemPos.top - (tooltipHeight / 2) + (elemHeight / 2);
                                break;

                            case 'topRight':
                                posX = elemPos.left + elemWidth;
                                posY = elemPos.top;
                                break;

                            default:
                            case 'default':
                                posX = (elemWidth / 2) + elemPos.left + 20;
                                posY = elemPos.top;
                                break;
                        };
                    };
                }
                else
                {
                    var posX = event.pageX;
                    var posY = event.pageY;
                };

                if(typeof conf.position != 'object')
                {
                    posX = posX + conf.offset[0];
                    posY = posY + conf.offset[1];

                    if(conf.boundryCheck)
                    {
                        var overflow = self.boundryCheck(posX, posY);

                        if(overflow[0]) posX = posX - (tooltipWidth / 2) - (2 * conf.offset[0]);
                        if(overflow[1]) posY = posY - (tooltipHeight / 2) - (2 * conf.offset[1]);
                    }
                }
                else
                {
                    if(typeof conf.position[0] == "string") posX = String(posX);
                    if(typeof conf.position[1] == "string") posY = String(posY);
                };

                self.setPos(posX, posY);

                return self;
            }
        });
    };

    jQuery.fn.simpletip = function(conf)
    {
        // Check if a simpletip is already present
        var api = jQuery(this).eq(typeof conf == 'number' ? conf : 0).data("simpletip");
        if(api) return api;

        // Default configuration
        var defaultConf = {
            // Basics
            content: 'A simple tooltip',
            persistent: false,
            focus: false,
            hidden: true,

            // Positioning
            position: 'default',
            offset: [0, 0],
            boundryCheck: false,
            fixed: true,

            // Effects
            showEffect: 'fade',
            showTime: 150,
            showCustom: null,
            hideEffect: 'fade',
            hideTime: 150,
            hideCustom: null,

            // Selectors and classes
            baseClass: 'tooltip',
            activeClass: 'active',
            fixedClass: 'fixed',
            persistentClass: 'persistent',
            focusClass: 'focus',

            // Callbacks
            onBeforeShow: function(){
                return true;
            },
            onShow: function(){},
            onBeforeHide: function(){},
            onHide: function(){},
            beforeContentLoad: function(){},
            onContentLoad: function(){}
        };
        jQuery.extend(defaultConf, conf);

        this.each(function()
        {
            var el = new Simpletip(jQuery(this), defaultConf);
            jQuery(this).data("simpletip", el);
        });

        return this;
    };
})();