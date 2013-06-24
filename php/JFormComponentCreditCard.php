<?php

class JFormComponentCreditCard extends JFormComponent {
    var $emptyValues = null; // cardNumber, securityCode
    var $showSublabels = true;
    var $showCardType = true;
    var $showSecurityCode = true;
    var $creditCardProviders = array('visa' => 'Visa', 'masterCard' => 'MasterCard', 'americanExpress' => 'American Express', 'discover' => 'Discover');
    var $showMonthName = true;
    var $showLongYear = true;

    /*
     * Constructor
     */
    function __construct($id, $label, $optionArray = array()) {
        // Class variables
        $this->id = $id;
        $this->name = $this->id;
        $this->label = $label;
        $this->class = 'jFormComponentCreditCard';
        
        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);

        // Set the empty values with a boolean
        if($this->emptyValues === true) {
            $this->emptyValues = array('cardNumber' => 'Card Number', 'securityCode' => 'CSC/CVV');
        }
    }

    function getOption($optionValue, $optionLabel, $optionSelected, $optionDisabled) {
        $option = new JFormElement('option', array('value' => $optionValue));
        $option->update($optionLabel);

        if($optionSelected) {
            $option->setAttribute('selected', 'selected');
        }

        if($optionDisabled) {
            $option->setAttribute('disabled', 'disabled');
        }

        return $option;
    }

    function getOptions() {
        $options = parent::getOptions();

        if(!empty($this->emptyValues)) {
            $options['options']['emptyValues'] = $this->emptyValues;
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
        // Generate the component div
        $componentDiv = $this->generateComponentDiv();

         // Add the card type select tag
        if($this->showCardType) {
            $cardTypeDiv = new JFormElement('div', array(
                'class' => 'cardTypeDiv',
            ));
            $cardType = new JFormElement('select', array(
                'id' => $this->id.'-cardType',
                'name' => $this->name.'-cardType',
                'class' => 'cardType',
            ));
            // Have a default value the drop down list if there isn't a sublabel
            if($this->showSublabels == false){
                $cardType->insert($this->getOption('', 'Card Type', true, true));
            }
            // Add the card types
            foreach($this->creditCardProviders as $key => $value) {
                $cardType->insert($this->getOption($key, $value, false, false));
            }
            $cardTypeDiv->insert($cardType);
        }

        // Add the card number input tag
        $cardNumberDiv = new JFormElement('div', array(
            'class' => 'cardNumberDiv',
        ));
        $cardNumber = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-cardNumber',
            'name' => $this->name.'-cardNumber',
            'class' => 'cardNumber',
            'maxlength' => '16',
        ));
        $cardNumberDiv->insert($cardNumber);

        // Add the expiration month select tag
        $expirationDateDiv = new JFormElement('div', array(
            'class' => 'expirationDateDiv',
        ));
        $expirationMonth = new JFormElement('select', array(
            'id' => $this->id.'-expirationMonth',
            'name' => $this->name.'-expirationMonth',
            'class' => 'expirationMonth',
        ));
        // Have a default value the drop down list if there isn't a sublabel
        if($this->showSublabels == false){
            $expirationMonth->insert($this->getOption('', 'Month', true, true));
        }
        // Add the months
        foreach(JFormComponentDropDown::getMonthArray() as $dropDownOption) {
            $optionValue = isset($dropDownOption['value']) ? $dropDownOption['value'] : '';
            $optionLabel = isset($dropDownOption['label']) ? $dropDownOption['label'] : '';
            $optionSelected = isset($dropDownOption['selected']) ? $dropDownOption['selected'] : false;
            $optionDisabled = isset($dropDownOption['disabled']) ? $dropDownOption['disabled'] : false;
            $optionOptGroup = isset($dropDownOption['optGroup']) ? $dropDownOption['optGroup'] : '';

            if($this->showMonthName) {
                $expirationMonth->insert($this->getOption($optionValue, $optionValue.' - '.$optionLabel, $optionSelected, $optionDisabled));
                $expirationMonth->addClassName('long');
            }
            else {
                $expirationMonth->insert($this->getOption($optionValue, $optionValue, $optionSelected, $optionDisabled));
            }
        }
        $expirationDateDiv->insert($expirationMonth);
        // Add the expiration year select tag
        $expirationYear = new JFormElement('select', array(
            'id' => $this->id.'-expirationYear',
            'name' => $this->name.'-expirationYear',
            'class' => 'expirationYear',
        ));
        // Add years
        if($this->showLongYear) {
            $startYear = Date('Y');
            $expirationYear->addClassName('long');
        }
        else {
            $startYear = Date('y');
            if(!$this->showMonthName) {
                $expirationDateDiv->insert('<span class="expirationDateSeparator">/</span>');
            }
        }
        if($this->showSublabels == false){
            $expirationYear->insert($this->getOption('', 'Year', true, true));
        }
        foreach(range($startYear, $startYear+9) as $year) {
            $expirationYear->insert($this->getOption($year, $year, false, false));
        }
        $expirationDateDiv->insert($expirationYear);

        // Add the security code input tag
        $securityCodeDiv = new JFormElement('div', array(
            'class' => 'securityCodeDiv',
        ));
        $securityCode = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-securityCode',
            'name' => $this->name.'-securityCode',
            'class' => 'securityCode',
            'maxlength' => '4',
        ));
        $securityCodeDiv->insert($securityCode);

        // Set the empty values if they are enabled
        if(!empty($this->emptyValues)) {
            foreach($this->emptyValues as $emptyValueKey => $emptyValue) {
                if($emptyValueKey == 'cardNumber') {
                    $cardNumber->setAttribute('value', $emptyValue);
                    $cardNumber->addClassName('defaultValue');
                }
                if($emptyValueKey == 'securityCode') {
                    $securityCode->setAttribute('value', $emptyValue);
                    $securityCode->addClassName('defaultValue');
                }
            }
        }

        // Put the sublabels in if the option allows for it
        if($this->showSublabels) {
            if($this->showCardType) {
                $cardTypeDiv->insert('<div class="jFormComponentSublabel"><p>Card Type</p></div>');
            }
            $cardNumberDiv->insert('<div class="jFormComponentSublabel"><p>Card Number</p></div>');
            $expirationDateDiv->insert('<div class="jFormComponentSublabel"><p>Expiration Date</p></div>');
            if($this->showSecurityCode) {
                $securityCodeDiv->insert('<div class="jFormComponentSublabel"><p>Security Code</p></div>');
            }
        }

        // Insert the components
        if($this->showCardType) {
            $componentDiv->insert($cardTypeDiv);
        }
        $componentDiv->insert($cardNumberDiv);
        $componentDiv->insert($expirationDateDiv);
        if($this->showSecurityCode) {
            $componentDiv->insert($securityCodeDiv);
        }
        
        // Add any description (optional)
        $componentDiv = $this->insertComponentDescription($componentDiv);

        // Add a tip (optional)
        $componentDiv = $this->insertComponentTip($componentDiv);

        return $componentDiv->__toString();
    }

    // Credit card validations
    public function required($options) {
        $errorMessageArray = array();
        if($this->showCardType && empty($options['value']->cardType)) {
            array_push($errorMessageArray, array('Card type is required.'));
        }
        if(empty($options['value']->cardNumber)) {
            array_push($errorMessageArray, array('Card number is required.'));
        }
        else {
            if(preg_match('/[^\d]/', $options['value']->cardNumber)) {
                array_push($errorMessageArray, array('Card number may only contain numbers.'));
            }
            if(strlen($options['value']->cardNumber) > 16 || strlen($options['value']->cardNumber) < 13) {
                array_push($errorMessageArray, array('Card number must contain 13 to 16 digits.'));
            }
        }
        if(empty($options['value']->expirationMonth)) {
            array_push($errorMessageArray, array('Expiration month is required.'));
        }
        if(empty($options['value']->expirationYear)) {
            array_push($errorMessageArray, array('Expiration year is required.'));
        }
        if($this->showSecurityCode && empty($options['value']->securityCode)) {
            array_push($errorMessageArray, array('Security code is required.'));
        }
        else if($this->showSecurityCode) {
            if(preg_match('/[^\d]/', $options['value']->securityCode)) {
                array_push($errorMessageArray, array('Security code may only contain numbers.'));
            }
            if(strlen($options['value']->securityCode) > 4 || strlen($options['value']->securityCode) < 3) {
                array_push($errorMessageArray, array('Security code must contain 3 or 4 digits.'));
            }
        }
        return sizeof($errorMessageArray) < 1 ? 'success' : $errorMessageArray;
    }
}

?>
