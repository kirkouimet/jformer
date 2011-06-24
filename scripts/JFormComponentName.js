JFormComponentName = JFormComponent.extend({
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
});