<?php

/**
 * A FormSection object contains FormComponent objects and belongs to a FormPage object
 */
class JFormSection {

    // General settings
    var $id;
    var $class = 'jFormSection';
    var $style = '';
    var $parentJFormPage;
    var $jFormComponentArray = array();
    var $data;
    var $anonymous = false;

    // Title, description, submit instructions
    var $title = '';
    var $titleClass = 'jFormSectionTitle';
    var $description = '';
    var $descriptionClass = 'jFormSectionDescription';

    // Options
    var $instanceOptions = null;
    var $dependencyOptions = null;

    // Validation
    var $errorMessageArray = array();

    /*
     * Constructor
     */
    function __construct($id, $optionArray = array(), $jFormComponentArray = array()) {
        // Set the id
        $this->id = $id;
     
        // Use the options hash to update object variables
        if(is_array($optionArray)) {
            foreach($optionArray as $option => $value) {
                $this->{$option} = $value;
            }
        }

        // Add the components from the constructor
        $this->addJFormComponentArray($jFormComponentArray);

        return $this;
    }

    function addJFormComponent($jFormComponent) {
        $jFormComponent->parentJFormSection = $this;
        $this->jFormComponentArray[$jFormComponent->id] = $jFormComponent;

        return $this;
    }

    function addJFormComponents($jFormComponents) {
        if (is_array($jFormComponents)) {
            foreach ($jFormComponentArray as $jFormComponent) {
                $jFormComponent->parentJFormSection = $this;
                $this->addJFormComponent($jFormComponent);
            }
        } else {
            $jFormComponent->parentJFormSection = $this;
            $this->jFormComponentArray[$jFormComponent->id] = $jFormComponent;
        }
        return $this;
    }

    function addJFormComponentArray($jFormComponentArray) {
        foreach($jFormComponentArray as $jFormComponent) {
            $this->addJFormComponent($jFormComponent);
        }
        return $this;
    }

    function getData() {
        $this->data = array();

        // Check to see if jFormComponent array contains instances
        if(array_key_exists(0, $this->jFormComponentArray) && is_array($this->jFormComponentArray[0])) {
            foreach($this->jFormComponentArray as $jFormComponentArrayInstanceIndex => $jFormComponentArrayInstance) {
                foreach($jFormComponentArrayInstance as $jFormComponentKey => $jFormComponent) {
                    if(get_class($jFormComponent) != 'JFormComponentHtml') { // Don't include HTML components
                        $this->data[$jFormComponentArrayInstanceIndex][$jFormComponentKey] = $jFormComponent->getValue();
                    }
                }
            }
        }
        // If the section does not have instances
        else {
            foreach($this->jFormComponentArray as $jFormComponentKey => $jFormComponent) {
                if(get_class($jFormComponent) != 'JFormComponentHtml') { // Don't include HTML components
                    $this->data[$jFormComponentKey] = $jFormComponent->getValue();
                }
            }
        }

        return $this->data;
    }

    function setData($jFormSectionData) {
        // Handle multiple instances
        if(is_array($jFormSectionData)) {
            $newJFormComponentArray = array();
            
            // Go through each section instance
            foreach($jFormSectionData as $jFormSectionIndex => $jFormSection) {
                // Create a clone of the jFormComponentArray
                $newJFormComponentArray[$jFormSectionIndex] = unserialize(serialize($this->jFormComponentArray));

                // Go through each component in the instanced section
                foreach($jFormSection as $jFormComponentKey => $jFormComponentValue) {
                    // Set the value of the clone
                    $newJFormComponentArray[$jFormSectionIndex][$jFormComponentKey]->setValue($jFormComponentValue);
                }
            }
            $this->jFormComponentArray = $newJFormComponentArray;
        }
        // Single instance
        else {
            // Go through each component
            foreach($jFormSectionData as $jFormComponentKey => $jFormComponentValue) {
                $this->jFormComponentArray[$jFormComponentKey]->setValue($jFormComponentValue);
            }
        }
    }

    function clearData() {
        // Check to see if jFormComponent array contains instances
        if(array_key_exists(0, $this->jFormComponentArray) && is_array($this->jFormComponentArray[0])) {
            foreach($this->jFormComponentArray as $jFormComponentArrayInstanceIndex => $jFormComponentArrayInstance) {
                foreach($jFormComponentArrayInstance as $jFormComponentKey => $jFormComponent) {
                    $jFormComponent->clearValue();
                }
            }
        }
        // If the section does not have instances
        else {
            foreach($this->jFormComponentArray as $jFormComponent) {
                $jFormComponent->clearValue();
            }
        }
        $this->data = null;
    }

    function validate() {
        // Clear the error message array
        $this->errorMessageArray = array();

        // If we have instances, return an array
        if(array_key_exists(0, $this->jFormComponentArray) && is_array($this->jFormComponentArray[0])) {
            foreach($this->jFormComponentArray as $jFormComponentArrayInstanceIndex => $jFormComponentArrayInstance) {
                foreach($jFormComponentArrayInstance as $jFormComponentKey => $jFormComponent) {
                    $this->errorMessageArray[$jFormComponentArrayInstanceIndex][$jFormComponent->id] = $jFormComponent->validate();
                }
            }
        }
        // If the section does not have instances, return an single dimension array
        else {
            foreach($this->jFormComponentArray as $jFormComponent) {
                $this->errorMessageArray[$jFormComponent->id] = $jFormComponent->validate();
            }
        }

        return $this->errorMessageArray;
    }

    function getOptions() {
        $options = array();
        $options['options'] = array();
        $options['jFormComponents'] = array();
        
        // Instances
        if(!empty($this->instanceOptions)) {
            $options['options']['instanceOptions'] = $this->instanceOptions;
            if(!isset($options['options']['instanceOptions']['addButtonText'])) {
                $options['options']['instanceOptions']['addButtonText'] = 'Add Another';
            }
            if(!isset($options['options']['instanceOptions']['removeButtonText'])) {
                $options['options']['instanceOptions']['removeButtonText'] = 'Remove';
            }
        }

        // Dependencies
        if(!empty($this->dependencyOptions)) {
            // Make sure the dependentOn key is tied to an array
            if(isset($this->dependencyOptions['dependentOn']) && !is_array($this->dependencyOptions['dependentOn'])) {
                $this->dependencyOptions['dependentOn'] = array($this->dependencyOptions['dependentOn']);
            }
            $options['options']['dependencyOptions'] = $this->dependencyOptions;
        }

        // Get options for each of the jFormComponents
        foreach($this->jFormComponentArray as $jFormComponent) {
            // Don't get options for JFormComponentHtml objects
            if(get_class($jFormComponent) != 'JFormComponentHtml') {
                $options['jFormComponents'][$jFormComponent->id] = $jFormComponent->getOptions();
            }
        }

        if(empty($options['options'])) {
            unset($options['options']);
        }

        return $options;
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Section fieldset
        $jFormSectionDiv = new JFormElement('div', array(
            'id' => $this->id,
            'class' => $this->class
        ));

        // This causes issues with things that are dependent and should display by default
        // If the section has dependencies and the display type is hidden, hide by default
        //if($this->dependencyOptions !== null && isset($this->dependencyOptions['display']) && $this->dependencyOptions['display'] == 'hide') {
        //    $jFormSectionDiv->setAttribute('style', 'display: none;');
        //}

        // Set the style
        if(!empty($this->style)) {
            $jFormSectionDiv->addToAttribute('style', $this->style);
        }

        // Add a title to the page
        if(!empty($this->title)) {
            $title = new JFormElement('div', array(
                'class' => $this->titleClass
            ));
            $title->update($this->title);
            $jFormSectionDiv->insert($title);
        }

        // Add a description to the page
        if(!empty($this->description)) {
            $description = new JFormElement('div', array(
                'class' => $this->descriptionClass
            ));
            $description->update($this->description);
            $jFormSectionDiv->insert($description);
        }

        // Add the form sections to the page
        foreach($this->jFormComponentArray as $jFormComponentArray) {
            $jFormSectionDiv->insert($jFormComponentArray);
        }
        
        return $jFormSectionDiv->__toString();
    }
}
?>