<?php

class JFormElement {
    private $type;
    private $unaryTagArray = array('input', 'img', 'hr', 'br', 'meta', 'link');
    private $attributeArray;
    private $innerHtml;

    /**
     * Constructor
     *
     * @param <type> $type
     * @param <type> $attributeArray
     * @param <type> $unaryTagArray
     */
    public function __construct($type, $attributeArray = array()) {
        $this->type = strtolower($type);

        foreach($attributeArray as $attribute => $value) {
            $this->setAttribute($attribute, $value);
        }

        return $this;
    }

    /**
     * Set an array, can pass an array or a key, value combination
     *
     * @param <type> $attribute
     * @param <type> $value
     */

    public function getAttribute($attribute) {
        return $this->attributeArray[$attribute];
    }


    function setAttribute($attribute, $value = '') {
        if(!is_array($attribute)) {
            $this->attributeArray[$attribute] = $value;
        }
        else {
            $this->attributeArray = array_merge($this->attributeArray, $attribute);
        }

        return $this;
    }

    function addToAttribute($attribute, $value = '') {
        if(isset($this->attributeArray[$attribute])) {
            $currentValue = $this->attributeArray[$attribute];
        }
        else {
            $currentValue = '';
        }
        $this->attributeArray[$attribute] = $currentValue.$value;

        return $this;
    }

    function addClassName($className) {
        $currentClasses = $this->getAttribute('class');

        // Check to see if the class is already added
        if(!strstr($currentClasses, $className)) {
            $newClasses = $currentClasses.' '.$className;
            $this->setAttribute('class', $newClasses);
        }
    }

    /**
     * Insert an element into the current element
     *
     * @param <type> $object
     */
    function insert($object) {
        if(@get_class($object) == __class__) {
            $this->innerHtml .= $object->build();
        }
        else {
            $this->innerHtml .= $object;
        }

        return $this;
    }

    /**
     * Set the innerHtml of an element
     *
     * @param <type> $object
     * @return <type>
     */
    function update($object) {
        $this->innerHtml = $object;

        return $this;
    }

    /**
     * Builds the element
     *
     * @return <type>
     */
    function build() {
        // Start the tag
        $element = '<'.$this->type;

        // Add attributes
        if(count($this->attributeArray)) {
            foreach($this->attributeArray as $key => $value) {
                $element .= ' '.$key.'="'.$value.'"';
            }
        }

        // Close the element
        if(!in_array($this->type, $this->unaryTagArray)) {
            $element.= '>'.$this->innerHtml.'</'.$this->type.'>';
        }
        else {
            $element.= ' >';
        }

        // Don't format the XML string, saves time
        //return $this->formatXmlString($element);
        return $element;
    }

    /**
     * Echoes out the element
     *
     * @return <type>
     */
    function __toString() {
        return $this->build();
    }
}




require_once('JFormElement.php');
require_once('JFormPage.php');
require_once('JFormSection.php');
require_once('JFormComponent.php');
require_once('JFormComponentSingleLineText.php');
require_once('JFormComponentMultipleChoice.php');
require_once('JFormComponentDropDown.php');
require_once('JFormComponentTextArea.php');
require_once('JFormComponentDate.php');
require_once('JFormComponentFile.php');
require_once('JFormComponentName.php');
require_once('JFormComponentHidden.php');
require_once('JFormComponentAddress.php');
require_once('JFormComponentCreditCard.php');
require_once('JFormComponentLikert.php');
require_once('JFormComponentHtml.php');

function is_empty($string)
{
    $string = trim($string);
    if (!is_numeric($string))
    {
        return empty($string);
    }
    return FALSE;
}


class JFormer {

    // General settings
    var $id;
    var $class = 'jFormer';
    var $action;
    var $style;
    var $jFormPageArray = array();
    var $jFormerId;
    var $onSubmitFunctionServerSide = 'onSubmit';
    var $disableAnalytics = false;
    var $setupPageScroller = true;
    var $data;
    // Title, description, and submission button
    var $title = '';
    var $titleClass = 'jFormerTitle';
    var $description = '';
    var $descriptionClass = 'jFormerDescription';
    var $submitButtonText = 'Submit';
    var $submitProcessingButtonText = 'Processing...';
    var $afterControl = '';
    var $cancelButton = false;
    var $cancelButtonOnClick = '';
    var $cancelButtonText = 'Cancel';
    var $cancelButtonClass = 'cancelButton';
    // Form options
    var $alertsEnabled = true;
    var $clientSideValidation = true;
    var $debugMode = false;
    var $validationTips = true;
    var $useIframeTarget = true; // use hidden iframe for form processing, normal form post if false    
    // Page navigator
    var $pageNavigatorEnabled = false;
    var $pageNavigator = array();
    // Splash page
    var $splashPageEnabled = false;
    var $splashPage = array();
    // Animations
    var $animationOptions = null;
    // Custom script execution before form submission
    var $onSubmitStartClientSide = '';
    var $onSubmitFinishClientSide = '';
    // Essential class variables
    var $status = array('status' => 'processing', 'response' => 'Form initialized.');
    // Validation
    var $validationResponse = array();
    var $validationPassed = null;
    // Required Text
    var $requiredText = ' *';

    /**
     * Constructor
     */
    function __construct($id, $optionArray = array(), $jFormPageArray = array()) {
        // Set the id
        $this->id = $id;

        // Set the action dynamically
        $callingFile = debug_backtrace();
        $callingFile = str_replace("\\", "/", $callingFile[0]['file']);
        $this->action = str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', realpath($callingFile));

        // Use the options array to update the form variables
        if (is_array($optionArray)) {
            foreach ($optionArray as $option => $value) {
                $this->{$option} = $value;
            }
        }

        // Set defaults for the page navigator
        if (!empty($this->pageNavigator)) {
            $this->pageNavigatorEnabled = true;
        } else if ($this->pageNavigator == true) {
            $this->pageNavigator = array(
                'position' => 'top'
            );
        }

        // Set defaults for the splash page
        if (!empty($this->splashPage)) {
            $this->splashPageEnabled = true;
        }

        // Add the pages from the constructor
        foreach ($jFormPageArray as $jFormPage) {
            $this->addJFormPage($jFormPage);
        }

        return $this;
    }

    function addJFormPage($jFormPage) {
        $jFormPage->jFormer = $this;
        $this->jFormPageArray[$jFormPage->id] = $jFormPage;
        return $this;
    }

    function addJFormPages($jFormPages) {
        if (is_array($jFormPages)) {
            foreach ($jFormPages as $jFormPage) {
                $jFormPage->jFormer = $this;
                $this->jFormPageArray[$jFormPage->id] = $jFormPage;
            }
        }
        $jFormPage->jFormer = $this;
        $this->jFormPageArray[$jFormPage->id] = $jFormPage;
        return $this;
    }

    // Convenience method, no need to create a page or section to get components on the form
    function addJFormComponent($jFormComponent) {
        // Create an anonymous page if necessary
        if (empty($this->jFormPageArray)) {
            $this->addJFormPage(new JFormPage($this->id . '_page1', array('anonymous' => true)));
        }

        // Get the first page in the jFormPageArray
        $currentJFormPage = current($this->jFormPageArray);

        // Get the last section in the page
        $lastJFormSection = end($currentJFormPage->jFormSectionArray);

        // If the last section exists and is anonymous, add the component to it
        if (!empty($lastJFormSection) && $lastJFormSection->anonymous) {
            $lastJFormSection->addJFormComponent($jFormComponent);
        }
        // If the last section in the page does not exist or is not anonymous, add a new anonymous section and add the component to it
        else {
            // Create an anonymous section
            $anonymousSection = new JFormSection($currentJFormPage->id . '_section' . (sizeof($currentJFormPage->jFormSectionArray) + 1), array('anonymous' => true));

            // Add the anonymous section to the page
            $currentJFormPage->addJFormSection($anonymousSection->addJFormComponent($jFormComponent));
        }

        return $this;
    }

    function addJFormComponentArray($jFormComponentArray) {
        foreach ($jFormComponentArray as $jFormComponent) {
            $this->addJFormComponent($jFormComponent);
        }
        return $this;
    }

    // Convenience method, no need to create a to get a section on the form
    function addJFormSection($jFormSection) {
        // Create an anonymous page if necessary
        if (empty($this->jFormPageArray)) {
            $this->addJFormPage(new JFormPage($this->id . '_page1', array('anonymous' => true)));
        }

        // Get the first page in the jFormPageArray
        $currentJFormPage = current($this->jFormPageArray);

        // Add the section to the first page
        $currentJFormPage->addJFormSection($jFormSection);

        return $this;
    }

    function setStatus($status, $response) {
        $this->status = array('status' => $status, 'response' => $response);
        return $this->status;
    }

    function resetStatus() {
        $this->status = array('status' => 'processing', 'response' => 'Form status reset.');
        return $this->status;
    }

    function getStatus() {
        return $this->status;
    }

    function validate() {
        // Update the form status
        $this->setStatus('processing', 'Validating component values.');

        // Clear the validation response
        $this->validationResponse = array();

        // Validate each page
        foreach ($this->jFormPageArray as $jFormPage) {
            $this->validationResponse[$jFormPage->id] = $jFormPage->validate();
        }
        // Walk through all of the pages to see if there are any errors
        $this->validationPassed = true;

        foreach ($this->validationResponse as $jFormPageKey => $jFormPage) {
            foreach ($jFormPage as $jFormSectionKey => $jFormSection) {
                // If there are section instances
                if ($jFormSection != null && array_key_exists(0, $jFormSection) && is_array($jFormSection[0])) {
                    foreach ($jFormSection as $jFormSectionInstanceIndex => $jFormSectionInstance) {
                        foreach ($jFormSectionInstance as $jFormComponentKey => $jFormComponentErrorMessageArray) {
                            // If there are component instances
                            if ($jFormComponentErrorMessageArray != null && array_key_exists(0, $jFormComponentErrorMessageArray) && is_array($jFormComponentErrorMessageArray[0])) {
                                foreach ($jFormComponentErrorMessageArray as $jFormComponentInstanceErrorMessageArray) {
                                    // If the first value is not empty, the component did not pass validation
                                    if (!empty($jFormComponentInstanceErrorMessageArray[0]) || sizeof($jFormComponentInstanceErrorMessageArray) > 1) {
                                        $this->validationPassed = false;
                                    }
                                }
                            } else {
                                if (!empty($jFormComponentErrorMessageArray)) {
                                    $this->validationPassed = false;
                                }
                            }
                        }
                    }
                }
                // No section instances
                else {
                    foreach ($jFormSection as $jFormComponentErrorMessageArray) {
                        // Component instances
                        if ($jFormComponentErrorMessageArray != null && array_key_exists(0, $jFormComponentErrorMessageArray) && is_array($jFormComponentErrorMessageArray[0])) {
                            foreach ($jFormComponentErrorMessageArray as $jFormComponentInstanceErrorMessageArray) {
                                // If the first value is not empty, the component did not pass validation
                                if (!empty($jFormComponentInstanceErrorMessageArray[0]) || sizeof($jFormComponentInstanceErrorMessageArray) > 1) {
                                    $this->validationPassed = false;
                                }
                            }
                        } else {
                            if (!empty($jFormComponentErrorMessageArray)) {
                                $this->validationPassed = false;
                            }
                        }
                    }
                }
            }
        }

        // Update the form status
        $this->setStatus('processing', 'Validation complete.');

        return $this->validationResponse;
    }

    function getData() {
        $this->data = array();

        foreach ($this->jFormPageArray as $jFormPageKey => $jFormPage) {
            if (!$jFormPage->anonymous) {
                $this->data[$jFormPageKey] = $jFormPage->getData();
            } else {
                foreach ($jFormPage->jFormSectionArray as $jFormSectionKey => $jFormSection) {
                    if (!$jFormSection->anonymous) {
                        $this->data[$jFormSectionKey] = $jFormSection->getData();
                    } else {
                        foreach ($jFormSection->jFormComponentArray as $jFormComponentKey => $jFormComponent) {
                            if (get_class($jFormComponent) != 'JFormComponentHtml') { // Don't include HTML components
                                $this->data[$jFormComponentKey] = $jFormComponent->getValue();
                            }
                        }
                    }
                }
            }
        }
        return json_decode(json_encode($this->data));
    }

    function updateRequiredText($requiredText) {
        foreach($this->jFormPageArray as $jFormPage) {
            $jFormPage->updateRequiredText($requiredText);
        }
    }

    function setInitialValues($formValues) {
        // Make sure we are always working with an object
        if (!is_object($formValues)) {
            $formValues = json_decode(urldecode($formValues));
            if (!is_object($formValues)) {
                $formValues = json_decode(urldecode(stripslashes($data)));
            }
        }

        // Walk through the form object and apply initial values
        foreach ($formValues as $formPageKey => $formPageData) {
            $this->formPageArray[$formPageKey]->setInitialValues($formPageData);
        }
    }

    function setData($data, $fileArray = array()) {
        // Get the form data as an object, handle apache auto-add slashes on post requests
        $jFormerData = json_decode(urldecode($data));
        if (!is_object($jFormerData)) {
            $jFormerData = json_decode(urldecode(stripslashes($data)));
        }

        // Clear all of the component values
        $this->clearData();

        //print_r($jFormerData); exit();
        //print_r($fileArray);
        // Update the form status
        $this->setStatus('processing', 'Setting component values.');

        // Assign all of the received JSON values to the form
        foreach ($jFormerData as $jFormPageKey => $jFormPageData) {
            $this->jFormPageArray[$jFormPageKey]->setData($jFormPageData);
        }

        // Handle files
        if (!empty($fileArray)) {
            foreach ($fileArray as $jFormComponentId => $fileDataArray) {
                preg_match('/(-section([0-9])+)?(-instance([0-9])+)?:([A-Za-z0-9_-]+):([A-Za-z0-9_-]+)/', $jFormComponentId, $fileIdInfo);

                $jFormComponentId = str_replace($fileIdInfo[0], '', $jFormComponentId);
                $jFormPageId = $fileIdInfo[5];
                $jFormSectionId = $fileIdInfo[6];

                // Inside section instances
                if ($fileIdInfo[1] != null || ($fileIdInfo[1] == null && array_key_exists(0, $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray))) {
                    // section instance
                    // set the instance index
                    if ($fileIdInfo[1] != null) {
                        $jFormSectionInstanceIndex = $fileIdInfo[2] - 1;
                    } else {
                        // prime instance
                        $jFormSectionInstanceIndex = 0;
                    }
                    // check to see if there is a component instance
                    if ($fileIdInfo[3] != null || ($fileIdInfo[3] == null && is_array($this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormSectionInstanceIndex][$jFormComponentId]->value))) {
                        // set the component instance index inside of a  section instance
                        if ($fileIdInfo[3] == null) {
                            $jFormComponentInstanceIndex = 0;
                        } else {
                            $jFormComponentInstanceIndex = $fileIdInfo[4] - 1;
                        }
                        // set the value with a section and a component instance
                        $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormSectionInstanceIndex][$jFormComponentId]->value[$jFormComponentInstanceIndex] = $fileDataArray;
                    } else {
                        // set the value with a section instance
                        $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormSectionInstanceIndex][$jFormComponentId]->value = $fileDataArray;
                    }
                }

                // Not section instances
                else {
                    // has component instances
                    if ($fileIdInfo[3] != null || ($fileIdInfo[3] == null && is_array($this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormComponentId]->value))) {
                        // set component  instance index
                        if ($fileIdInfo[3] == null) {
                            $jFormComponentInstanceIndex = 0;
                        } else {
                            $jFormComponentInstanceIndex = $fileIdInfo[4] - 1;
                        }
                        $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormComponentId]->value[$jFormComponentInstanceIndex] = $fileDataArray;
                    } else {
                        // no instances
                        $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormComponentId]->value = $fileDataArray;
                    }
                }
            }
        }

        return $this;
    }

    function clearData() {
        foreach ($this->jFormPageArray as $jFormPage) {
            $jFormPage->clearData();
        }
        $this->data = null;
    }

    function clearAllComponentValues() {
        // Clear all of the components in the form
        foreach ($this->jFormPageArray as $jFormPage) {
            foreach ($jFormPage->jFormSectionArray as $jFormSection) {
                foreach ($jFormSection->jFormComponentArray as $jFormComponent) {
                    $jFormComponent->value = null;
                }
            }
        }
    }

    function select($id) {
        foreach ($this->jFormPageArray as $jFormPageId => &$jFormPage) {
            if ($id === $jFormPageId) {
                return $jFormPage;
            }
            foreach ($jFormPage->jFormSectionArray as $jFormSectionId => &$jFormSection) {
                if ($id === $jFormSectionId) {
                    return $jFormSection;
                }
                foreach ($jFormSection->jFormComponentArray as $jFormComponentId => &$jFormComponent) {
                    if (is_array($jFormComponent)) {
                        foreach ($jFormComponent as $sectionInstanceComponentId => &$sectionInstanceComponent) {
                            if ($id === $sectionInstanceComponentId) {
                                return $sectionInstanceComponent;
                            }
                        }
                    }
                    if ($id === $jFormComponentId) {
                        return $jFormComponent;
                    }
                }
            }
        }
        return false;
    }

    function remove($id) {
        foreach ($this->jFormPageArray as $jFormPageId => &$jFormPage) {
            if ($id === $jFormPageId) {
                $this->jFormPageArray[$jFormPageId] = null;
                array_filter($this->jFormPageArray);
                return true;
            }
            foreach ($jFormPage->jFormSectionArray as $jFormSectionId => &$jFormSection) {
                if ($id === $jFormSectionId) {
                    $jFormPage->jFormSectionArray[$jFormSectionId] = null;
                    array_filter($jFormPage->jFormSectionArray);
                    return true;
                }
                foreach ($jFormSection->jFormComponentArray as $jFormComponentId => &$jFormComponent) {
                    if ($id === $jFormComponentId) {
                        $jFormSection->jFormComponentArray[$jFormComponentId] = null;
                        array_filter($jFormSection->jFormComponentArray);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function processRequest($silent = false) {
        // Are they trying to post a file that is too large?
        if (isset($_SERVER['CONTENT_LENGTH']) && empty($_POST)) {
            $this->setStatus('success', array('failureNoticeHtml' => 'Your request (' . round($_SERVER['CONTENT_LENGTH'] / 1024 / 1024, 1) . 'M) was too large for the server to handle. ' . ini_get('post_max_size') . ' is the maximum request size.'));
            echo '
                <script type="text/javascript" language="javascript">
                    parent.' . $this->id . 'Object.handleFormSubmissionResponse(' . json_encode($this->getStatus()) . ');
                </script>
            ';
            exit();
        }

        // Are they trying to post something to the form?
        if (isset($_POST['jFormer']) && $this->id == $_POST['jFormerId'] || isset($_POST['jFormerTask'])) {
            // Process the form, get the form state, or display the form
            if (isset($_POST['jFormer'])) {
                //echo json_encode($_POST);
                $onSubmitErrorMessageArray = array();

                // Set the form components and validate the form
                $this->setData($_POST['jFormer'], $_FILES);

                //print_r($this->getData());
                // Run validation
                $this->validate();
                if (!$this->validationPassed) {
                    $this->setStatus('failure', array('validationFailed' => $this->validationResponse));
                } else {
                    try {
                        $onSubmitResponse = call_user_func($this->onSubmitFunctionServerSide, $this->getData());
                    } catch (Exception $exception) {
                        $onSubmitErrorMessageArray[] = $exception->getTraceAsString();
                    }

                    // Make sure you actually get a callback response
                    if (empty($onSubmitResponse)) {
                        $onSubmitErrorMessageArray[] = '<p>The function <b>' . $this->onSubmitFunctionServerSide . '</b> did not return a valid response.</p>';
                    }

                    // If there are no errors, it is a successful response
                    if (empty($onSubmitErrorMessageArray)) {
                        $this->setStatus('success', $onSubmitResponse);
                    } else {
                        $this->setStatus('failure', array('failureHtml' => $onSubmitErrorMessageArray));
                    }
                }
                if($this->useIframeTarget){  
                    echo '
                        <script type="text/javascript" language="javascript">
                            parent.' . $this->id . 'Object.handleFormSubmissionResponse(' . json_encode($this->getStatus()) . ');
                        </script>
                    ';
                }
                //echo json_encode($this->getValues());

                exit();
            }
            // Get the form's status
            else if (isset($_POST['jFormerTask']) && $_POST['jFormerTask'] == 'getFormStatus') {
                $onSubmitResponse = $this->getStatus();
                echo json_encode($onSubmitResponse);
                $this->resetStatus();
                exit();
            }
        }
        // If they aren't trying to post something to the form
        else if (!$silent) {
            $this->outputHtml();
        }
    }

    function getOptions() {
        $options = array();
        $options['options'] = array();
        $options['jFormPages'] = array();

        // Get all of the pages
        foreach ($this->jFormPageArray as $jFormPage) {
            $options['jFormPages'][$jFormPage->id] = $jFormPage->getOptions();
        }

        // Set form options
        if (!$this->clientSideValidation) {
            $options['options']['clientSideValidation'] = $this->clientSideValidation;
        }
        if ($this->debugMode) {
            $options['options']['debugMode'] = $this->debugMode;
        }
        if (!$this->validationTips) {
            $options['options']['validationTips'] = $this->validationTips;
        }
        if (!$this->setupPageScroller) {
            $options['options']['setupPageScroller'] = $this->setupPageScroller;
        }
        if ($this->animationOptions !== null) {
            $options['options']['animationOptions'] = $this->animationOptions;
        }
        if ($this->pageNavigatorEnabled) {
            $options['options']['pageNavigator'] = $this->pageNavigator;
        }
        if ($this->splashPageEnabled) {
            $options['options']['splashPage'] = $this->splashPage;
            unset($options['options']['splashPage']['content']);
        }
        if (!empty($this->onSubmitStartClientSide)) {
            $options['options']['onSubmitStart'] = $this->onSubmitStartClientSide;
        }
        if (!empty($this->onSubmitFinishClientSide)) {
            $options['options']['onSubmitFinish'] = $this->onSubmitFinishClientSide;
        }
        if (!$this->alertsEnabled) {
            $options['options']['alertsEnabled'] = false;
        }
        if ($this->submitButtonText != 'Submit') {
            $options['options']['submitButtonText'] = $this->submitButtonText;
        }
        if ($this->submitProcessingButtonText != 'Processing...') {
            $options['options']['submitProcessingButtonText'] = $this->submitProcessingButtonText;
        }

        if (empty($options['options'])) {
            unset($options['options']);
        }

        return $options;
    }

    function outputHtml() {
        echo $this->getHtml();
    }

    function __toString() {
        $element = $this->getHtml();
        return $element->__toString();
    }

    function getHtml() {
        $this->updateRequiredText($this->requiredText);
        // Create the form
        $target = $this->useIframeTarget ? $this->id . '-iframe' : '';
        $jFormElement = new JFormElement('form', array(
                    'id' => $this->id,
                    'target' => $target,
                    'enctype' => 'multipart/form-data',
                    'method' => 'post',
                    'class' => $this->class,
                    'action' => $this->action,
                ));

        if (!empty($this->onMouseOver)) {
            $formJFormElement->attr('onmouseover', $this->onMouseOver);
        }

        if (!empty($this->onMouseOut)) {
            $formJFormElement->attr('onmouseout', $this->onMouseOut);
        }

        // Set the style
        if (!empty($this->style)) {
            $jFormElement->addToAttribute('style', $this->style);
        }

        // Global messages
        if ($this->alertsEnabled) {
            $jFormerAlertWrapperDiv = new JFormElement('div', array(
                        'class' => 'jFormerAlertWrapper',
                        'style' => 'display: none;',
                    ));
            $alertDiv = new JFormElement('div', array(
                        'class' => 'jFormerAlert',
                    ));
            $jFormerAlertWrapperDiv->insert($alertDiv);
            $jFormElement->insert($jFormerAlertWrapperDiv);
        }

        // If a splash is enabled
        if ($this->splashPageEnabled) {
            // Create a splash page div
            $splashPageDiv = new JFormElement('div', array(
                        'id' => $this->id . '-splash-page',
                        'class' => 'jFormerSplashPage jFormPage',
                    ));

            // Set defaults if they aren't set
            if (!isset($this->splashPage['content'])) {
                $this->splashPage['content'] = '';
            }
            if (!isset($this->splashPage['splashButtonText'])) {
                $this->splashPage['splashButtonText'] = 'Begin';
            }

            $splashPageDiv->insert('<div class="jFormerSplashPageContent">' . $this->splashPage['content'] . '</div>');

            // Create a splash button if there is no custom button ID
            if (!isset($this->splashPage['customButtonId'])) {
                $splashLi = new JFormElement('li', array('class' => 'splashLi'));
                $splashButton = new JFormElement('button', array('class' => 'splashButton'));
                $splashButton->update($this->splashPage['splashButtonText']);
                $splashLi->insert($splashButton);
            }
        }

        // Add a title to the form
        if (!empty($this->title)) {
            $title = new JFormElement('div', array(
                        'class' => $this->titleClass
                    ));
            $title->update($this->title);
            $jFormElement->insert($title);
        }

        // Add a description to the form
        if (!empty($this->description)) {
            $description = new JFormElement('div', array(
                        'class' => $this->descriptionClass
                    ));
            $description->update($this->description);
            $jFormElement->insert($description);
        }

        // Add the page navigator if enabled
        if ($this->pageNavigatorEnabled) {
            $pageNavigatorDiv = new JFormElement('div', array(
                        'class' => 'jFormPageNavigator',
                    ));
            if (isset($this->pageNavigator['position']) && $this->pageNavigator['position'] == 'right') {
                $pageNavigatorDiv->addToAttribute('class', ' jFormPageNavigatorRight');
            } else {
                $pageNavigatorDiv->addToAttribute('class', ' jFormPageNavigatorTop');
            }

            $pageNavigatorUl = new JFormElement('ul', array(
                    ));

            $jFormPageArrayCount = 0;
            foreach ($this->jFormPageArray as $jFormPageKey => $jFormPage) {
                $jFormPageArrayCount++;

                $pageNavigatorLabel = new JFormElement('li', array(
                            'id' => 'navigatePage' . $jFormPageArrayCount,
                            'class' => 'jFormPageNavigatorLink',
                        ));

                // If the label is numeric
                if (isset($this->pageNavigator['label']) && $this->pageNavigator['label'] == 'numeric') {
                    $pageNavigatorLabelText = 'Page ' . $jFormPageArrayCount;
                } else {
                    // Add a link prefix if there is a title
                    if (!empty($jFormPage->title)) {
                        $pageNavigatorLabelText = '<span class="jFormNavigatorLinkPrefix">' . $jFormPageArrayCount . '</span> ' . strip_tags($jFormPage->title);
                    } else {
                        $pageNavigatorLabelText = 'Page ' . $jFormPageArrayCount;
                    }
                }
                $pageNavigatorLabel->update($pageNavigatorLabelText);

                if ($jFormPageArrayCount != 1) {
                    $pageNavigatorLabel->addToAttribute('class', ' jFormPageNavigatorLinkLocked');
                } else {
                    $pageNavigatorLabel->addToAttribute('class', ' jFormPageNavigatorLinkUnlocked jFormPageNavigatorLinkActive');
                }

                $pageNavigatorUl->insert($pageNavigatorLabel);
            }

            // Add the page navigator ul to the div
            $pageNavigatorDiv->insert($pageNavigatorUl);

            $jFormElement->insert($pageNavigatorDiv);
        }

        // Add the jFormerControl UL
        $jFormerControlUl = new JFormElement('ul', array(
                    'class' => 'jFormerControl',
                ));

        // Create the cancel button
        if ($this->cancelButton) {
            $cancelButtonLi = new JFormElement('li', array('class' => 'cancelLi'));
            $cancelButton = new JFormElement('button', array('class' => $this->cancelButtonClass));
            $cancelButton->update($this->cancelButtonText);

            if (!empty($this->cancelButtonOnClick)) {
                $cancelButton->attr('onclick', $this->cancelButtonOnClick);
            }

            $cancelButtonLi->append($cancelButton);
        }

        // Create the previous button
        $previousButtonLi = new JFormElement('li', array('class' => 'previousLi', 'style' => 'display: none;'));
        $previousButton = new JFormElement('button', array('class' => 'previousButton'));
        $previousButton->update('Previous');
        $previousButtonLi->insert($previousButton);

        // Create the next button
        $nextButtonLi = new JFormElement('li', array('class' => 'nextLi'));
        $nextButton = new JFormElement('button', array('class' => 'nextButton'));
        $nextButton->update($this->submitButtonText);
        // Don't show the next button
        if ($this->splashPageEnabled) {
            $nextButtonLi->setAttribute('style', 'display: none;');
        }
        $nextButtonLi->insert($nextButton);

        // Add a splash page button if it exists
        if (isset($splashLi)) {
            $jFormerControlUl->insert($splashLi);
        }

        // Add the previous and next buttons
        $jFormerControlUl->insert($previousButtonLi);

        if ($this->cancelButton && $this->cancelButtonLiBeforeNextButtonLi) {
            echo 'one';
            $jFormerControlUl->insert($cancelButtonLi);
            $jFormerControlUl->insert($nextButtonLi);
        } else if ($this->cancelButton) {
            echo 'two';
            $jFormerControlUl->insert($nextButtonLi);
            $jFormerControlUl->insert($cancelButtonLi);
        } else {
            $jFormerControlUl->insert($nextButtonLi);
        }

        // Create the page wrapper and scrollers
        $jFormPageWrapper = new JFormElement('div', array('class' => 'jFormPageWrapper'));
        $jFormPageScroller = new JFormElement('div', array('class' => 'jFormPageScroller'));

        // Add a splash page if it exists
        if (isset($splashPageDiv)) {
            $jFormPageScroller->insert($splashPageDiv);
        }

        // Add the form pages to the form
        $jFormPageCount = 0;
        foreach ($this->jFormPageArray as $jFormPage) {
            // Hide everything but the first page
            if ($jFormPageCount != 0 || ($jFormPageCount == 0 && ($this->splashPageEnabled))) {
                $jFormPage->style .= 'display: none;';
            }

            $jFormPageScroller->insert($jFormPage);
            $jFormPageCount++;
        }

        // Page wrapper wrapper
        $pageWrapperContainer = new JFormElement('div', array('class' => 'jFormWrapperContainer'));

        // Insert the page wrapper and the jFormerControl UL to the form
        $jFormElement->insert($pageWrapperContainer->insert($jFormPageWrapper->insert($jFormPageScroller) . $jFormerControlUl));

        // Create a script tag to initialize jFormer JavaScript
        $script = new JFormElement('script', array(
                    'type' => 'text/javascript',
                    'language' => 'javascript'
                ));

        // Update the script tag
        $script->update('$(document).ready(function () { ' . $this->id . 'Object = new JFormer(\'' . $this->id . '\', ' . json_encode($this->getOptions()) . '); });');
        $jFormElement->insert($script);

        // Add a hidden iframe to handle the form posts
        $iframe = new JFormElement('iframe', array(
                    'id' => $this->id . '-iframe',
                    'name' => $this->id . '-iframe',
                    'class' => 'jFormerIFrame',
                    'frameborder' => 0,
                    'src' => (defined('URLDIR') ? URLDIR : '') . '/jquery/jFormer/jformer.php?iframe=true',
                    //'src' => '/empty.html',
                        //'src' => str_replace($_SERVER['DOCUMENT_ROOT'], '', __FILE__).'?iframe=true',
                ));

        if ($this->debugMode) {
            $iframe->addToAttribute('style', 'display:block;');
        }

        $jFormElement->insert($iframe);


        // After control
        if (!empty($this->afterControl)) {
            $subSubmitInstructions = new JFormElement('div', array('class' => 'jFormerAfterControl'));
            $subSubmitInstructions->update($this->afterControl);
            $jFormElement->insert($subSubmitInstructions);
        }

        return $jFormElement;
    }

}

// Handle any requests that come to this file
if (isset($_GET['iframe'])) {
    echo '';
}



/**
 * A FormPage object contains FormSection objects and belongs to a Form object
 */
class JFormPage {
    
    // General settings
    var $id;
    var $class = 'jFormPage';
    var $style = '';
    var $jFormer;
    var $jFormSectionArray = array();
    var $onBeforeScrollTo; // array('function', 'notificationHtml')
    var $data;
    var $anonymous = false;

    // Title, description, submit instructions
    var $title = '';
    var $titleClass = 'jFormPageTitle';
    var $description = '';
    var $descriptionClass = 'jFormPageDescription';
    var $submitInstructions = '';
    var $submitInstructionsClass = 'jFormPageSubmitInstructions';

    // Validation
    var $errorMessageArray = array();

    // Options
    var $dependencyOptions = null;

    /*
     * Constructor
     */
    function __construct($id, $optionArray = array(), $jFormSectionArray = array()) {
        // Set the id
        $this->id = $id;

        // Use the options hash to update object variables
        if(is_array($optionArray)) {
            foreach($optionArray as $option => $value) {
                $this->{$option} = $value;
            }
        }

        // Add the sections from the constructor
        foreach($jFormSectionArray as $jFormSection) {
            $this->addJFormSection($jFormSection);
        }

        return $this;
    }

    function addJFormSection($jFormSection) {
        $jFormSection->parentJFormPage = $this;
        $this->jFormSectionArray[$jFormSection->id] = $jFormSection;
        return $this;
    }

    function addJFormSections($jFormSections) {
        if (is_array($jFormSections)) {
            foreach ($jFormSections as $jFormSection) {
                $jFormSection->parentJFormPage = $this;
                $this->jFormSectionArray[$jFormSection->id] = $jFormSection;
            }
        }
        $jFormSection->parentJFormPage = $this;
        $this->jFormSectionArray[$jFormSection->id] = $jFormSection;
        return $this;
    }
    
    // Convenience method, no need to create a section to get components on the page
    function addJFormComponent($jFormComponent) {
        // Create an anonymous section if necessary
        if(empty($this->jFormSectionArray)) {
            $this->addJFormSection(new JFormSection($this->id.'_section1', array('anonymous' => true)));
        }

        // Get the last section in the page
        $lastJFormSection = end($this->jFormSectionArray);

        // If the last section exists and is anonymous, add the component to it
        if(!empty($lastJFormSection) && $lastJFormSection->anonymous) {
            $lastJFormSection->addJFormComponent($jFormComponent);
        }
        // If the last section in the page does not exist or is not anonymous, add a new anonymous section and add the component to it
        else {
            // Create an anonymous section
            $anonymousSection = new JFormSection($this->id.'_section'.(sizeof($this->jFormSectionArray) + 1), array('anonymous' => true));

            // Add the anonymous section to the page
            $this->addJFormSection($anonymousSection->addJFormComponent($jFormComponent));
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
        foreach($this->jFormSectionArray as $jFormSectionKey => $jFormSection) {
            $this->data[$jFormSectionKey] = $jFormSection->getData();
        }
        return $this->data;
    }

    function setData($jFormPageData) {
        foreach($jFormPageData as $jFormSectionKey => $jFormSectionData) {
            $this->jFormSectionArray[$jFormSectionKey]->setData($jFormSectionData);
        }
    }

    function clearData() {
        foreach($this->jFormSectionArray as $jFormSection) {
            $jFormSection->clearData();
        }
        $this->data = null;
    }

    function validate() {
        // Clear the error message array
        $this->errorMessageArray = array();

        // Validate each section
        foreach($this->jFormSectionArray as $jFormSection) {
            $this->errorMessageArray[$jFormSection->id] = $jFormSection->validate();
        }

        return $this->errorMessageArray;
    }

    function getOptions() {
        $options = array();
        $options['options'] = array();
        $options['jFormSections'] = array();

        foreach($this->jFormSectionArray as $jFormSection) {
            $options['jFormSections'][$jFormSection->id] = $jFormSection->getOptions();
        }

        if(!empty($this->onScrollTo)) {
            $options['options']['onScrollTo'] = $this->onScrollTo;
        }
        
        // Dependencies
        if(!empty($this->dependencyOptions)) {
            // Make sure the dependentOn key is tied to an array
            if(isset($this->dependencyOptions['dependentOn']) && !is_array($this->dependencyOptions['dependentOn'])) {
                $this->dependencyOptions['dependentOn'] = array($this->dependencyOptions['dependentOn']);
            }
            $options['options']['dependencyOptions'] = $this->dependencyOptions;
        }

        if(empty($options['options'])) {
            unset($options['options']);
        }

        return $options;
    }

    function updateRequiredText($requiredText) {
        foreach($this->jFormSectionArray as $jFormSection) {
            $jFormSection->updateRequiredText($requiredText);
        }
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Page div
        $jFormPageDiv = new JFormElement('div', array(
            'id' => $this->id,
            'class' => $this->class
        ));

        // Set the styile
        if(!empty($this->style)) {
            $jFormPageDiv->addToAttribute('style', $this->style);
        }

        // Add a title to the page
        if(!empty($this->title)) {
            $title = new JFormElement('div', array(
                'class' => $this->titleClass
            ));
            $title->update($this->title);
            $jFormPageDiv->insert($title);
        }

        // Add a description to the page
        if(!empty($this->description)) {
            $description = new JFormElement('div', array(
                'class' => $this->descriptionClass
            ));
            $description->update($this->description);
            $jFormPageDiv->insert($description);
        }

        // Add the form sections to the page
        foreach($this->jFormSectionArray as $jFormSection) {
            $jFormPageDiv->insert($jFormSection);
        }

        // Submit instructions
        if(!empty($this->submitInstructions)) {
            $submitInstruction = new JFormElement('div', array(
                'class' => $this->submitInstructionsClass
            ));
            $submitInstruction->update($this->submitInstructions);
            $jFormPageDiv->insert($submitInstruction);
        }

        return $jFormPageDiv->__toString();
    }
}


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
                if (!is_null($this->jFormComponentArray[$jFormComponentKey])) {
                    $this->jFormComponentArray[$jFormComponentKey]->setValue($jFormComponentValue);
                }
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

    function updateRequiredText($requiredText) {
        foreach($this->jFormComponentArray as $jFormComponent) {
            $jFormComponent->updateRequiredText($requiredText);
        }
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


/**
 * An abstract FormComponent object, cannot be instantiated
 */
abstract class JFormComponent {
    // General settings
    var $id;
    var $class = null;
    var $value = null;
    var $style = null;
    var $parentJFormSection;
    var $anonymous = false;

    // Label
    var $label = null;  // Must be implemented by child class
    var $labelClass = 'jFormComponentLabel';
    var $labelRequiredStarClass = 'jFormComponentLabelRequiredStar';
    var $requiredText = ' *'; // can be overridden at the form level;

    // Helpers
    var $tip = null;
    var $tipClass = 'jFormComponentTip';
    var $description = null;
    var $descriptionClass = 'jFormComponentDescription';

    // Options
    var $instanceOptions = null;
    var $triggerFunction = null;
    var $enterSubmits = false;
    
    // Dependencies
    var $dependencyOptions = null;

    // Validation
    var $validationOptions = array();
    var $errorMessageArray = null;
    var $passedValidation = null;
    var $showErrorTipOnce = false;
    var $persistentTip = false;

    /**
     * Initialize
     */
    function initialize($optionArray = array()) {
        // Use the options hash to update object variables
        if(is_array($optionArray)) {
            foreach($optionArray as $option => $value) {
                $this->{$option} = $value;
            }
        }

        // Allow users to pass a string into validation options
        if(is_string($this->validationOptions)) {
            $this->validationOptions = array($this->validationOptions);
        }
        
        return $this;
    }

    function getValue() {
        return $this->value;
    }

    function setValue($value) {
        $this->value = $value;
    }

    function clearValue() {
        $this->value = null;
    }

    function validate() {
        // Clear the error message array
        $this->errorMessageArray = array();

        // Only validate if the value isn't null - this is so dependencies aren't validated before they are unlocked
        if($this->value !== null) {
            // Perform the validation
            $this->reformValidations();

            // If you have instance values
            if($this->hasInstanceValues()) {
                // Walk through each of the instance values
                foreach($this->value as $instanceKey => $instanceValue) {
                    foreach($this->validationOptions as $validationType => $validationOptions) {
                        $validationOptions['value'] = $instanceValue;

                        // Get the validation response
                        $validationResponse = $this->$validationType($validationOptions);

                        // Make sure you have an array to work with
                        if(!isset($this->errorMessageArray[$instanceKey])) {
                            $this->errorMessageArray[$instanceKey] = array();
                        }

                        if($validationResponse != 'success') {
                            $this->passedValidation = false;

                            if(is_array($validationResponse)) {
                                $this->errorMessageArray[$instanceKey] = array_merge($this->errorMessageArray[$instanceKey], $validationResponse);
                            }
                            else {
                                if(is_string($validationResponse)) {
                                    $this->errorMessageArray[$instanceKey] = array_merge($this->errorMessageArray[$instanceKey], array($validationResponse));
                                }
                                else {
                                    $this->errorMessageArray[$instanceKey] = array_merge($this->errorMessageArray[$instanceKey], array('There was a problem validating this component on the server.'));
                                }
                            }
                        }
                        // Use an empty array as a placeholder for instances that have passed validation
                        else {
                            if(sizeof($this->errorMessageArray[$instanceKey]) == 0) {
                                $this->errorMessageArray[$instanceKey] = array('');
                            }
                        }
                    }
                }
            }
            // If there are no instance values
            else {
                foreach($this->validationOptions as $validationType => $validationOptions) {
                    $validationOptions['value'] = $this->value;

                    // Get the validation response
                    $validationResponse = $this->$validationType($validationOptions);
                    if($validationResponse != 'success') {
                        $this->passedValidation = false;
                        
                        if(is_array($validationResponse)) {
                            $this->errorMessageArray = array_merge($validationResponse, $this->errorMessageArray);
                        }
                        else {
                            if(is_string($validationResponse)) {
                                $this->errorMessageArray = array_merge(array($validationResponse), $this->errorMessageArray);
                            }
                            else {
                                $this->errorMessageArray = array_merge(array('There was a problem validating this component on the server.'), $this->errorMessageArray);
                            }
                        }
                    }
                }
            }

            return $this->errorMessageArray;
        }
    }

    function reformValidations(){
        $reformedValidations = array();
        foreach($this->validationOptions as $validationType => $validationOptions) {
            // Check to see if the name of the function is actually an array index
            if(is_int($validationType)) {
                // The function is not an index, it becomes the name of the option with the value of an empty object
                $reformedValidations[$validationOptions] =  array();
            }
            // If the validationOptions is a string
            else if(!is_array($validationOptions)) {
                $reformedValidations[$validationType] = array();
                $reformedValidations[$validationType][$validationType] = $validationOptions;
            }
            // If validationOptions is an object
            else if(is_array($validationOptions)) {
                if(isset($validationOptions[0])){
                    $reformedValidations[$validationType] = array();
                    $reformedValidations[$validationType][$validationType] = $validationOptions;
                } else {
                    $reformedValidations[$validationType] = $validationOptions;
                }
            }
        }
        $this->validationOptions = $reformedValidations;
    }

    function getOptions() {
        $options = array();
        $options['options'] = array();
        $options['type'] = get_class($this);

        // Validation options
        if(!empty($this->validationOptions)) {
            $options['options']['validationOptions'] = $this->validationOptions;
        }
        if($this->showErrorTipOnce) {
            $options['options']['showErrorTipOnce'] = $this->showErrorTipOnce;
        }

        if($this->persistentTip){
            $options['options']['persistentTip'] = $this->persistentTip;
        }
        
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
        
        
        // Trigger
        if(!empty($this->triggerFunction)) {
            $options['options']['triggerFunction'] = $this->triggerFunction;
        }
        
        // Dependencies
        if(!empty($this->dependencyOptions)) {
            // Make sure the dependentOn key is tied to an array
            if(isset($this->dependencyOptions['dependentOn']) && !is_array($this->dependencyOptions['dependentOn'])) {
                $this->dependencyOptions['dependentOn'] = array($this->dependencyOptions['dependentOn']);
            }
            $options['options']['dependencyOptions'] = $this->dependencyOptions;
        }
        
        // Clear the options key if there is nothing in it
        if(empty($options['options'])) {
            unset($options['options']);
        }

        return $options;
    }

    /**
     * Generates the HTML for the FormComponent
     * @return string
     */
    abstract function __toString();
    
    function hasInstanceValues() {
        return is_array($this->value);
    }

    function generateComponentDiv($includeLabel = true) {
        // Div tag contains everything about the component
        $componentDiv = new JFormElement('div', array(
            'id' => $this->id.'-wrapper',
            'class' => 'jFormComponent '.$this->class,
        ));

        // This causes issues with things that are dependent and should display by default
        // If the component has dependencies and the display type is hidden, hide by default
        //if($this->dependencyOptions !== null && isset($this->dependencyOptions['display']) && $this->dependencyOptions['display'] == 'hide') {
        //    $componentDiv->setAttribute('style', 'display: none;');
        //}

        // Style
        if(!empty($this->style)) {
            $componentDiv->addToAttribute('style', $this->style);
        }

        // Label tag
        if($includeLabel) {
            $label = $this->generateComponentLabel();
            $componentDiv->insert($label);
        }

        return $componentDiv;
    }

    function updateRequiredText($requiredText) {
        $this->requiredText = $requiredText;
    }

    function generateComponentLabel() {
        if(empty($this->label)) {
            return '';
        }

        $label = new JFormElement('label', array(
            'id' => $this->id.'-label',
            'for' => $this->id,
            'class' => $this->labelClass
        ));
        $label->update($this->label);
        // Add the required star to the label
        if(in_array('required', $this->validationOptions)) {
            $labelRequiredStarSpan = new JFormElement('span', array(
                'class' => $this->labelRequiredStarClass
            ));
            $labelRequiredStarSpan->update($this->requiredText);
            $label->insert($labelRequiredStarSpan);
        }

        return $label;
    }

    function insertComponentDescription($div) {
        // Description
        if(!empty($this->description)) {
            $description = new JFormElement('div', array(
                'id' => $this->id.'-description',
                'class' => $this->descriptionClass
            ));
            $description->update($this->description);

            $div->insert($description);
        }

        return $div;
    }

    function insertComponentTip($div) {
        // Create the tip div if not empty
        if(!empty($this->tip)) {
            $tipDiv = new JFormElement('div', array(
                'id' => $this->id.'-tip',
                'style' => 'display: none;',
                'class' => $this->tipClass,
            ));
            $tipDiv->update($this->tip);
            $div->insert($tipDiv);
        }

        return $div;
    }

    // Generic validations

    public function required($options) { // Just override this if necessary
        $messageArray = array('Required.');
        //return empty($options['value']) ? 'success' : $messageArray; // Break validation on purpose
        return !empty($options['value']) || $options['value'] == '0' ? 'success' : $messageArray;
    }
}


class JFormComponentAddress extends JFormComponent {
    var $selectedCountry = null;
    var $selectedState = null;
    var $stateDropDown = false;
    var $emptyValues = null;
    var $showSublabels = true;
    var $unitedStatesOnly = false;
    var $addressLine2Hidden = false;

    /*
     * Constructor
     */
    function __construct($id, $label, $optionArray = array()) {
        // Class variables
        $this->id = $id;
        $this->name = $this->id;
        $this->label = $label;
        $this->class = 'jFormComponentAddress';
        
        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);

        // Set the empty values with a boolean
        if($this->emptyValues === true) {
            $this->emptyValues = array('addressLine1' => 'Street Address', 'addressLine2' => 'Address Line 2', 'city' => 'City', 'state' => 'State / Province / Region', 'zip' => 'Postal / Zip Code');
        }

        // United States only switch
        if($this->unitedStatesOnly) {
            $this->stateDropDown = true;
            $this->selectedCountry = 'US';
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
            $options['options']['emptyValue'] = $this->emptyValues;
        }

        if($this->stateDropDown){
            $options['options']['stateDropDown'] = true;
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

        // Add the Address Line 1 input tag
        $addressLine1Div = new JFormElement('div', array(
            'class' => 'addressLine1Div',
        ));
        $addressLine1 = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-addressLine1',
            'name' => $this->name.'-addressLine1',
            'class' => 'addressLine1',
        ));
        $addressLine1Div->insert($addressLine1);

        // Add the Address Line 2 input tag
        $addressLine2Div = new JFormElement('div', array(
            'class' => 'addressLine2Div',
        ));
        $addressLine2 = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-addressLine2',
            'name' => $this->name.'-addressLine2',
            'class' => 'addressLine2',
        ));
        $addressLine2Div->insert($addressLine2);

        // Add the city input tag
        $cityDiv = new JFormElement('div', array(
            'class' => 'cityDiv',
        ));
        $city = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-city',
            'name' => $this->name.'-city',
            'class' => 'city',
            'maxlength' => '15',
        ));
        $cityDiv->insert($city);

        // Add the State input tag
        $stateDiv = new JFormElement('div', array(
            'class' => 'stateDiv',
        ));
        if($this->stateDropDown){
            $state = new JFormElement('select', array(
                'id' => $this->id.'-state',
                'name' => $this->name.'-state',
                'class' => 'state',
            ));

            // Add any options that are not in an opt group to the select
            foreach(JFormComponentDropDown::getStateArray($this->selectedState) as $dropDownOption) {
                $optionValue = isset($dropDownOption['value']) ? $dropDownOption['value'] : '';
                $optionLabel = isset($dropDownOption['label']) ? $dropDownOption['label'] : '';
                $optionSelected = isset($dropDownOption['selected']) ? $dropDownOption['selected'] : false;
                $optionDisabled = isset($dropDownOption['disabled']) ? $dropDownOption['disabled'] : false;
                $optionOptGroup = isset($dropDownOption['optGroup']) ? $dropDownOption['optGroup'] : '';

                $state->insert($this->getOption($optionValue, $optionLabel, $optionSelected, $optionDisabled));
            }
        }
        else {
            $state = new JFormElement('input', array(
                'type' => 'text',
                'id' => $this->id.'-state',
                'name' => $this->name.'-state',
                'class' => 'state',
            ));
        }
        $stateDiv->insert($state);

        // Add the Zip input tag
        $zipDiv = new JFormElement('div', array(
            'class' => 'zipDiv',
        ));
        $zip = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-zip',
            'name' => $this->name.'-zip',
            'class' => 'zip',
            'maxlength' => '6',
        ));
        $zipDiv->insert($zip);

        // Add the country input tag
        $countryDiv = new JFormElement('div', array(
            'class' => 'countryDiv',
        ));
        // Don't built a select list if you are United States only
        if($this->unitedStatesOnly) {
            $country = new JFormElement('input', array(
                'type' => 'hidden',
                'id' => $this->id.'-country',
                'name' => $this->name.'-country',
                'class' => 'country',
                'value' => 'US',
                'style' => 'display: none;',
            ));
        }
        else {
            $country = new JFormElement('select', array(
                'id' => $this->id.'-country',
                'name' => $this->name.'-country',
                'class' => 'country',
            ));
            // Add any options that are not in an opt group to the select
            foreach(JFormComponentDropDown::getCountryArray($this->selectedCountry) as $dropDownOption) {
                $optionValue = isset($dropDownOption['value']) ? $dropDownOption['value'] : '';
                $optionLabel =  isset($dropDownOption['label']) ? $dropDownOption['label'] : '';
                $optionSelected = isset($dropDownOption['selected']) ? $dropDownOption['selected'] : false;
                $optionDisabled = isset($dropDownOption['disabled']) ? $dropDownOption['disabled'] : false;
                $optionOptGroup = isset($dropDownOption['optGroup']) ? $dropDownOption['optGroup'] : '';

                $country->insert($this->getOption($optionValue, $optionLabel, $optionSelected, $optionDisabled));
            }
        }
        $countryDiv->insert($country);

        // Set the empty values if they are enabled
        if(!empty($this->emptyValues)) {
            foreach($this->emptyValues as $empyValueKey => $emptyValue) {
                if($empyValueKey == 'addressLine1') {
                    $addressLine1->setAttribute('value', $emptyValue);
                    $addressLine1->addClassName('defaultValue');
                }
                if($empyValueKey == 'addressLine2') {
                    $addressLine2->setAttribute('value', $emptyValue);
                    $addressLine2->addClassName('defaultValue');
                }
                if($empyValueKey == 'city') {
                    $city->setAttribute('value', $emptyValue);
                    $city->addClassName('defaultValue');
                }
                if($empyValueKey == 'state' && !$this->stateDropDown) {
                    $state->setAttribute('value', $emptyValue);
                    $state->addClassName('defaultValue');
                }
                if($empyValueKey == 'zip') {
                    $zip->setAttribute('value', $emptyValue);
                    $zip->addClassName('defaultValue');
                }
            }
        }


        // Put the sublabels in if the option allows for it
        if($this->showSublabels) {
            $addressLine1Div->insert('<div class="jFormComponentSublabel"><p>Street Address</p></div>');
            $addressLine2Div->insert('<div class="jFormComponentSublabel"><p>Address Line 2</p></div>');
            $cityDiv->insert('<div class="jFormComponentSublabel"><p>City</p></div>');

            if($this->unitedStatesOnly) {
                $stateDiv->insert('<div class="jFormComponentSublabel"><p>State</p></div>');
            }
            else {
                $stateDiv->insert('<div class="jFormComponentSublabel"><p>State / Province / Region</p></div>');
            }

            if($this->unitedStatesOnly) {
                $zipDiv->insert('<div class="jFormComponentSublabel"><p>Zip Code</p></div>');
            }
            else {
                $zipDiv->insert('<div class="jFormComponentSublabel"><p>Postal / Zip Code</p></div>');
            }

            $countryDiv->insert('<div class="jFormComponentSublabel"><p>Country</p></div>');
        }

        // United States only switch
        if($this->unitedStatesOnly) {
            $countryDiv->setAttribute('style', 'display: none;');
        }

        // Hide address line 2
        if($this->addressLine2Hidden) {
            $addressLine2Div->setAttribute('style', 'display: none;');
        }

        // Insert the address components
        $componentDiv->insert($addressLine1Div);
        $componentDiv->insert($addressLine2Div);
        $componentDiv->insert($cityDiv);
        $componentDiv->insert($stateDiv);
        $componentDiv->insert($zipDiv);
        $componentDiv->insert($countryDiv);

        // Add any description (optional)
        $componentDiv = $this->insertComponentDescription($componentDiv);

        // Add a tip (optional)
        $componentDiv = $this->insertComponentTip($componentDiv);

        return $componentDiv->__toString();
    }

    // Address validations
    public function required($options) {
        $errorMessageArray = array();
        if($options['value']->addressLine1 == '') {
            array_push($errorMessageArray, array('Street Address is required.'));
        }
        if($options['value']->city == '') {
            array_push($errorMessageArray, array('City is required.'));
        }
        if($options['value']->state == '') {
            array_push($errorMessageArray, array('State is required.'));
        }
        if($options['value']->zip == '') {
            array_push($errorMessageArray, array('Zip is required.'));
        }
        if($options['value']->country == '') {
            array_push($errorMessageArray, array('Country is required.'));
        }
        return sizeof($errorMessageArray) < 1 ? 'success' : $errorMessageArray;
    }
}




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



class JFormComponentDropDown extends JFormComponent {
    var $dropDownOptionArray = array();

    var $disabled = false;
    var $multiple = false;
    var $size = null;
    var $width = null;

    /**
     * Constructor
     */
    function __construct($id, $label, $dropDownOptionArray, $optionArray = array()) {
        // General settings
        $this->id = $id;
        $this->name = $this->id;
        $this->class = 'jFormComponentDropDown';
        $this->label = $label;
        $this->dropDownOptionArray = $dropDownOptionArray;

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);
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

    public static function getCountryArray($selectedCountry = null) {
        $countryArray = array(array('value' => '', 'label'  => 'Select a Country', 'disabled' => true), array('value' => 'US', 'label'  => 'United States of America'), array('value' => 'AF', 'label'  => 'Afghanistan'), array('value' => 'AL', 'label'  => 'Albania'), array('value' => 'DZ', 'label'  => 'Algeria'), array('value' => 'AS', 'label'  => 'American Samoa'), array('value' => 'AD', 'label'  => 'Andorra'), array('value' => 'AO', 'label'  => 'Angola'), array('value' => 'AI', 'label'  => 'Anguilla'), array('value' => 'AQ', 'label'  => 'Antarctica'), array('value' => 'AG', 'label'  => 'Antigua and Barbuda'), array('value' => 'AR', 'label'  => 'Argentina'), array('value' => 'AM', 'label'  => 'Armenia'), array('value' => 'AW', 'label'  => 'Aruba'), array('value' => 'AU', 'label'  => 'Australia'), array('value' => 'AT', 'label'  => 'Austria'), array('value' => 'AZ', 'label'  => 'Azerbaijan'), array('value' => 'BS', 'label'  => 'Bahamas'), array('value' => 'BH', 'label'  => 'Bahrain'), array('value' => 'BD', 'label'  => 'Bangladesh'), array('value' => 'BB', 'label'  => 'Barbados'), array('value' => 'BY', 'label'  => 'Belarus'), array('value' => 'BE', 'label'  => 'Belgium'), array('value' => 'BZ', 'label'  => 'Belize'), array('value' => 'BJ', 'label'  => 'Benin'), array('value' => 'BM', 'label'  => 'Bermuda'), array('value' => 'BT', 'label'  => 'Bhutan'), array('value' => 'BO', 'label'  => 'Bolivia'), array('value' => 'BA', 'label'  => 'Bosnia and Herzegovina'), array('value' => 'BW', 'label'  => 'Botswana'), array('value' => 'BV', 'label'  => 'Bouvet Island'), array('value' => 'BR', 'label'  => 'Brazil'), array('value' => 'IO', 'label'  => 'British Indian Ocean Territory'), array('value' => 'BN', 'label'  => 'Brunei'), array('value' => 'BG', 'label'  => 'Bulgaria'), array('value' => 'BF', 'label'  => 'Burkina Faso'), array('value' => 'BI', 'label'  => 'Burundi'), array('value' => 'KH', 'label'  => 'Cambodia'), array('value' => 'CM', 'label'  => 'Cameroon'), array('value' => 'CA', 'label'  => 'Canada'), array('value' => 'CV', 'label'  => 'Cape Verde'), array('value' => 'KY', 'label'  => 'Cayman Islands'), array('value' => 'CF', 'label'  => 'Central African Republic'), array('value' => 'TD', 'label'  => 'Chad'), array('value' => 'CL', 'label'  => 'Chile'), array('value' => 'CN', 'label'  => 'China'), array('value' => 'CX', 'label'  => 'Christmas Island'), array('value' => 'CC', 'label'  => 'Cocos (Keeling) Islands'), array('value' => 'CO', 'label'  => 'Columbia'), array('value' => 'KM', 'label'  => 'Comoros'), array('value' => 'CG', 'label'  => 'Congo'), array('value' => 'CK', 'label'  => 'Cook Islands'), array('value' => 'CR', 'label'  => 'Costa Rica'), array('value' => 'CI', 'label'  => 'Cote D\'Ivorie (Ivory Coast)'), array('value' => 'HR', 'label'  => 'Croatia (Hrvatska)'), array('value' => 'CU', 'label'  => 'Cuba'), array('value' => 'CY', 'label'  => 'Cyprus'), array('value' => 'CZ', 'label'  => 'Czech Republic'), array('value' => 'CD', 'label'  => 'Democratic Republic of Congo (Zaire)'), array('value' => 'DK', 'label'  => 'Denmark'), array('value' => 'DJ', 'label'  => 'Djibouti'), array('value' => 'DM', 'label'  => 'Dominica'), array('value' => 'DO', 'label'  => 'Dominican Republic'), array('value' => 'TP', 'label'  => 'East Timor'), array('value' => 'EC', 'label'  => 'Ecuador'), array('value' => 'EG', 'label'  => 'Egypt'), array('value' => 'SV', 'label'  => 'El Salvador'), array('value' => 'GQ', 'label'  => 'Equatorial Guinea'), array('value' => 'ER', 'label'  => 'Eritrea'), array('value' => 'EE', 'label'  => 'Estonia'), array('value' => 'ET', 'label'  => 'Ethiopia'), array('value' => 'FK', 'label'  => 'Falkland Islands (Malvinas)'), array('value' => 'FO', 'label'  => 'Faroe Islands'), array('value' => 'FJ', 'label'  => 'Fiji'), array('value' => 'FI', 'label'  => 'Finland'), array('value' => 'FR', 'label'  => 'France'), array('value' => 'FX', 'label'  => 'France), Metropolitanarray('), array('value' => 'GF', 'label'  => 'French Guinea'), array('value' => 'PF', 'label'  => 'French Polynesia'), array('value' => 'TF', 'label'  => 'French Southern Territories'), array('value' => 'GA', 'label'  => 'Gabon'), array('value' => 'GM', 'label'  => 'Gambia'), array('value' => 'GE', 'label'  => 'Georgia'), array('value' => 'DE', 'label'  => 'Germany'), array('value' => 'GH', 'label'  => 'Ghana'), array('value' => 'GI', 'label'  => 'Gibraltar'), array('value' => 'GR', 'label'  => 'Greece'), array('value' => 'GL', 'label'  => 'Greenland'), array('value' => 'GD', 'label'  => 'Grenada'), array('value' => 'GP', 'label'  => 'Guadeloupe'), array('value' => 'GU', 'label'  => 'Guam'), array('value' => 'GT', 'label'  => 'Guatemala'), array('value' => 'GN', 'label'  => 'Guinea'), array('value' => 'GW', 'label'  => 'Guinea-Bissau'), array('value' => 'GY', 'label'  => 'Guyana'), array('value' => 'HT', 'label'  => 'Haiti'), array('value' => 'HM', 'label'  => 'Heard and McDonald Islands'), array('value' => 'HN', 'label'  => 'Honduras'), array('value' => 'HK', 'label'  => 'Hong Kong'), array('value' => 'HU', 'label'  => 'Hungary'), array('value' => 'IS', 'label'  => 'Iceland'), array('value' => 'IN', 'label'  => 'India'), array('value' => 'ID', 'label'  => 'Indonesia'), array('value' => 'IR', 'label'  => 'Iran'), array('value' => 'IQ', 'label'  => 'Iraq'), array('value' => 'IE', 'label'  => 'Ireland'), array('value' => 'IL', 'label'  => 'Israel'), array('value' => 'IT', 'label'  => 'Italy'), array('value' => 'JM', 'label'  => 'Jamaica'), array('value' => 'JP', 'label'  => 'Japan'), array('value' => 'JO', 'label'  => 'Jordan'), array('value' => 'KZ', 'label'  => 'Kazakhstan'), array('value' => 'KE', 'label'  => 'Kenya'), array('value' => 'KI', 'label'  => 'Kiribati'), array('value' => 'KW', 'label'  => 'Kuwait'), array('value' => 'KG', 'label'  => 'Kyrgyzstan'), array('value' => 'LA', 'label'  => 'Laos'), array('value' => 'LV', 'label'  => 'Latvia'), array('value' => 'LB', 'label'  => 'Lebanon'), array('value' => 'LS', 'label'  => 'Lesotho'), array('value' => 'LR', 'label'  => 'Liberia'), array('value' => 'LY', 'label'  => 'Libya'), array('value' => 'LI', 'label'  => 'Liechtenstein'), array('value' => 'LT', 'label'  => 'Lithuania'), array('value' => 'LU', 'label'  => 'Luxembourg'), array('value' => 'ME', 'label' => 'Montenegro'), array('value' => 'MO', 'label'  => 'Macau'), array('value' => 'MK', 'label'  => 'Macedonia'), array('value' => 'MG', 'label'  => 'Madagascar'), array('value' => 'MW', 'label'  => 'Malawi'), array('value' => 'MY', 'label'  => 'Malaysia'), array('value' => 'MV', 'label'  => 'Maldives'), array('value' => 'ML', 'label'  => 'Mali'), array('value' => 'MT', 'label'  => 'Malta'), array('value' => 'MH', 'label'  => 'Marshall Islands'), array('value' => 'MQ', 'label'  => 'Martinique'), array('value' => 'MR', 'label'  => 'Mauritania'), array('value' => 'MU', 'label'  => 'Mauritius'), array('value' => 'YT', 'label'  => 'Mayotte'), array('value' => 'MX', 'label'  => 'Mexico'), array('value' => 'FM', 'label'  => 'Micronesia'), array('value' => 'MD', 'label'  => 'Moldova'), array('value' => 'MC', 'label'  => 'Monaco'), array('value' => 'MN', 'label'  => 'Mongolia'), array('value' => 'MS', 'label'  => 'Montserrat'), array('value' => 'MA', 'label'  => 'Morocco'), array('value' => 'MZ', 'label'  => 'Mozambique'), array('value' => 'MM', 'label'  => 'Myanmar (Burma)'), array('value' => 'NA', 'label'  => 'Namibia'), array('value' => 'NR', 'label'  => 'Nauru'), array('value' => 'NP', 'label'  => 'Nepal'), array('value' => 'NL', 'label'  => 'Netherlands'), array('value' => 'AN', 'label'  => 'Netherlands Antilles'), array('value' => 'NC', 'label'  => 'New Caledonia'), array('value' => 'NZ', 'label'  => 'New Zealand'), array('value' => 'NI', 'label'  => 'Nicaragua'), array('value' => 'NE', 'label'  => 'Niger'), array('value' => 'NG', 'label'  => 'Nigeria'), array('value' => 'NU', 'label'  => 'Niue'), array('value' => 'NF', 'label'  => 'Norfolk Island'), array('value' => 'KP', 'label'  => 'North Korea'), array('value' => 'MP', 'label'  => 'Northern Mariana Islands'), array('value' => 'NO', 'label'  => 'Norway'), array('value' => 'OM', 'label'  => 'Oman'), array('value' => 'PK', 'label'  => 'Pakistan'), array('value' => 'PW', 'label'  => 'Palau'), array('value' => 'PA', 'label'  => 'Panama'), array('value' => 'PG', 'label'  => 'Papua New Guinea'), array('value' => 'PY', 'label'  => 'Paraguay'), array('value' => 'PE', 'label'  => 'Peru'), array('value' => 'PH', 'label'  => 'Philippines'), array('value' => 'PN', 'label'  => 'Pitcairn'), array('value' => 'PL', 'label'  => 'Poland'), array('value' => 'PT', 'label'  => 'Portugal'), array('value' => 'PR', 'label'  => 'Puerto Rico'), array('value' => 'QA', 'label'  => 'Qatar'), array('value' => 'RE', 'label'  => 'Reunion'), array('value' => 'RO', 'label'  => 'Romania'), array('value' => 'RS', 'label' => 'Serbia'), array('value' => 'RU', 'label'  => 'Russia'), array('value' => 'RW', 'label'  => 'Rwanda'), array('value' => 'SH', 'label'  => 'Saint Helena'), array('value' => 'KN', 'label'  => 'Saint Kitts and Nevis'), array('value' => 'LC', 'label'  => 'Saint Lucia'), array('value' => 'PM', 'label'  => 'Saint Pierre and Miquelon'), array('value' => 'VC', 'label'  => 'Saint Vincent and The Grenadines'), array('value' => 'SM', 'label'  => 'San Marino'), array('value' => 'ST', 'label'  => 'Sao Tome and Principe'), array('value' => 'SA', 'label'  => 'Saudi Arabia'), array('value' => 'SN', 'label'  => 'Senegal'), array('value' => 'SC', 'label'  => 'Seychelles'), array('value' => 'SL', 'label'  => 'Sierra Leone'), array('value' => 'SG', 'label'  => 'Singapore'), array('value' => 'SK', 'label'  => 'Slovak Republic'), array('value' => 'SI', 'label'  => 'Slovenia'), array('value' => 'SB', 'label'  => 'Solomon Islands'), array('value' => 'SO', 'label'  => 'Somalia'), array('value' => 'ZA', 'label'  => 'South Africa'), array('value' => 'GS', 'label'  => 'South Georgia'), array('value' => 'KR', 'label'  => 'South Korea'), array('value' => 'ES', 'label'  => 'Spain'), array('value' => 'LK', 'label'  => 'Sri Lanka'), array('value' => 'SD', 'label'  => 'Sudan'), array('value' => 'SR', 'label'  => 'Suriname'), array('value' => 'SJ', 'label'  => 'Svalbard and Jan Mayen'), array('value' => 'SZ', 'label'  => 'Swaziland'), array('value' => 'SE', 'label'  => 'Sweden'), array('value' => 'CH', 'label'  => 'Switzerland'), array('value' => 'SY', 'label'  => 'Syria'), array('value' => 'TW', 'label'  => 'Taiwan'), array('value' => 'TJ', 'label'  => 'Tajikistan'), array('value' => 'TZ', 'label'  => 'Tanzania'), array('value' => 'TH', 'label'  => 'Thailand'), array('value' => 'TG', 'label'  => 'Togo'), array('value' => 'TK', 'label'  => 'Tokelau'), array('value' => 'TO', 'label'  => 'Tonga'), array('value' => 'TT', 'label'  => 'Trinidad and Tobago'), array('value' => 'TN', 'label'  => 'Tunisia'), array('value' => 'TR', 'label'  => 'Turkey'), array('value' => 'TM', 'label'  => 'Turkmenistan'), array('value' => 'TC', 'label'  => 'Turks and Caicos Islands'), array('value' => 'TV', 'label'  => 'Tuvalu'), array('value' => 'UG', 'label'  => 'Uganda'), array('value' => 'UA', 'label'  => 'Ukraine'), array('value' => 'AE', 'label'  => 'United Arab Emirates'), array('value' => 'UK', 'label'  => 'United Kingdom'), array('value' => 'US', 'label'  => 'United States of America'), array('value' => 'UM', 'label'  => 'United States Minor Outlying Islands'), array('value' => 'UY', 'label'  => 'Uruguay'), array('value' => 'UZ', 'label'  => 'Uzbekistan'), array('value' => 'VU', 'label'  => 'Vanuatu'), array('value' => 'VA', 'label'  => 'Vatican City (Holy See)'), array('value' => 'VE', 'label'  => 'Venezuela'), array('value' => 'VN', 'label'  => 'Vietnam'), array('value' => 'VG', 'label'  => 'Virgin Islands (British)'), array('value' => 'VI', 'label'  => 'Virgin Islands (US)'), array('value' => 'WF', 'label'  => 'Wallis and Futuna Islands'), array('value' => 'EH', 'label'  => 'Western Sahara'), array('value' => 'WS', 'label'  => 'Western Samoa'), array('value' => 'YE', 'label'  => 'Yemen'), array('value' => 'YU', 'label'  => 'Yugoslavia'), array('value' => 'ZM', 'label'  => 'Zambia'), array('value' => 'ZW', 'label'  => 'Zimbabwe'));

        if(!empty($selectedCountry)) {
            foreach($countryArray as &$countryOption)  {
                if($countryOption['value'] == $selectedCountry) {
                    $countryOption['selected'] = true;
                    break;
                }
            }
        }
        else {
            $countryArray[0]['selected'] = true;
        }

        return $countryArray;
    }

    public static function getStateArray($selectedState = null) {
        $stateArray = array(array('value' => '', 'label'  => 'Select a State', 'disabled' => true), array('value' => 'AL', 'label'  => 'Alabama'), array('value' => 'AK', 'label'  => 'Alaska'), array('value' => 'AZ', 'label'  => 'Arizona'), array('value' => 'AR', 'label'  => 'Arkansas'), array('value' => 'CA', 'label'  => 'California'), array('value' => 'CO', 'label'  => 'Colorado'), array('value' => 'CT', 'label'  => 'Connecticut'), array('value' => 'DE', 'label'  => 'Delaware'), array('value' => 'DC', 'label'  => 'District of Columbia'), array('value' => 'FL', 'label'  => 'Florida'), array('value' => 'GA', 'label'  => 'Georgia'), array('value' => 'HI', 'label'  => 'Hawaii'), array('value' => 'ID', 'label'  => 'Idaho'), array('value' => 'IL', 'label'  => 'Illinois'), array('value' => 'IN', 'label'  => 'Indiana'), array('value' => 'IA', 'label'  => 'Iowa'), array('value' => 'KS', 'label'  => 'Kansas'), array('value' => 'KY', 'label'  => 'Kentucky'), array('value' => 'LA', 'label'  => 'Louisiana'), array('value' => 'ME', 'label'  => 'Maine'), array('value' => 'MD', 'label'  => 'Maryland'), array('value' => 'MA', 'label'  => 'Massachusetts'), array('value' => 'MI', 'label'  => 'Michigan'), array('value' => 'MN', 'label'  => 'Minnesota'), array('value' => 'MS', 'label'  => 'Mississippi'), array('value' => 'MO', 'label'  => 'Missouri'), array('value' => 'MT', 'label'  => 'Montana'), array('value' => 'NE', 'label'  => 'Nebraska'), array('value' => 'NV', 'label'  => 'Nevada'), array('value' => 'NH', 'label'  => 'New Hampshire'), array('value' => 'NJ', 'label'  => 'New Jersey'), array('value' => 'NM', 'label'  => 'New Mexico'), array('value' => 'NY', 'label'  => 'New York'), array('value' => 'NC', 'label'  => 'North Carolina'), array('value' => 'ND', 'label'  => 'North Dakota'), array('value' => 'OH', 'label'  => 'Ohio'), array('value' => 'OK', 'label'  => 'Oklahoma'), array('value' => 'OR', 'label'  => 'Oregon'), array('value' => 'PA', 'label'  => 'Pennsylvania'), array('value' => 'RI', 'label'  => 'Rhode Island'), array('value' => 'SC', 'label'  => 'South Carolina'), array('value' => 'SD', 'label'  => 'South Dakota'), array('value' => 'TN', 'label'  => 'Tennessee'), array('value' => 'TX', 'label'  => 'Texas'), array('value' => 'UT', 'label'  => 'Utah'), array('value' => 'VT', 'label'  => 'Vermont'), array('value' => 'VA', 'label'  => 'Virginia'), array('value' => 'WA', 'label'  => 'Washington'), array('value' => 'WV', 'label'  => 'West Virginia'), array('value' => 'WI', 'label'  => 'Wisconsin'), array('value' => 'WY', 'label'  => 'Wyoming'));

        if(!empty($selectedState)) {
            foreach($stateArray as &$stateOption)  {
                if($stateOption['value'] == $selectedState) {
                    $stateOption['selected'] = true;
                    break;
                }
            }
        }
        else {
            $stateArray[0]['selected'] = true;
        }

        return $stateArray;
    }

    public static function getMonthArray() {
        return array(array('value' => '01', 'label'  => 'January'), array('value' => '02', 'label'  => 'February'), array('value' => '03', 'label'  => 'March'), array('value' => '04', 'label'  => 'April'), array('value' => '05', 'label'  => 'May'), array('value' => '06', 'label'  => 'June'), array('value' => '07', 'label'  => 'July'), array('value' => '08', 'label'  => 'August'), array('value' => '09', 'label'  => 'September'), array('value' => '10', 'label'  => 'October'), array('value' => '11', 'label'  => 'November'), array('value' => '12', 'label'  => 'December'));
    }

    public static function getYearArray($minYear, $maxYear) {
        $yearArray = array();
        for($i = $maxYear - $minYear; $i > 0; $i--) {
            $yearArray[] = array('value' => $i + $minYear, 'label' => $i + $minYear);
        }
        return $yearArray;
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Div tag contains everything about the component
        $div = parent::generateComponentDiv();

        // Select tag
        $select = new JFormElement('select', array(
            'id' => $this->id,
            'name' => $this->name,
            'class' => $this->class,
        ));

        // Only use if disabled is set, otherwise will throw an error
        if($this->disabled) {
            $select->setAttribute('disabled', 'disabled');
        }
        if($this->multiple) {
            $select->setAttribute('multiple', 'multiple');
        }
        if($this->size != null) {
            $select->setAttribute('size', $this->size);
        }
        if($this->width != null) {
            $select->setAttribute('style', 'width:'.$this->width);
        }

        // Check for any opt groups
        $optGroupArray = array();
        foreach($this->dropDownOptionArray as $dropDownOption) {
            if(isset($dropDownOption['optGroup']) && !empty($dropDownOption['optGroup'])) {
                $optGroupArray[] = $dropDownOption['optGroup'];
            }
        }
        $optGroupArray = array_unique($optGroupArray);

        // Create the optgroup elements
        foreach($optGroupArray as $optGroup) {
            ${$optGroup} = new JFormElement('optgroup', array('label' => $optGroup));
        }

        // Add any options to their appropriate optgroup
        foreach($this->dropDownOptionArray as $dropDownOption) {
            if(isset($dropDownOption['optGroup']) && !empty($dropDownOption['optGroup'])) {
                $optionValue = isset($dropDownOption['value']) ? $dropDownOption['value'] : '';
                $optionLabel =  isset($dropDownOption['label']) ? $dropDownOption['label'] : '';
                $optionSelected =  isset($dropDownOption['selected']) ? $dropDownOption['selected'] : false;
                $optionDisabled =  isset($dropDownOption['disabled']) ? $dropDownOption['disabled'] : false;
                $optionOptGroup =  isset($dropDownOption['optGroup']) ? $dropDownOption['optGroup'] : '';
            
                ${$dropDownOption['optGroup']}->insert($this->getOption($optionValue, $optionLabel, $optionSelected, $optionDisabled));
            }
        }
        
        // Add any options that are not in an opt group to the select
        foreach($this->dropDownOptionArray as $dropDownOption) {
            // Handle optgroup addition - only add the group if you haven't seen it yet
            if(isset($dropDownOption['optGroup']) && !empty($dropDownOption['optGroup']) && !isset(${$dropDownOption['optGroup'].'Added'})) {
                $select->insert(${$dropDownOption['optGroup']});
                ${$dropDownOption['optGroup'].'Added'} = true;
            }
            // Add any other elements
            else if(!isset($dropDownOption['optGroup'])) {
                $optionValue = isset($dropDownOption['value']) ? $dropDownOption['value'] : '';
                $optionLabel =  isset($dropDownOption['label']) ? $dropDownOption['label'] : '';
                $optionSelected =  isset($dropDownOption['selected']) ? $dropDownOption['selected'] : false;
                $optionDisabled =  isset($dropDownOption['disabled']) ? $dropDownOption['disabled'] : false;
                $optionOptGroup =  isset($dropDownOption['optGroup']) ? $dropDownOption['optGroup'] : '';

                $select->insert($this->getOption($optionValue, $optionLabel, $optionSelected, $optionDisabled));
            }
        }

        // Add the select box to the div
        $div->insert($select);

        // Add any description (optional)
        $div = $this->insertComponentDescription($div);

        // Add a tip (optional)
        $div = $this->insertComponentTip($div, $this->id.'-div');

        return $div->__toString();
    }
}




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




class JFormComponentHidden extends JFormComponent {
    /*
     * Constructor
     */
    function __construct($id, $value, $optionArray = array()) {
        // Class variables
        $this->id = $id;
        $this->name = $this->id;
        $this->class = 'jFormComponentHidden';

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);

        // Prevent the value from being overwritten
        $this->value = $value;
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Generate the component div without a label
        $div = $this->generateComponentDiv(false);
        $div->addToAttribute('style', 'display: none;');

        // Input tag
        $input = new JFormElement('input', array(
            'type' => 'hidden',
            'id' => $this->id,
            'name' => $this->name,
            'value' => $this->value,
        ));
        $div->insert($input);

        return $div->__toString();
    }
}



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



class JFormComponentLikert extends JFormComponent {
    var $choiceArray = array();
    var $statementArray = array();
    var $showTableHeading = true;
    var $collapseLabelIntoTableHeading = false;

    /**
     * Constructor
     */
    function __construct($id, $label, $choiceArray, $statementArray, $optionsArray) {
        // General settings
        $this->id = $id;
        $this->name = $this->id;
        $this->class = 'jFormComponentLikert';
        $this->label = $label;

        $this->choiceArray = $choiceArray;
        $this->statementArray = $statementArray;

        // Initialize the abstract FormComponent object
        $this->initialize($optionsArray);
    }

    function getOptions() {
        $options = parent::getOptions();

        $statementArray = array();
        foreach($this->statementArray as $statement) {
            $statementArray[$statement['name']] = array();

            if(!empty($statement['validationOptions'])) {
                $statementArray[$statement['name']]['validationOptions'] = $statement['validationOptions'];
            }

            if(!empty($statement['triggerFunction'])) {
                $statementArray[$statement['name']]['triggerFunction'] = $statement['triggerFunction'];
            }
        }

        $options['options']['statementArray'] = $statementArray;

        // Make sure you have an options array to manipulate
        if(!isset($options['options'])) {
            $options['options']  = array();
        }

        return $options;
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Generate the component div
        $componentDiv = parent::generateComponentDiv(!$this->collapseLabelIntoTableHeading);

        // Create the table
        $table = new JFormElement('table', array('class' => 'jFormComponentLikertTable'));

        // Generate the first row
        if($this->showTableHeading) {
            $tableHeadingRow = new JFormElement('tr', array('class' => 'jFormComponentLikertTableHeading'));

            $tableHeading = new JFormElement('th', array(
                'class' => 'jFormComponentLikertStatementColumn',
            ));
            // Collapse the label into the heading if the option is set
            if($this->collapseLabelIntoTableHeading) {
                $tableHeadingLabel = new JFormElement('label', array(
                    'class' => 'jFormComponentLikertStatementLabel',
                ));
                $tableHeadingLabel->update($this->label);
                // Add the required star to the label
                if(in_array('required', $this->validationOptions)) {
                    $labelRequiredStarSpan = new JFormElement('span', array(
                        'class' => $this->labelRequiredStarClass
                    ));
                    $labelRequiredStarSpan->update(' *');
                    $tableHeadingLabel->insert($labelRequiredStarSpan);
                }
                $tableHeading->insert($tableHeadingLabel);
            }
            $tableHeadingRow->insert($tableHeading);

            foreach($this->choiceArray as $choice) {
                $tableHeadingRow->insert('<th>'.$choice['label'].'</th>');
            }
            $table->insert($tableHeadingRow);
        }
        
        // Insert each of the statements
        $statementCount = 0;
        foreach($this->statementArray as $statement) {
            // Set the row style
            if($statementCount % 2 == 0) {
                $statementRowClass = 'jFormComponentLikertTableRowEven';
            }
            else {
                $statementRowClass = 'jFormComponentLikertTableRowOdd';
            }

            // Set the statement
            $statementRow = new JFormElement('tr', array('class' => $statementRowClass));
            $statementColumn = new JFormElement('td', array('class' => 'jFormComponentLikertStatementColumn'));
            $statementLabel = new JFormElement('label', array(
                'class' => 'jFormComponentLikertStatementLabel',
                'for' => $statement['name'].'-choice1',
            ));
            $statementColumn->insert($statementLabel->insert($statement['statement']));

            // Set the statement description (optional)
            if(!empty($statement['description'])) {
                $statementDescription = new JFormElement('div', array(
                    'class' => 'jFormComponentLikertStatementDescription',
                ));
                $statementColumn->insert($statementDescription->update($statement['description']));
            }

            // Insert a tip (optional)
            if(!empty($statement['tip'])) {
                $statementTip = new JFormElement('div', array(
                    'class' => 'jFormComponentLikertStatementTip',
                    'style' => 'display: none;',
                ));
                $statementColumn->insert($statementTip->update($statement['tip']));
            }

            $statementRow->insert($statementColumn);

            $choiceCount = 1;
            foreach($this->choiceArray as $choice) {
                $choiceColumn = new JFormElement('td');

                $choiceInput = new JFormElement('input', array(
                    'id' => $statement['name'].'-choice'.$choiceCount,
                    'type' => 'radio',
                    'value' => $choice['value'],
                    'name' => $statement['name'],
                ));
                // Set a selected value if defined
                if(!empty($statement['selected'])) {
                    if($statement['selected'] == $choice['value']) {
                        $choiceInput->setAttribute('checked', 'checked');
                    }
                }
                $choiceColumn->insert($choiceInput);

                // Choice sub labels
                if(!empty($choice['sublabel'])) {
                    $choiceSublabel = new JFormElement('label', array(
                        'class' => 'jFormComponentLikertSublabel',
                        'for' => $statement['name'].'-choice'.$choiceCount,
                    ));
                    $choiceSublabel->update($choice['sublabel']);
                    $choiceColumn->insert($choiceSublabel);
                }

                $statementRow->insert($choiceColumn);
                $choiceCount++;
            }
            $statementCount++;

            $table->insert($statementRow);
        }

        $componentDiv->insert($table);

        // Add any description (optional)
        $componentDiv = $this->insertComponentDescription($componentDiv);

        // Add a tip (optional)
        $componentDiv = $this->insertComponentTip($componentDiv, $this->id.'-div');

        return $componentDiv->__toString();
    }

    // Validation
    public function required($options) {
        $errorMessageArray = array();
        foreach($options['value'] as $key => $statement) {
            if(empty($statement)) {
                //print_r($key);
                //print_r($statement);
                array_push($errorMessageArray, array($key => 'Required.'));
            }
        }

        return sizeof($errorMessageArray) == 0 ? 'success' : $errorMessageArray;
    }
}

class JFormComponentLikertStatement extends JFormComponent {
    /**
     * Constructor
     */
    function __construct($id, $label, $choiceArray, $statementArray, $optionsArray) {
        // General settings
        $this->id = $id;
        $this->name = $this->id;
        $this->class = 'jFormComponentLikertStatement';
        $this->label = $label;
        // Initialize the abstract FormComponent object
        $this->initialize($optionsArray);
    }

    function  __toString() {
        return;
    }
}




class JFormComponentMultipleChoice extends JFormComponent {
    var $multipleChoiceType = 'checkbox'; // radio, checkbox
    var $multipleChoiceClass = 'choice';
    var $multipleChoiceLabelClass = 'choiceLabel';
    var $multipleChoiceArray = array();
    var $showMultipleChoiceTipIcons = true;

    /**
     * Constructor
     */
    function __construct($id, $label, $multipleChoiceArray, $optionArray = array()) {
        // General settings
        $this->id = $id;
        $this->name = $this->id;
        $this->class = 'jFormComponentMultipleChoice';
        $this->label = $label;
        $this->multipleChoiceArray = $multipleChoiceArray;

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);
    }

    function hasInstanceValues() {
        if($this->multipleChoiceType == 'radio' ){
            return is_array($this->value);
        } else {
            if(!empty($this->value)){
                return is_array($this->value[0]);
            }
        }
        return false;
    }

     /**
     * MultipleChoice Specific Instance Handling for validation
     *
     */
     function validateComponent() {
        $this->passedValidation = true;
        $this->errorMessageArray = array();

        if(is_array($this->value[0])){
            foreach($this->value as $value){
                $this->errorMessageArray[] = $this->validate($value);
            }
        }
        else {
            $this->errorMessageArray = $this->validate($this->value);
        }
    }

    function getOptions() {
        $options = parent::getOptions();

        // Make sure you have an options array to manipulate
        if(!isset($options['options'])) {
            $options['options']  = array();
        }

        // Set the multiple choice type
        $options['options']['multipleChoiceType'] = $this->multipleChoiceType;

        return $options;
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Generate the component div
        if(sizeof($this->multipleChoiceArray) > 1) {
            $div = parent::generateComponentDiv();
        }
        else {
            $div = parent::generateComponentDiv(false);
        }
        
        // Case
        // array(array('value' => 'option1', 'label' => 'Option 1', 'checked' => 'checked', 'tip' => 'This is a tip'))
        $multipleChoiceCount = 0;
        foreach($this->multipleChoiceArray as $multipleChoice) {
            
            $multipleChoiceValue = isset($multipleChoice['value']) ? $multipleChoice['value'] : '';
            $multipleChoiceLabel =  isset($multipleChoice['label']) ? $multipleChoice['label'] : '';
            $multipleChoiceChecked =  isset($multipleChoice['checked']) ? $multipleChoice['checked'] : false;
            $multipleChoiceTip =  isset($multipleChoice['tip']) ? $multipleChoice['tip'] : '';
            $multipleChoiceDisabled =  isset($multipleChoice['disabled']) ? $multipleChoice['disabled'] : '';
            $multipleChoiceInputHidden =  isset($multipleChoice['inputHidden']) ? $multipleChoice['inputHidden'] : '';

            $multipleChoiceCount++;

            $div->insert($this->getMultipleChoiceWrapper($multipleChoiceValue, $multipleChoiceLabel, $multipleChoiceChecked, $multipleChoiceTip, $multipleChoiceDisabled, $multipleChoiceInputHidden, $multipleChoiceCount));
        }

        // Add any description (optional)
        $div = $this->insertComponentDescription($div);

        // Add a tip (optional)
        $div = $this->insertComponentTip($div, $this->id.'-div');

        return $div->__toString();
    }
    
    //function to insert tips onto the wrappers

    function getMultipleChoiceWrapper($multipleChoiceValue, $multipleChoiceLabel, $multipleChoiceChecked, $multipleChoiceTip, $multipleChoiceDisabled, $multipleChoiceInputHidden, $multipleChoiceCount) {
        // Make a wrapper div for the input and label
        $multipleChoiceWrapperDiv = new JFormElement('div', array(
            'id' => $this->id.'-choice'.$multipleChoiceCount.'-wrapper',
            'class' => $this->multipleChoiceClass.'Wrapper',
        ));

        // Input tag
        $input = new JFormElement('input', array(
            'type' => $this->multipleChoiceType,
            'id' => $this->id.'-choice'.$multipleChoiceCount,
            'name' => $this->name,
            'value' => $multipleChoiceValue,
            'class' => $this->multipleChoiceClass,
            'style' => 'display: inline;',
        ));
        if($multipleChoiceChecked == 'checked') {
            $input->setAttribute('checked', 'checked');
        }
        if($multipleChoiceDisabled) {
            $input->setAttribute('disabled', 'disabled');
        }
        if($multipleChoiceInputHidden) {
            $input->setAttribute('style', 'display: none;');
        }
        $multipleChoiceWrapperDiv->insert($input);

        // Multiple choice label
        $multipleChoiceLabelElement = new JFormElement('label', array(
            'for' => $this->id.'-choice'.$multipleChoiceCount,
            'class' => $this->multipleChoiceLabelClass,
            'style' => 'display: inline;',
        ));
        // Add an image to the label if there is a tip
        if(!empty($multipleChoiceTip) && $this->showMultipleChoiceTipIcons) {
            $multipleChoiceLabelElement->update($multipleChoiceLabel.' <span class="jFormComponentMultipleChoiceTipIcon">&nbsp;</span>');
        }
        else {
            $multipleChoiceLabelElement->update($multipleChoiceLabel);
        }
        // Add a required star if there is only one multiple choice option and it is required
        if(sizeof($this->multipleChoiceArray) == 1) {
            // Add the required star to the label
            if(in_array('required', $this->validationOptions)) {
                $labelRequiredStarSpan = new JFormElement('span', array(
                    'class' => $this->labelRequiredStarClass
                ));
                $labelRequiredStarSpan->update(' *');
                $multipleChoiceLabelElement->insert($labelRequiredStarSpan);
            }
        }
        $multipleChoiceWrapperDiv->insert($multipleChoiceLabelElement);

        // Multiple choice tip
        if(!empty($multipleChoiceTip)) {
            $multipleChoiceTipDiv = new JFormElement('div', array(
                'id' => $this->id.'-'.$multipleChoiceValue.'-tip',
                'style' => 'display: none;',
                'class' => 'jFormComponentMultipleChoiceTip'
            ));
            $multipleChoiceTipDiv->update($multipleChoiceTip);
            $multipleChoiceWrapperDiv->insert($multipleChoiceTipDiv);
        }

        return $multipleChoiceWrapperDiv;
    }


    // Validations
    public function required($options) {
        $errorMessageArray = array('Required.');
        return  sizeof($options['value']) > 0 ? 'success' : $errorMessageArray;
    }
    public function minOptions($options) {
        $errorMessageArray = array('You must select more than '. $options['minOptions'] .' options');
        return sizeof($options['value']) == 0 || sizeof($options['value']) > $options['minOptions'] ? 'success' : $errorMessageArray;
    }
    public function maxOptions($options) {
        $errorMessageArray = array('You may select up to '. $options['maxOptions'] .' options. You have selected '. sizeof($options['value']) . '.');
        return sizeof($options['value']) == 0 || sizeof($options['value']) <= $options['maxOptions'] ? 'success' : $errorMessageArray;
    }
}




class JFormComponentName extends JFormComponent {
    var $middleInitialHidden = false;
    var $emptyValues = null;
    var $showSublabels = true;

    /*
     * Constructor
     */
    function __construct($id, $label, $optionArray = array()) {
        // Class variables
        $this->id = $id;
        $this->name = $this->id;
        $this->label = $label;
        $this->class = 'jFormComponentName';

        // Input options
        $this->initialValues = array('firstName' => '', 'middleInitial' => '', 'lastName' => '');

        if($this->emptyValues === true) {
            $this->emptyValues = array('firstName' => 'First Name', 'middleInitial' => 'M' ,'lastName' => 'Last Name');
        }
        //$this->mask = '';

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);
    }

    function hasInstanceValues() {
        return is_array($this->value);
    }

    function getOptions() {
        $options = parent::getOptions();

        if(!empty($this->emptyValues)) {
            $options['options']['emptyValue'] = $this->emptyValues;
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
        $div = $this->generateComponentDiv();


        $firstNameDiv = new JFormElement('div', array(
            'class' => 'firstNameDiv',
        ));
        // Add the first name input tag
        $firstName = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-firstName',
            'name' => $this->name.'-firstName',
            'class' => 'firstName singleLineText',
            'value' => $this->initialValues['firstName'],
        ));
        $firstNameDiv->insert($firstName);

        // Add the middle initial input tag
        $middleInitialDiv = new JFormElement('div', array(
            'class' => 'middleInitialDiv',
        ));
        $middleInitial = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-middleInitial',
            'name' => $this->name.'-middleInitial',
            'class' => 'middleInitial singleLineText',
            'maxlength' => '1',
            'value' => (isset($this->initialValues['middleInitial']) ? $this->initialValues['middleInitial'] : ''),
        ));
        if($this->middleInitialHidden) {
            $middleInitial->setAttribute('style', 'display: none;');
            $middleInitialDiv->setAttribute('style', 'display: none;');
        }
        $middleInitialDiv->insert($middleInitial);
        

        // Add the last name input tag
        $lastNameDiv = new JFormElement('div', array(
            'class' => 'lastNameDiv',
        ));
        $lastName = new JFormElement('input', array(
            'type' => 'text',
            'id' => $this->id.'-lastName',
            'name' => $this->name.'-lastName',
            'class' => 'lastName singleLineText',
            'value' => $this->initialValues['lastName'],
        ));
        $lastNameDiv->insert($lastName);

        if(!empty($this->emptyValues)){
            $this->emptyValues = array('firstName' => 'First Name', 'middleInitial' => 'M' ,'lastName' => 'Last Name');
            foreach($this->emptyValues as $key => $value) {
            if($key == 'firstName') {
                $firstName->setAttribute('value', $value);
                $firstName->addClassName('defaultValue');
            }
            if($key == 'middleInitial') {
                $middleInitial->setAttribute('value', $value);
                $middleInitial->addClassName('defaultValue');
            }
            if($key == 'lastName') {
                $lastName->setAttribute('value', $value);
                $lastName->addClassName('defaultValue');
            }
        }
            
        }

        if($this->showSublabels) {
            $firstNameDiv->insert('<div class="jFormComponentSublabel"><p>First Name</p></div>');
            $middleInitialDiv->insert('<div class="jFormComponentSublabel"><p>MI</p></div>');
            $lastNameDiv->insert('<div class="jFormComponentSublabel"><p>Last Name</p></div>');
        }
        
        $div->insert($firstNameDiv);
        $div->insert($middleInitialDiv);
        $div->insert($lastNameDiv);

        // Add any description (optional)
        $div = $this->insertComponentDescription($div);

        // Add a tip (optional)
        $div = $this->insertComponentTip($div);

        return $div->__toString();
    }

    public function required($options) {
        $errorMessageArray = array();
        if($options['value']->firstName == '') {
            array_push($errorMessageArray, array('First name is required.'));
        }
        if($options['value']->lastName == '') {
            array_push($errorMessageArray, array('Last name is required.'));
        }
        return sizeof($errorMessageArray) == 0 ? 'success' : $errorMessageArray;
    }
}




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