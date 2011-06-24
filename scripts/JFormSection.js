/**
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
});