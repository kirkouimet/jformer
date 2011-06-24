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
});