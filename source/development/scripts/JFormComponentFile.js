JFormComponentFile = JFormComponent.extend({
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
});