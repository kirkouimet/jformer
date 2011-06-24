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

});