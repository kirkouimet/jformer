JFormComponentHidden = JFormComponent.extend({
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
