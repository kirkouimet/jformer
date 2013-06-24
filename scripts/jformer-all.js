JFormerUtility = function() {
    }

$.extend(JFormerUtility.prototype, {
    isSet: function() {
        var a = arguments;
        var l = a.length;
        var i = 0;
        if(l == 0) {
            throw new Error('Empty isSet.');
        }
        while(i != l) {
            if(typeof(a[i]) == 'undefined' || a[i] === null) {
                return false;
            }
            else {
                i++;
            }
        }
        return true;
    },

    empty: function(mixedVariable) {
        var key;
        if(mixedVariable === ""
            || mixedVariable === 0
            || mixedVariable === "0"
            || mixedVariable === null
            || mixedVariable === false
            || mixedVariable === undefined
            ) {
            return true;
        }
        if(typeof mixedVariable == 'object') {
            for(key in mixedVariable) {
                if(typeof mixedVariable[key] !== 'function') {
                    return false;
                }
            }
            return true;
        }
        return false;
    },

    getExtraWidth: function(element) {
        var element = $(element);
        var totalWidth = 0;
        totalWidth += parseInt(element.css("padding-left"), 10) + parseInt(element.css("padding-right"), 10); //Total Padding Width
        totalWidth += parseInt(element.css("margin-left"), 10) + parseInt(element.css("margin-right"), 10); //Total Margin Width
        totalWidth += parseInt(element.css("borderLeftWidth"), 10) + parseInt(element.css("borderRightWidth"), 10); //Total Border Width
        return totalWidth;
    },

    jsonEncode: function(mixed_val) {
        // http://kevin.vanzonneveld.net
        // +      original by: Public Domain (http://www.json.org/json2.js)
        // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // + improved by: T.J. Leahy
        // *     example 1: json_encode(['e', {pluribus: 'unum'}]);
        // *     returns 1: '[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]'

        /*
        http://www.JSON.org/json2.js
        2008-11-19
        Public Domain.
        NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
        See http://www.JSON.org/js.html
    */
        var json = window.JSON;
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            return json.stringify(mixed_val);
        }

        var value = mixed_val;

        var quote = function (string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
        };

        var str = function (key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0;          // The loop counter.
            var k = '';          // The member key.
            var v = '';          // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                        partial.join(',\n' + gap) + '\n' +
                        mind + ']' :
                        '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                    mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });
    }

});

jFormerUtility = new JFormerUtility();

// Simple class creation and inheritance
// Inspired by base2 and Prototype
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){
    }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
                return function() {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();
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
      
                $('td[date="' + this.dateToString(new Date()) + '"]', this.tbody).addClass("jFormComponentDateSelectorToday");
      
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
/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2009 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
	Version: 1.2.2 (03/09/2009 22:39:06)
*/
(function($) {
	var pasteEventName = ($.browser.msie ? 'paste' : 'input') + ".mask";
	var iPhone = (window.orientation != undefined);

	$.mask = {
		//Predefined character definitions
		definitions: {
			'9': "[0-9]",
			'a': "[A-Za-z]",
			'*': "[A-Za-z0-9]"
		}
	};

	$.fn.extend({
		//Helper Function for Caret positioning
		caret: function(begin, end) {
			if (this.length == 0) return;
			if (typeof begin == 'number') {
				end = (typeof end == 'number') ? end : begin;
				return this.each(function() {
					if (this.setSelectionRange) {
						this.focus();
						this.setSelectionRange(begin, end);
					} else if (this.createTextRange) {
						var range = this.createTextRange();
						range.collapse(true);
						range.moveEnd('character', end);
						range.moveStart('character', begin);
						range.select();
					}
				});
			} else {
				if (this[0].setSelectionRange) {
					begin = this[0].selectionStart;
					end = this[0].selectionEnd;
				} else if (document.selection && document.selection.createRange) {
					var range = document.selection.createRange();
					begin = 0 - range.duplicate().moveStart('character', -100000);
					end = begin + range.text.length;
				}
				return { begin: begin, end: end };
			}
		},
		unmask: function() { return this.trigger("unmask"); },
		mask: function(mask, settings) {
			if (!mask && this.length > 0) {
				var input = $(this[0]);
				var tests = input.data("tests");
				return $.map(input.data("buffer"), function(c, i) {
					return tests[i] ? c : null;
				}).join('');
			}
			settings = $.extend({
				placeholder: "_",
				completed: null
			}, settings);

			var defs = $.mask.definitions;
			var tests = [];
			var partialPosition = mask.length;
			var firstNonMaskPos = null;
			var len = mask.length;

			$.each(mask.split(""), function(i, c) {
				if (c == '?') {
					len--;
					partialPosition = i;
				} else if (defs[c]) {
					tests.push(new RegExp(defs[c]));
					if(firstNonMaskPos==null)
						firstNonMaskPos =  tests.length - 1;
				} else {
					tests.push(null);
				}
			});

			return this.each(function() {
				var input = $(this);
				var buffer = $.map(mask.split(""), function(c, i) { if (c != '?') return defs[c] ? settings.placeholder : c });
				var ignore = false;  			//Variable for ignoring control keys
				var focusText = input.val();

				input.data("buffer", buffer).data("tests", tests);

				function seekNext(pos) {
					while (++pos <= len && !tests[pos]) {}
					return pos;
				};

				function shiftL(pos) {
					while (!tests[pos] && --pos >= 0) {}
					for (var i = pos; i < len; i++) {
						if (tests[i]) {
							buffer[i] = settings.placeholder;
							var j = seekNext(i);
							if (j < len && tests[i].test(buffer[j])) {
								buffer[i] = buffer[j];
							} else
								break;
						}
					}
					writeBuffer();
					input.caret(Math.max(firstNonMaskPos, pos));
				};

				function shiftR(pos) {
					for (var i = pos, c = settings.placeholder; i < len; i++) {
						if (tests[i]) {
							var j = seekNext(i);
							var t = buffer[i];
							buffer[i] = c;
							if (j < len && tests[j].test(t))
								c = t;
							else
								break;
						}
					}
				};

				function keydownEvent(e) {
					var pos = $(this).caret();
					var k = e.keyCode;
					ignore = (k < 16 || (k > 16 && k < 32) || (k > 32 && k < 41));
                                        if(!e.shiftKey){
                                            if(k==36){
                                                e.preventDefault();
                                                $(this).caret(seekNext(0));
                                            }

                                            if(k==35){
                                                e.preventDefault();
                                                var tempPos = input.val().indexOf(' ');
                                                var tempLength = input.val().length;
                                                while (tests[tempPos] == null || input.val().charAt(tempPos) != ' '){
                                                    tempPos = tempPos + 1;
                                                    if (tempPos == tempLength){
                                                        break;
                                                    }
                                                }
                                                $(this).caret(tempPos);
                                                return false;
                                            }
                                        }

					//delete selection before proceeding
					if ((pos.begin - pos.end) != 0 && (!ignore || k == 8 || k == 46))
						clearBuffer(pos.begin, pos.end);

					//backspace, delete, and escape get special treatment
					if (k == 8 || k == 46 || (iPhone && k == 127)) {//backspace/delete
						shiftL(pos.begin + (k == 46 ? 0 : -1));
						return false;
					} else if (k == 27) {//escape
						input.val(focusText);
						input.caret(0, checkVal());
						return false;
					}
				};

				function keypressEvent(e) {
					if (ignore) {
						ignore = false;
						//Fixes Mac FF bug on backspace
						return (e.keyCode == 8) ? false : null;
					}
					e = e || window.event;
					var k = e.charCode || e.keyCode || e.which;
					var pos = $(this).caret();

					if (e.ctrlKey || e.altKey || e.metaKey) {//Ignore
						return true;
					} else if ((k >= 32 && k <= 125) || k > 186) {//typeable characters
                                            var p = seekNext(pos.begin - 1);
                                            if (p < len) {
                                                var c = String.fromCharCode(k);
                                                if (tests[p].test(c)) {
                                                    shiftR(p);
                                                    buffer[p] = c;
                                                    writeBuffer();
                                                    var next = seekNext(p);
                                                    $(this).caret(next);
                                                    if (settings.completed && next == len)
                                                        settings.completed.call(input);
                                                }
                                            }
					}
					return false;
				};

				function clearBuffer(start, end) {
					for (var i = start; i < end && i < len; i++) {
						if (tests[i])
							buffer[i] = settings.placeholder;
					}
				};

				function writeBuffer() { return input.val(buffer.join('')).val(); };

				function checkVal(allow) {
					//try to place characters where they belong
					var test = input.val();
					var lastMatch = -1;
					for (var i = 0, pos = 0; i < len; i++) {
						if (tests[i]) {
							buffer[i] = settings.placeholder;
							while (pos++ < test.length) {
								var c = test.charAt(pos - 1);
								if (tests[i].test(c)) {
									buffer[i] = c;
									lastMatch = i;
									break;
								}
							}
							if (pos > test.length)
								break;
						} else if (buffer[i] == test[pos] && i!=partialPosition) {
							pos++;
							lastMatch = i;
						}
					}
					if (!allow && lastMatch + 1 < partialPosition) {
						input.val("");
						clearBuffer(0, len);
					} else if (allow || lastMatch + 1 >= partialPosition) {
						writeBuffer();
						if (!allow) input.val(input.val().substring(0, lastMatch + 1));
					}
					return (partialPosition ? i : firstNonMaskPos);
				};

				if (!input.attr("readonly"))
					input
					.one("unmask", function() {
						input
							.unbind(".mask")
							.removeData("buffer")
							.removeData("tests");
					})
					.bind("focus.mask", function() {
						focusText = input.val();
						var pos = checkVal();
						writeBuffer();
						setTimeout(function() {
							if (pos == mask.length)
								input.caret(0, pos);
							else
								input.caret(pos);
						}, 0);
					})
					.bind("blur.mask", function() {
						checkVal();
						if (input.val() != focusText)
							input.change();
					})
					.bind("keydown.mask", keydownEvent)
					.bind("keypress.mask", keypressEvent)
					.bind(pasteEventName, function() {
						setTimeout(function() { input.caret(checkVal(true)); }, 0);
					});

				checkVal(); //Perform initial check for existing values
			});
		}
	});
})(jQuery);
/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/9/2009
 * @author Ariel Flesler
 * @version 1.4.1
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function($){var m=$.scrollTo=function(b,h,f){$(window).scrollTo(b,h,f)};m.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1};m.window=function(b){return $(window).scrollable()};$.fn.scrollable=function(){return this.map(function(){var b=this,h=!b.nodeName||$.inArray(b.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!h)return b;var f=(b.contentWindow||b).document||b.ownerDocument||b;return $.browser.safari||f.compatMode=='BackCompat'?f.body:f.documentElement})};$.fn.scrollTo=function(l,j,a){if(typeof j=='object'){a=j;j=0}if(typeof a=='function')a={onAfter:a};if(l=='max')l=9e9;a=$.extend({},m.defaults,a);j=j||a.speed||a.duration;a.queue=a.queue&&a.axis.length>1;if(a.queue)j/=2;a.offset=n(a.offset);a.over=n(a.over);return this.scrollable().each(function(){var k=this,o=$(k),d=l,p,g={},q=o.is('html,body');switch(typeof d){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px)?$/.test(d)){d=n(d);break}d=$(d,this);case'object':if(d.is||d.style)p=(d=$(d)).offset()}$.each(a.axis.split(''),function(b,h){var f=h=='x'?'Left':'Top',i=f.toLowerCase(),c='scroll'+f,r=k[c],s=h=='x'?'Width':'Height';if(p){g[c]=p[i]+(q?0:r-o.offset()[i]);if(a.margin){g[c]-=parseInt(d.css('margin'+f))||0;g[c]-=parseInt(d.css('border'+f+'Width'))||0}g[c]+=a.offset[i]||0;if(a.over[i])g[c]+=d[s.toLowerCase()]()*a.over[i]}else g[c]=d[i];if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],u(s));if(!b&&a.queue){if(r!=g[c])t(a.onAfterFirst);delete g[c]}});t(a.onAfter);function t(b){o.animate(g,j,a.easing,b&&function(){b.call(this,l,a)})};function u(b){var h='scroll'+b;if(!q)return k[h];var f='client'+b,i=k.ownerDocument.documentElement,c=k.ownerDocument.body;return Math.max(i[h],c[h])-Math.min(i[f],c[f])}}).end()};function n(b){return typeof b=='object'?b:{top:b,left:b}}})(jQuery);

/**
 * jQuery.LocalScroll - Animated scrolling navigation, using anchors.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/11/2009
 * @author Ariel Flesler
 * @version 1.2.7
 **/
;(function($){var l=location.href.replace(/#.*/,'');var g=$.localScroll=function(a){$('body').localScroll(a)};g.defaults={duration:1e3,axis:'y',event:'click',stop:true,target:window,reset:true};g.hash=function(a){if(location.hash){a=$.extend({},g.defaults,a);a.hash=false;if(a.reset){var e=a.duration;delete a.duration;$(a.target).scrollTo(0,a);a.duration=e}i(0,location,a)}};$.fn.localScroll=function(b){b=$.extend({},g.defaults,b);return b.lazy?this.bind(b.event,function(a){var e=$([a.target,a.target.parentNode]).filter(d)[0];if(e)i(a,e,b)}):this.find('a,area').filter(d).bind(b.event,function(a){i(a,this,b)}).end().end();function d(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,'')==l&&(!b.filter||$(this).is(b.filter))}};function i(a,e,b){var d=e.hash.slice(1),f=document.getElementById(d)||document.getElementsByName(d)[0];if(!f)return;if(a)a.preventDefault();var h=$(b.target);if(b.lock&&h.is(':animated')||b.onBefore&&b.onBefore.call(b,a,f,h)===false)return;if(b.stop)h.stop(true);if(b.hash){var j=f.id==d?'id':'name',k=$('<a> </a>').attr(j,d).css({position:'absolute',top:$(window).scrollTop(),left:$(window).scrollLeft()});f[j]='';$('body').prepend(k);location=e.hash;k.remove();f[j]=d}h.scrollTo(f,b).trigger('notify.serialScroll',[f])}})(jQuery);

/**
 * jQuery[a] - Animated scrolling of series
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/20/2008
 * @author Ariel Flesler
 * @version 1.2.1
 *
 * http://flesler.blogspot.com/2008/02/jqueryserialscroll.html
 */
;(function($){var a='serialScroll',b='.'+a,c='bind',C=$[a]=function(b){$.scrollTo.window()[a](b)};C.defaults={duration:1e3,axis:'x',event:'click',start:0,step:1,lock:1,cycle:1,constant:1};$.fn[a]=function(y){y=$.extend({},C.defaults,y);var z=y.event,A=y.step,B=y.lazy;return this.each(function(){var j=y.target?this:document,k=$(y.target||this,j),l=k[0],m=y.items,o=y.start,p=y.interval,q=y.navigation,r;if(!B)m=w();if(y.force)t({},o);$(y.prev||[],j)[c](z,-A,s);$(y.next||[],j)[c](z,A,s);if(!l.ssbound)k[c]('prev'+b,-A,s)[c]('next'+b,A,s)[c]('goto'+b,t);if(p)k[c]('start'+b,function(e){if(!p){v();p=1;u()}})[c]('stop'+b,function(){v();p=0});k[c]('notify'+b,function(e,a){var i=x(a);if(i>-1)o=i});l.ssbound=1;if(y.jump)(B?k:w())[c](z,function(e){t(e,x(e.target))});if(q)q=$(q,j)[c](z,function(e){e.data=Math.round(w().length/q.length)*q.index(this);t(e,this)});function s(e){e.data+=o;t(e,this)};function t(e,a){if(!isNaN(a)){e.data=a;a=l}var c=e.data,n,d=e.type,f=y.exclude?w().slice(0,-y.exclude):w(),g=f.length,h=f[c],i=y.duration;if(d)e.preventDefault();if(p){v();r=setTimeout(u,y.interval)}if(!h){n=c<0?0:n=g-1;if(o!=n)c=n;else if(!y.cycle)return;else c=g-n-1;h=f[c]}if(!h||d&&o==c||y.lock&&k.is(':animated')||d&&y.onBefore&&y.onBefore.call(a,e,h,k,w(),c)===!1)return;if(y.stop)k.queue('fx',[]).stop();if(y.constant)i=Math.abs(i/A*(o-c));k.scrollTo(h,i,y).trigger('notify'+b,[c])};function u(){k.trigger('next'+b)};function v(){clearTimeout(r)};function w(){return $(m,l)};function x(a){if(!isNaN(a))return a;var b=w(),i;while((i=b.index(a))==-1&&a!=l)a=a.parentNode;return i}})}})(jQuery);/**
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

        if(conf.persistent){
            wrappedContent = ['<span class="tipArrow"></span><div class="tipContent">',conf.content.html(),'<span class="jformerTipClose">x</span></div>'].join('');
        }
        else {
            wrappedContent = ['<span class="tipArrow"></span><div class="tipContent">',conf.content.html(),'</div>'].join('');
        }
        

        var tooltip = jQuery(conf.content)
        .addClass(conf.baseClass)
        .html(wrappedContent);

        // Add an event listener that listens for a window resize and repositions the element
        jQuery(window).resize(function(){
            if(tooltip.is(':visible')) {
                self.updatePos();
            }
            
        });

        jQuery.extend(self,
        {
            persistent: conf.persistent,
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
                        tooltip.fadeIn(conf.showTime);
                        break;
                    case 'slide':
                        tooltip.slideDown(conf.showTime, self.updatePos);
                        break;
                    case 'custom':
                        conf.showCustom.call(tooltip, conf.showTime);
                        break;
                    default:
                    case 'none':
                        tooltip.show();
                        break;
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
                        tooltip.fadeOut(conf.hideTime);
                        break;
                    case 'slide':
                        tooltip.slideUp(conf.hideTime);
                        break;
                    case 'custom':
                        conf.hideCustom.call(tooltip, conf.hideTime);
                        break;
                    default:
                    case 'none':
                        tooltip.hide();
                        break;
                };

                tooltip.removeClass(conf.activeClass);

                conf.onHide.call(self);

                jQuery(document).trigger('blurTip', [tooltip, 'hide']);

                return self;
            },

            update: function(content)
            {
                tooltip.html(content);
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
})();/**
 * jFormer is the steward of the form. Holds base functions which are not specific to any page, section, or component.
 * jFormer is initialized on top of the existing HTML and handles validation, tool tip management, dependencies, instances, triggers, pages, and form submission.
 *
 * @author Kirk Ouimet <kirk@kirkouimet.com>
 * @author Seth Jensen <seth@sethjdesign.com>
 * @version .5
 */
JFormer = Class.extend({
    init: function(formId, options) {
        var self = this;

        // Keep track of when the form starts initializing (turns off at buttom of init)
        this.initializing = true;

        // Update the options object
        this.options = $.extend(true, {
            animationOptions: {
                pageScroll: {
                    duration: 375,
                    adjustHeightDuration: 375
                },
                instance: {
                    appearDuration: 0,
                    appearEffect: 'fade',
                    removeDuration: 0,
                    removeEffect: 'fade',
                    adjustHeightDuration: 0
                },
                dependency: {
                    appearDuration: 250,
                    appearEffect: 'fade',
                    hideDuration: 100,
                    hideEffect: 'fade',
                    adjustHeightDuration: 100
                },
                alert: {
                    appearDuration: 250,
                    appearEffect: 'fade',
                    hideDuration: 100,
                    hideEffect: 'fade'
                },
                modal: {
                    appearDuration: 0,
                    hideDuration: 0
                }
            },
            setupPageScroller: true,
            validationTips: true,
            pageNavigator: false,
            splashPage: false,
            alertsEnabled: true,
            clientSideValidation: true,
            debugMode: false,
            submitButtonText: 'Submit',
            submitProcessingButtonText: 'Processing...',
            onSubmitStart: function() {
                return true;
            },
            onSubmitFinish: function() {
                return true;
            }
        }, options.options || {});

        // Class variables
        this.id = formId;
        this.form = $(['form#',this.id].join(''));
        this.formData = {};
        this.jFormPageWrapper = this.form.find('div.jFormPageWrapper');
        this.jFormPageScroller = this.form.find('div.jFormPageScroller');
        this.jFormPageNavigator = null;
        this.jFormPages = {};
        this.currentJFormPage = null;
        this.maxJFormPageIdArrayIndexReached = null;
        this.jFormPageIdArray = [];
        this.currentJFormPageIdArrayIndex = null;
        this.blurredTips = [];
        this.lastEnabledPage = false;

        // Controls
        this.control = this.form.find('ul.jFormerControl');
        this.controlNextLi = this.form.find('ul.jFormerControl li.nextLi');
        this.controlNextButton = this.controlNextLi.find('button.nextButton');
        this.controlPreviousLi = this.form.find('ul.jFormerControl li.previousLi');
        this.controlPreviousButton = this.controlPreviousLi.find('button.previousButton');

        // Initialize all of the pages
        this.initPages(options.jFormPages);

        // Add a splash page if enabled
        if(this.options.splashPage !== false) {
            if(this.options.splashPage == false) {
                this.options.splashPage = {};
            }
            this.addSplashPage();
        }
        // Set the current page
        else {
            this.currentJFormPageIdArrayIndex = 0;
            this.maxJFormPageIdArrayIndexReached = 0;
            this.currentJFormPage = this.jFormPages[this.jFormPageIdArray[0]];
            this.currentJFormPage.active = true;
            // Add the page navigator
            if(this.options.pageNavigator !== false) {
                this.addPageNavigator();
            }
        }

        // Setup the page scroller - mainly CSS changes to width and height
        if(this.options.setupPageScroller) {
            this.setupPageScroller();
        }
        
        // Hide all inactive pages
        this.hideInactivePages();

        // Setup the control buttons
        this.setupControl();

        // Add a submit button listener
        this.addSubmitListener();

        // Add enter key listener
        this.addEnterKeyListener();

        // The blur tip listener
        this.addBlurTipListener();

        // Check dependencies
        this.checkDependencies(true);

        // Record when the form is finished initializing
        this.initializing = false;

        // Instantly adjust the height of the form after the window is loaded
        $(window).load(function() {
            //console.log('Adjusting height!', self.id);
            self.adjustHeight({
                adjustHeightDuration:0
            });
        });
    },

    initPages: function(jFormPages) {
        var self = this
        var each = $.each;
        var dependencies = {};
        
        each(jFormPages, function(jFormPageKey, jFormPageValue) {
            var jFormPage = new JFormPage(self, jFormPageKey, jFormPageValue.options);
            jFormPage.show();
            
            // Handle page level dependencies
            if(jFormPage.options.dependencyOptions !== null) {
                $.each(jFormPage.options.dependencyOptions.dependentOn, function(index, componentId) {
                    if(dependencies[componentId] === undefined) {
                        dependencies[componentId] = {
                            pages:[],
                            sections:[],
                            components:[]
                        };
                    }
                    dependencies[componentId].pages.push({
                        jFormPageId:jFormPageKey
                    });
                });
            }

            each(jFormPageValue.jFormSections, function(jFormSectionKey, jFormSectionValue) {
                var jFormSection = new JFormSection(jFormPage, jFormSectionKey, jFormSectionValue.options);

                // Handle section level dependencies
                if(jFormSection.options.dependencyOptions !== null) {
                    $.each(jFormSection.options.dependencyOptions.dependentOn, function(index, componentId) {
                        if(dependencies[componentId] === undefined) {
                            dependencies[componentId] = {
                                pages:[],
                                sections:[],
                                components:[]
                            };
                        }
                        dependencies[componentId].sections.push({
                            jFormPageId:jFormPageKey,
                            jFormSectionId:jFormSectionKey
                        });
                    });
                }

                each(jFormSectionValue.jFormComponents, function(jFormComponentKey, jFormComponentValue) {
                    var jFormComponent = new window[jFormComponentValue.type](jFormSection, jFormComponentKey, jFormComponentValue.type, jFormComponentValue.options);
                    jFormSection.addComponent(jFormComponent);

                    // Check if there are pregenerated instances and add them
                    jFormComponent.addInitialInstances();

                    jFormSection.addComponent(jFormComponent);

                    // Handle component level dependencies
                    if(jFormComponent.options.dependencyOptions !== null) {
                        $.each(jFormComponent.options.dependencyOptions.dependentOn, function(index, componentId) {
                            if(dependencies[componentId] === undefined) {
                                dependencies[componentId] = {
                                    pages:[],
                                    sections:[],
                                    components:[]
                                };
                            }
                            dependencies[componentId].components.push({
                                jFormPageId:jFormPageKey,
                                jFormSectionId:jFormSectionKey,
                                jFormComponentId:jFormComponentKey
                            });
                        });
                    }
                });

                // Check if there are pregenerated instances and add them
                jFormSection.addInitialSectionInstances();

                // Add the section to the page
                jFormPage.addSection(jFormSection);
            });
            self.addJFormPage(jFormPage);
        });

        // Add listeners for all of the components that are being dependent on
        // We group the component event listeners to prevent them from constantly being called
        $.each(dependencies, function(componentId, dependentTypes) {
            
            $('#'+componentId+':text, textarea#'+componentId).bind('keyup', function(event) {
                $.each(dependentTypes.pages, function(index, object) {
                    self.jFormPages[object.jFormPageId].checkDependencies();
                });
                $.each(dependentTypes.sections, function(index, object) {
                    self.jFormPages[object.jFormPageId].jFormSections[object.jFormSectionId].checkDependencies();
                });
                $.each(dependentTypes.components, function(index, object) {
                    self.jFormPages[object.jFormPageId].jFormSections[object.jFormSectionId].jFormComponents[object.jFormComponentId].checkDependencies();
                });
            });

            $('#'+componentId+'-wrapper').bind('jFormComponent:changed', function(event) {
                //console.log('running depend check');

                $.each(dependentTypes.pages, function(index, object) {
                    self.jFormPages[object.jFormPageId].checkDependencies();
                });
                $.each(dependentTypes.sections, function(index, object) {
                    self.jFormPages[object.jFormPageId].jFormSections[object.jFormSectionId].checkDependencies();
                });
                $.each(dependentTypes.components, function(index, object) {
                    //console.log('running a check', componentId, 'for', object.jFormComponentId);
                    self.jFormPages[object.jFormPageId].jFormSections[object.jFormSectionId].jFormComponents[object.jFormComponentId].checkDependencies();
                });
            });

            // Handle instances (this is super kludgy)
            var component = self.select(componentId);
            //console.log(component);
            if(component !== null && component.options.instanceOptions !== null){
                component.options.dependencies = dependentTypes;
            }
        });
    },

    select: function(jFormComponentId) {
        var componentFound = false,
        component = null;
        $.each(this.jFormPages, function(jFormPageKey, jFormPage){
            $.each(jFormPage.jFormSections, function(sectionKey, sectionObject){
                $.each(sectionObject.jFormComponents, function(componentKey, componentObject){
                    if (componentObject.id == jFormComponentId){
                        component = componentObject;
                        componentFound = true;
                    }
                    return !componentFound;
                });
                return !componentFound;
            });
            return !componentFound;
        });
        return component;
    },

    checkDependencies: function(onInit) {
        $.each(this.jFormPages, function(jFormPageKey, jFormPage) {
            jFormPage.checkDependencies();

            $.each(jFormPage.jFormSections, function(jFormSectionKey, jFormSection) {
                jFormSection.checkDependencies();

                $.each(jFormSection.jFormComponents, function(jFormComponentKey, jFormComponent) {
                    jFormComponent.checkDependencies();
                });
            });
        });
    },

    addSplashPage: function() {
        var self = this;

        // Setup the formPage for the splash page
        // Setup default page options for the splash page
        if(!this.options.splashPage.options) {
            this.options.splashPage.options = {};
        }

        // Setup the jFormPage for the splash page
        this.options.splashPage.jFormPage = new JFormPage(this, this.form.find('div.jFormerSplashPage').attr('id'));
        this.options.splashPage.jFormPage.addSection(new JFormSection(this.options.splashPage.jFormPage, this.form.find('div.jFormerSplashPage').attr('id') + '-section'));
        this.options.splashPage.jFormPage.page.width(this.form.width());
        this.options.splashPage.jFormPage.active = true;

        // Set the splash page as the current page
        this.currentJFormPage = this.options.splashPage.jFormPage;

        // Set the height of the page wrapper to the height of the splash page
        this.jFormPageWrapper.height(this.options.splashPage.jFormPage.page.outerHeight());

        // If they have a custom button
        if(this.options.splashPage.customButtonId) {
            this.options.splashPage.controlSplashLi = this.form.find('#'+this.options.splashPage.customButtonId);
            this.options.splashPage.controlSplashButton = this.form.find('#'+this.options.splashPage.customButtonId);
        }
        // Use the native control buttons
        else {
            this.options.splashPage.controlSplashLi = this.form.find('li.splashLi');
            this.options.splashPage.controlSplashButton = this.form.find('button.splashButton');
        }

        // Hide the other native controls
        this.setupControl();

        this.options.splashPage.controlSplashButton.bind('click', function(event) {
            event.preventDefault();
            self.beginFormFromSplashPage(false);
        });
    },

    beginFormFromSplashPage: function(initSaveState, loadForm) {
        var self = this;

        // Add the page navigator
        if(this.options.pageNavigator !== false && this.jFormPageNavigator == null) {
            this.addPageNavigator();
            this.jFormPageNavigator.show();
        }
        else if(this.options.pageNavigator !== false) {
            this.jFormPageNavigator.show();
        }

        // Find all of the pages
        var pages = this.form.find('.jFormPage');

        // Set the width of each page
        pages.css('width', this.form.find('.jFormWrapperContainer').width());
        
        // Mark the splash page as inactive
        self.options.splashPage.jFormPage.active = false;

        if(!loadForm){
            // Set the current page index
            self.currentJFormPageIdArrayIndex = 0;

            // Scroll to the new page, hide the old page when it is finished
            self.jFormPages[self.jFormPageIdArray[0]].scrollTo({
                onAfter: function() {
                    self.options.splashPage.jFormPage.hide();
                    self.renumberPageNavigator();
                }
            });
    }
},

addPageNavigator: function(){
    var self = this;

    this.jFormPageNavigator = this.form.find('.jFormPageNavigator');

    this.jFormPageNavigator.find('.jFormPageNavigatorLink:first').click(function(event) {
        // Don't scroll to the page if you already on it
        if(self.currentJFormPageIdArrayIndex != 0) {
            self.currentJFormPageIdArrayIndex = 0;

            self.scrollToPage(self.jFormPageIdArray[0], {
                //onAfter: function() {
                //}
                });
        }
    });

    // Update the style is right aligned
    if(this.options.pageNavigator.position == 'right'){
        this.form.find('.jFormWrapperContainer').width(this.form.width() - this.jFormPageNavigator.width() - 30);
    }
},

updatePageNavigator: function() {
    var self = this, pageCount, pageIndex;
    for(var i = 1; i <= this.maxJFormPageIdArrayIndexReached + 1; i++) {
        pageCount = i;
        var jFormPageNavigatorLink = $('#navigatePage'+pageCount);

        // Remove the active class from the page you aren't on
        if(this.currentJFormPageIdArrayIndex != pageCount - 1) {
            jFormPageNavigatorLink.removeClass('jFormPageNavigatorLinkActive');
        }
        // Add the active class to the page you are on
        else {
            jFormPageNavigatorLink.addClass('jFormPageNavigatorLinkActive');
        }

        // If the page is currently locked
        if(jFormPageNavigatorLink.hasClass('jFormPageNavigatorLinkLocked')){
            // Remove the lock
            jFormPageNavigatorLink.removeClass('jFormPageNavigatorLinkLocked').addClass('jFormPageNavigatorLinkUnlocked');

            jFormPageNavigatorLink.click(function(event) {
                var target = $(event.target);
                if(!target.is('li')){
                    target = target.closest('li');
                }

                pageIndex = target.attr('id').match(/[0-9]+$/)
                pageIndex = parseInt(pageIndex) - 1;

                // Perform a silent validation on the page you are leaving
                self.getActivePage().validate(true);

                // Don't scroll to the page if you already on it
                if(self.currentJFormPageIdArrayIndex != pageIndex) {
                    self.scrollToPage(self.jFormPageIdArray[pageIndex]);
                }

                self.currentJFormPageIdArrayIndex = pageIndex;
                    
            });
        }
    }
},

renumberPageNavigator: function() {
    $('.jFormPageNavigatorLink:visible').each(function(index, element) {
        // Renumber page link icons
        if($(element).find('span').length > 0) {
            $(element).find('span').html(index+1);
        }
        // Relabel pages that have no title or icons
        else {
            $(element).html('Page '+(index+1));
        }
    });
},
    
addJFormPage: function(jFormPage) {
    this.jFormPageIdArray.push(jFormPage.id);
    this.jFormPages[jFormPage.id] = jFormPage;
},

removeJFormPage: function(jFormPageId) {
    var self = this;

    // Remove the HTML
    $('#'+jFormPageId).remove();

    this.jFormPageIdArray = $.grep(self.jFormPageIdArray, function(value) {
        return value != jFormPageId;
    });
    delete this.jFormPages[jFormPageId];
},

addEnterKeyListener: function() {
    var self = this;

    // Prevent the default submission on key down
    this.form.bind('keydown', {
        context:this
    }, function(event) {
        if(event.keyCode === 13 || event.charCode === 13) {
            if($(event.target).is('textarea')){
                return;
            }
            event.preventDefault();
        }
    });

    this.form.bind('keyup', {
        context:this
    }, function(event) {
        // Get the current page, check to see if you are on the splash page
        var currentPage = self.getActivePage().page;

        // Listen for the enter key keycode
        if(event.keyCode === 13 || event.charCode === 13) {
            var target = $(event.target);
            // Do nothing if you are on a text area
            if(target.is('textarea')){
                return;
            }

            // If you are on a button, press it
            if(target.is('button')){
                event.preventDefault();
                target.trigger('click').blur();
            }
            // If you are on a field where pressing enter submits
            else if(target.is('.jFormComponentEnterSubmits')){
                event.preventDefault();
                target.blur();
                self.controlNextButton.trigger('click');
            }
            // If you are on an input that is a check box or radio button, select it
            else if(target.is('input:checkbox')) {
                event.preventDefault();
                target.trigger('click');
            }
            // If you are the last input and you are a password input, submit the form
            else if(target.is('input:password')) {
                event.preventDefault();
                target.blur();

                // Handle if you are on the splash page
                if(self.options.splashPage !== null && self.currentJFormPage.id == self.options.splashPage.jFormPage.id) {
                    self.options.splashPage.controlSplashButton.trigger('click');
                }
                else {
                    self.controlNextButton.trigger('click');
                }
            }

        }
    });
},

addSubmitListener: function(){
    var self = this;
    this.form.bind('submit', {
        context: this
    }, function(event) {
        event.preventDefault();
        self.submitEvent(event);
    });
},

getData: function() {
    var self = this;
    this.formData = {};
    $.each(this.jFormPages, function(jFormKey, jFormPage) {
        self.formData[jFormKey] = jFormPage.getData();
    });
    return this.formData;
},

setData: function(data) {
    var self = this;
    this.formData = data;
    $.each(data, function(key, page) {
        if(self.jFormPages[key] != undefined){
            self.jFormPages[key].setData(page);
        } else {
            return;
        }
    });
    return this.formData;
},

setupPageScroller: function(options) {
    var self = this;

    // Set some default values for the options
    var defaultOptions = {
        adjustHeightDuration: 0,
        jFormWrapperContainerWidth : self.form.find('.jFormWrapperContainer').width(),
        jFormPageWrapperWidth : self.jFormPageWrapper.width(),
        activePageOuterHeight : self.getActivePage().page.outerHeight()
    };
    options = $.extend(defaultOptions, options);
        
    // Find all of the pages
    var pages = this.form.find('.jFormPage');

    // Count the total number of pages
    var pageCount = pages.length;

    // Don't set width's if they are 0 (the form is hidden)
    if(options.formWrapperContainerWidth != 0) {
        // Set the width of each page
        pages.css('width', options.formWrapperContainerWidth)
    }
    pages.show();

    // Don't set width's if they are 0 (the form is hidden)
    if(options.formWrapperContainerWidth != 0) {
        // Set the width of the scroller
        self.jFormPageScroller.css('width', options.jFormPageWrapperWidth * (pageCount));
        self.jFormPageWrapper.parent().css('width', options.jFormPageWrapperWidth);
    }

    // Don't set height if it is 0 (the form is hidden)
    if(options.activePageOuterHeight != 0) {
        // Set the height of the wrapper
        self.jFormPageWrapper.height(options.activePageOuterHeight);
    }

    // Scroll to the current page (prevent weird Firefox bug where the page does not display on soft refresh
    if(options.scrollToPage) {
        self.scrollToPage(self.currentJFormPage.id, options);
    }
},

setupControl: function() {
    //console.log('setting up control');

    var self = this;
    // console.log(this.currentJFormPageIdArrayIndex);
    // Setup event listener for next button
    this.controlNextButton.unbind().click(function(event) {
        event.preventDefault();
        event['context'] = self;
        self.submitEvent(event);
    }).removeAttr('disabled');

    //check to see if this is the last enabled page.
    this.lastEnabledPage = false;
    for(i = this.jFormPageIdArray.length - 1 ; i > this.currentJFormPageIdArrayIndex; i--){
        if(!this.jFormPages[this.jFormPageIdArray[i]].disabledByDependency){
            this.lastEnabledPage = false;
            break;
        }
        this.lastEnabledPage = true;
    }

    // Setup event listener for previous button
    this.controlPreviousButton.unbind().click(function(event) {
        event.preventDefault();

        // Be able to return to the splash page
        if(self.options.splashPage !== false && self.currentJFormPageIdArrayIndex === 0) {
            self.currentJFormPageIdArrayIndex = null;
            if(self.jFormPageNavigator){
                self.jFormPageNavigator.hide();
            }
            self.options.splashPage.jFormPage.scrollTo();
        }
        // Scroll to the previous page
        else {
            if(self.jFormPages[self.jFormPageIdArray[self.currentJFormPageIdArrayIndex - 1]].disabledByDependency){
                for(var i = 1; i <= self.currentJFormPageIdArrayIndex; i++){
                    var nextIndex  = self.currentJFormPageIdArrayIndex - i;
                    if(nextIndex == 0 && self.options.splashPage !== false && self.jFormPages[self.jFormPageIdArray[nextIndex]].disabledByDependency ){
                        if(self.jFormPageNavigator){
                            self.jFormPageNavigator.hide();
                        }
                        self.options.splashPage.jFormPage.scrollTo();
                        break;
                    }
                    else if(!self.jFormPages[self.jFormPageIdArray[nextIndex]].disabledByDependency){
                        self.currentJFormPageIdArrayIndex = nextIndex;
                        break;
                    }
                }
            } else {
                self.currentJFormPageIdArrayIndex = self.currentJFormPageIdArrayIndex - 1;
            }
            self.scrollToPage(self.jFormPageIdArray[self.currentJFormPageIdArrayIndex]);
        }
    });
       
    // First page with more pages after, or splash page
    if(this.currentJFormPageIdArrayIndex === 0 && this.currentJFormPageIdArrayIndex != this.jFormPageIdArray.length - 1 && this.lastEnabledPage === false) {
        this.controlNextButton.html('Next');
        this.controlNextLi.show();
        this.controlPreviousLi.hide();
        this.controlPreviousButton.attr('disabled', 'disabled');
    }
    // Last page
    else if(self.currentJFormPageIdArrayIndex == this.jFormPageIdArray.length - 1 || this.lastEnabledPage === true) {
        this.controlNextButton.html(this.options.submitButtonText);
        this.controlNextLi.show();

        // First page is the last page
        if(self.currentJFormPageIdArrayIndex === 0 ) {
            // Hide the previous button
            this.controlPreviousLi.hide();
            this.controlPreviousButton.attr('disabled', '');
        }
        // There is a previous page
        else if(self.currentJFormPageIdArrayIndex > 0) {
            this.controlPreviousButton.removeAttr('disabled');
            this.controlPreviousLi.show();
        }
    }
    // Middle page with a previous and a next
    else {
        this.controlNextButton.html('Next');
        this.controlNextLi.show();
        this.controlPreviousButton.removeAttr('disabled');
        this.controlPreviousLi.show();
    }

    // Splash page
    if(this.options.splashPage !== false) {
        // If you are on the splash page
        if(this.options.splashPage.jFormPage.active) {
            this.options.splashPage.controlSplashLi.show();
            this.controlNextLi.hide();
            this.controlPreviousLi.hide();
            this.controlPreviousButton.attr('disabled', 'disabled');
        }
        // If you aren't on the splash page, don't show the splash button
        else {
            this.options.splashPage.controlSplashLi.hide();
        }

        // If you are on the first page
        if(this.currentJFormPageIdArrayIndex === 0  && this.options.saveState == false) {
            this.controlPreviousButton.removeAttr('disabled');
            this.controlPreviousLi.show();
        }
    }

    // Failure page
    if(this.control.find('.startOver').length == 1){
        // Hide the other buttons
        this.controlNextLi.hide();
        this.controlPreviousLi.hide();

        // Bind an event listener to the start over button
        this.control.find('.startOver').one('click', function(event){
            event.preventDefault();
            self.currentJFormPageIdArrayIndex = 0;
            self.scrollToPage(self.jFormPageIdArray[0], {
                onAfter: function(){
                    // Remove the start over button
                    $(event.target).parent().remove();
                    self.removeJFormPage(self.id+'jFormPageFailure');
                }
            });
        });
    }
},
    
scrollToPage: function(jFormPageId, options) {
    //console.log('JFormer('+this.id+'):scrollToPage', jFormPageId, options);

    // Prevent scrolling to dependency disabled pages
    if(this.jFormPages[jFormPageId] && this.jFormPages[jFormPageId].disabledByDependency) {
        return false;
    }

    var self = this;

    // Disable buttons
    this.controlNextButton.attr('disabled', true);
    this.controlPreviousButton.attr('disabled', true);

    // Handle page specific onScrollTo onBefore custom function
    var formPage = null;
    if(self.options.splashPage !== false && jFormPageId == self.options.splashPage.formPage.id) {
        formPage = self.options.splashPage.formPage;
    }
    else {
        formPage = this.jFormPages[jFormPageId];
    }

    if(formPage && formPage.options.onScrollTo.onBefore !== null) {
        // put a notice up if defined
        if(this.jFormPages[jFormPageId].options.onScrollTo.notificationHtml !== undefined) {
            if(self.control.find('.jformerScrollToNotification').length != 0 ){
                self.control.find('.jformerScrollToNotification').html(this.jFormPages[jFormPageId].options.onScrollTo.notificationHtml);
            } else {
                self.control.append('<li class="jformerScrollToNotification">'+this.jFormPages[jFormPageId].options.onScrollTo.notificationHtml+'<li>');
            }
                
        }
        this.jFormPages[jFormPageId].options.onScrollTo.onBefore();
    }

    // Remember the active duration time of the page
    var oldJFormPage = this.getActivePage();

    // Show every page so you can see them as you scroll through
    $.each(this.jFormPages, function(jFormPageKey, jFormPage) {
        jFormPage.show();
        jFormPage.active = false;
    });

    // If on the splash page, set the current page to the splash page
    if(self.options.splashPage !== false && jFormPageId == self.options.splashPage.jFormPage.id) {
        self.currentJFormPage = self.options.splashPage.jFormPage;
        self.currentJFormPage.show();
    }
    // Set the current page to the new page
    else {
        this.currentJFormPage = this.jFormPages[jFormPageId];
    }

    // Mark the current page as active
    this.currentJFormPage.active = true;

    // Adjust the height of the page wrapper
    // If there is a custom adjust height duration
    if(options && options.adjustHeightDuration !== undefined) {
        self.adjustHeight({
            adjustHeightDuration: options.adjustHeightDuration
            });
    }
    else {
        self.adjustHeight();
    }

    // Run the next animation immediately
    this.jFormPageWrapper.dequeue();

    // Scroll the document the top of the form
    this.scrollToTop();
        
    // PageWrapper is like a viewport - this scrolls to the top of the new page, but the document needs to be scrolled too
    var initializing = this.initializing;
    this.jFormPageWrapper.scrollTo(
        self.currentJFormPage.page,
        self.options.animationOptions.pageScroll.duration,
        {
            onAfter: function() {
                // Don't hide any pages while scrolling
                if($(self.jFormPageWrapper).queue('fx').length <= 1 ) {
                    self.hideInactivePages(self.getActivePage());
                }

                // Set the max page reach indexed
                if(self.maxJFormPageIdArrayIndexReached < self.currentJFormPageIdArrayIndex) {
                    self.maxJFormPageIdArrayIndexReached = self.currentJFormPageIdArrayIndex;
                }

                // Update the page navigator
                self.updatePageNavigator();

                // Start the time for the new page
                self.currentJFormPage.startTime = (new Date().getTime()/1000);

                // Run any special functions
                if(options && options.onAfter) {
                    options.onAfter();
                }

                // Run any specific page functions
                //console.log(self.currentJFormPage);
                if(self.currentJFormPage.options.onScrollTo.onAfter) {
                    self.currentJFormPage.options.onScrollTo.onAfter();
                }

                // Setup the controls
                self.setupControl();

                // Enable the buttons again
                self.controlNextButton.removeAttr('disabled').blur();
                self.controlPreviousButton.removeAttr('disabled').blur();

                // Focus on the first failed component, if it is failed,
                if(self.currentJFormPage.validationPassed === false && !initializing){
                    self.currentJFormPage.focusOnFirstFailedComponent();
                }

                // Handle page specific onScrollTo onAfter custom function
                if(self.jFormPages[jFormPageId] && self.jFormPages[jFormPageId].options.onScrollTo.onAfter !== null) {
                    self.jFormPages[jFormPageId].options.onScrollTo.onAfter();
                    if(self.jFormPages[jFormPageId].options.onScrollTo.notificationHtml !== null) {
                        self.control.find('li.jFormerScrollToNotification').remove();
                    }
                }
            }
        }
        );

    return this;
},

scrollToTop: function() {
    if(this.initializing) {
        return;
    }

    var self = this;
    // Only scroll if the top of the form is not visible
    if($(window).scrollTop() > this.form.offset().top) {
        $(document).scrollTo(self.form, self.options.animationOptions.pageScroll.duration, {
            offset: {
                top: -10
            }
        });
    }
},

getActivePage: function() {
    // if active page has not been set
    return this.currentJFormPage;
},

hideInactivePages: function(){
    $.each(this.jFormPages, function(jFormPageKey, jFormPage){
        jFormPage.hide();
    });
},

clearValidation: function() {
    $.each(this.jFormPages, function(jFormPageKey, jFormPage){
        jFormPage.clearValidation();
    });
},

submitEvent: function(event) {
    var self = this;
    //console.log('last enabled page', self.lastEnabledPage);
    // Stop the event no matter what
    event.stopPropagation();
    event.preventDefault();

    // Remove any failure notices
    self.control.find('.jFormerFailureNotice').remove();
    self.form.find('.jFormerFailure').remove();

    // Run a custom function at beginning of the form submission
    var onSubmitStartResult;
    if(typeof(self.options.onSubmitStart) != 'function') {
        onSubmitStartResult = eval(self.options.onSubmitStart);
    }
    else {
        onSubmitStartResult = self.options.onSubmitStart();
    }

    // Validate the current page if you are not the last page
    var clientSideValidationPassed = false;
    if(this.options.clientSideValidation) {
        if(self.currentJFormPageIdArrayIndex < self.jFormPageIdArray.length - 1 && !self.lastEnabledPage) {
            //console.log('Validating single page.');
            clientSideValidationPassed = self.getActivePage().validate();
        }
        else {
            //console.log('Validating whole form.');
            clientSideValidationPassed = self.validateAll();
        }
    }
    // Ignore client side validation
    else {
        this.clearValidation();
        clientSideValidationPassed = true;
    }

    // Run any custom functions at the end of the validation
    var onSubmitFinishResult = self.options.onSubmitFinish();

    // If the custom finish function returns false, do not submit the form
    if(onSubmitFinishResult) {
        // Last page, submit the form
        //console.log(clientSideValidationPassed && (self.currentJFormPageIdArrayIndex == self.jFormPageIdArray.length - 1) || (self.lastEnabledPage === true ));
        if(clientSideValidationPassed && (self.currentJFormPageIdArrayIndex == self.jFormPageIdArray.length - 1) || (self.lastEnabledPage === true )) {
            self.submitForm(event);
        }
        // Not last page, scroll to the next page
        else if(clientSideValidationPassed && self.currentJFormPageIdArrayIndex < self.jFormPageIdArray.length - 1) {
            // if the next page is disabled by dependency, loop through till you find a good page.
            if(self.jFormPages[self.jFormPageIdArray[self.currentJFormPageIdArrayIndex + 1]].disabledByDependency){
                for(var i = self.currentJFormPageIdArrayIndex + 1; i <= self.jFormPageIdArray.length - 1; i++){
                    // page is enabled, set the proper index, and break out of the loop.
                    if(!self.jFormPages[self.jFormPageIdArray[self.currentJFormPageIdArrayIndex + i]].disabledByDependency){
                        self.currentJFormPageIdArrayIndex = self.currentJFormPageIdArrayIndex + i;
                        break;
                    }
                }
            } else {
                self.currentJFormPageIdArrayIndex = self.currentJFormPageIdArrayIndex + 1;
            }
            self.scrollToPage(self.jFormPageIdArray[self.currentJFormPageIdArrayIndex]);
        }
    }
},

validateAll: function(){
    var self = this;
    var validationPassed = true;
    var index = 0;
    $.each(this.jFormPages, function(jFormPageKey, jFormPage) {
        var passed = jFormPage.validate();
        //console.log(jFormPage.id, 'passed', passed);
        if(passed === false) {
            //console.log('something went wrong' );
            self.currentJFormPageIdArrayIndex = index;
            if(self.currentJFormPage.id != jFormPage.id) {
                jFormPage.scrollTo();
            }
            validationPassed = false;
            return false; // Break out of the .each
        }
        index++;
    });
    return validationPassed;
},

adjustHeight: function(options) {
    //console.log('jFormer:adjustHeight', options)

    var self = this;
    var duration = this.options.animationOptions.pageScroll.adjustHeightDuration;

    // Use custom one time duration settings
    if(this.initializing){
        duration = 0;
    }
    else if(options && options.adjustHeightDuration !== undefined) {
        duration = options.adjustHeightDuration;
    }

    if(!this.initializing) {
        this.jFormPageWrapper.animate({
            'height' : self.getActivePage().page.outerHeight()
        }, duration);
    }
},

submitForm: function(event) {
    var self = this;

    // Use a temporary form targeted to the iframe to submit the results
    var formClone = this.form.clone(false);
    formClone.attr('id', formClone.attr('id')+'-clone');
    formClone.attr('style', 'display: none;');
    formClone.empty();
    formClone.appendTo($(this.form).parent());
    // Wrap all of the form responses into an object based on the component jFormComponentType
    var formData = $('<input type="hidden" name="jFormer" />').attr('value', encodeURI(jFormerUtility.jsonEncode(this.getData()))); // Set all non-file values in one form object
    var formIdentifier = $('<input type="hidden" name="jFormerId" value="'+this.id+'" />');
    formClone.append(formData);
    formClone.append(formIdentifier);


    this.form.find('input:file').each(function(index, fileInput) {
        if($(fileInput).val() != '') {
            // grab the IDs needed to pass
            var sectionId = $(fileInput).closest('.jFormSection').attr('id');
            var pageId = $(fileInput).closest('.jFormPage').attr('id');
            //var fileInput = $(fileInput).clone()

            // do find out the section instance index
            if($(fileInput).attr('id').match(/-section[0-9]+/)){
                var sectionInstance = null;
                var section = $(fileInput).closest('.jFormSection');
                // grab the base id of the section to find all sister sections
                var sectionBaseId = section.attr('id').replace(/-section[0-9]+/, '') ;
                sectionId = sectionId.replace(/-section[0-9]+/, '');
                // Find out which instance it is
                section.closest('.jFormPage').find('div[id*='+sectionBaseId+']').each(function(index, fileSection){
                    if(section.attr('id') == $(fileSection).attr('id')){
                        sectionInstance = index + 1;
                        return false;
                    }
                    return true;
                });
                fileInput.attr('name', fileInput.attr('name').replace(/-section[0-9]+/, '-section'+sectionInstance));
            }

            // do find out the component instance index
            if($(fileInput).attr('id').match(/-instance[0-9]+/)){
                // grab the base id of the component to find all sister components
                var baseId = $(fileInput).attr('id').replace(/-instance[0-9]+/, '')
                var instance = null;
                // Find out which instance it is
                $(fileInput).closest('.jFormSection').find('input[id*='+baseId+']').each(function(index, fileComponent){
                    if($(fileComponent).attr('id') == $(fileInput).attr('id')){
                        instance = index + 1;
                        return false;
                    }
                    return true;
                });
                fileInput.attr('name', $(fileInput).attr('name').replace(/-instance[0-9]+/, '-instance'+instance));
            }

            $(fileInput).attr('name', $(fileInput).attr('name')+':'+pageId+':'+sectionId);
            $(fileInput).appendTo(formClone);
        }
    });
        
    // Submit the form
    formClone.submit();
    formClone.remove(); // Ninja vanish!

    // Find the submit button and the submit response
    if(!this.options.debugMode){
        this.controlNextButton.text(this.options.submitProcessingButtonText).attr('disabled', 'disabled');
    }
    else {
        this.form.find('iframe:hidden').show();
    }

    // Add a processing li to the form control
    this.control.append('<li class="processingLi"></li>');
},

handleFormSubmissionResponse: function(json) {
    var self = this;
        
    // Remove the processing li from the form control
    this.control.find('.processingLi').remove();

    // Form failed processing
    if(json.status == 'failure') {
        // Handle validation failures
        if(json.response.validationFailed) {
            $.each(json.response.validationFailed, function(jFormPageKey, jFormPageValues){
                $.each(jFormPageValues, function(jFormSectionKey, jFormSectionValues){
                    // Handle section instances
                    if($.isArray(jFormSectionValues)) {
                        $.each(jFormSectionValues, function(jFormSectionInstanceIndex, jFormSectionInstanceValues){
                            var sectionKey;
                            if(jFormSectionInstanceIndex != 0) {
                                sectionKey = '-section'+(jFormSectionInstanceIndex + 1);
                            }
                            else {
                                sectionKey = '';
                            }
                            $.each(jFormSectionInstanceValues, function(jFormComponentKey, jFormComponentErrors) {
                                self.jFormPages[jFormPageKey].jFormSections[jFormSectionKey].instanceArray[jFormSectionInstanceIndex].jFormComponents[jFormComponentKey + sectionKey].handleServerValidationResponse(jFormComponentErrors);
                            });
                        });
                    }
                    // There are no section instances
                    else {
                        $.each(jFormSectionValues, function(jFormComponentKey, jFormComponentErrors){
                            self.jFormPages[jFormPageKey].jFormSections[jFormSectionKey].jFormComponents[jFormComponentKey].handleServerValidationResponse(jFormComponentErrors);
                        });
                    }
                });
            });
        }

        // Show the failureHtml if there was a problem
        if(json.response.failureHtml) {
            // Update the failure HTML
            this.control.find('.jFormerFailure').remove();
            this.control.after('<div class="jFormerFailure">'+json.response.failureHtml+'</div>');
        }

        // Strip the script out of the iframe
        this.form.find('iframe').contents().find('body script').remove();
        if(this.form.find('iframe').contents().find('body').html() !== null) {
            this.form.find('.jFormerFailure').append('<p>Output:</p>'+this.form.find('iframe').contents().find('body').html().trim());
        }

        // Reset the page, focus on the first failed component
        this.controlNextButton.text(this.options.submitButtonText);
        this.controlNextButton.removeAttr('disabled');
        this.getActivePage().focusOnFirstFailedComponent();
    }
    // Form passed processing
    else if(json.status == 'success'){
        // Show a success page
        if(json.response.successPageHtml){
            // Stop saving the form
            clearInterval(this.saveIntervalSetTimeoutId);

            // Create the success page html
            var successPageDiv = $('<div id="'+this.id+'jFormPageSuccess" class="jFormPage jFormPageSuccess">'+json.response.successPageHtml+'</div>');
            successPageDiv.css('width', this.jFormPages[this.jFormPageIdArray[0]].page.width());
            this.jFormPageScroller.css('width', this.jFormPageScroller.width() + this.jFormPages[this.jFormPageIdArray[0]].page.width());
            this.jFormPageScroller.append(successPageDiv);

            // Create the success page
            var jFormPageSuccess = new JFormPage(this, this.id+'jFormPageSuccess');
            this.addJFormPage(jFormPageSuccess);

            // Hide the page navigator and controls
            this.control.hide();
            if(this.jFormPageNavigator) {
                this.jFormPageNavigator.hide();
            }

            // Scroll to the page
            jFormPageSuccess.scrollTo();
        }
        // Show a failure page that allows you to go back
        else if(json.response.failurePageHtml){
            // Create the failure page html
            var failurePageDiv = $('<div id="'+this.id+'jFormPageFailure" class="jFormPage jFormPageFailure">'+json.response.failurePageHtml+'</div>');
            failurePageDiv.width(this.jFormPages[this.jFormPageIdArray[0]].page.width());
            this.jFormPageScroller.append(failurePageDiv);

            // Create the failure page
            var jFormPageFailure = new JFormPage(this, this.id+'jFormPageFailure');
            this.addJFormPage(jFormPageFailure);

            // Create a start over button
            this.control.append($('<li class="startOver"><button class="startOverButton">Start Over</button></li>'));

            // Scroll to the failure page
            jFormPageFailure.scrollTo();
        }
        // Show a failure notice on the same page
        if(json.response.failureNoticeHtml){
            this.control.find('.jFormerFailureNotice').remove();
            this.control.append('<li class="jFormerFailureNotice">'+json.response.failureNoticeHtml+'</li>');
            this.controlNextButton.text(this.options.submitButtonText);
            this.controlNextButton.removeAttr('disabled');
        }

        // Show a large failure response on the same page
        if(json.response.failureHtml){
            this.control.find('.jFormerFailure').remove();
            this.control.after('<div class="jFormerFailure">'+json.response.failureHtml+'</div>');
            this.controlNextButton.text(this.options.submitButtonText);
            this.controlNextButton.removeAttr('disabled');
        }

        // Evaluate any failure or successful javascript
        if(json.response.successJs){
            eval(json.response.successJs);
        }
        else if(json.response.failureJs){
            eval(json.response.failureJs);
        }

        // Redirect the user
        if(json.response.redirect){
            this.controlNextButton.html('Redirecting...');
            document.location = json.response.redirect;
        }

        // Reload the page
        if(json.response.reload){
            this.controlNextButton.html('Reloading...');
            document.location.reload(true);
        }
    }
},

reset: function() {
    this.control.find('.jFormFailureNotice').remove();
    this.control.find('.jFormFailure').remove();
    this.controlNextButton.text(this.options.submitButtonText);
    this.controlNextButton.removeAttr('disabled');
},

showAlert: function(message, jFormComponentType, modal, options){
    if(!this.options.alertsEnabled){
        return;
    }
    var animationOptions = $.extend(this.options.animationOptions.alert, options);


    var alertWrapper = this.form.find('.jFormerAlertWrapper');
    var alertDiv = this.form.find('.jFormerAlert');

    alertDiv.addClass(jFormComponentType);
    alertDiv.text(message);

    // Show the message
    if(animationOptions.appearEffect == 'slide'){
        alertWrapper.slideDown(animationOptions.appearDuration, function(){
            // hide the message
            setTimeout(hideAlert, 1000);
        });
    } else if(animationOptions.appearEffect == 'fade') {
        alertWrapper.fadeIn(animationOptions.appearDuration, function(){
            // hide the message
            setTimeout(hideAlert, 1000);
        });
    }

    function hideAlert(){
        if(animationOptions.hideEffect == 'slide'){
            alertWrapper.slideUp(animationOptions.hideDuration, function() {
                });
        } else if(animationOptions.hideEffect == 'fade'){
            alertWrapper.fadeOut(animationOptions.hideDuration, function() {
                });
        }
    }

},

showModal: function(header, content, className, options) {
    // Get the modal wrapper div element
    var modalWrapper = this.form.find('.jFormerModalWrapper');

    // set animation options
    var animationOptions = $.extend(this.options.animationOptions.modal, options);

    // If there is no modal wrapper, add it
    if(modalWrapper.length == 0) {
        var modalTransparency = $('<div class="jFormerModalTransparency"></div>');
        modalWrapper = $('<div style="display: none;" class="jFormerModalWrapper"><div class="jFormerModal"><div class="jFormerModalHeader">'+header+'</div><div class="jFormerModalContent">'+content+'</div><div class="jFormerModalFooter"><button>Okay</button></div></div></div>');

        // Add the modal wrapper after the alert
        this.form.find('.jFormerAlertWrapper').after(modalTransparency);
        this.form.find('.jFormerAlertWrapper').after(modalWrapper);

        // Add any custom classes
        if(className != '') {
            modalWrapper.addClass(className);
        }

        // Add the onclick event for the Okay button
        modalWrapper.find('button').click(function(event) {
            $('.jFormerModalWrapper').hide(animationOptions.hideDuration);
            $('.jFormerModalTransparency').hide(animationOptions.hideDuration);
            $('.jFormerModalWrapper').remove();
            $('.jFormerModalTransparency').remove();
            $('body').css('overflow','auto');
        });
    }

    // Get the modal div element
    var modal = modalWrapper.find('.jFormerModal');
    modal.css({
        'position':'absolute'
    });
    var varWindow = $(window);
    $('body').css('overflow','hidden');
    // Add window resize and scroll events
    varWindow.resize(function(event) {
        leftMargin = (varWindow.width() / 2) - (modal.width() / 2);
        topMargin = (varWindow.height() / 2) - (modal.height() / 2) + varWindow.scrollTop();
        modal.css({
            'top': topMargin,
            'left': leftMargin
        });
        $('.jFormerModalTransparency').width(varWindow.width()).height(varWindow.height());
    });

    // If they click away from the modal (on the modal wrapper), remove it
    $('.jFormerModalTransparency').click(function(event) {
        if($(event.target).is('.jFormerModalTransparency')) {
            modalWrapper.hide(animationOptions.hideDuration);
            modalWrapper.remove();
            $('.jFormerModalTransparency').hide(animationOptions.hideDuration);
            $('.jFormerModalTransparency').remove();
            $('body').css('overflow','auto');
        }
    });

    // Show the wrapper
    //modalWrapper.width(varWindow.width()).height(varWindow.height()*1.1).css('top', varWindow.scrollTop());
    modalWrapper.show(animationOptions.appearDuration);

    // Set the position
    var leftMargin = (varWindow.width() / 2) - (modal.width() / 2);
    var topMargin = (varWindow.height() / 2) - (modal.height() / 2) + varWindow.scrollTop();
    $('.jFormerModalTransparency').width(varWindow.width()).height(varWindow.height()*1.1).css('top', varWindow.scrollTop());
    modal.css({
        'top': topMargin,
        'left': leftMargin
    });
},

addBlurTipListener: function(){
    var self = this;
    $(document).bind('blurTip', function(event, tipElement, action){
        if(action == 'hide'){
            self.blurredTips = $.map(self.blurredTips, function(tip, index){
                if($(tip).attr('id') == tipElement.attr('id')){
                    return null
                } else {
                    return tip;
                }
            });
            if(self.blurredTips[self.blurredTips.length-1] != undefined){
                self.blurredTips[self.blurredTips.length-1].removeClass('jFormerTipBlurred');
            }
        } else if(action == 'show'){
            if(self.blurredTips.length > 0){
                $.each(self.blurredTips, function(index, tip){
                    $(tip).addClass('jFormerTipBlurred')
                })
            }
            self.blurredTips.push(tipElement)
            tipElement.removeClass('jFormerTipBlurred');
        }
    });
}
});
/**
 * jFormPage handles all functions on the page level, including page validation.
 *
 */
JFormPage = Class.extend({
    init: function(jFormer, pageId, options) {
        this.options = $.extend({
            dependencyOptions: null,
            onScrollTo: {
                onBefore: null,
                onAfter: null,
                notificationHtml: null
            }
        }, options || {});

        // Setup the onScrollTo functions
        if(this.options.onScrollTo.onBefore !== null) {
            var onBeforeFunction = $.trim(this.options.onScrollTo.onBefore);
            this.options.onScrollTo.onBefore = function() {eval(onBeforeFunction);};
        }
        if(this.options.onScrollTo.onAfter !== null) {
            var onAfterFunction = $.trim(this.options.onScrollTo.onAfter);
            this.options.onScrollTo.onAfter = function() {eval(onAfterFunction);};
        }

        // Class variables
        this.jFormer = jFormer;
        this.id = pageId;
        this.page = $('#'+pageId);
        this.jFormSections = {};
        this.formData = {};
        this.active = false;
        this.validationPassed = null;
        this.disabledByDependency = false;
    },

    addSection: function(section) {
        this.jFormSections[section.id] = section;
        return this;
    },

    getData: function() {
        //console.log('getting data for page');
        var self = this;

        // Handle disabled pages
        if(this.disabledByDependency) {
            this.formData = null;
        }
        else {
            this.formData = {};
            $.each(this.jFormSections, function(jFormSectionKey, jFormSection) {
                self.formData[jFormSectionKey] = jFormSection.getData();
            });
        }

        return this.formData;
    },

    setData: function(data) {
        var self = this;
        $.each(data, function(key, values) {
            if(self.jFormSections[key] != undefined){
                self.jFormSections[key].setData(values);
            } else {
                data[key] = undefined;
            }
        });
        this.formData = data;
        return this.formData;
    },

    validate: function(silent) {
        //console.log('validating', this.id);
        // Handle dependencies
        if(this.disabledByDependency) {
            return null;
        }

        var self = this;
        var each = $.each;
        
        self.validationPassed = true;
        each(this.jFormSections, function(sectionKey, section) {
           each(section.instanceArray, function(instanceIndex, sectionInstance){
                each(sectionInstance.jFormComponents, function(componentKey, component) {
                    if(component.type == 'JFormComponentLikert'){
                        return;
                    }
                    each(component.instanceArray, function(instanceIndex, instance) {
                        instance.validate();
                        if(instance.validationPassed == false) {
                            self.validationPassed = false;
                        }
                    });
                });
            });
        });

        if(self.validationPassed) {
            $('#navigatePage'+(self.jFormer.currentJFormPageIdArrayIndex + 1)).removeClass('jFormPageNavigatorLinkWarning');
        }
        else if(!silent) {
            if(this.id === this.jFormer.currentJFormPage.id){
                this.focusOnFirstFailedComponent();
            }
        }

        return self.validationPassed;
    },

    clearValidation: function() {
        $.each(this.jFormSections, function(sectionKey, section) {
            section.clearValidation();
        });
    },

    focusOnFirstFailedComponent: function() {
        var each = $.each,
        validationPassed = true;
        each(this.jFormSections, function(sectionLabel, section){
            each(section.instanceArray, function(sectionInstanceIndex, sectionInstance){
                each(sectionInstance.jFormComponents, function(componentLabel, component){
                    each(component.instanceArray, function(instanceLabel, instance){
                        if(!instance.validationPassed || instance.errorMessageArray.length > 0){
                            var offset = instance.component.offset().top - 30;
                            var top = $(window).scrollTop();
                            if(top < offset && top + $(window).height() > instance.component.position().top) {
                                instance.component.find(':input:first').focus();
                                //instance.highlight();
                            }
                            else {
                                $.scrollTo(offset + 'px', 500, {
                                    onAfter: function() {
                                        instance.component.find(':input:first').focus();
                                        //instance.highlight();
                                    }
                                });
                            }
                            validationPassed = false;
                        }
                        return validationPassed;
                    });
                    return validationPassed;
                });
                return validationPassed;
            });
            return validationPassed;
        });
    },

    scrollTo: function(options) {
        this.jFormer.scrollToPage(this.id, options);
        return this;
    },

    show: function(){
        if(this.page.hasClass('jFormPageInactive')){
            this.page.removeClass('jFormPageInactive');
        }
    },

    hide:function() {
        if(!this.active){
            this.page.addClass('jFormPageInactive');
        }
    },

    disableByDependency: function(disable) {
        // If the condition is different then the current condition
        if(this.disabledByDependency !== disable) {
            var pageIndex = $.inArray(this.id, this.jFormer.jFormPageIdArray);

            // Disable the page
            if(disable === true) {
                // Hide the page
                this.page.hide();

                // Update the page navigator appropriately
                if(this.jFormer.options.pageNavigator !== false) {
                    // Hide the page link
                    if(this.options.dependencyOptions.display == 'hide') {
                        $('#navigatePage'+(pageIndex+1)).hide();

                        // Renumber appropriately
                        this.jFormer.renumberPageNavigator();
                    }
                    // Lock the page link
                    else {
                        $('#navigatePage'+(pageIndex+1)).addClass('jFormPageNavigatorLinkDependencyLocked').find('span').html('&nbsp;');
                    }
                }
            }
            // Show the page
            else {
                this.checkChildrenDependencies();
                 this.page.show();

                // Update the page navigator appropriately
                if(this.jFormer.options.pageNavigator !== false) {
                    // Show the page link
                    if(this.options.dependencyOptions.display == 'hide') {
                        $('#navigatePage'+(pageIndex+1)).show();
                    }
                    // Unlock the page link
                    else {
                        $('#navigatePage'+(pageIndex+1)).removeClass('jFormPageNavigatorLinkDependencyLocked');
                    }

                    // Renumber the existing links
                    this.jFormer.renumberPageNavigator();
                 }

             }

            this.disabledByDependency = disable;
            this.jFormer.setupControl();
        }
    },

    checkDependencies: function() {
        var self = this;
        if(this.options.dependencyOptions !== null) {
            // Run the dependency function
            //console.log(self.options.dependencyOptions.jsFunction);
            //console.log(eval(self.options.dependencyOptions.jsFunction));
            var disable = !(eval(self.options.dependencyOptions.jsFunction));
            this.disableByDependency(disable);
        }
    },

    checkChildrenDependencies: function() {
        $.each(this.jFormSections, function(jFormSectionKey, jFormSection) {
            jFormSection.checkDependencies();
        });
    }
});/**
 * jFormSection handles all functions on the section level, including dependencies and instances. A section groups components.
 *
 */
JFormSection = Class.extend({
    init: function(parentJFormPage, sectionId, options) {
        this.options = $.extend({
            dependencyOptions: null,            // options {jsFunction:#, dependentOn:array, display:enum('hide','lock')}
            instanceOptions: null              // options {max:#, addButtonText:string, removeButtonText:string}
        }, options || {});

        // Class variables
        this.parentJFormPage = parentJFormPage;
        this.id = sectionId;
        this.section = $('#'+sectionId);
        this.jFormComponents = {};
        this.formData = null;                       // Will be an object is there is just one instance, will be an array if there is more than one instance
        this.disabledByDependency = false;

        if(this.options.isInstance){
            this.instanceArray = null;
            this.clone = null;                  // clone of the original html.. only initiates if instances are turned on...
        }
        // Do parentInstance functions
        else {
            this.instanceArray = [this];

            if(this.options.instanceOptions != null){
                this.clone = this.section.clone();
                this.iterations = 1;
            }
            else {
                this.clone = null;
            }
            this.instanceArray = [this];
            this.createInstanceButton();
        }
    },

    createInstanceButton:function() {
        var self =  this;
        if(this.options.instanceOptions != null){
            var buttonId = this.id+'-addInstance',
            addButton = '<button id="'+buttonId+'" class="jFormSectionAddInstanceButton">' + this.options.instanceOptions.addButtonText + '</button>';
            if(this.options.dependencyOptions !== null){
                if(this.options.dependencyOptions.display == 'hide'){
                    addButton.hide();
                } 
            }
            this.instanceArray[this.instanceArray.length - 1].section.after(addButton);
            this.parentJFormPage.page.find('#'+buttonId).bind('click', function(event){
                event.preventDefault();
                if(!self.disabledByDependency){
                    self.addSectionInstance();
                }
            });
        }
    },

    // Creates instance objects for pre-generated instances
    addInitialSectionInstances: function() {
        if(this.options.instanceOptions !== null && this.options.instanceOptions.initialValues !== undefined && this.options.instanceOptions.initialValues !== null) {

            var count = this.options.instanceOptions.initialValues.length - 1;
            for(var i = 0; i < count; i++) {
                this.addSectionInstance(true)
            }

            // Move the add button
            var addButton = $('#'+this.id+'-addInstance');
            this.instanceArray[this.instanceArray.length - 1].section.after(addButton);
        }
    },

    addSectionInstance: function(sectionHtmlExists) {
        var parent = this;
        if(this.instanceArray.length < this.options.instanceOptions.max || this.options.instanceOptions.max === 0){
            this.iterations++;
            var instanceClone;

            // Do not use a clone of the first section if the section HTML has already been generated

            if(sectionHtmlExists) {
				instanceClone = $('#'+this.id+'-section'+this.iterations);
				
            }
            else {
                instanceClone = this.clone.clone();

                // Rename the section instance
                this.nameSectionInstance(instanceClone, sectionHtmlExists);
            }

            // Create the remove button
            var removeButtonId = this.id+'-removeInstance',
            removeButton = '<button id="'+removeButtonId+'" class="jFormSectionRemoveInstanceButton">'+this.options.instanceOptions.removeButtonText+'</button>';

            // Set the default animation options
            var animationOptions = {};
            if(this.options.instanceOptions.animationOptions !== undefined){
                $.extend(animationOptions, this.parentJFormPage.jFormer.options.animationOptions.instance, this.options.instanceOptions.animationOptions);
            } else {
                animationOptions = this.parentJFormPage.jFormer.options.animationOptions.instance;
            }
            //console.log(animationOptions);
            $(instanceClone).append(removeButton);
            instanceClone.find('#'+removeButtonId).bind('click', function(event){
                var target = $(event.target);
                event.preventDefault();
                parent.instanceArray = $.map(parent.instanceArray, function(cloneId, index){
                    if (cloneId.section.attr('id') ==  target.parent().attr('id')){
                        cloneId = null;
                    }
                    return cloneId;
                });
                if(animationOptions.removeEffect == 'none' || animationOptions.removeDuration === 0){
                    target.parent().remove();
                    target.remove();
                }
                else {
                    if(animationOptions.removeEffect == 'slide'){
                        target.parent().slideUp(animationOptions.removeDuration, function(){
                            target.parent().remove();
                            target.remove();
                            
                        });
                        //parent.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
                        parent.parentJFormPage.jFormer.adjustHeight(animationOptions);

                    }
                    else {
                        target.parent().fadeOut(animationOptions.removeDuration, function(){
                            target.parent().remove();
                            target.remove();
                            //parent.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
                            parent.parentJFormPage.jFormer.adjustHeight(animationOptions);
                        });
                    }
                }
                
                if(parent.instanceArray.length < parent.options.instanceOptions.max || parent.options.instanceOptions.max === 0){
                    parent.parentJFormPage.page.find('#'+parent.id+'-addInstance').show();
                }

                // Relabel the instance array
                parent.relabelSectionInstances(parent.instanceArray, animationOptions);
            });

            // Add the clone of the instance only if it not already pre-generated
            if(!sectionHtmlExists) {
                // Put the section in there, but hide it first, just in case
                instanceClone.hide();
                this.parentJFormPage.page.find('#'+this.id+'-addInstance').before(instanceClone);
                // no animation
                if(animationOptions.appearEffect == 'none' || animationOptions.appearDuration === 0){
                    instanceClone.show();
                }
                // Show the instance section with an animation
                else {
                    if(animationOptions.appearEffect == 'slide'){
                    
                        instanceClone.slideDown(animationOptions.appearDuration, function(){
                            //parent.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
                            parent.parentJFormPage.jFormer.adjustHeight(animationOptions);
                        });
                    }
                    else {
                        instanceClone.fadeIn(animationOptions.appearDuration, function(){});
                        //parent.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
                        parent.parentJFormPage.jFormer.adjustHeight(animationOptions);
                    }
                }
            }

            var instanceObject = this.createSectionInstanceObject(instanceClone, this.options);
            this.instanceArray.push(instanceObject);

            // Add the clone of the instance only if it not already pregenerated
            if(!sectionHtmlExists) {
                this.relabelSectionInstances(this.instanceArray, animationOptions);
                if (this.instanceArray.length >= this.options.instanceOptions.max && this.options.instanceOptions.max !== 0) {
                    this.parentJFormPage.page.find('#'+this.id+'-addInstance').hide();
                }
            }
        }

        return this;
    },

    nameSectionInstance: function(component, sectionHtmlExists) {
        var self = this,
        ending = '';
        $(component).attr('id', $(component).attr('id')+ '-section'+this.iterations);
        $(component).find('*').each(function(key, child){
            if($(child).attr('id')){
                changeName(child, 'id');
            }
            if($(child).attr('for')){
                changeName(child, 'for');
            }
            if($(child).attr('name')){
                changeName(child, 'name');
            }
        });

        function changeName(child, attribute){
            ending = getEnding($(child).attr(attribute)) ;
            if(ending == ''){
                $(child).attr(attribute, $(child).attr(attribute) +'-section'+self.iterations+ending);
            }else {
                $(child).attr(attribute, $(child).attr(attribute).replace(ending, '-section'+self.iterations+ending));
            }
        }

        function getEnding(identifier){
            var ending = '';
            if(identifier.match(/(\-[A-Za-z0-9]+)&?/)){
                ending = identifier.match(/(\-[A-Za-z0-9]+)&?/)[1];
            } else {

            }
            return ending;
        }

        return component;
    },

    createSectionInstanceObject:function(instanceClone, options){
        var tempOptions = $.extend(true, {}, options);
        tempOptions.isInstance = true;
        var self = this,
        instanceObject = new JFormSection(this.parentJFormPage, this.id+'-section'+this.iterations, tempOptions);
        $.each(this.jFormComponents, function(key, component){
            var componentTempOptions = $.extend(true, {}, component.options);
            componentTempOptions.isInstance = false;
            var componentClone = new window[component.type](instanceObject, component.id+'-section'+self.iterations, component.type, componentTempOptions);
            instanceObject.addComponent(componentClone);
        });

        $.each(instanceObject.jFormComponents, function(key, instancedComponent) {
            if(instancedComponent.options.dependencyOptions != undefined){
                var objectTop = self.parentJFormPage.form;

                // Define the dependent on component
                var dependentOnComponent = objectTop.select(instancedComponent.options.dependencyOptions.dependentOn);

                // Check to see if the dependentOn component is within in same section
                if(self.section.find('#'+instancedComponent.options.dependencyOptions.dependentOn+'-wrapper').length != 0) {
                    // If the component that is dependentOn is inside the instanced section, use the instanced section's component as the dependentOn
                    //console.log(instanceObject.formComponents[instancedComponent.options.dependencyOptions.dependentOn+'-section'+self.iterations]);
                    if(instanceObject.jFormComponents[instancedComponent.options.dependencyOptions.dependentOn+'-section'+self.iterations]) {
                        //console.log('found it')
                        dependentOnComponent = instanceObject.jFormComponents[instancedComponent.options.dependencyOptions.dependentOn+'-section'+self.iterations];
                    }
                }

                //console.log(dependentOnComponent);

                dependentOnComponent.component.find(':text, textarea').bind('keyup', function(event) {
                    instancedComponent.checkDependencies();
                });

                dependentOnComponent.component.bind('formComponent:changed', function(event) {
                    instancedComponent.checkDependencies();
                });

                instancedComponent.checkDependencies();
            }
        });

        return instanceObject;
    },

    relabelSectionInstances:function(instanceArray, animationOptions){
        $.each(instanceArray, function(key, instance){
            if( key!== 0) {
                var count = key+1,
                label = instance.section.find('.jFormSectionTitle').children(':first');
                if(label.length > 0){
                    if (label.text().match(/(\([0-9]+\))$/)){
                        label.text(label.text().replace(/(\([0-9]+\))$/, '('+count+')'));
                    } else {
                        label.text(label.text() + ' ('+count+')');
                    }
                    
                }
            }
        });
        //this.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
        this.parentJFormPage.jFormer.adjustHeight(animationOptions);
    },

    addComponent: function(component) {
        this.jFormComponents[component.id] = component;
        return this;
    },

    clearValidation: function() {
        $.each(this.jFormComponents, function(componentKey, component) {
            component.clearValidation();
        });
    },

    getData: function() {
        var self = this;

        // Handle disabled sections
        if(this.disabledByDependency) {
            this.formData = null;
        }
        else {
            if(this.instanceArray.length > 1) {
                this.formData = [];
                $.each(this.instanceArray, function(instanceIndex, instanceJFormSection) {
                    var sectionData = {};
                    $.each(instanceJFormSection.jFormComponents, function(jFormComponentKey, jFormComponent) {
                        if(jFormComponent.type != 'JFormComponentLikertStatement') {
                            jFormComponentKey = jFormComponentKey.replace(/-section[0-9]+/, '');
                            sectionData[jFormComponentKey] = jFormComponent.getData();
                        }
                    });
                    self.formData.push(sectionData);
                });
            }
            else {
                this.formData = {};
                $.each(this.jFormComponents, function(key, component) {
                    if(component.type != 'JFormComponentLikertStatement'){
                        self.formData[key] = component.getData();
                    }
                });
            }
        }
        return this.formData;
    },

    setData: function(data) {
        var self = this;
        if($.isArray(data)) {
            $.each(data, function(index, instance){
                if(index !== 0 && self.instanceArray[index] == undefined){
                    self.addSectionInstance();
                }
                $.each(instance, function(key, componentData){
                    if(index !== 0){
                        key = key + '-section'+(index+1);
                    }
                    if(self.instanceArray[index].jFormComponents[key] != undefined){
                        self.instanceArray[index].jFormComponents[key].setData(componentData)
                    }
                });
            /*$.each(self.instanceArray[index].jFormComponents, function(key, component){
                   
                   component.setData(instance[key]);
               });*/
            });
        }
        else {
            $.each(data, function(key, componentData) {
                if(self.jFormComponents[key] != undefined){
                    self.jFormComponents[key].setData(componentData);
                }
                
            });
        }
    },

    disableByDependency: function(disable) {
        var self = this;

        if(self.parentJFormPage.jFormer.initializing) {
            var animationOptions = {
                adjustHeightDuration : 0,
                appearDuration : 0,
                appearEffect: 'none',
                hideDuration : 0,
                hideEffect: 'none'

            }
        } else if(this.options.dependencyOptions.animationOptions !== undefined){
            animationOptions = $.extend(animationOptions, this.parentJFormPage.jFormer.options.animationOptions.dependency, this.options.dependencyOptions.animationOptions);
        } else {
            animationOptions = this.parentJFormPage.jFormer.options.animationOptions.dependency;
        }

        var elementsToDisable = this.section;
        $.each(this.instanceArray, function(index, sectionInstance){
            if(index !== 0){
                elementsToDisable = elementsToDisable.add(sectionInstance.section);
            }
        });
        if(this.options.instanceOptions !== null && (this.instanceArray.length < this.options.instanceOptions.max || this.options.instanceOptions.max === 0)){
            var addButton = $(this.parentJFormSection.section.find('#'+this.id+'-addInstance'));
            if(self.parentJFormPage.jFormer.initializing) {
                if(!disable && addButton.is(':hidden')){
                    addButton.show();
                    self.parentJFormPage.jFormer.adjustHeight({
                        adjustHeightDuration:0
                    });
                }
            }
            elementsToDisable = elementsToDisable.add(addButton);
        }

        // If the condition is different then the current condition
        if(this.disabledByDependency !== disable) {
            // Disable the section
            if(disable) {
                // Hide the section
                if(this.options.dependencyOptions.display == 'hide') {
                    //console.log('hiding section');
                    if(animationOptions.hideEffect == 'none' || animationOptions.hideDuration === 0){
                        elementsToDisable.hide();
                        self.parentJFormPage.jFormer.adjustHeight(animationOptions);
                    } else {
                        if(animationOptions.appearEffect === 'fade'){
                            elementsToDisable.fadeOut(animationOptions.hideDuration, function() {
                                self.parentJFormPage.jFormer.adjustHeight(animationOptions);
                            });
                        }else if(animationOptions.appearEffect === 'slide'){
                            elementsToDisable.slideUp(animationOptions.hideDuration, function() {
                                self.parentJFormPage.jFormer.adjustHeight(animationOptions);
                            });
                        }
                    }
                    
                }
                // Lock the section and disable all inputs
                else {
                    elementsToDisable.addClass('jFormSectionDependencyDisabled').find(':not(.jFormComponentDisabled) > :input').attr('disabled', 'disabled');
                    this.parentJFormPage.jFormer.adjustHeight({
                        adjustHeightDuration:0
                    }); // Handle if they are showing a border on the DependencyDisabled class
                }
            }
            // Show or unlock the section
            else {
                // Show the section
                if(this.options.dependencyOptions.display == 'hide') {
                    if(animationOptions.appearEffect == 'none' || animationOptions.appearDuration === 0){
                        elementsToDisable.show();
                        self.parentJFormPage.form.adjustHeight(animationOptions);
                        if(self.options.dependencyOptions.onAfterEnable) {
                            //console.log('Running: ', self.options.dependencyOptions.onAfterEnable);
                            eval(self.options.dependencyOptions.onAfterEnable);
                        }
                    }
                    else {
                        if(animationOptions.hideEffect === 'fade') {
                            elementsToDisable.fadeIn(animationOptions.appearDuration, function() {
                                if(self.options.dependencyOptions.onAfterEnable) {
                                    //console.log('Running: ', self.options.dependencyOptions.onAfterEnable);
                                    eval(self.options.dependencyOptions.onAfterEnable);
                                }
                            });
                            self.parentJFormPage.form.adjustHeight(animationOptions);
                        }
                        else if(animationOptions.hideEffect === 'slide'){
                            elementsToDisable.slideDown(animationOptions.appearDuration, function() {
                                if(self.options.dependencyOptions.onAfterEnable) {
                                    //console.log('Running: ', self.options.dependencyOptions.onAfterEnable);
                                    eval(self.options.dependencyOptions.onAfterEnable);
                                }
                            });
                            self.parentJFormPage.form.adjustHeight(animationOptions);
                        }
                    }
                //console.log('showing section');
                }
                // Unlock the section and reenable all inputs that aren't manually disabled
                else {
                    elementsToDisable.removeClass('jFormSectionDependencyDisabled').find(':not(.jFormComponentDisabled) > :input').removeAttr('disabled');
                    this.parentJFormPage.jFormer.adjustHeight({
                        adjustHeightDuration:0
                    }); // Handle if they are showing a border on the DependencyDisabled class
                }
                this.checkChildrenDependencies();
            }
            this.disabledByDependency = disable;
        }
    },

    checkDependencies: function() {
        var self = this;
        if(this.options.dependencyOptions !== null) {
            // Run the dependency function
            var disable = !(eval(self.options.dependencyOptions.jsFunction));
            this.disableByDependency(disable);
        }

        // Handle instances
        $.each(this.instanceArray, function(index, formSectionInstance) {
            //console.log('checking dependencies on ', formSectionInstance.id);
            formSectionInstance.checkChildrenDependencies();
        });
    },

    checkChildrenDependencies: function() {
        $.each(this.jFormComponents, function(jFormComponentKey, jFormComponent) {
            jFormComponent.checkDependencies();
        });
    }
});/**
 *  jFormComponent is the base class for all components in the form. all specific components extend off of this class
 *  Handles instances, dependencies and trigger bases
 *
 */
JFormComponent = Class.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this.options = $.extend({
            validationOptions: [],                // 'required', 'email', etc... - An array of validation keys used by this.validate() and jFormerValidator
            showErrorTipOnce: false,
            triggerFunction: null,              // set to a function name, is a function
            componentChangedOptions: null,      // set options for when component:changed is run
            dependencyOptions: null,            // options {jsFunction:Javascript, dependentOn:array, display:enum('hide','lock')}
            instanceOptions: null,              // options {max:#, addButtonText:string, removeButtonText:string}
            tipTargetPosition: 'rightMiddle',   // 'rightMiddle' - Where the tooltip will be placed in relation to the component
            tipCornerPosition: 'leftTop',       // 'leftTop' - The corner of the tip that will point to the tip target position
            isInstance: false,
            persistentTip: false
        }, options || {});

        //console.count(jFormComponentType);
        // Class variables
        this.parentJFormSection = parentJFormSection;
        this.id = jFormComponentId;
        this.component = $('#'+jFormComponentId+'-wrapper');
        this.formData = null;                       // Will be an object is there is just one instance, will be an array if there is more than one instance
        this.type = jFormComponentType;                       // 'SingleLineText', 'TextArea', etc... - The component jFormComponentType
        this.errorMessageArray = [];            // Used to store error messages displayed in tips or appended to the description
        this.tip = null;
        this.tipDiv = this.component.find('#'+this.id+'-tip');
        this.tipTarget = null;                  // The ID of the element where the tip will be targeted
        this.validationPassed = true;
        this.disabledByDependency = false;
        this.isRequired = false;
        this.requiredCompleted = false;
        this.validationFunctions = {
            'required': function(options) {
                var errorMessageArray = ['Required.'];
                return options.value != '' ? 'success' : errorMessageArray;
            }
        }

        if(this.options.isInstance){
            this.instanceArray = null;
            this.clone = null; // Clone of the original HTML, only initiates if instances are turned on
        }
        else { // do parentInstance functions
            if(this.options.instanceOptions != null){
                this.clone = this.component.clone();
                this.iterations = 1;
            }
            else {
                this.clone = null;
            }
            this.instanceArray = [this];
            this.createInstanceButton();   
        }

        // Intitialize the implemented component
        this.initialize();
        this.reformValidations();

        // Add a tip if there is content to add
        if($.trim(this.tipDiv.html()) !== '') {
            this.addTip();
        }

        // Initiation functions
        this.addHighlightListeners();
        this.defineComponentChangedEventListener();
        this.catchComponentChangedEventListener();

        

        // Tip listeners
        this.addTipListeners();
    },

    addHighlightListeners: function() {
        var self = this;

        // Focus
        this.component.find(':input:not(button):not(hidden)').each(function(key, input) {
            $(input).bind('focus', function() {
                self.highlight();
            } );
            $(input).bind('blur', function(event) {
                
                self.removeHighlight();

                // Handle multifield highlight and validation
                if((self.type == 'JFormComponentName' || self.type == 'JFormComponentAddress' || self.type == 'JFormComponentCreditCard') && self.changed === true){
                    self.validate();
                }
            });

        });

        // Multiple choice
        if(this.tip !== null) {
            if(this.tip.persistent){
                this.tip.getTooltip().mouseenter(function(event) {
                    $(document).bind('click', function(clickevent){

                        if($(clickevent.target).closest('.jFormerTip').length != 0 || $(clickevent.target).is(':focus')) {
                            return;
                        } else {
                            self.removeHighlight();
                        }
                    });
                    self.component.find(':input:not(button):not(hidden)').each(function(key, input) {
                        $(input).unbind('blur');
                    });
                });
                this.tip.getTooltip().mouseleave(function(event) {

                    self.component.find(':input:not(button):not(hidden)').each(function(key, input) {
                        $(input).bind('blur', function(event) {

                            self.removeHighlight();

                            // Handle multifield highlight and validation
                            if((self.type == 'JFormComponentName' || self.type == 'JFormComponentAddress' || self.type == 'JFormComponentCreditCard') && self.changed === true){
                                self.validate();
                            }
                        });
                    });
                });
                this.tip.getTooltip().find('.jFormerTipClose').bind('click', function(){
                    $(document).unbind('click');
                   self.removeHighlight();
                });
            }
        }

        // Multiple choice
        if(this.component.find('input:checkbox, input:radio').length > 0) {
            this.component.mouseenter(function(event) {
                self.highlight();

            });
            this.component.mouseleave(function(event) {
                self.removeHighlight();
            });
        }

        return this;
    },

    reformValidations: function() {
        var reformedValidations = {},
        self = this;
        $.each(this.options.validationOptions, function(validationFunction, validationOptions) {
            // Check to see if this component is required, take not of it in the options - used to track which components are required for progress bar
            if(validationOptions == 'required'){
                self.isRequired = true;
            }

            // Check to see if the name of the function is actually an array index
            if(validationFunction >= 0) {
                // The function is not an index, it becomes the name of the option with the value of an empty object
                reformedValidations[validationOptions] = {'component': self.component};
            }
            // If the validationOptions is a string
            else if(typeof(validationOptions) != 'object') {
                reformedValidations[validationFunction] = {'component': self.component};
                reformedValidations[validationFunction][validationFunction] = validationOptions;
            }
            // If validationOptions is an object
            else if(typeof(validationOptions) == 'object') {
                if(validationOptions[0] != undefined){
                    reformedValidations[validationFunction] = {}
                    reformedValidations[validationFunction][validationFunction] = validationOptions;
                } else {
                    reformedValidations[validationFunction] = validationOptions;
                }
                reformedValidations[validationFunction].component = self.component;
            }
        });

        this.options.validationOptions = reformedValidations;
    },


    defineComponentChangedEventListener: function() {
        var self = this;

        // Handle IE events
        this.component.find('input:checkbox, input:radio').each(function(key, input) {
            $(input).bind('click', function(event) {
                $(this).trigger('jFormComponent:changed', self);
            });
        });

        this.component.find(':input:not(button, :checkbox, :radio)').each(function(key, input) {
            $(input).bind('change', function(event) {
                $(this).trigger('jFormComponent:changed', self);
            });
        });
    },

    catchComponentChangedEventListener: function() {
        var self = this;
        this.component.bind('jFormComponent:changed', function(event) {
            // Run a trigger on change if there is one
            if(self.options.triggerFunction !== null) {
                eval(self.options.triggerFunction);
            }
            // Prevent validation from occuring with components with more than one input
            if(self.type == 'JFormComponentName' || self.type == 'JFormComponentAddress' || self.type == 'JFormComponentLikert' || self.type == 'JFormComponentCreditCard'){
                self.changed = true;
            }
            // Validate the component on change if client side validation is enabled
            if(self.parentJFormSection.parentJFormPage.jFormer.options.clientSideValidation) {
                self.validate();
            }
        });
    },

    highlight: function() {
        // Add the highlight class and trigger the highlight
        this.component.addClass('jFormComponentHighlight').trigger('jFormComponent:highlighted', this.component);
        this.component.trigger('jFormComponent:showTip', this.component);
    },

    removeHighlight: function() {
        var self = this;
        this.component.removeClass('jFormComponentHighlight').trigger('jFormComponent:highlightRemoved', this.component);

        // Wait just a microsecond to see if you are still on the same component
        setTimeout(function() {
            if(!self.component.hasClass('jFormComponentHighlight')){
                self.component.trigger('jFormComponent:hideTip', self.component);
            }
        }, 1);
    },

    getData: function() {
        var self = this;

        // Handle disabled component
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency) {
            this.formData = null;
        }
        else {
            if(this.instanceArray.length > 1) {
                this.formData = [];
                $.each(this.instanceArray, function(index, component) {
                    var componentValue = component.getValue();
                        self.formData.push(componentValue);
                });
            }
            else {
                this.formData = this.getValue();
            }
        }
        return this.formData;
    },

    setData: function(data) {
        var self = this;
        if($.isArray(data)) {
            $.each(data, function(index, value) {
                if((self.type == 'JFormComponentMultipleChoice' && ($.isArray(value) ||  self.multipeChoiceType == 'radio')) || self.type != 'JFormComponentMultipleChoice'){
                    if(index !== 0 && self.instanceArray[index] == undefined){
                        self.addInstance();
                    }
                    self.instanceArray[index].setValue(value);
                }
                else {
                    self.setValue(data);
                    return false;
                }
            });
        }
        else {
            this.setValue(data);
        }
    },

    createInstanceButton:function() {
        var self =  this;
        if(this.options.instanceOptions != null){
        //if(this.options.instancesAllowed != 1){
        var addButton = $('<button id="'+this.id+'-addInstance" class="jFormComponentAddInstanceButton">'+this.options.instanceOptions.addButtonText+'</button>');
        // hide the button if there are dependencies... show it later if necessary
        if(this.options.dependencyOptions !== null){
            addButton.hide();
        }
        
          this.component.after(addButton);
          //this.component.after('<button id="'+this.id+'-addInstance" class="jFormComponentAddInstanceButton">'+this.options.instanceAddText+'</button>');
          this.parentJFormSection.section.find('#'+this.id+'-addInstance').bind('click', function(event){
              event.preventDefault();
              if(!self.disabledByDependency){
                self.addInstance();
              }
          });
      }
    },

    // Creates instance objects for pre-generated instances
    addInitialInstances: function() {
        if(this.options.instanceOptions !== null && this.options.instanceOptions.initialValues !== undefined && this.options.instanceOptions.initialValues !== null) {
            this.setData(this.options.instanceOptions.initialValues);
        }
    },

    addInstance: function() {
        if(this.options.componentChangedOptions != null && this.options.componentChangedOptions.instance != undefined && this.options.componentChangedOptions.instance == true){
            this.component.trigger('jFormComponent:changed', this);
        }
        var parent = this;
        if(this.instanceArray.length < this.options.instanceOptions.max || this.options.instanceOptions.max === 0){
            var instanceClone = this.clone.clone();
            var addButton = this.parentJFormSection.section.find('#'+this.id+'-addInstance');
            var animationOptions = {};
            if(this.options.instanceOptions.animationOptions !== undefined){
                animationOptions = $.extend(animationOptions, this.parentJFormSection.parentJFormPage.jFormer.options.animationOptions.instance, this.options.instanceOptions.animationOptions);
            } else {
                animationOptions = this.parentJFormSection.parentJFormPage.jFormer.options.animationOptions.instance;
            }

            // Create the remove button
            $(instanceClone).append('<button id="'+this.id+'-removeInstance" class="jFormComponentRemoveInstanceButton">'+this.options.instanceOptions.removeButtonText+'</button>');
            
            // Add an event listener on the remove button
            instanceClone.find('#'+this.id+'-removeInstance').bind('click', function(event){
                var target = $(event.target);
                event.preventDefault();
                
                parent.instanceArray = $.map(parent.instanceArray, function(cloneId, index){
                   if(cloneId.component.attr('id') ==  target.parent().attr('id')){
                       if(cloneId.tip != null){
                            cloneId.tip.hide();
                       }
                       cloneId = null;
                   }
                   return cloneId;
                });
                if(animationOptions.removeEffect == 'none' || animationOptions.removeDuration === 0){
                    target.parent().remove();
                    target.remove();
                } else {
                    if(animationOptions.removeEffect == 'slide'){
                        target.parent().slideUp(animationOptions.removeDuration, function(){
                            target.parent().remove();
                            target.remove();
                            //parent.parentJFormSection.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
                            parent.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                        })
                        
                    }else {
                        target.parent().fadeOut(animationOptions.removeDuration, function(){
                            target.parent().remove();
                            target.remove();
                            //parent.parentJFormSection.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
                            parent.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                        });
                    }
                }
                if(parent.instanceArray.length < parent.options.instanceOptions.max || parent.options.instanceOptions.max === 0){
                    addButton.show();
                }
                parent.relabelInstances(parent.instanceArray, animationOptions);
            });
            instanceClone.hide();
            // Insert the clone right before the add button
            addButton.before(instanceClone);

            if(animationOptions.appearEffect == 'none' || animationOptions.appearDuration === 0){
                if(!parent.disabledByDependency || (parent.disabledByDependency && parent.options.dependencyOptions.display != 'hide')){
                    instanceClone.show();
                }
            } else {
                if(!parent.disabledByDependency){
                    if(animationOptions.appearEffect == 'slide'){
                        instanceClone.slideDown(animationOptions.appearDuration, function(){
                            parent.parentJFormSection.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
                            parent.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                        });
                    }else {
                        instanceClone.fadeIn(animationOptions.appearDuration, function(){
                            parent.parentJFormSection.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
                            parent.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                        });
                    }
                }
            }

            this.nameInstance(instanceClone);
            
            var instanceObject = this.createInstanceObject(instanceClone, this.options);
            this.instanceArray.push(instanceObject);
            this.relabelInstances(this.instanceArray, animationOptions);
            if(this.instanceArray.length == this.options.instanceOptions.max && this.options.instanceOptions.max !== 0){
            //if(this.instanceArray.length == this.options.instancesAllowed && this.options.instancesAllowed !== 0) {
                addButton.hide();
            }

            if(this.options.dependencies != undefined){
                var objectTop = parent.parentJFormSection.parentJFormPage.jFormer;
                instanceObject.component.find(':text, textarea').bind('keyup', function(event) {
                    $.each(parent.options.dependencies.pages, function(index, object) {
                        objectTop.jFormPages[object.jFormPageId].checkDependencies();
                    });
                    $.each(parent.options.dependencies.sections, function(index, object) {
                        objectTop.jFormPages[object.jFormPageId].jFormSections[object.jFormSectionId].checkDependencies();
                    });
                    $.each(parent.options.dependencies.components, function(index, object) {
                        objectTop.jFormPages[object.jFormPageId].jFormSections[object.jFormSectionId].jFormComponents[object.jFormComponentId].checkDependencies();
                    });
                });

                instanceObject.component.bind('jFormComponent:changed', function(event) {
                    
                        $.each(parent.options.dependencies.pages, function(index, object) {
                            objectTop.jFormPages[object.jFormPageId].checkDependencies();
                        });
                        $.each(parent.options.dependencies.sections, function(index, object) {
                            objectTop.jFormPages[object.jFormPageId].jFormSections[object.jFormSectionId].checkDependencies();
                        });
                        $.each(parent.options.dependencies.components, function(index, object) {
                            objectTop.jFormPages[object.jFormPageId].jFormSections[object.jFormSectionId].jFormComponents[object.jFormComponentId].checkDependencies();
                        });
                });
            }
            if(this.disabledByDependency){
                this.disableByDependency(true);
            }
            
            // Resize the page
            //parent.parentJFormSection.parentJFormPage.scrollTo();
        }
        return this;
    },

    nameInstance: function(component) {
        component = $(component);
        var self = this,
        ending = '';
        this.iterations++;
        component.attr('id', component.attr('id').replace('-wrapper', '-instance'+this.iterations+'-wrapper'));
        component.find('*').each(function(key, child){
            if($(child).attr('id')){
                changeName(child, 'id');
            }
            if($(child).attr('for')){
                changeName(child, 'for');
            }
            if($(child).attr('name')){
                changeName(child, 'name');
            }
        });
        function changeName(child, attribute){
            ending = getEnding($(child).attr(attribute)) ;
            if(ending == ''){
                $(child).attr(attribute, $(child).attr(attribute) +'-instance'+self.iterations+ending);
            }else {
                $(child).attr(attribute, $(child).attr(attribute).replace(ending, '-instance'+self.iterations+ending));
            }
        }
        function getEnding(identifier){
            var ending = '';
            if(identifier.match(/\-(div|label|tip|removeInstance)\b/)){
                ending = identifier.match(/\-(div|label|tip|removeInstance)\b/)[0];
            } else {

            }
            return ending;
        }
        return component;
    },

    createInstanceObject:function(instanceClone, options){
        var tempOptions = $.extend(true, {}, options);
        tempOptions.isInstance = true;
        if(this.options.componentChangedOptions != null && this.options.componentChangedOptions.children != undefined && this.options.componentChangedOptions.children == false ){
            tempOptions.componentChangedOptions = null;
        }
        var instanceObject = new window[this.type](this.parentJFormSection, this.id+'-instance'+this.iterations, this.type, tempOptions);
        return instanceObject;
    },

    relabelInstances:function(instanceArray, animationOptions){
        $.each(instanceArray, function(key, instance){
            if( key!== 0) {
                var count = key+1,
                label = instance.component.find('#'+instance.component.attr('id').replace('-wrapper','-label'));
                if(label.length > 0) {
                    var star = label.find('span.jFormComponentLabelRequiredStar');
                    if(star.length > 0){
                        star.remove()
                    }
                    if(label.html().match(/:$/)){
                        label.html(label.html().replace(/(\([0-9]+\))?:/, ' ('+count+'):'));
                    } else {
                        if (label.text().match(/(\([0-9]+\))$/)){
                            label.text(label.text().replace(/(\([0-9]+\))$/, '('+count+')'));
                        } else {
                            label.text(label.text() + ' ('+count+')');
                        }
                    }
                    label.append(star);
                } else {
                    label = instance.component.find('label');
                    var star = label.find('span.jFormComponentLabelRequiredStar');
                    if(star.length > 0){
                        star.remove()
                    }
                    if (label.text().match(/(\([0-9]+\))$/)){
                        label.text(label.text().replace(/(\([0-9]+\))$/, '('+count+')'));
                    } else {
                        label.text(label.text() + ' ('+count+')');
                    }
                    label.append(star);
                }

            }
        });
        //this.parentJFormSection.parentJFormPage.jFormer.jFormPageWrapper.dequeue();
        this.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
    },

    addTip: function() {
        var self = this;

        // Check to see if the tip already exists
        if(typeof(this.tip) !== 'function') {
            // Create the tip
            var tip = this.tipTarget.simpletip({
                persistent: self.options.persistentTip,
                focus: true,
                position: 'topRight',
                content: self.tipDiv,
                baseClass: 'jFormerTip',
                hideEffect: 'none',
                onBeforeShow: function(){
                    if(self.tipDiv.find('.tipContent').text() == ''){
                        return false;
                    }
                },
                onShow: function(){
                    // Scroll the page to show the tip if the tip is off the page
                    var height = $(window).height();
                    var offset = this.getTooltip().offset().top + this.getTooltip().outerHeight() + 12;
                    if($(window).scrollTop() + height < offset) {
                        $.scrollTo(offset - height + 'px', 250, {axis:'y'});
                    }
                }
            });
            this.tip = tip.simpletip();
        }
    },

    addTipListeners: function() {
        var self = this;

        // Show a tip
        this.component.bind('jFormComponent:showTip', function(event) {
            // Make sure the tip exists and display the tip if it is not empty
            if(self.tip && typeof(self.tip) == 'object' && $.trim(self.tipDiv.html()) !== '') {
                self.tip.show();
            }
            
        });

        // Hide a tip
        this.component.bind('jFormComponent:hideTip', function(event) {
            // Make sure the tip exists
            if(self.tip && typeof(self.tip) == 'object') {
                self.tip.hide();
            }

            // Show error tips once
            if(self.options.showErrorTipOnce){
                self.clearValidation();
            }
        });

        return this;
    },

    clearValidation: function() {
        // Reset the error message array and validation passes boolean
        this.errorMessageArray = [];
        this.validationPassed = true;

        // Reset the classes
        this.component.removeClass('jFormComponentValidationFailed');
        this.component.addClass('jFormComponentValidationPassed');

        // Remove any tipErrorUl from the tip div
        this.component.find('.tipErrorUl').remove();

        // Handle tip display
        if(this.tip && typeof(this.tip) == 'object') {
            // Update the tip content
            this.tip.update(this.tipDiv.html());

            // Hide the tip if the tip is empty
            if($.trim(this.tipDiv.find('.tipContent').html()) == ''){
                this.tipDiv.hide();
            }
        }
    },

    // Abstract functions
    initialize: function() { },
    getValue: function() { },
    setValue: function() { },

    clearData: function() {
        this.component.find(':input').val('');
    },

    validate: function(silent) {
        //console.log('validating a component Bi!', this.parentJFormSection.parentJFormPage.id, this.id);
        // Handle dependencies
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency) {
            return null;
        }

        // If there are no validations, return true
        if(this.options.validationOptions.length < 1) {
            return true;
        }
        if(silent){
            var silentValidationPassed = true;
        }

        var self = this;
        this.clearValidation();
        var value = this.getValue();

        if(value === null){
            return true;
        }

        $.each(this.options.validationOptions, function(validationType, validationOptions){
            validationOptions['value'] = value;
            var validation = self.validationFunctions[validationType](validationOptions);

            if(validation == 'success') {
                if(validationType.match('required')){
                    self.requiredCompleted = true;
                }
                return true;
            }
            else {
                if(validationType.match('required')){
                    self.requiredCompleted = false;
                    if(self.parentJFormSection.parentJFormPage.jFormer.options.pageNavigator != false){
                        var pageIndex = $.inArray(self.parentJFormSection.parentJFormPage.id, self.parentJFormSection.parentJFormPage.jFormer.jFormPageIdArray);
                        $('#navigatePage'+(pageIndex + 1)).addClass('jFormPageNavigatorLinkWarning');
                    }
                }
                if(silent){
                    silentValidationPassed = false;
                } else {
                    $.merge(self.errorMessageArray, validation);   
                }
            }
        });
        if(silent) {
            return silentValidationPassed;
        }
        else {
            if(this.errorMessageArray.length > 0 ) {
                this.handleErrors();
                this.validationPassed = false;
            }
            return this.validationPassed;
        }
    },

    handleServerValidationResponse: function(errorMessageArray) {
        // Clear the validation
        $.each(this.instanceArray, function(instanceKey, instance) {
            instance.clearValidation();
        });

        // If there are errors
        if(errorMessageArray != null && errorMessageArray.length > 0) {
            // If there are instances
            if(this.instanceArray.length != 1) {
                // Go through each of the instances and assign the error messages
                $.each(this.instanceArray, function(instanceKey, instance) {
                    if(!jFormerUtility.empty(errorMessageArray[instanceKey])){
                        $.each(errorMessageArray[instanceKey], function(errorMessageArrayIndex, errorMessage){
                            if(errorMessage != '') {
                                instance.errorMessageArray.push(errorMessage);
                            }
                        });
                        if(instance.errorMessageArray.length > 0) {
                            instance.validationPassed = false;
                            instance.handleErrors();
                        }
                    }
                });
            }
            // If there aren't instances
            else {
                this.errorMessageArray = errorMessageArray;
                this.validationPassed = false;
                this.handleErrors();
            }
        }
    },

    handleErrors: function() {
        var self = this;

        // Change classes
        this.component.removeClass('jFormComponentValidationPassed');
        this.component.addClass('jFormComponentValidationFailed');

        // Add a tip div and tip neccesary
        if(this.tipDiv.length == 0) {
            this.createTipDiv();
        }

        // If validation tips are disabled
        if(!this.parentJFormSection.parentJFormPage.jFormer.options.validationTips) {
            return;
        }

        // Put the error list into the tip
        var tipErrorUl = $('<ul id="'+this.id+'-tipErrorUl" class="tipErrorUl"></ul>');
        $.each(this.errorMessageArray, function(index, errorMessage){
            tipErrorUl.append("<li>"+errorMessage+"</li>");
        });
        this.tipDiv.find('.tipContent').append(tipErrorUl);

        // Update the tip content
        this.tip.update(self.tipDiv.html());

        // Show the tip if you are currently on it
        if(this.component.hasClass('jFormComponentHighlight')) {
            this.tip.show();

        }
    },

    createTipDiv: function() {
        // Create a tip div and tip neccesary
        this.tipDiv = $('<div id="'+this.id+'-tip" style="display: none;"></div>');
        this.component.append(this.tipDiv);
        this.addTip();
    },

    disableByDependency: function(disable) {
        var self = this;
        var animationOptions = {};
        if(this.options.componentChangedOptions != null && this.options.componentChangedOptions.dependency != undefined && this.options.componentChangedOptions.dependency == true){
            this.component.trigger('jFormComponent:changed', this);
        }
        //stuff we are going to do stuff to...
        var elementsToDisable = this.component;
        $.each(this.instanceArray, function(index, componentInstance){
            if(index !== 0){
                elementsToDisable = elementsToDisable.add(componentInstance.component);
            }
        });
        if(this.options.instanceOptions !== null && (this.instanceArray.length < this.options.instanceOptions.max || this.options.instanceOptions.max === 0)){
            var addButton = $(this.parentJFormSection.section.find('#'+this.id+'-addInstance'));
            if(self.parentJFormSection.parentJFormPage.jFormer.initializing) {
                if(!disable && addButton.is(':hidden')){
                    addButton.show();
                    self.parentJFormSection.parentJFormPage.jFormer.adjustHeight({adjustHeightDuration:0});
                } else if(this.options.dependencyOptions.display == 'lock'){
                    addButton.show();
                    self.parentJFormSection.parentJFormPage.jFormer.adjustHeight({adjustHeightDuration:0});
                }
            }
            elementsToDisable = elementsToDisable.add(addButton);
        }
  
        if(self.parentJFormSection.parentJFormPage.jFormer.initializing) {
            animationOptions = {
                adjustHeightDelay : 0,
                appearDuration : 0,
                appearEffect: 'none',
                hideDuration : 0,
                hideEffect: 'none'

            }
        } else if(this.options.dependencyOptions.animationOptions !== undefined){
            animationOptions = $.extend(animationOptions, this.parentJFormSection.parentJFormPage.jFormer.options.animationOptions.dependency, this.options.dependencyOptions.animationOptions);
        } else {
            animationOptions = this.parentJFormSection.parentJFormPage.jFormer.options.animationOptions.dependency;
        }

        // If the condition is different then the current condition or if the form is initializing
        if(this.disabledByDependency !== disable || this.parentJFormSection.parentJFormPage.jFormer.initializing) {
            // Disable the component
            if(disable) {
                // Clear the validation to prevent validation issues with disabled component
                this.clearValidation();

                // Hide the component
                if(this.options.dependencyOptions.display == 'hide') {
                    //console.log('hiding component')
                    if(animationOptions.hideEffect == 'none' || animationOptions.hideDuration === 0){
                        elementsToDisable.hide(animationOptions.hideDuration);
                        self.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                    } else {
                        if(animationOptions.hideEffect === 'fade'){
                            elementsToDisable.fadeOut(animationOptions.hideDuration, function() {
                                self.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                            });
                        }else if(animationOptions.hideEffect === 'fade'){
                        
                            elementsToDisable.slideUp(animationOptions.hideDuration, function() {
                                self.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                            });
                        }
                    }
                }
                // Lock the component
                else {
                    elementsToDisable.addClass('jFormComponentDependencyDisabled').find(':input').attr('disabled', 'disabled');
                }
            }
            // Show or unlock the component
            else {
                // Show the component
                if(this.options.dependencyOptions.display == 'hide') {
                    //console.log('showing component')
                    if(animationOptions.appearEffect == 'none' || animationOptions.apearDuration === 0){
                        
                        elementsToDisable.show();
                        self.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                    }else {
                        if(animationOptions.appearEffect === 'fade'){
                        
                            elementsToDisable.fadeIn(animationOptions.appearDuration);
                            self.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                        }else if(animationOptions.appearEffect === 'slide'){
                        
                            elementsToDisable.slideDown(animationOptions.appearDuration);
                            self.parentJFormSection.parentJFormPage.jFormer.adjustHeight(animationOptions);
                        }
                    }
                }
                // Unlock the component
                else {
                    elementsToDisable.removeClass('jFormComponentDependencyDisabled').find(':input').removeAttr('disabled');
                }
            }
            this.disabledByDependency = disable;
        }
    },

    checkDependencies: function() {
        var self = this;
        if(this.options.dependencyOptions !== null) {
            // Run the dependency function
            //console.log(self.options.dependencyOptions.jsFunction);
            //console.log(eval(self.options.dependencyOptions.jsFunction));
            var disable = !(eval(self.options.dependencyOptions.jsFunction));
            this.disableByDependency(disable);
        }
    }
});
JFormComponentAddress = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    initialize: function(){
        this.tipTarget = this.component;
        if(this.options.emptyValue){
            this.addEmptyValues();
        }
        this.validationFunctions = {
            //Name Validations
            'required': function(options) {
                var errorMessageArray = [];
                if(options.value.addressLine1 == '') {
                    errorMessageArray.push(['Street Address is required.']);
                }
                if(options.value.city == '') {
                    errorMessageArray.push(['City is required.']);
                }
                if(options.value.state == '') {
                    errorMessageArray.push(['State is required.']);
                }
                if(options.value.zip == '') {
                    errorMessageArray.push(['Zip is required.']);
                }
                if(options.value.country == '') {
                    errorMessageArray.push(['Country is required.']);
                }
                return errorMessageArray.length < 1 ? 'success' : errorMessageArray;
            }
        }
        
        this.changed = false;
    },

    setValue: function(data) {
        var self = this;
        if(data === null || data === ''){
            data = {
                addressline1:'',
                city:'',
                state:'',
                zip:''
            }
        }
        if(this.options.emptyValue){
            if(data.addressLine1 != this.options.emptyValue.addressLine1){
                self.component.find(':input[id*=addressLine1]').removeClass('defaultValue').val(data.addressLine1).blur();
            }
            if(data.addressLine2 != this.options.emptyValue.addressLine2){
                self.component.find(':input[id*=addressLine2]').removeClass('defaultValue').val(data.addressLine2).blur();
            }
            if(data.city != this.options.emptyValue.city){
                self.component.find(':input[id*=city]').removeClass('defaultValue').val(data.city).blur();
            }
            if(data.state != this.options.emptyValue.state || this.options.emptyValue.state == undefined){
                self.component.find(':input[id*=state]').removeClass('defaultValue').val(data.state).blur();
            }
            if(data.zip != this.options.emptyValue.zip){
                self.component.find(':input[id*=zip]').removeClass('defaultValue').val(data.zip).blur();
            }
        }
        else {
            self.component.find(':input[id*=addressLine1]').val(data.addressLine1);
            self.component.find(':input[id*=addressLine2]').val(data.addressLine2);
            self.component.find(':input[id*=city]').val(data.city);
            self.component.find(':input[id*=state]').val(data.state);
            self.component.find(':input[id*=zip]').val(data.zip);
        }
        self.component.find(':input[id*=country]').val(data.country);
        this.validate(true);
        /*
        $.each(data, function(key, value){
            if(self.options.emptyValue[key] != undefined && data[key] != self.options.emptyValue[key]){
                self.component.find(':input[id*='+key+']').removeClass('defaultValue').val(value).trigger('component:changed').blur();
            } else if (self.options.emptyValue[key] == undefined) {
                self.component.find(':input[id*='+key+']').val(value).trigger('component:changed');
            } else {
                self.component.find(':input[id*='+key+']').val(value).trigger('component:changed');
            }
        });*/
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
           return null;
        }
        var address = {},
        self = this;

        // Get the values
        address.addressLine1 = self.component.find(':input[id*=addressLine1]').val();
        address.addressLine2 = self.component.find(':input[id*=addressLine2]').val();
        address.city = self.component.find(':input[id*=city]').val();
        address.state = self.component.find(':input[id*=state]').val();
        address.zip = self.component.find(':input[id*=zip]').val();
        address.country = self.component.find(':input[id*=country]').val();

        this.component.find(':input').each(function(index, input) {
            address[$(input).attr('id').replace(self.id+'-', '')] = $(input).val();
        });
        if(this.options.emptyValue){
            if(address.addressLine1 == this.options.emptyValue.addressLine1){
                address.addressLine1 = '';
            }
            if(address.addressLine2 == this.options.emptyValue.addressLine2){
                address.addressLine2 = '';
            }
            if(address.city == this.options.emptyValue.city){
                address.city = '';
            }
            if(address.state == this.options.emptyValue.state){
                address.state = '';
            }
            if(address.zip == this.options.emptyValue.zip){
                address.zip = '';
            }
        }

        return address;
    },

    validate: function(){
        if(!this.parentJFormSection.parentJFormPage.jFormer.options.clientSideValidation) {
            return;
        }

        var self = this;
        if(!this.changed){
            this._super();
        }
        
        setTimeout(function() {
            if(!self.component.hasClass('jFormComponentHighlight')){
                if(self.options.validationOptions.length < 1){
                    return true;
                }
                self.clearValidation();
                $.each(self.options.validationOptions, function(validationType, validationOptions){
                    validationOptions['value'] = self.getValue();
                    var validation = self.validationFunctions[validationType](validationOptions);
                    if(validation == 'success'){
                        return;
                    }
                    else {
                        $.merge(self.errorMessageArray, validation);
                        self.validationPassed = false;
                    }
                });
                if(self.errorMessageArray.length > 0 ){
                    self.handleErrors();
                }
                self.changed = false;
                return self.validationPassed;
            }
        }, 1);

    },

    addEmptyValues: function(){
        var self = this,
        emptyValue = this.options.emptyValue;
        $.each(emptyValue, function(key, value){
            var input = self.component.find('input[id*='+key+']');
            input.addClass('defaultValue');
            input.focus(function(event){
                if ($.trim($(event.target).val()) == value ){
                    $(event.target).val('');
                    $(event.target).removeClass('defaultValue');
                }
            });
            input.blur(function(event){
                if ($.trim($(event.target).val()) == '' ){
                    $(event.target).addClass('defaultValue');
                    $(event.target).val(value);
                }
            });
            input.trigger('blur');
        });
    }
});JFormComponentCreditCard = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    initialize: function(){
        this.tipTarget = this.component;
        if(this.options.emptyValues){
            this.addEmptyValues();
        }
        this.validationFunctions = {
            //Name Validations
            'required': function(options) {
                var errorMessageArray = [];
                if(options.value.cardType != undefined && options.value.cardType == '') {
                    errorMessageArray.push(['Card type is required.']);
                }
                if(options.value.cardNumber == '') {
                    errorMessageArray.push(['Credit card number is required.']);
                } 
                if(options.value.cardNumber != '' && options.value.cardNumber.match(/[^\d]/)){
                    errorMessageArray.push(['Card number may only contain numbers.']);
                }
                if(options.value.cardNumber != '' && (options.value.cardNumber.length < 13 || options.value.cardNumber.length > 16)){
                    errorMessageArray.push(['Card number must contain 13 to 16 digits.']);
                }
                if(options.value.expirationMonth == '') {
                    errorMessageArray.push(['Expiration month is required.']);
                }
                if(options.value.expirationYear == '') {
                    errorMessageArray.push(['Expiration year is required.']);
                }
                if(options.value.securityCode != undefined && options.value.securityCode == '') {
                    errorMessageArray.push(['Security code is required.']);
                }
                if(options.value.securityCode != undefined && options.value.securityCode != '' && options.value.securityCode.match(/[^\d]/)) {
                    errorMessageArray.push(['Security code may only contain numbers.']);
                }
                if(options.value.securityCode != undefined && options.value.securityCode != '' && options.value.securityCode.length < 3){
                    errorMessageArray.push(['Security code must contain 3 or 4 digits.']);
                }
                return errorMessageArray.length < 1 ? 'success' : errorMessageArray;
            }
        }
        
        this.changed = false;
    },

    setValue: function(data) {
        var self = this;
        if(this.options.emptyValues){
            if(data.cardType != undefined){
                self.component.find(':input[id*=cardType]').removeClass('defaultValue').val(data.cardType).blur();
            }
            if(data.cardNumber != this.options.emptyValues.cardNumber){
                self.component.find(':input[id*=cardNumber]').removeClass('defaultValue').val(data.cardNumber).blur();
            }            
            self.component.find(':input[id*=expirationMonth]').removeClass('defaultValue').val(data.expirationMonth).blur();
            self.component.find(':input[id*=expirationYear]').removeClass('defaultValue').val(data.expirationYear).blur();
            if(data.securityCode != undefined && data.securityCode != this.options.emptyValues.securityCode){
                self.component.find(':input[id*=expirationMonth]').removeClass('defaultValue').val(data.expirationMonth).blur();
            }
        }
        else {
            if(data.cardType != undefined){
                self.component.find(':input[id*=cardType]').val(data.cardType);
            }
            self.component.find(':input[id*=cardNumber]').val(data.cardNumber);
            self.component.find(':input[id*=expirationMonth]').val(data.expirationMonth);
            self.component.find(':input[id*=expirationYear]').val(data.expirationYear);
            if(data.securityCode != undefined){
                self.component.find(':input[id*=securityCode]').val(data.securityCode);
            }
        }
        this.validate(true);
        /*
        $.each(data, function(key, value){
            if(self.options.emptyValue[key] != undefined && data[key] != self.options.emptyValue[key]){
                self.component.find(':input[id*='+key+']').removeClass('defaultValue').val(value).trigger('component:changed').blur();
            } else if (self.options.emptyValue[key] == undefined) {
                self.component.find(':input[id*='+key+']').val(value).trigger('component:changed');
            } else {
                self.component.find(':input[id*='+key+']').val(value).trigger('component:changed');
            }
        });*/
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
           return null;
        }
        var creditCardInfo = {};

        // Get the values
        if(this.component.find(':input[id*=cardType]').length != 0){
            creditCardInfo.cardType = this.component.find(':input[id*=cardType]').val();
        }
        creditCardInfo.cardNumber = this.component.find(':input[id*=cardNumber]').val();
        creditCardInfo.expirationMonth = this.component.find(':input[id*=expirationMonth]').val();
        creditCardInfo.expirationYear = this.component.find(':input[id*=expirationYear]').val();
        if(this.component.find(':input[id*=securityCode]').length != 0){
            creditCardInfo.securityCode = this.component.find(':input[id*=securityCode]').val();
        }
        if(this.options.emptyValues){
            if(creditCardInfo.cardNumber == this.options.emptyValues.cardNumber){
                creditCardInfo.cardNumber = '';
            }
            if(creditCardInfo.securityCode != undefined && creditCardInfo.securityCode == this.options.emptyValues.securityCode){
                creditCardInfo.securityCode = '';
            }
        }
        return creditCardInfo;
    },

    validate: function(){
        if(!this.parentJFormSection.parentJFormPage.jFormer.options.clientSideValidation) {
            return;
        }

        var self = this;
        if(!this.changed){
            this._super();
        }
        
        setTimeout(function() {
            if(!self.component.hasClass('jFormComponentHighlight')){
                if(self.options.validationOptions.length < 1){
                    return true;
                }
                self.clearValidation();
                $.each(self.options.validationOptions, function(validationType, validationOptions){
                    validationOptions['value'] = self.getValue();
                    var validation = self.validationFunctions[validationType](validationOptions);
                    if(validation == 'success'){
                        return;
                    }
                    else {
                        $.merge(self.errorMessageArray, validation);
                        self.validationPassed = false;
                    }
                });
                if(self.errorMessageArray.length > 0 ){
                    self.handleErrors();
                }
                self.changed = false;
                return self.validationPassed;
            }
        }, 1);

    },

    addEmptyValues: function(){
        var self = this,
        emptyValues = this.options.emptyValues;
        $.each(emptyValues, function(key, value){
            var input = self.component.find('input[id*='+key+']');
            input.addClass('defaultValue');
            input.focus(function(event){
                if ($.trim($(event.target).val()) == value ){
                    $(event.target).val('');
                    $(event.target).removeClass('defaultValue');
                }
            });
            input.blur(function(event){
                if ($.trim($(event.target).val()) == '' ){
                    $(event.target).addClass('defaultValue');
                    $(event.target).val(value);
                }
            });
            input.trigger('blur');
        });
    }
});JFormComponentDate = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    initialize: function() {
        var self = this;
        this.monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.addCalendar();
        this.tipTarget = this.component.find('.jFormComponentDateSelector');
        if(this.tipTarget == undefined){
            this.tipTarget = this.component;
        }
        if(this.options.validationOptions.length == 0){
           this.reformValidations();
        }
        this.validationFunctions = {
            //Date validations
            'required': function(options) {
                var errorMessageArray = [];
                if(options.value.month == '' || options.value.day == '' || options.value.year == '' || options.value == null){
                    errorMessageArray.push('Required.');
                    return errorMessageArray;
                }

                var month = parseInt(options.value.month,10);
                var day = parseInt(options.value.day,10);
                var year = options.value.year;
                var badDay = false;
                if(!year.match(/[\d]{4}/)){
                    errorMessageArray.push('You must enter a valid year.');
                }
                if(month < 1 || month > 12){
                    errorMessageArray.push('You must enter a valid month.');
                }
                if(month==4 || month==6 || month==9 || month==11) {
                    if(day > 30){
                        badDay = true;
                    }
                }
		else if (month==2) {
                    year = parseInt(year);
                    var days = ((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28
                    if(day > days){
                        badDay = true;
                    }
                }
                if (day > 31 || day < 1){
                    badDay = true;
                }
                if(badDay){
                    errorMessageArray.push('You must enter a valid day.');
                }

                return errorMessageArray.length < 1 ? 'success' : errorMessageArray;
            },
            'minDate': function(options) {
                var errorMessageArray = [];
                var minDate = self.getDateFromString(options.minDate);
                var selectedDate = self.getDateFromObject(options.value);
                if(selectedDate < minDate) {
                    errorMessageArray.push('Date must be on or after ' + self.monthArray[minDate.getMonth()] + ' ' + minDate.getDate() + ', ' + minDate.getFullYear() + '.');
                }                
                return errorMessageArray.length < 1 ? 'success' : errorMessageArray;
            },
            'maxDate': function(options) {
                var errorMessageArray = [];
                var maxDate = self.getDateFromString(options.maxDate);
                var selectedDate = self.getDateFromObject(options.value);
                if(selectedDate > maxDate) {
                    errorMessageArray.push('Date must be on or before ' + self.monthArray[maxDate.getMonth()] + ' ' + maxDate.getDate() + ', ' + maxDate.getFullYear() + '.');
                }
                return errorMessageArray.length < 1 ? 'success' : errorMessageArray;
            },
            'teenager': function(options) {
                var errorMessageArray = ['You must be at least 13 years old to use this site.'];
                var birthday = self.getDateFromObject(options.value);
                var limit = new Date();
                limit.setFullYear(limit.getFullYear() - 13);
                return options.value == '' || birthday <= limit ? 'success' : errorMessageArray;
            }
        }
    },

    highlight: function() {
        var self = this
        // Add the highlight class and trigger the highlight
        this.component.addClass('jFormComponentHighlight').trigger('jFormComponent:highlighted', this.component);
        setTimeout(function(){
            self.component.trigger('jFormComponent:showTip', self.component);
        }, 1);

    },

    addCalendar: function(){
        var input = this.component.find('input:text');
        var datePicker = input.date_input();
        input.bind('keyup', function(event){
            if (event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39 ){
                return;
            } else if(input.val().length == 10){
                input.trigger('change');
            }
        });
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
           return null;
        }
        var date = {'month': '' , 'day': '', 'year':''};
        var value = $('#'+this.id).val();
        if(value != ''){
            value = value.split(value.match(/[^\d]/));
            if (value[0] != undefined){
                date.month = value[0];
            } 
            if(value[1] != undefined) {
                date.day = value[1];
            }
            if(value[2] != undefined){
                date.year = value[2];
            }
        }
        
        return date;
    },

    // Expects YYYY-MM-DD
    getDateFromString: function(string) {
        var timeArray = string.split('-');
        return new Date(parseInt(timeArray[0], 10), parseInt(timeArray[1], 10)-1, parseInt(timeArray[2], 10));
    },

    // Expects {year,month,day}
    getDateFromObject: function(object) {
        return new Date(parseInt(object.year, 10), parseInt(object.month, 10) - 1, parseInt(object.day, 10));
    },

    setValue: function(value) {

        if(value == null || value.month == 'undefined' || value.year == 'undefined' || value.day == 'undefined'){
            $('#'+this.id).val('');
            return;
        } else {
            $('#'+this.id).val(padString(value.month) +'/'+ padString(value.day) +"/"+ value.year)
            if($('#'+this.id).val() == '//'){
                $('#'+this.id).val('');
            }
        }
        
        this.validate(true);
        return ;

        function padString(number){
            if(number == '' || number == 'undefined'){
                return '';
            }
            number = '' + number;
            if(number.length == 1){
                number = '0'+number;
            }
            return number;
        }

    }

});
JFormComponentDropDown = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    initialize: function(){
       this.tipTarget = this.component.find('select:last');
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
           return null;
        }
            var dropDownValue = $('#'+this.id).val();
            return dropDownValue;
    },

    setValue: function(value){
        $('#'+this.id).val(value).trigger('jFormComponent:changed');
      //this.component.find('option[value=\''+value+'\']').attr('selected', 'selected').trigger('jFormComponent:changed');
      this.validate(true);
    }

});JFormComponentFile = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },
    
    initialize: function(){
        var tipTarget = this.component.find('button').parent();
        if (tipTarget.length < 1){
            tipTarget = this.component.find('input:file');
        }
        this.tipTarget = tipTarget;
        if(this.options.customStyle){
            this.setOnChange();
        }
        this.validationFunctions = {
            'required': function(options) {
                var errorMessageArray = ['Required.'];
                return options.value != '' ? 'success' : errorMessageArray;
            },
            'extension': function(options) {
                var errorMessageArray = ['Must have the .'+options.extension+' extension.'];
                var extensionRegex = new RegExp('\\.'+options.extension+'$', 'i');
                return options.value == '' || options.value.match(extensionRegex) ? 'success' : errorMessageArray;
            },
            'extensionType': function(options) {
                var extensionType;
                var errorMessageArray = ['Incorrect file type.'];
                if($.isArray(options.extensionType)){
                    extensionType = new RegExp('\\.('+options.extensionType.join('|')+')$', 'i');
                }
                else {
                    var extensionObject = {};
                    extensionObject.image = /\.(bmp|gif|jpe?g|png|psd|psp|thm|tif)/i;
                    extensionObject.document = /\.(doc|docx|log|msg|pages|rtf|txt|wpd|wps)/i;
                    extensionObject.audio = /\.(aac|aif|iff|m3u|mid|midi|mp3|mpa|ra|wav|wma)/i;
                    extensionObject.video = /\.(3g2|3gp|asf|asx|avi|flv|mov|mp4|mpg|rm|swf|vob|wmv)/i;
                    extensionObject.web = /\.(asp|css|htm|html|js|jsp|php|rss|xhtml)/i;
                    extensionType = new RegExp(extensionObject[options.extensionType]);
                    errorMessageArray = ['Must be an '+options.extensionType+' file type.'];
                }
                return options.value == '' || options.value.match(extensionType) ? 'success' : errorMessageArray;
            },
            'size' : function(options){
                return true;
            },
            'imageDimensions' : function(options){
                return true;
            },
            'minImageDimensions' : function(options){
                return true;
            }
        }
    },

    setOnChange: function(){
        var self = this;

        this.component.find('input:file').change(function(event){
            var value = event.target.value.replace(/.+\\/, '');
            self.component.find('input:text').val(value);
        });
        
    },

    setValue: function() {
        return false;
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
           return null;
        }
        return this.component.find('input:file').val();
    },

    validate: function() {
        this._super();
    }
});JFormComponentHidden = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
           return null;
        }
        return $('#'+this.id).val();
    },

    validate: function() {
        this._super();
    }
});
JFormComponentLikert = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    initialize: function(){
        var self = this;
        this.changed = false;
        this.tipTarget = this.component;
        this.statementComponentArray = {};

        $.each(this.options.statementArray, function(statementName, statementOptions){
            if(!jFormerUtility.empty(self.options.validationOptions)){
                statementOptions.validationOptions = self.options.validationOptions;
            }
            var newLikertStatment = new JFormComponentLikertStatement(self.parentJFormSection, statementName, 'JFormComponentLikertStatement', statementOptions);
            newLikertStatment.id = self.id+'-'+newLikertStatment.id
            self.parentJFormSection.addComponent(newLikertStatment);
            self.statementComponentArray[statementName] = newLikertStatment;
        });
    },

    clearValidation: function (){
      $.each(this.statementComponentArray, function(index, statement){
          statement.clearValidation();
      });
    },

    setValue: function(data) {
        var self = this;
        return
        /*
        $.each(data, function(key, value){
            if(data[key] != self.options.emptyValue[key]){
                self.component.find('input[id*='+key+']').removeClass('defaultValue').val(value).blur().trigger('component:changed');
            }
        });*/
    },

    catchComponentChangedEventListener: function() { return null },
    addHighlightListeners: function() { return null },
    defineComponentChangedEventListener: function() { return null },
    addTipListeners: function() { return null },

    getValue: function() {
        var value = {};
        $.each(this.statementComponentArray, function(key, component){
            value[key] = component.getValue();
        })


        return value;
    },

    handleErrors: function() {
        var self = this;
        return true;
    },

    handleServerValidationResponse: function(errorMessageArray) {
        var self = this;
        if(errorMessageArray.length > 0) {
            $.each(this.instanceArray, function(key, instance){    
                $.each(errorMessageArray, function(index, passedErrorArray){
                    $.each(passedErrorArray, function(statementKey, statementError){
                        var likertStatement = self.parentJFormSection.jFormComponents[instance.id+'-'+statementKey];
                        if(likertStatement != undefined){
                            likertStatement.errorMessageArray = [statementError];
                            likertStatement.validationPassed = false;
                            likertStatement.handleErrors();
                        }
                    }) ;
                });
            });
        }
    },

    validate: function(){
        var self = this;
        return true;
    }
        
});
JFormComponentLikertStatement = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    initialize: function(){
        var self = this
        this.changed = false;
        this.component = $('input[name='+this.id+']:first').closest('tr');
        this.tipTarget = this.component;
        this.tipDiv = this.component.find('div.jFormComponentLikertStatementTip');

        // Allow the user to click on the box
        //this.component.find('td').click(function(event){
            //event.preventDefault();
            //$(event.target).find('input').attr("checked", "checked").trigger('click');
        //});

        this.validationFunctions = {
            'required': function(options) {
                var errorMessageArray = ['Required.'];
                return options.value.length > 0 ? 'success' : errorMessageArray;
            }
        }

    },

    setValue: function(data) {
        var self = this;
            self.component.find('input').val([data]);
            this.validate(true);
        /*
        $.each(data, function(key, value){
            if(data[key] != self.options.emptyValue[key]){
                self.component.find('input[id*='+key+']').removeClass('defaultValue').val(value).blur().trigger('component:changed');
            }
        });*/
    },

    validate: function(){
        this._super();
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
            return null;
        }      
        var value = this.component.find('input:checked');
        if(value.length > 0){
            value = value.val()
        } else {
            value = '';
        }
        return value;
    }
});JFormComponentMultipleChoice = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    initialize: function(){
        this.tipTarget = this.component;
        this.addChoiceTips();
        this.validationFunctions = {
            //MultipleChoice validations
            'required': function(options) {
                var errorMessageArray = ['Required.'];
                return options.value.length > 0 ? 'success' : errorMessageArray;
            },
            'minOptions': function(options) {
                var errorMessageArray = ['You must select more than '+ options.minOptions +' options'];
                return options.value.length == 0 || options.value.length > options.minOptions ? 'success' : errorMessageArray;
            },
            'maxOptions': function(options) {
                var errorMessageArray = ['You may select up to '+ options.maxOptions +' options. You have selected '+ options.value.length + '.'];
                return options.value.length == 0 || options.value.length <= options.maxOptions ? 'success' : errorMessageArray;
            }
        }
    },

    addChoiceTips: function(){
        var self = this;
        var tips = this.component.find('div.jFormComponentMultipleChoiceTip');
        if(tips.length > 0) {
            tips.each(function(index, tip) {
                var tipTarget = $(tip).prev('label').find('.jFormComponentMultipleChoiceTipIcon');
                if (tipTarget.length == 0){
                    tipTarget = $(tip).parent();
                }
                tipTarget.simpletip({
                    position: 'topRight',
                    content: $(tip),
                    baseClass: 'jFormerTip jFormComponentMultipleChoiceTip',
                    hideEffect: 'none'
                });
            });
        }
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
           return null;
        }
        var multipleChoiceValue
        if(this.options.multipleChoiceType == 'checkbox') {
            multipleChoiceValue = [];
            this.component.find('input:checked').each(function(index, input){
                multipleChoiceValue.push($(input).val());
            });
        }
        else {
            if(this.component.find('input:checked').length > 0){
                multipleChoiceValue = this.component.find('input:checked').val();
            }
            else {
                multipleChoiceValue = '';
            }
        }
        return multipleChoiceValue;
    },

    setValue: function(data) {
        var self = this;
        // Checkbox
        if(this.options.multipleChoiceType == 'checkbox') {
            $.each(data, function(key, value){
                self.component.find('input[value=\''+value+'\']').attr('checked', 'checked').trigger('jFormComponent:changed');
            });
        }
        // Radio button
        else {
            this.component.find('input[value=\''+data+'\']').attr('checked', 'checked').trigger('jFormComponent:changed');

            if(data == null) {
                this.component.find('input').attr('checked', false).trigger('jFormComponent:changed');
            }
        }
        this.validate(true);
    }
});JFormComponentName = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
    },

    initialize: function(){
        this.tipTarget = this.component.find('input:last');
        if(this.options.emptyValue){
            this.addEmptyValues();
        }
        this.changed = false;
        this.validationFunctions = {
            'required': function(options) {
                var errorMessageArray = [];
                if(options.value.firstName == '') {
                    errorMessageArray.push(['First name is required.']);
                }
                if(options.value.lastName == '') {
                    errorMessageArray.push(['Last name is required.']);
                }
                return errorMessageArray.length < 1 ? 'success' : errorMessageArray;
            }
        }
    },

    setValue: function(data) {
        var self = this;
        if(this.options.emptyValue){
            if(data.firstName != self.options.emptyValue.firstName){
                self.component.find('input[id*=firstName]').removeClass('defaultValue').val(data.firstName).blur();
            }
            self.component.find('input[id*=middleInitial]').removeClass('defaultValue').val(data.middleInitial).blur();
            if(data.lastName != self.options.emptyValue.lastName){
                self.component.find('input[id*=lastName]').removeClass('defaultValue').val(data.lastName).blur();
            }
        } else {
            self.component.find('input[id*=firstName]').val(data.firstName)
            self.component.find('input[id*=middleInitial]').val(data.middleInitial);
            self.component.find('input[id*=lastName]').val(data.lastName);
        }
        this.validate(true);

        /*
        $.each(data, function(key, value){
            if(data[key] != self.options.emptyValue[key]){
                self.component.find('input[id*='+key+']').removeClass('defaultValue').val(value).blur().trigger('component:changed');
            }
        });*/
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
           return null;
        }
        var name = {},
        self = this;
        name.firstName = this.component.find('input[id*=firstName]').val();
        name.middleInitial = this.component.find('input[id*=middleInitial]').val();
        name.lastName = this.component.find('input[id*=lastName]').val();

        if(this.options.emptyValue){
            if(name.firstName == this.options.emptyValue.firstName){
                name.firstName = '';
            }
            if(this.component.find('input[id$=middleInitial]').hasClass('defaultValue') ){
                name.middleInitial = '';
            }
            if(name.lastName == this.options.emptyValue.lastName){
                name.lastName = '';
            }
        }

        return name;
    },

    validate: function(){
        if(!this.parentJFormSection.parentJFormPage.jFormer.options.clientSideValidation) {
            return;
        }

        var self = this;
        if(!this.changed){
            this._super();
        }
        
        setTimeout(function() {
            if(!self.component.hasClass('jFormComponentHighlight')){
                if(self.options.validationOptions.length < 1){
                    return true;
                }
                self.clearValidation();
                $.each(self.options.validationOptions, function(validationType, validationOptions){
                    validationOptions['value'] = self.getValue();
                    var validation = self.validationFunctions[validationType](validationOptions);
                    if(validation == 'success'){
                        return;
                    }
                    else {
                        $.merge(self.errorMessageArray, validation);
                        self.validationPassed = false;
                    }
                });
                if(self.errorMessageArray.length > 0 ){
                    self.handleErrors();
                }
                self.changed = false;
                return self.validationPassed;
            }
        }, 1);
    },

    addEmptyValues: function(){
        var self = this,
        emptyValue = this.options.emptyValue;
        $.each(emptyValue, function(key, value){
            var input = self.component.find('input[id*='+key+']');
            input.addClass('defaultValue');
            input.focus(function(event){
                if ($.trim($(event.target).val()) == value ){
                    $(event.target).val('');
                    $(event.target).removeClass('defaultValue');
                }
            });
            input.blur(function(event){
                if ($.trim($(event.target).val()) == '' ){
                    $(event.target).addClass('defaultValue');
                    $(event.target).val(value);
                }
            });
            input.trigger('blur');
        });
    }
});JFormComponentSingleLineText = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType ,options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType ,options);
    },

    initialize: function() {
        this.tipTarget = this.component.find('input:last');
        this.enterSubmits = false;
        if(this.options.mask) {
            this.addMask();
        }
        if(this.options.emptyValue) {
            this.addEmptyValue();
        }
        if(this.component.find('input:password').length == 1 && this.options.showStrength){
            this.addPasswordStrength();
        }
        this.validationFunctions = {
            'alpha': function(options) {
                var errorMessageArray = ['Must only contain letters.'];
                return options.value == '' || options.value.match(/^[A-Za-z]+$/i)  ? 'success' : errorMessageArray;
            },
            'alphaDecimal': function(options) {
                var errorMessageArray = ['Must only contain letters, numbers, or periods.'];
                return options.value == '' || options.value.match(/^[A-Za-z0-9\.]+$/i)  ? 'success' : errorMessageArray;
            },
            'alphaNumeric': function(options) {
                var errorMessageArray = ['Must only contain letters or numbers.'];
                return options.value == '' || options.value.match(/^[A-Za-z0-9]+$/i)  ? 'success' : errorMessageArray;
            },
            'blank': function(options) {
                var errorMessageArray = ['Must be blank.'];
                return $.trim(options.value).length == 0 ? 'success' : errorMessageArray;
            },
            'canadianPostal': function(options) {
                var errorMessageArray = ['Must be a valid Canadian postal code.'];
                return options.value == '' || options.value.match(/^[ABCEGHJKLMNPRSTVXY][0-9][A-Z] [0-9][A-Z][0-9]$/)  ? 'success' : errorMessageArray;
            },
            'custom_regexp': function(options) {
                var errorMessageArray = [options.custom_regexp.custom_message];
                var sm = options.custom_regexp.regexp.substring(1,sm.length-1);						
                var regular_expression = RegExp(sm);
                return options.value.match(regular_expression) ? 'success' : errorMessageArray;
            },
            'date': function(options) {
                var errorMessageArray = ['Must be a date in the mm/dd/yyyy format.'];
                return options.value == '' || options.value.match(/^(0?[1-9]|1[012])[\- \/.](0?[1-9]|[12][0-9]|3[01])[\- \/.](19|20)[0-9]{2}$/)  ? 'success' : errorMessageArray;
            },
            'dateTime': function(options) {
                var errorMessageArray = ['Must be a date in the mm/dd/yyyy hh:mm:ss tt format. ss and tt are optional.'];
                return options.value == '' || options.value.match(/^(0?[1-9]|1[012])[\- \/.](0?[1-9]|[12][0-9]|3[01])[\- \/.](19|20)?[0-9]{2} [0-2]?\d:[0-5]\d(:[0-5]\d)?( ?(a|p)m)?$/i)  ? 'success' : errorMessageArray;
            },
            'decimal': function(options) {
                // Can be negative and have a decimal value
                // Do not accept commas in value as the DB does not accept them
                var errorMessageArray = ['Must be a number without any commas. Decimal is optional.'];
                return options.value == '' || options.value.match(/^-?((\d+(\.\d+)?)|(\.\d+))$/) ? 'success' : errorMessageArray;
            },
            'decimalNegative': function(options) {
                // Must be negative and have a decimal value
                var errorMessageArray = ['Must be a negative number without any commas. Decimal is optional.'];
                var isDecimal = this.decimal(options);
                return options.value == '' || (isDecimal == 'success' && (parseFloat(options.value) < 0)) ? 'success' : errorMessageArray;
            },
            'decimalPositive': function(options) {
                // Must be positive and have a decimal value
                var errorMessageArray = ['Must be a positive number without any commas. Decimal is optional.'];
                var isDecimal = this.decimal(options);
                return options.value == '' ||  (isDecimal == 'success' && (parseFloat(options.value) > 0)) ? 'success' : errorMessageArray;
            },
            'decimalZeroNegative': function(options) {
                // Must be negative and have a decimal value
                var errorMessageArray = ['Must be zero or a negative number without any commas. Decimal is optional.'];
                var isDecimal = this.decimal(options);
                return options.value == '' || (isDecimal == 'success' && (parseFloat(options.value) <= 0)) ? 'success' : errorMessageArray;
            },
            'decimalZeroPositive': function(options) {
                // Must be positive and have a decimal value
                var errorMessageArray = ['Must be zero or a positive number without any commas. Decimal is optional.'];
                var isDecimal = this.decimal(options);
                return options.value == '' || (isDecimal == 'success' && (parseFloat(options.value) >= 0)) ? 'success' : errorMessageArray;
            },
            'email': function(options) {
                var errorMessageArray = ['Must be a valid e-mail address.'];
                return options.value == '' || options.value.match(/^[A-Z0-9._%\-\+]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i)  ? 'success' : errorMessageArray;
            },
            'integer': function(options) {
                var errorMessageArray = ['Must be a whole number.'];
                return options.value == '' || options.value.match(/^-?\d+$/) ? 'success' : errorMessageArray;
            },
            'integerNegative': function(options) {
                var errorMessageArray = ['Must be a negative whole number.'];
                var isInteger = this.integer(options);
                return options.value == '' || (isInteger == 'success' && (parseInt(options.value, 10) < 0)) ? 'success' : errorMessageArray;
            },
            'integerPositive': function(options) {
                var errorMessageArray = ['Must be a positive whole number.'];
                var isInteger = this.integer(options);
                return options.value == '' || (isInteger == 'success' && (parseInt(options.value, 10) > 0)) ? 'success' : errorMessageArray;
            },
            'integerZeroNegative': function(options) {
                var errorMessageArray = ['Must be zero or a negative whole number.'];
                var isInteger = this.integer(options);
                return options.value == '' || (isInteger == 'success' && (parseInt(options.value, 10) <= 0)) ? 'success' : errorMessageArray;
            },
            'integerZeroPositive': function(options) {
                var errorMessageArray = ['Must be zero or a positive whole number.'];
                var isInteger = this.integer(options);
                return options.value == '' || (isInteger == 'success' && (parseInt(options.value, 10) >= 0)) ? 'success' : errorMessageArray;
            },
            'isbn': function(options) {
                //Match an ISBN
                var errorMessageArray = ['Must be a valid ISBN and consist of either ten or thirteen characters.'];
                var success = false;
                //For ISBN-10
                if(options.value.match(/^(?=.{13}$)\d{1,5}([\- ])\d{1,7}\1\d{1,6}\1(\d|X)$/)) {
                    success = true;
                }
                if(options.value.match(/^\d{9}(\d|X)$/)) {
                    success = true;
                }
                //For ISBN-13
                if(options.value.match(/^(?=.{17}$)\d{3}([\- ])\d{1,5}\1\d{1,7}\1\d{1,6}\1(\d|X)$/)) {
                    success = true;
                }
                if(options.value.match(/^\d{3}[\- ]\d{9}(\d|X)$/)) {
                    success = true;
                }
                //ISBN-13 without starting delimiter (Not a valid ISBN but less strict validation was requested)
                if(options.value.match(/^\d{12}(\d|X)$/)) {
                    success = true;
                }
                return options.value == '' || success ? 'success' : errorMessageArray;
            },
            'length' : function(options) {
                var errorMessageArray = ['Must be exactly ' + options.length + ' characters long. Current value is '+ options.value.length +' characters.'];
                return options.value == '' || options.value.length == options.length  ? 'success' : errorMessageArray;
            },
            'matches': function(options) {
                var errorMessageArray = ['Does not match.'];

                // If the match should occur within the same section instances, both the source and destination fields are stored in the same section
                var idToMatch = options.matches;

                // If it is matching to section instances
                if(options.sectionInstances) {
                    var sectionId = options.component.attr('id').match(/-section[\d]+/);
                    if(sectionId) {
                        idToMatch = options.matches + sectionId;
                    }
                }

                return options.value == $('#'+idToMatch).val() ? 'success' : errorMessageArray;
            },
            'maxLength' : function(options) {
                var errorMessageArray = ['Must be less than ' + options.maxLength + ' characters long. Current value is '+ options.value.length +' characters.'];
                return options.value == '' || options.value.length <= options.maxLength  ? 'success' : errorMessageArray;
            },
            'maxFloat': function(options) {
                //Value cannot have more digits then specified in maxFloat
                var errorMessageArray = ['Must be numeric and cannot have more than ' + options.maxFloat + ' decimal place(s).'];
                maxFloatPattern = new RegExp('^-?((\\d+(\\.\\d{0,'+ options.maxFloat + '})?)|(\\.\\d{0,' + options + '}))$');
                return options.value == '' || options.value.match(maxFloatPattern) ? 'success' : errorMessageArray;
            },
            'maxValue': function(options) {
                var errorMessageArray = ['Must be numeric with a maximum value of ' + options.maxValue + '.'];
                return (options.value <= options.maxValue) ? 'success' : errorMessageArray;
            },
            'minLength' : function(options) {
                var errorMessageArray = ['Must be at least ' + options.minLength + ' characters long. Current value is '+ options.value.length +' characters.'];
                return options.value == '' || options.value.length >= options.minLength  ? 'success' : errorMessageArray;
            },
            'minValue': function(options) {
                var errorMessageArray = ['Must be numeric with a minimum value of ' + options.minValue + '.'];
                return (options.value >= options.minValue) ? 'success' : errorMessageArray;
            },
            'money' : function(options) {
                var errorMessageArray = ['Must be a valid dollar value.'];
                return options.value == '' || options.value.match(/^\$?[1-9][0-9]{0,2}(,?[0-9]{3})*(\.[0-9]{2})?$/)  ? 'success' : errorMessageArray;
            },
            'moneyNegative' : function(options) {
                var errorMessageArray = ['Must be a valid negative dollar value.'];
                return options.value == '' || options.value.match(/^((-?\$)|(\$-?)|(-))?((\d+(\.\d{2})?)|(\.\d{2}))$/) && RegExp.$5 < 0  ? 'success' : errorMessageArray;
            },
            'moneyPositive' : function(options) {
                var errorMessageArray = ['Must be a valid positive dollar value.'];
                return options.value == '' || options.value.match(/^((-?\$)|(\$-?)|(-))?((\d+(\.\d{2})?)|(\.\d{2}))$/) && RegExp.$5 > 0  ? 'success' : errorMessageArray;
            },
            'moneyZeroNegative' : function(options) {
                var errorMessageArray = ['Must be zero or a valid negative dollar value.'];
                return options.value == '' || options.value.match(/^((-?\$)|(\$-?)|(-))?((\d+(\.\d{2})?)|(\.\d{2}))$/) && RegExp.$5 <= 0  ? 'success' : errorMessageArray;
            },
            'moneyZeroPositive' : function(options) {
                var errorMessageArray = ['Must be zero or a valid positive dollar value.'];
                return options.value == '' || options.value.match(/^((-?\$)|(\$-?)|(-))?((\d+(\.\d{2})?)|(\.\d{2}))$/) && RegExp.$5 >= 0  ? 'success' : errorMessageArray;
            },
            'password': function(options) {
                var errorMessageArray = ['Must be between 4 and 32 characters.'];
                return options.value == '' || options.value.match(/^.{4,32}$/)  ? 'success' : errorMessageArray;
            },
            'phone': function(options) {
                var errorMessageArray = ['Must be a 10 digit phone number.'];
                return options.value == '' || options.value.match(/^(1[\-. ]?)?\(?[0-9]{3}\)?[\-. ]?[0-9]{3}[\-. ]?[0-9]{4}$/)  ? 'success' : errorMessageArray ;
            },
            'postalZip': function(options) {
                var errorMessageArray = ['Must be a valid United States zip code, Canadian postal code, or United Kingdom postal code.']
                return options.value == '' || this.zip(options) == 'success' || this.canadianPostal(options) == 'success' || this.ukPostal(options) == 'success' ? 'success' : errorMessageArray;
            },
            'required': function(options) {
                var errorMessageArray = ['Required.'];
                return options.value != '' ? 'success' : errorMessageArray;
            },
            'serverSide': function(options) {
                if(options.value == '') {
                    return 'success'
                }

                // options: value, url, data
                var errorMessageArray = [];

                options.component.addClass('jFormComponentServerSideCheck');
                $.ajax({
                    url: options.url,
                    type: 'post',
                    data:{
                        'task': options.task,
                        'value': options.value
                    },
                    dataType: 'json' ,
                    cache: false,
                    async: false,
                    success: function(json) {
                        if(json.status != 'success') {
                            errorMessageArray = json.response;
                        }

                        options.component.removeClass('jFormComponentServerSideCheck');
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        if(textStatus != 'error'){
                            errorThrown = textStatus ? textStatus : 'Unknown error';
                        }
                        errorMessageArray = ['There was an error during server side validation: '+ errorThrown];
                        options.component.removeClass('jFormComponentServerSideCheck');
                    }
                });

                return errorMessageArray.length < 1 ? 'success' : errorMessageArray;
            },
            'ssn': function(options) {
                var errorMessageArray = ['Must be a valid United States social security number.'];
                return options.value == '' || options.value.match(/^\d{3}-?\d{2}-?\d{4}$/i)  ? 'success' : errorMessageArray;
            },
            'teenager': function(options) {
                var errorMessageArray = ['Must be at least 13 years old.'];
                var birthday = new Date(options.value);
                var now = new Date();
                var limit = new Date(now.getFullYear() - 13 , now.getMonth(), now.getDate());
                var timeDifference = (limit - birthday);
                return options.value == '' || timeDifference >= 0  ? 'success' : errorMessageArray;
            },
            'time': function(options) {
                var errorMessageArray = ['Must be a time in the hh:mm:ss tt format. ss and tt are optional.'];
                return options.value == '' || options.value.match(/^[0-2]?\d:[0-5]\d(:[0-5]\d)?( ?(a|p)m)?$/i)  ? 'success' : errorMessageArray;
            },
            'ukPostal' : function(options) {
                var errorMessageArray = ['Must be a valid United Kingdom postal code.'];
                return options.value == '' || options.value.match(/^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][ABD-HJLNP-UW-Z]{2}$/)  ? 'success' : errorMessageArray;
            },
            'url': function(options) {
                var errorMessageArray = ['Must be a valid Internet address.'];
                return options.value == '' || options.value.match(/^((ht|f)tp(s)?:\/\/|www\.)?([\-A-Z0-9.]+)(\.[a-zA-Z]{2,4})(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?$/i)  ? 'success' : errorMessageArray;
            },
            'username': function(options) {
                var errorMessageArray = ['Must use 4 to 32 characters and start with a letter.'];
                return options.value == '' || options.value.match(/^[A-Za-z](?=[A-Za-z0-9_.]{3,31}$)[a-zA-Z0-9_]*\.?[a-zA-Z0-9_]*$/)  ? 'success' : errorMessageArray;
            },
            'zip': function(options) {
                var errorMessageArray = ['Must be a valid United States zip code.'];
                return options.value == '' || options.value.match(/^[0-9]{5}(?:-[0-9]{4})?$/)  ? 'success' : errorMessageArray;
            }
        }
    },

    addMask: function(){
        this.component.find('input').mask("?"+this.options.mask, {
            placeholder:' '
        });
    },

    addPasswordStrength: function(){
        var self = this,
        component = this.component;

        var strengthComponent = "<p id='"+this.id+"-strength' > Strength: <b> " + this.getPasswordStrength().strength + " </b> </p>";
        component.find('div.jFormComponentTip').append(strengthComponent);
        component.find('input:password').bind('keyup', function(event){
            component.find('#'+self.id+'-strength b').text(self.getPasswordStrength().strength);
            self.tip.update(component.find('div.jFormComponentTip').html());
        });
    },

    getPasswordStrength: function() {
        var value = this.getValue(),
        score = 0,
        strength = 'None';

        if(value.length >= 6) {
            score = (score + 1); // at least six characters
        }
        if(value.length >= 10) {
            score = (score + 1); // 10 characters+ bonus
        }
        if(value.match(/[a-z]/)) { // [verified] at least one lower case letter
            score = (score + 1);
        }
        if(value.match(/[A-Z]/)) { // [verified] at least one upper case letter
            score = (score + 1);
        }
        if(value.match(/\d+/)) { // [verified] at least one number
            score = (score + 1);
        }
        if(value.match(/(\d.*\d)/)) { // [verified] at least two numbers
            score = (score + 1);
        }
        if(value.match(/[!,@#$%\^&*?_~]/)) { // [verified] at least one special character
            score = (score + 1);
        }
        if(value.match(/([!,@#$%\^&*?_~].*[!,@#$%\^&*?_~])/)) { // [verified] at least two special characters
            score = (score + 1);
        }
        if(value.match(/[a-z]/) && value.match(/[A-Z]/)) { // [verified] both upper and lower case
            score = (score + 1);
        }
        if(value.match(/\d/) && value.match(/\D/)) { // [verified] both letters and numbers
            score = (score + 1);
        }
        if(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/\d/) && value.match(/[!,@#$%\^&*?_~]/)) {
            score = (score + 1);
        }

        if(score === 0) {
            strength = 'None';
        }
        else if(score <= 1) {
            strength = 'Very Weak';
        }
        else if(score <= 3) {
            strength = 'Weak';
        }
        else if(score <= 5) {
            strength = 'Good';
        }
        else if(score <= 7) {
            strength = 'Strong';
        }
        else if(score > 7) {
            strength = 'Very Strong';
        }

        return {
            'score': score,
            'strength': strength
        };
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
            return null;
        }
        var input = $('#'+this.id).val();

        // Handle empty values
        if(this.options.emptyValue){
            if(input == this.options.emptyValue) {
                return '';
            }
            else {
                return input;
            }
        }
        else {
            return input;
        }
    },

    setValue: function(value) {
        $('#'+this.id).val(value).removeClass('defaultValue');
        this.validate(true);
    },

    addEmptyValue: function() {
        var emptyValue = this.options.emptyValue,
        input = this.component.find('input');
        input.addClass('defaultValue');
        input.val(emptyValue);

        var target ='';
        input.focus(function(event){
            target = $(event.target);
            if ($.trim(target.val()) == emptyValue ){
                target.val('');
                target.removeClass('defaultValue');
            }
        });
        input.blur(function(event){
            target = $(event.target);
            if ($.trim(target.val()) == '' ){
                target.addClass('defaultValue');
                target.val(emptyValue);
            }
        });
    }
});

JFormComponentTextArea = JFormComponent.extend({
    init: function(parentJFormSection, jFormComponentId, jFormComponentType, options) {
        this._super(parentJFormSection, jFormComponentId, jFormComponentType, options);
        
        if(this.options.allowTabbing) {
            this.allowTabbing();
        }
        if(this.options.emptyValue) {
            this.addEmptyValue();
        }
        if(this.options.autoGrow) {
            this.addAutoGrow();
        }
    },

    initialize: function() {
        this.tipTarget = this.component.find('textarea');
        if(this.options.emptyValue) {
            this.addEmptyValue();
        }
    },

    allowTabbing: function() {
        this.component.find('textarea').bind('keydown', function(event) {
            if(event != null) {
                if(event.keyCode == 9) {  // tab character
                    if(this.setSelectionRange) {
                        var sS = this.selectionStart;
                        var sE = this.selectionEnd;
                        this.value = this.value.substring(0, sS) + "\t" + this.value.substr(sE);
                        this.setSelectionRange(sS + 1, sS + 1);
                        this.focus();
                    }
                    else if (this.createTextRange) {
                        document.selection.createRange().text = "\t";
                        event.returnValue = false;
                    }
                    if(event.preventDefault) {
                        event.preventDefault();
                    }
                    return false;
                }
            }
        });
    },

    addEmptyValue: function() {
        var emptyValue = this.options.emptyValue,
        textArea = this.component.find('textarea');
        textArea.addClass('defaultValue');
        textArea.val(emptyValue);

        var target ='';
        textArea.focus(function(event){
            target = $(event.target);
            if ($.trim(target.val()) == emptyValue ){
                target.val('');
                target.removeClass('defaultValue');
            }
        });
        textArea.blur(function(event){
            target = $(event.target);
            if ($.trim(target.val()) == '' ){
                target.addClass('defaultValue');
                target.val(emptyValue);
            }
        });
    },

    addAutoGrow: function() {
        var self = this,
        textArea = this.component.find('textarea'),
        minHeight = textArea.height(),
        lineHeight = textArea.css('lineHeight');

        var shadow = $('<div></div>').css({
            position: 'absolute',
            top: -10000,
            left: -10000,
            width: textArea.width() - parseInt(textArea.css('paddingLeft')) - parseInt(textArea.css('paddingRight')),
            fontSize: textArea.css('fontSize'),
            fontFamily: textArea.css('fontFamily'),
            lineHeight: textArea.css('lineHeight'),
            resize: 'none'
        }).appendTo(document.body);
            
        var update = function() {
            var times = function(string, number) {
                for (var i = 0, r = ''; i < number; i ++) r += string;
                return r;
            };

            var val = textArea.val().replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/&/g, '&amp;')
            .replace(/\n$/, '<br/>&nbsp;')
            .replace(/\n/g, '<br/>')
            .replace(/ {2,}/g, function(space) {
                return times('&nbsp;', space.length -1) + ' '
            });

            shadow.html(val);
            textArea.css('height', Math.max(shadow.height() + 20, minHeight));

            if(self.parentJFormSection.parentJFormPage.jFormer.currentJFormPage) {
                self.parentJFormSection.parentJFormPage.jFormer.adjustHeight({delay:0});
            }
        }

        $(textArea).change(update).keyup(update).keydown(update);
        update.apply(textArea);

        return this;
    },

    getValue: function() {
        if(this.disabledByDependency || this.parentJFormSection.disabledByDependency){
            return null;
        }

        var input = $('#'+this.id).val();

        // Handle empty values
        if(this.options.emptyValue){
            if(input == this.options.emptyValue) {
                return '';
            }
            else {
                return input;
            }
        }
        else {
            return input;
        }
    },

    setValue: function(value) {
        $('#'+this.id).val(value);
        this.validate(true);
    }

});