
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