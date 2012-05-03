<?php

class JFormComponentTextArea extends JFormComponent {
    /*
     * Constructor
     */
    function __construct($id, $label, $optionArray = array()) {
        // Class variables
        $this->id = $id;
        $this->name = $this->id;
        $this->label = $label;
        $this->class = 'jFormComponentTextArea';
        $this->inputClass = 'textArea';
        $this->widthArray = array('shortest' => '5em', 'short' => '10em', 'medium' => '20em', 'long' => '30em', 'longest' => '40em');
        $this->heightArray = array('short' => '6em', 'medium' => '12em', 'tall' => '18em');

        // Input options
        $this->initialValue = '';
        $this->disabled = false;
        $this->readOnly = false;
        $this->wrap = ''; // hard, off
        $this->width = '';
        $this->height = '';
        $this->style = '';
        $this->allowTabbing = false;
        $this->emptyValue = '';
        $this->autoGrow = false;

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);
    }

    function hasInstanceValues() {
        return is_array($this->value);
    }

    function getOptions() {
        $options = parent::getOptions();

        // Tabbing
        if($this->allowTabbing) {
            $options['options']['allowTabbing'] = true;
        }

        // Empty value
        if(!empty($this->emptyValue)) {
            $options['options']['emptyValue'] = $this->emptyValue;
        }

        // Auto grow
        if($this->autoGrow) {
            $options['options']['autoGrow'] = $this->autoGrow;
        }

        return $options;
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Generate the component div
        $div = $this->generateComponentDiv();

        // Add the input tag
        $textArea = new JFormElement('textarea', array(
            'id' => $this->id,
            'name' => $this->name,
            'class' => $this->inputClass,
        ));
        if(!empty($this->width)) {
            if(array_key_exists($this->width, $this->widthArray)) {
                $textArea->setAttribute('style', 'width: '.$this->widthArray[$this->width].';');
            }
            else {
                $textArea->setAttribute('style', 'width: '.$this->width.';');
            }
        }
        if(!empty($this->height)) {
            if(array_key_exists($this->height, $this->heightArray)) {
                $textArea->addToAttribute('style', 'height: '.$this->heightArray[$this->height].';');
            }
            else {
                $textArea->addToAttribute('style', 'height: '.$this->height.';');
            }
        }
        if(!empty($this->style)) {
            $textArea->addToAttribute('style', $this->style);
        }
        if($this->disabled) {
            $textArea->setAttribute('disabled', 'disabled');
        }
        if($this->readOnly) {
            $textArea->setAttribute('readonly', 'readonly');
        }
        if($this->wrap) {
            $textArea->setAttribute('wrap', $this->wrap);
        }
        if(isset($this->initialValue)) {
            $textArea->update($this->initialValue);
        }
        $div->insert($textArea);

        // Add any description (optional)
        $div = $this->insertComponentDescription($div);

        // Add a tip (optional)
        $div = $this->insertComponentTip($div);

        return $div->__toString();
    }
}

?>
