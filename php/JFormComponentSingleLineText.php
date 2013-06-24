<?php

class JFormComponentSingleLineText extends JFormComponent {
    var $sublabel;

    /*
     * Constructor
     */
    function __construct($id, $label, $optionArray = array()) {
        // Class variables
        $this->id = $id;
        $this->name = $this->id;
        $this->label = $label;
        $this->class = 'jFormComponentSingleLineText';
        $this->widthArray = array('shortest' => '2em', 'short' => '6em', 'mediumShort' => '9em', 'medium' => '12em', 'mediumLong' => '15em', 'long' => '18em', 'longest' => '24em');

        // Input options
        $this->initialValue = '';
        $this->type = 'text'; // text, password, hidden
        $this->disabled = false;
        $this->readOnly = false;
        $this->maxLength = '';
        $this->width = '';
        $this->mask = '';
        $this->emptyValue = '';

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);
    }

    function hasInstanceValues() {
        return is_array($this->value);
    }

    function getOptions() {
        $options = parent::getOptions();

        // Make sure you have an options array to manipulate
        if(!isset($options['options'])) {
            $options['options']  = array();
        }

        // Mask
        if(!empty($this->mask)) {
            $options['options']['mask'] = $this->mask;
        }

        // Empty value
        if(!empty($this->emptyValue)) {
            $options['options']['emptyValue'] = $this->emptyValue;
        }

        // Clear the options key if there is nothing in it
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
        $div = $this->generateComponentDiv();

        // Add the input tag
        $input = new JFormElement('input', array(
            'type' => $this->type,
            'id' => $this->id,
            'name' => $this->name,
        ));
        if(!empty($this->width)) {
            if(array_key_exists($this->width, $this->widthArray)) {
                $input->setAttribute('style', 'width: '.$this->widthArray[$this->width].';');
            }
            else {
                $input->setAttribute('style', 'width: '.$this->width.';');
            }
        }
        if(isset($this->initialValue)) {
            $input->setAttribute('value', $this->initialValue);
        }
        if(!empty($this->maxLength)) {
            $input->setAttribute('maxlength', $this->maxLength);
        }
        if(!empty($this->mask)){
            $this->formComponentMeta['options']['mask']= $this->mask;
        }
        if($this->disabled) {
            $input->setAttribute('disabled', 'disabled');
        }
        if($this->readOnly) {
            $input->setAttribute('readonly', 'readonly');
        }
        if($this->enterSubmits) {
            $input->addToAttribute('class', ' jFormComponentEnterSubmits');
        }
        $div->insert($input);

        if(!empty($this->sublabel)) {
            $div->insert('<div class="jFormComponentSublabel">'.$this->sublabel.'</div>');
        }

        // Add any description (optional)
        $div = $this->insertComponentDescription($div);

        // Add a tip (optional)
        $div = $this->insertComponentTip($div);

        return $div->__toString();
    }

    // Validations

    public function alpha($options) {
        $messageArray = array('Must only contain letters.');
        return preg_match('/^[a-z_\s]+$/i', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function alphaDecimal($options) {
        $messageArray = array('Must only contain letters, numbers, or periods.');
        return preg_match('/^\w+$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function alphaNumeric($options) {
        $messageArray = array('Must only contain letters or numbers.');
        return preg_match('/^[a-z0-9_\s]+$/i', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }
    
    public function blank($options) {
        $messageArray = array('Must be blank.');
        return strlen(trim($options['value'])) == 0 ? 'success' : $messageArray;
    }
    
    public function canadianPostal($options) {
        $messageArray = array('Must be a valid Canadian postal code.');
        return preg_match('/^[ABCEGHJKLMNPRSTVXY][0-9][A-Z] [0-9][A-Z][0-9]$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }
    
    public function custom_regexp() {
        $messageArray = array($options['custom_regexp']['custom_message']);
        return preg_match ($options['custom_regexp']['regexp'], $options['value']) ? 'success' : $messageArray;
    }
    
    public function date($options) {
        $messageArray = array('Must be a date in the mm/dd/yyyy format.');
        return preg_match('/^(0?[1-9]|1[012])[\- \/.](0?[1-9]|[12][0-9]|3[01])[\- \/.](19|20)[0-9]{2}$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }
    
    public function dateTime($options) {
        $messageArray = array('Must be a date in the mm/dd/yyyy hh:mm:ss tt format. ss and tt are optional.');
        return preg_match('/^(0?[1-9]|1[012])[\- \/.](0?[1-9]|[12][0-9]|3[01])[\- \/.](19|20)?[0-9]{2} [0-2]?\d:[0-5]\d(:[0-5]\d)?( ?(a|p)m)?$/i', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }
    
    public function decimal($options) {
        // Can be negative and have a decimal value
        // Do not accept commas in value as the DB does not accept them
        $messageArray = array('Must be a number without any commas. Decimal is optional.');
        return preg_match('/^-?((\d+(\.\d+)?)|(\.\d+))$/', $options['value']) ? 'success' : $messageArray;
    }
    
    public function decimalNegative($options) {
        // Must be negative and have a decimal value
        $messageArray = array('Must be a negative number without any commas. Decimal is optional.');
        //isDecimal = self.validations.decimal($options);
        return ($isDecimal == 'success' && (floatval($options['value']) < 0)) ? 'success' : $messageArray;
    }
    
    public function decimalPositive($options) {
        // Must be positive and have a decimal value
        $messageArray = array('Must be a positive number without any commas. Decimal is optional.');
        //isDecimal = self.validations.decimal($options);
        return ($isDecimal == 'success' && (floatval($options['value']) > 0)) ? 'success' : $messageArray;
    }
       
    public function decimalZeroNegative($options) {
        // Must be negative and have a decimal value
        $messageArray = array('Must be zero or a negative number without any commas. Decimal is optional.');
        //isDecimal = self.validations.decimal($options);
        return ($isDecimal == 'success' && (floatval($options['value']) <= 0)) ? 'success' : $messageArray;
    }
    
    public function decimalZeroPositive($options) {
        // Must be positive and have a decimal value
        $messageArray = array('Must be zero or a positive number without any commas. Decimal is optional.');
        //isDecimal = self.validations.decimal($options);
        return ($isDecimal == 'success' && (floatval($options['value']) >= 0)) ? 'success' : $messageArray;
    }
    
    public function email($options) {
        $messageArray = array('Must be a valid e-mail address.');
        return preg_match('/^[A-Z0-9._%-\+]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function integer($options) {
        $messageArray = array('Must be a whole number.');
        return preg_match('/^-?\d+$/', $options['value']) ? 'success' : $messageArray;
    }

    public function integerNegative($options) {
        $messageArray = array('Must be a negative whole number.');
        //isInteger = preg_match('/^-?\d+$/', $options['value']);
        return ($isInteger && (intval($options['value'], 10) < 0)) ? 'success' : $messageArray;
    }

    public function integerPositive($options) {
        $messageArray = array('Must be a positive whole number.');
        //isInteger = preg_match('/^-?\d+$/', $options['value']);
        return ($isInteger && (intval($options['value'], 10) > 0)) ? 'success' : $messageArray;
    }

    public function integerZeroNegative($options) {
        $messageArray = array('Must be zero or a negative whole number.');
        //isInteger = preg_match('/^-?\d+$/', $options['value']);
        return ($isInteger && (intval($options['value'], 10) <= 0)) ? 'success' : $messageArray;
    }

    public function integerZeroPositive($options) {
        $messageArray = array('Must be zero or a positive whole number.');
        //isInteger = preg_match('/^-?\d+$/', $options['value']);
        return ($isInteger && (intval($options['value'], 10) >= 0)) ? 'success' : $messageArray;
    }

    public function isbn($options) {
        //Match an ISBN
        $errorMessageArray = array('Must be a valid ISBN and consist of either ten or thirteen characters.');
        //For ISBN-10
        if(preg_match('/^(?=.{13}$)\d{1,5}([\- ])\d{1,7}\1\d{1,6}\1(\d|X)$/', $options['value'])) {
            $errorMessageArray = 'sucess';
        }
        if(preg_match('/^\d{9}(\d|X)$/', $options['value'])) {
            $errorMessageArray = 'sucess';
        }
        //For ISBN-13
        if(preg_match('/^(?=.{17}$)\d{3}([\- ])\d{1,5}\1\d{1,7}\1\d{1,6}\1(\d|X)$/' , $options['value'])) {
            $errorMessageArray = 'sucess';
        }
        if(preg_match('/^\d{3}[\- ]\d{9}(\d|X)$/', $options['value'])) {
            $errorMessageArray = 'sucess';
        }
        //ISBN-13 without starting delimiter (Not a valid ISBN but less strict validation was requested)
        if(preg_match('/^\d{12}(\d|X)$/', $options['value'])) {
            $errorMessageArray = 'sucess';
        }
        return $errorMessageArray;
    }

    public function length($options) {
        $messageArray = array('Must be exactly ' . $options['length'] .' characters long. Current value is '.strlen($options['value']).' characters.');
        return strlen($options['value']) == $options['length'] || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function matches($options) {
        $componentToMatch = $this->parentJFormSection->parentJFormPage->jFormer->select($options['matches']);
        if($componentToMatch && $componentToMatch->value == $options['value']) {
            return 'success';
        }
        else {
            return array('Does not match.');
        }
    }

    public function maxLength($options) {
        $messageArray = array('Must be less than ' . $options['maxLength'] . ' characters long. Current value is '.strlen($options['value']).' characters.');
        return strlen($options['value']) <= $options['maxLength'] || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function maxFloat($options) {
        $messageArray = array('Must be numeric and cannot have more than ' . $options['maxFloat'] . ' decimal place(s).');
        return preg_match('^-?((\\d+(\\.\\d{0,'+ $options['maxFloat'] +'})?)|(\\.\\d{0,' . $options['maxFloat'] . '}))$', $options['value'])  ? 'success' : $messageArray;
    }

    public function maxValue($options) {
        $messageArray = array('Must be numeric with a maximum value of ' . $options['maxValue'] . '.');
        return $options['maxValue'] >= $options['value'] ? 'success' : $messageArray;
    }

    public function minLength($options) {
        $messageArray = array('Must be at least ' . $options['minLength'] . ' characters long. Current value is '.strlen($options['value']).' characters.');
        return strlen($options['value']) >= $options['minLength'] || $options['value'] == '' ? 'success' : $messageArray;
    }
    
    public function minValue($options) {
        $messageArray = array('Must be numeric with a minimum value of ' . $options['minValue'] . '.');
        return $options['minValue'] <= $options['value'] ? 'success' : $messageArray;
    }

    public function money($options) {
        $messageArray = array('Must be a valid dollar value.');
        return preg_match('/^\$?[1-9][0-9]{0,2}(,?[0-9]{3})*(\.[0-9]{2})?$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function moneyNegative($options) {
        $messageArray = array('Must be a valid negative dollar value.');
        return preg_match('/^((-?\$)|(\$-?)|(-))?((\d+(\.\d{2})?)|(\.\d{2}))$/', $options['value'], $matches) && $matches[0] < 0 || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function moneyPositive($options) {
        $messageArray = array('Must be a valid positive dollar value.');
        return preg_match('/^((-?\$)|(\$-?)|(-))?((\d+(\.\d{2})?)|(\.\d{2}))$/', $options['value'], $matches) && $matches[0] > 0 || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function moneyZeroNegative($options) {
        $messageArray = array('Must be zero or a valid negative dollar value.');
        return preg_match('/^((-?\$)|(\$-?)|(-))?((\d+(\.\d{2})?)|(\.\d{2}))$/', $options['value'], $matches) && $matches[0] <= 0 ? 'success' : $messageArray;
    }

    public function moneyZeroPositive($options) {
        $messageArray = array('Must be zero or a valid positive dollar value.');
        return preg_match('/^((-?\$)|(\$-?)|(-))?((\d+(\.\d{2})?)|(\.\d{2}))$/', $options['value'], $matches) && $matches[0]= 0 || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function password($options) {
        $messageArray = array('Must be between 4 and 32 characters.');
        return preg_match('/^.{4,32}$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function phone($options) {
        //$messageArray = array('Must be a 10 digit phone number.');
        //return preg_match('/^(1[\-. ]?)?\(?[0-9]{3}\)?[\-. ]?[0-9]{3}[\-. ]?[0-9]{4}$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray ;
        $messageArray = array('Must be a US or International Phone Number');
        return preg_match('/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function postalZip($options) {
        $messageArray = array('Must be a valid United States zip code, Canadian postal code, or United Kingdom postal code.');
        $postal = false;
        if(this.zip($options) == 'success') {
            $postal = true;
        }
        if(this.canadianPostal($options) == 'success') {
            $postal = true;
        }
        if(this.ukPostal($options) == 'success') {
            $postal = true;
        }
        return postal ? 'success' : $messageArray;
    }
    
    public function required($options) {
        $messageArray = array('Required.');
        //return empty($options['value']) ? 'success' : $messageArray; // Break validation on purpose
        return !empty($options['value']) || $options['value'] == '0' ? 'success' : $messageArray;
    }

    public function serverSide($options) {
        // Handle empty values
        if(empty($options['value'])) {
            return 'success';
        }

        $messageArray = array();

        // Perform the server side check with a scrape
        $serverSideResponse = getUrlContent($options['url'].'&value='.$options['value']);

        // Can't read the URL
        if($serverSideResponse['status'] != 'success') {
            $messageArray[] = 'This component could not be validated.';
        }
        // Read the URL
        else {
            $serverSideResponse = json_decode($serverSideResponse['response']);
            if($serverSideResponse->status == 'success') {
                $messageArray == 'success';
            }
            else {
                $messageArray = $serverSideResponse->response;
            }
        }

        return $messageArray;

        function getUrlContent($url, $postData = null) {
            // Handle objects and arrays
            $curlHandler = curl_init();
            curl_setopt($curlHandler, CURLOPT_URL, $url);
            curl_setopt($curlHandler, CURLOPT_FAILONERROR, 1);
            curl_setopt($curlHandler, CURLOPT_TIMEOUT, 20); // Time out in seconds
            curl_setopt($curlHandler, CURLOPT_RETURNTRANSFER, 1);
            if ($postData != null) {
                foreach ($postData as $key => &$value) {
                    if (is_object($value) || is_array($value)) {
                        $value = json_encode($value);
                    }
                }
                curl_setopt($curlHandler, CURLOPT_POSTFIELDS, $postData);
            }
            $request = curl_exec($curlHandler);

            if (!$request) {
                $response = array('status' => 'failure', 'response' => 'CURL error ' . curl_errno($curlHandler) . ': ' . curl_error($curlHandler));
            } else {
                $response = array('status' => 'success', 'response' => $request);
            }

            return $response;
        }
    }

    public function ssn($options) {
        $messageArray = array('Must be a valid United States social security number.');
        return preg_match('/^\d{3}-?\d{2}-?\d{4}$/i', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function teenager($options) {
        $messageArray = array('Must be at least 13 years old.');
        if($this->date($options) == 'success') {
            $oldEnough = strtotime($options['value']) - strtotime('-13 years');
        }
        else {
            return false;
        }
        return $oldEnough >= 0  ? 'success' : $messageArray;
    }

    public function time($options) {
        $messageArray = array('Must be a time in the hh:mm:ss tt format. ss and tt are optional.');
        return preg_match('/^[0-2]?\d:[0-5]\d(:[0-5]\d)?( ?(a|p)m)?$/i', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function ukPostal($options) {
        $messageArray = array('Must be a valid United Kingdom postal code.');
        return preg_match('/^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][ABD-HJLNP-UW-Z]{2}$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function url($options) {
        $messageArray = array('Must be a valid Internet address.');
        return preg_match('/^((ht|f)tp(s)?:\/\/|www\.)?([\-A-Z0-9.]+)(\.[a-zA-Z]{2,4})(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?$/i', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function username($options) {
        $messageArray = array('Must use 4 to 32 characters and start with a letter.');
        return preg_match('/^[A-Za-z](?=[A-Za-z0-9_.]{3,31}$)[a-zA-Z0-9_]*\.?[a-zA-Z0-9_]*$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

    public function zip($options) {
        $messageArray = array('Must be a valid United States zip code.');
        return preg_match('/^[0-9]{5}(?:-[0-9]{4})?$/', $options['value']) || $options['value'] == '' ? 'success' : $messageArray;
    }

}
?>
