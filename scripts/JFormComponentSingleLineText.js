JFormComponentSingleLineText = JFormComponent.extend({
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
                return options.value == '' || options.value.match(/^[A-Z0-9._%-\+]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i)  ? 'success' : errorMessageArray;
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
