<?php

class JFormComponentDate extends JFormComponentSingleLineText {
    /*
     * Constructor
     */
    function __construct($id, $label, $optionArray = array()) {
        // Class variables
        $this->id = $id;
        $this->name = $this->id;
        $this->label = $label;
        $this->class = 'jFormComponentDate';

        // Input options
        $this->initialValue = '';
        $this->type = 'text';
        $this->disabled = false;
        $this->readOnly = false;
        $this->maxLength = '';
        $this->styleWidth = '';
        $this->mask = '9?9/9?9/9999';
        $this->emptyValue = '';

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Generate the component div
        $div = parent::__toString();

        return $div;
    }

    // Date validations
    public function required($options) {
        $errorMessageArray = array();
        if($options['value']->month == '' || $options['value']->day == '' || $options['value']->year == '' || $options['value'] == null) {
            array_push($errorMessageArray, 'Required.');
            return $errorMessageArray;
        }

        $month = intval($options['value']->month);
        $day = intval($options['value']->day);
        $year = intval($options['value']->year);
        $badDay = false;
        if($options['value']->month == '' || $options['value']->day == '' || $options['value']->year == '') {
            return true;
        }

        if(!preg_match('/[\d]{4}/', $year)) {
            array_push($errorMessageArray, 'You must enter a valid year.');
        }
        if($month < 1 || $month > 12) {
            array_push($errorMessageArray, 'You must enter a valid month.');
        }
        if($month==4 || $month==6 || $month==9 || $month==11) {
            if($day > 30) {
                $badDay = true;
            }
        }
        else if ($month==2) {
            $days = (($year % 4 == 0) && ( (!($year % 100 == 0)) || ($year % 400 == 0))) ? 29 : 28;
            if($day > $days) {
                $badDay = true;
            }
        }
        if ($day > 31 || $day < 1) {
            $badDay = true;
        }
        if($badDay) {
            array_push($errorMessageArray, 'You must enter a valid day.');
        }

        return sizeof($errorMessageArray) < 1 ? 'success' : $errorMessageArray;
    }
    public function minDate($options) {
        $errorMessageArray = array();
        $month = intval($options['value']->month);
        $day = intval($options['value']->day);
        $year = intval($options['value']->year);
        $error = false;
        if(!empty($year) && !empty($month) && !empty($day)) {
            if(strtotime($year.'-'.$month.'-'.$day) < strtotime($options['minDate'])) {
                $error = true;
            }
        }
        // If they did not provide a date, validate true
        else {
            return 'success';
        }

        if($error) {
            array_push($errorMessageArray, 'Date must be on or after '.date('F j, Y', strtotime($options['minDate'])).'.');
        }

        return sizeof($errorMessageArray) < 1 ? 'success' : $errorMessageArray;
    }
    public function maxDate($options) {
        $errorMessageArray = array();
        $month = intval($options['value']->month);
        $day = intval($options['value']->day);
        $year = intval($options['value']->year);
        $error = false;
        if(!empty($year) && !empty($month) && !empty($day)) {
            if(strtotime($year.'-'.$month.'-'.$day) > strtotime($options['maxDate'])) {
                $error = true;
            }
        }
        // If they did not provide a date, validate true
        else {
            return 'success';
        }

        if($error) {
            array_push($errorMessageArray, 'Date must be on or before '.date('F j, Y', strtotime($options['maxDate'])).'.');
        }

        return sizeof($errorMessageArray) < 1 ? 'success' : $errorMessageArray;
    }
    public function teenager($options) {
        $errorMessageArray = array();
        $month = intval($options['value']->month);
        $day = intval($options['value']->day);
        $year = intval($options['value']->year);
        $error = false;
        if(!empty($year) && !empty($month) && !empty($day)) {
            if(strtotime($year.'-'.$month.'-'.$day) > strtotime('-13 years')) {
                $error = true;
            }
        }
        // If they did not provide a date, validate true
        else {
            return 'success';
        }

        if($error) {
            array_push($errorMessageArray, 'You must be at least 13 years old to use this site.');
        }

        return sizeof($errorMessageArray) < 1 ? 'success' : $errorMessageArray;
    }
}

?>
