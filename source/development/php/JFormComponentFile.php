<?php
class JFormComponentFile extends JFormComponent {
    /*
     * Constructor
     */
    function __construct($id, $label, $optionArray = array()) {
        // Class variables
        $this->id = $id;
        $this->name = $this->id;
        $this->class = 'jFormComponentFile';
        $this->label = $label;
        $this->inputClass = 'file';

        //style hacking
        $this->customStyle = true;

        // Input options
        $this->type = 'file';
        $this->disabled = false;
        $this->maxLength = '';
        $this->styleWidth = '';

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);
    }

    function hasInstanceValues() {
        return isset($this->value[0]);
    }

    function getOptions() {
        $options = parent::getOptions();

        if($this->customStyle) {
            $options['options']['customStyle'] = true;
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
        $pseudoFileWrapper = new JFormElement('div', array(
            'class' => 'pseudoFile',
            'style' => 'position:absolute;'
        ));

        $pseudoFileInput = new JFormElement('input', array (
           'type'=> 'text',
           'disabled' => 'disabled',
        ));

        $pseudoFileButton = new JFormElement('button', array (
           'onclick' => 'return false;',
           'disabled' => 'disabled'
        ));
        $pseudoFileButton->update('Browse...');
        $pseudoFileWrapper->insert($pseudoFileInput);
        $pseudoFileWrapper->insert($pseudoFileButton);

        $input = new JFormElement('input', array(
            'type' => $this->type,
            'id' => $this->id,
            'name' => $this->name,
            'class' => $this->inputClass,
            'size'=> 15,
        ));
        if(!empty($this->styleWidth)) {
            $input->setAttribute('style', 'width: '.$this->styleWidth.';');
        }
        if(!empty($this->maxLength)) {
            $input->setAttribute('maxlength', $this->maxLength);
        }
        if($this->disabled) {
            $input->setAttribute('disabled', 'disabled');
        }
        if($this->customStyle){
            $input->addClassName('hidden');
            $div->insert($pseudoFileWrapper);
        }
        $div->insert($input);

        // Add any description (optional)
        $div = $this->insertComponentDescription($div);

        // Add a tip (optional)
        $div = $this->insertComponentTip($div);

        return $div->__toString();
    }
    public function required($options) {
        $messageArray = array('Required.');
        return !empty($options['value']) ? 'success' : $messageArray;
    }

    public function extension($options) {
        $messageArray = array('Must have the .'.$options->extension.' extension.');
        $extensionRegex = '/\.'.options.extension.'$/';
        return $options['value']['name'] == '' || preg_match($extensionRegex , $options['value']['name']) ? 'success' : $messageArray;
    }

    public function extensionType($options) {
        $extensionType;
        $messageArray = array('Incorrect file type.');
        
        if(is_array($options['extensionType'])) {
            $extensionType = '/\.('.implode('|', $options['extensionType']).')/';
        }
        else {
            $extensionObject = new stdClass();
            $extensionObject->image = '/\.(bmp|gif|jpg|png|psd|psp|thm|tif)$/i';
            $extensionObject->document = '/\.(doc|docx|log|msg|pages|rtf|txt|wpd|wps)$/i';
            $extensionObject->audio = '/\.(aac|aif|iff|m3u|mid|midi|mp3|mpa|ra|wav|wma)$/i';
            $extensionObject->video = '/\.(3g2|3gp|asf|asx|avi|flv|mov|mp4|mpg|rm|swf|vob|wmv)$/i';
            $extensionObject->web = '/\.(asp|css|htm|html|js|jsp|php|rss|xhtml)$/i';
            $extensionType = $extensionObject->$options['extensionType'];
            $messageArray = array('Must be an '.$options['extensionType'].' file type.');
        }
        return empty($options['value']) || preg_match($extensionType , $options['value']['name']) ? 'success' : $messageArray;
    }
    public function size($options) {
        if(empty($options['value'])){
            return 'success';
        }
        // they will give filesize in kb
        $fileSizeInKb = $this->value['size'] / 1024;
        return $fileSizeInKb <= $options['size'] ? 'success' : array('File must be smaller then ' . $options['size'].'kb. File is '.round($fileSizeInKb, 2). 'kb.');
    }
    public function imageDimensions($options) {
        if(empty($options['value'])){
            return 'success';
        }
        $imageInfo = getimagesize($this->value['tmp_name']);

        // Check to see if the file is an image
        if(!$imageInfo) {
            return array("File is not a valid image file.");
        } else {
            $errorMessageArray = array();
            $width = $imageInfo[0];
            $height = $imageInfo[1];
            if($width > $options['width']) {
                $errorMessageArray[] = array('The image must be less then '.$options['width'].'px wide. File is '.$width. 'px.');
            }
            if($height > $options['height']) {
                $errorMessageArray[] = array('The image must be less then '.$options['height'].'px tall. File is '.$height. 'px.');
            }
        }
        return empty($errorMessageArray) ? 'success' : $errorMessageArray;
    }

    public function minImageDimensions($options) {
        if(empty($options['value'])){
            return 'success';
        }
        $imageInfo = getimagesize($this->value['tmp_name']);

        // Check to see if the file is an image
        if(!$imageInfo) {
            return array("File is not a valid image file.");
        }
        else {
            $errorMessageArray = array();
            $width = $imageInfo[0];
            $height = $imageInfo[1];
            if($width < $options['width']) {
                $errorMessageArray[] = array('The image must at least then '.$options['width'].'px wide. File is '.$width. 'px.');
            }
            if($height < $options['height']) {
                $errorMessageArray[] = array('The image must at least then '.$options['height'].'px tall. File is '.$height. 'px.');
            }
        }
        return empty($errorMessageArray) ? 'success' : $errorMessageArray;
    }
}

?>
