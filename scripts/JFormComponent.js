/**
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
        if(this.tip !== null){

        }
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