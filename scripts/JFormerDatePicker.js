/*
Date Input 1.2.1
Requires jQuery version: >= 1.2.6

Copyright (c) 2007-2008 Jonathan Leighton & Torchbox Ltd

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

DateInput = (function($) { 

    function DateInput(element, options) {
        if (typeof(opts) != "object") options = {};
        $.extend(this, DateInput.DEFAULT_OPTS, options);

        var button = $('<span class="jFormComponentDateButton">Find Date</span>');

        this.input = $(element);
        this.input.after(button);
        this.button = $(element).parent().find('span.jFormComponentDateButton');
        this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");
  
        this.build();
        this.selectDate();
        this.hide();
    };
    DateInput.DEFAULT_OPTS = {
        jFormComponentDateSelectorMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        short_jFormComponentDateSelectorMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        start_of_week: 0
    };
    DateInput.prototype = {
        build: function() {
            var monthNav = $('<p class="jFormComponentDateSelectorMonthNavigator">' +
                '<span class="jFormComponentDateSelectorButton jFormComponentDateSelectorPrevious" title="[Page-Up]">&#171;</span>' +
                ' <span class="jFormComponentDateSelectorMonthName"></span> ' +
                '<span class="jFormComponentDateSelectorButton jFormComponentDateSelectorNext" title="[Page-Down]">&#187;</span>' +
                '</p>');
            this.monthNameSpan = $(".jFormComponentDateSelectorMonthName", monthNav);
            $(".jFormComponentDateSelectorPrevious", monthNav).click(this.bindToObj(function() {
                this.moveMonthBy(-1);
            }));
            $(".jFormComponentDateSelectorNext", monthNav).click(this.bindToObj(function() {
                this.moveMonthBy(1);
            }));
    
            var yearNav = $('<p class="jFormComponentDateSelectorYearNavigator">' +
                '<span class="jFormComponentDateSelectorButton jFormComponentDateSelectorPrevious" title="[Ctrl+Page-Up]">&#171;</span>' +
                ' <span class="jFormComponentDateSelectorYearName"></span> ' +
                '<span class="jFormComponentDateSelectorButton jFormComponentDateSelectorNext" title="[Ctrl+Page-Down]">&#187;</span>' +
                '</p>');
            this.yearNameSpan = $(".jFormComponentDateSelectorYearName", yearNav);
            $(".jFormComponentDateSelectorPrevious", yearNav).click(this.bindToObj(function() {
                this.moveMonthBy(-12);
            }));
            $(".jFormComponentDateSelectorNext", yearNav).click(this.bindToObj(function() {
                this.moveMonthBy(12);
            }));
    
            var nav = $('<div class="jFormComponentDateSelectorNavigator"></div>').append(monthNav, yearNav);
    
            var tableShell = "<table><thead><tr>";
            $(this.adjustDays(this.short_day_names)).each(function() {
                tableShell += "<th>" + this + "</th>";
            });
            tableShell += "</tr></thead><tbody></tbody></table>";
    
            this.dateSelector = this.rootLayers = $('<div class="jFormComponentDateSelector"></div>').append(nav, tableShell).insertAfter(this.input);
    
            if ($.browser.msie && $.browser.version < 7) {
      
                this.ieframe = $('<iframe class="jFormComponentDateSelectorIEFrame" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector);
                this.rootLayers = this.rootLayers.add(this.ieframe);
      
                $(".jFormComponentDateSelectorButton", nav).mouseover(function() {
                    $(this).addClass("hover")
                });
                $(".jFormComponentDateSelectorButton", nav).mouseout(function() {
                    $(this).removeClass("hover")
                });
            };
    
            this.tbody = $("tbody", this.dateSelector);
    
            this.input.change(this.bindToObj(function() {
                this.selectDate();
            }));
            this.selectDate();
        },

        selectMonth: function(date) {
            var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    
            if (!this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() &&
                this.currentMonth.getMonth() == newMonth.getMonth())) {
      
                this.currentMonth = newMonth;
      
                var rangeStart = this.rangeStart(date), rangeEnd = this.rangeEnd(date);
                var numDays = this.daysBetween(rangeStart, rangeEnd);
                var dayCells = "";
      
                for (var i = 0; i <= numDays; i++) {
                    var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 12, 00);
        
                    if (this.isFirstDayOfWeek(currentDay)) dayCells += "<tr>";
        
                    if (currentDay.getMonth() == date.getMonth()) {
                        dayCells += '<td class="jFormComponentDateSelectorSelectedDay" date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + '</td>';
                    } else {
                        dayCells += '<td class="jFormComponentDateSelectorUnselectedMonth" date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + '</td>';
                    };
        
                    if (this.isLastDayOfWeek(currentDay)) dayCells += "</tr>";
                };
                this.tbody.empty().append(dayCells);
      
                this.monthNameSpan.empty().append(this.monthName(date));
                this.yearNameSpan.empty().append(this.currentMonth.getFullYear());
      
                $(".jFormComponentDateSelectorSelectedDay", this.tbody).click(this.bindToObj(function(event) {
                    this.changeInput($(event.target).attr("date"));
                }));
      
                $("td[date=\"" + this.dateToString(new Date()) + "\"]", this.tbody).addClass("jFormComponentDateSelectorToday");
      
                $("td.jFormComponentDateSelectorSelectedDay", this.tbody).mouseover(function() {
                    $(this).addClass("hover")
                });
                $("td.jFormComponentDateSelectorSelectedDay", this.tbody).mouseout(function() {
                    $(this).removeClass("hover")
                });
            };
    
            $('.jFormComponentDateSelectorSelected', this.tbody).removeClass("jFormComponentDateSelectorSelected");
            $('td[date="' + this.selectedDateString + '"]', this.tbody).addClass("jFormComponentDateSelectorSelected");
        },
  
        selectDate: function(date) {
            if (typeof(date) == "undefined") {
                date = this.stringToDate(this.input.val());
            };
            if (!date) date = new Date();
    
            this.selectedDate = date;
            this.selectedDateString = this.dateToString(this.selectedDate);
            this.selectMonth(this.selectedDate);
        },
  
        changeInput: function(dateString) {
            this.input.val(dateString).change();
            this.hide();
        },
  
        show: function() {
            this.rootLayers.css("display", "block");
            this.button.unbind("click", this.show);
            this.input.unbind("focus", this.show);
            $(document.body).keydown(this.keydownHandler);
            $([window, document.body]).click(this.hideIfClickOutside);
            this.setPosition();
        },
  
        hide: function() {
            this.rootLayers.css("display", "none");
            $([window, document.body]).unbind("click", this.hideIfClickOutside);
            this.button.click(this.show);
            this.input.focus(this.show);
            $(document.body).unbind("keydown", this.keydownHandler);
        },
  
        hideIfClickOutside: function(event) {
            if (event.target != this.input[0] && event.target != this.button[0] && !this.insideSelector(event)) {
                this.hide();
            };
        },
  
        insideSelector: function(event) {
            var offset = this.dateSelector.offset();
            offset.right = offset.left + this.dateSelector.outerWidth();
            offset.bottom = offset.top + this.dateSelector.outerHeight();

    
            return event.pageY < offset.bottom &&
            event.pageY > offset.top &&
            event.pageX < offset.right &&
            event.pageX > offset.left;
        },
  
        keydownHandler: function(event) {
            switch (event.keyCode)
            {
                case 9:
                case 27:
                    this.hide();
                    return;
                    break;
                case 13:
                    this.changeInput(this.selectedDateString);
                    break;
                case 33:
                    this.moveDateMonthBy(event.ctrlKey ? -12 : -1);
                    break;
                case 34:
                    this.moveDateMonthBy(event.ctrlKey ? 12 : 1);
                    break;
                case 38:
                    this.moveDateBy(-7);
                    break;
                case 40:
                    this.moveDateBy(7);
                    break;
                case 37:
                    this.moveDateBy(-1);
                    break;
                case 39:
                    this.moveDateBy(1);
                    break;
                default:
                    return;
            }
            event.preventDefault();
        },
  
        stringToDate: function(string) {
            string = string.replace(/[^\d]/g, '/');
            if (string.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4,4})$/)) {
                return new Date(string);
            } else {
                return null;
            };
        },
  
        dateToString: function(date) {
            return padString(date.getMonth()+1) +'/'+ padString(date.getDate()) +"/"+ date.getFullYear();

            function padString(number){
                number = '' + number;
                if(number.length == 1){
                    number = '0'+number;
                }
                return number;
            }
        },
  
        setPosition: function() {
            var offset = this.button.position();
            this.rootLayers.css({
                top: offset.top,
                left: offset.left + this.button.outerWidth() + 4
            });
            if (this.ieframe) {
                this.ieframe.css({
                    width: this.dateSelector.outerWidth(),
                    height: this.dateSelector.outerHeight()
                });
            }
            var bottom = offset.top + this.dateSelector.outerHeight() + 12;
            var top = '';
            if(jFormerUtility.isSet(window.scrollY)) {
                top = window.scrollY;
            }
            else { // IE FTL
                top = document.documentElement.scrollTop;
            }
            if(top + $(window).height() > bottom) {
            } else {
                $.scrollTo(bottom - $(window).height() + 'px', 250, {
                    axis:'y'
                });
            }
        },
  
        moveDateBy: function(amount) {
            var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
            this.selectDate(newDate);
        },
  
        moveDateMonthBy: function(amount) {
            var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
            if (newDate.getMonth() == this.selectedDate.getMonth() + amount + 1) {
      
                newDate.setDate(0);
            };
            this.selectDate(newDate);
        },
  
        moveMonthBy: function(amount) {
            var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, this.currentMonth.getDate());
            this.selectMonth(newMonth);
        },
  
        monthName: function(date) {
            return this.jFormComponentDateSelectorMonthNames[date.getMonth()];
        },
  
        bindToObj: function(fn) {
            var self = this;
            return function() {
                return fn.apply(self, arguments)
            };
        },
  
        bindMethodsToObj: function() {
            for (var i = 0; i < arguments.length; i++) {
                this[arguments[i]] = this.bindToObj(this[arguments[i]]);
            };
        },
  
        indexFor: function(array, value) {
            for (var i = 0; i < array.length; i++) {
                if (value == array[i]) return i;
            };
        },
  
        monthNum: function(jFormComponentDateSelectorMonthName) {
            return this.indexFor(this.jFormComponentDateSelectorMonthNames, jFormComponentDateSelectorMonthName);
        },
  
        shortMonthNum: function(jFormComponentDateSelectorMonthName) {
            return this.indexFor(this.short_jFormComponentDateSelectorMonthNames, jFormComponentDateSelectorMonthName);
        },
  
        shortDayNum: function(day_name) {
            return this.indexFor(this.short_day_names, day_name);
        },
  
        daysBetween: function(start, end) {
            start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
            end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
            return (end - start) / 86400000;
        },
  
        changeDayTo: function(dayOfWeek, date, direction) {
            var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
        },
  
        rangeStart: function(date) {
            return this.changeDayTo(this.start_of_week, new Date(date.getFullYear(), date.getMonth()), -1);
        },
  
        rangeEnd: function(date) {
            return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1);
        },
  
        isFirstDayOfWeek: function(date) {
            return date.getDay() == this.start_of_week;
        },
  
        isLastDayOfWeek: function(date) {
            return date.getDay() == (this.start_of_week - 1) % 7;
        },
  
        adjustDays: function(days) {
            var newDays = [];
            for (var i = 0; i < days.length; i++) {
                newDays[i] = days[(i + this.start_of_week) % 7];
            };
            return newDays;
        }
    };

    $.fn.date_input = function(opts) {
        return this.each(function() {
            new DateInput(this, opts);
        });
    };
    $.date_input = {
        initialize: function(opts) {
            $("input.date_input").date_input(opts);
        }
    };

    return DateInput;
})(jQuery); 
