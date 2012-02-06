JFormComponentDate = JFormComponent.extend({
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
                var errorMessageArray = ['You must be at least 13 years old to use this site.'],
                var birthday = new Date(options.value.year, options.value.month, options.value.day);
                var now = new Date();
                var limit = new Date(now.getFullYear() - 13 , now.getMonth(), now.getDate());
                var timeDifference = (limit - birthday);
                return options.value == '' || timeDifference >= 0  ? 'success' : errorMessageArray;
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