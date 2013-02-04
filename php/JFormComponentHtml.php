<?php
class JFormComponentHtml extends JFormComponent {
    var $html;

    function __construct($html) {
        $this->id = uniqid();
        $this->html = $html;
    }

    function getOptions() {
        return null;
    }

    function clearValue() {
        return null;
    }

    function validate() {
        return null;
    }

    function getValue() {
        return null;
    }

    function  __toString() {
        return $this->html;
    }
}
?>
