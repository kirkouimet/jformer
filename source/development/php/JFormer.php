<?php
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
            $element.= ' />';
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



/**
 * A Form object
 */


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

    // Form options
    var $alertsEnabled = true;
    var $clientSideValidation = true;
    var $debugMode = false;
    var $validationTips = true;

    // Page navigator
    var $pageNavigatorEnabled = false;
    var $pageNavigator = array();

    // Progress bar
    var $progressBar = false;

    // Splash page
    var $splashPageEnabled = false;
    var $splashPage = array();

    // Save state options
    var $saveStateEnabled = false;
    var $saveState = array();

    // Animations
    var $animationOptions = null;

    // Custom script execution before form submission
    var $onSubmitStartClientSide = '';
    var $onSubmitFinishClientSide = '';

    // Security options
    var $requireSsl = false; // Not implemented yet

    // Essential class variables
    var $status = array('status' => 'processing', 'response' => 'Form initialized.');

    // Validation
    var $jValidator;
    var $validationResponse = array();
    var $validationPassed = null;

    /**
     * Constructor
     */
    function __construct($id, $optionArray = array(), $jFormPageArray = array()) {
        // Set the id
        $this->id = $id;

        // Set the action dynamically
        $callingFile = debug_backtrace();
        $callingFile = $callingFile[0]['file'];
        $this->action = str_replace($_SERVER['DOCUMENT_ROOT'], '', $callingFile);

        // Use the options array to update the form variables
        if(is_array($optionArray)) {
            foreach($optionArray as $option => $value) {
                $this->{$option} = $value;
            }
        }
        
        // Set defaults for the page navigator        
        if(!empty($this->pageNavigator)) {
            $this->pageNavigatorEnabled = true;
        }
        else if($this->pageNavigator == true){
            $this->pageNavigator = array(
                'position' => 'top'
            );
        }

        // Set defaults for the save state
        if(!empty($this->saveState)) {
            $this->saveStateEnabled = true;

            if(empty($this->saveState['showSavingAlert'])) {
                $this->saveState['showSavingAlert'] = true;
            }
        }
        else {
            $this->saveState = array(
                'interval' => 30,
                'showSavingAlert' => true,
            );
        }

        // Set defaults for the splash page
        if(!empty($this->splashPage)) {
            $this->splashPageEnabled = true;
        }
        else if($this->saveStateEnabled == true) {
            $this->splashPage = array(
                'content' => '',
                'splashButtonText' => 'Begin'
            );
        }

        // Add the pages from the constructor
        foreach($jFormPageArray as $jFormPage) {
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
        if(empty($this->jFormPageArray)) {
            $this->addJFormPage(new JFormPage($this->id.'_page1', array('anonymous' => true)));
        }

        // Get the first page in the jFormPageArray
        $currentJFormPage = current($this->jFormPageArray);

        // Get the last section in the page
        $lastJFormSection = end($currentJFormPage->jFormSectionArray);

        // If the last section exists and is anonymous, add the component to it
        if(!empty($lastJFormSection) && $lastJFormSection->anonymous) {
            $lastJFormSection->addJFormComponent($jFormComponent);
        }
        // If the last section in the page does not exist or is not anonymous, add a new anonymous section and add the component to it
        else {
            // Create an anonymous section
            $anonymousSection = new JFormSection($currentJFormPage->id.'_section'.(sizeof($currentJFormPage->jFormSectionArray) + 1), array('anonymous' => true));

            // Add the anonymous section to the page
            $currentJFormPage->addJFormSection($anonymousSection->addJFormComponent($jFormComponent));
        }

        return $this;
    }
    function addJFormComponentArray($jFormComponentArray) {
        foreach($jFormComponentArray as $jFormComponent) {
            $this->addJFormComponent($jFormComponent);
        }
        return $this;
    }

    // Convenience method, no need to create a to get a section on the form
    function addJFormSection($jFormSection) {
        // Create an anonymous page if necessary
        if(empty($this->jFormPageArray)) {
            $this->addJFormPage(new JFormPage($this->id.'_page1', array('anonymous' => true)));
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
        foreach($this->jFormPageArray as $jFormPage) {
            $this->validationResponse[$jFormPage->id] = $jFormPage->validate();
        }
        // Walk through all of the pages to see if there are any errors
        $this->validationPassed = true;

        foreach($this->validationResponse as $jFormPageKey => $jFormPage) {
            foreach($jFormPage as $jFormSectionKey => $jFormSection) {
                // If there are section instances
                if($jFormSection != null && array_key_exists(0, $jFormSection) && is_array($jFormSection[0])) {
                    foreach($jFormSection as $jFormSectionInstanceIndex => $jFormSectionInstance) {
                        foreach($jFormSectionInstance as $jFormComponentKey => $jFormComponentErrorMessageArray) {
                            // If there are component instances
                            if($jFormComponentErrorMessageArray != null && array_key_exists(0, $jFormComponentErrorMessageArray) && is_array($jFormComponentErrorMessageArray[0])) {
                                foreach($jFormComponentErrorMessageArray as $jFormComponentInstanceErrorMessageArray)  {
                                    // If the first value is not empty, the component did not pass validation
                                    if(!empty($jFormComponentInstanceErrorMessageArray[0]) || sizeof($jFormComponentInstanceErrorMessageArray) > 1) {
                                        $this->validationPassed = false;
                                    }
                                }
                            }
                            else {
                                if(!empty($jFormComponentErrorMessageArray)) {
                                    $this->validationPassed = false;
                                }
                            }
                        }
                    }
                }
                // No section instances
                else {
                    foreach($jFormSection as $jFormComponentErrorMessageArray) {
                        // Component instances
                        if($jFormComponentErrorMessageArray != null && array_key_exists(0, $jFormComponentErrorMessageArray) && is_array($jFormComponentErrorMessageArray[0])) {
                            foreach($jFormComponentErrorMessageArray as $jFormComponentInstanceErrorMessageArray)  {
                                // If the first value is not empty, the component did not pass validation
                                if(!empty($jFormComponentInstanceErrorMessageArray[0]) || sizeof($jFormComponentInstanceErrorMessageArray) > 1) {
                                    $this->validationPassed = false;
                                }
                            }
                        }
                        else {
                            if(!empty($jFormComponentErrorMessageArray)) {
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

        foreach($this->jFormPageArray as $jFormPageKey => $jFormPage) {
            if(!$jFormPage->anonymous) {
                $this->data[$jFormPageKey] = $jFormPage->getData();
            }
            else {
                foreach($jFormPage->jFormSectionArray as $jFormSectionKey => $jFormSection) {
                    if(!$jFormSection->anonymous) {
                        $this->data[$jFormSectionKey] = $jFormSection->getData();
                    }
                    else {
                        foreach($jFormSection->jFormComponentArray as $jFormComponentKey => $jFormComponent) {
                            if(get_class($jFormComponent) != 'JFormComponentHtml') { // Don't include HTML components
                                $this->data[$jFormComponentKey] = $jFormComponent->getValue();
                            }
                        }
                    }
                }
            }
        }
        return json_decode(json_encode($this->data));
    }

    function setData($data, $fileArray = array()) {
        // Get the form data as an object, handle apache auto-add slashes on post requests
        $jFormerData = json_decode(urldecode($data));
        if(!is_object($jFormerData)) {
            $jFormerData = json_decode(urldecode(stripslashes($data)));
        }

        // Clear all of the component values
        $this->clearData();

        //print_r($jFormerData); exit();
        //print_r($fileArray);

        // Update the form status
        $this->setStatus('processing', 'Setting component values.');

        // Assign all of the received JSON values to the form
        foreach($jFormerData as $jFormPageKey => $jFormPageData) {
            $this->jFormPageArray[$jFormPageKey]->setData($jFormPageData);
        }
        
        // Handle files
        if(!empty($fileArray)) {
            foreach($fileArray as $jFormComponentId => $fileDataArray) {
                preg_match('/(-section([0-9])+)?(-instance([0-9])+)?:([A-Za-z0-9_-]+):([A-Za-z0-9_-]+)/', $jFormComponentId, $fileIdInfo);

                $jFormComponentId = str_replace($fileIdInfo[0], '', $jFormComponentId);
                $jFormPageId = $fileIdInfo[5];
                $jFormSectionId = $fileIdInfo[6];

                // Inside section instances
                if($fileIdInfo[1] != null || ($fileIdInfo[1] == null && array_key_exists(0, $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray))) {
                    // section instance
                    // set the instance index
                    if($fileIdInfo[1] != null) {
                        $jFormSectionInstanceIndex = $fileIdInfo[2] - 1;
                    } else {
                        // prime instance
                        $jFormSectionInstanceIndex = 0;
                    }
                    // check to see if there is a component instance
                    if ($fileIdInfo[3] != null || ($fileIdInfo[3] == null && is_array($this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormSectionInstanceIndex][$jFormComponentId]->value))) {
                        // set the component instance index inside of a  section instance
                        if($fileIdInfo[3] == null) {
                            $jFormComponentInstanceIndex = 0;
                        }
                        else {
                            $jFormComponentInstanceIndex = $fileIdInfo[4] - 1;
                        }
                        // set the value with a section and a component instance
                        $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormSectionInstanceIndex][$jFormComponentId]->value[$jFormComponentInstanceIndex] = $fileDataArray;
                    }
                    else {
                        // set the value with a section instance
                        $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormSectionInstanceIndex][$jFormComponentId]->value = $fileDataArray;
                    }
                }

                // Not section instances
                else {
                    // has component instances
                    if ($fileIdInfo[3] != null || ($fileIdInfo[3]== null && is_array($this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormComponentId]->value))) {
                        // set component  instance index
                        if($fileIdInfo[3] == null) {
                            $jFormComponentInstanceIndex = 0;
                        }
                        else {
                            $jFormComponentInstanceIndex = $fileIdInfo[4] - 1;
                        }
                        $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormComponentId]->value[$jFormComponentInstanceIndex] = $fileDataArray;
                    }
                    else {
                        // no instances
                        $this->jFormPageArray[$jFormPageId]->jFormSectionArray[$jFormSectionId]->jFormComponentArray[$jFormComponentId]->value = $fileDataArray;
                    }
                }
            }
        }

        return $this;
    }

    function clearData() {
        foreach($this->jFormPageArray as $jFormPage) {
            $jFormPage->clearData();
        }
        $this->data = null;
    }

    function clearAllComponentValues() {
        // Clear all of the components in the form
        foreach($this->jFormPageArray as $jFormPage) {
            foreach($jFormPage->jFormSectionArray as $jFormSection) {
                foreach($jFormSection->jFormComponentArray as $jFormComponent) {
                    $jFormComponent->value = null;
                }
            }
        }
    }

    function selectJFormComponent($jFormComponentId) {
        foreach($this->jFormPageArray as $jFormPageKey => $jFormPage) {
            foreach($jFormPage->jFormSectionArray as $jFormSectionKey => $jFormSection) {
                foreach($jFormSection->jFormComponentArray as $jFormComponentKey => $jFormComponent) {
                    if($jFormComponentId == $jFormComponentKey) {
                        return $jFormComponent;
                    }
                }
            }
        }
        return false;
    }
    
    public function initializeSaveState($username, $password, $formState, $formData) {
        // Make sure we have a table to work with
        $this->createSaveStateTable();

        $_SESSION[$this->id]['saveState']['username'] = $username;
        $_SESSION[$this->id]['saveState']['password'] = $password;

        // Either create a new form or resume an old one
        if($formState == 'newForm') {
            // Check to see if the form state exists already
            $response = $this->getSavedState();

            if($response['status'] == 'failure') {
                $response = $this->createSaveState($formData);
            }
            else {
                $response['status'] = 'exists';
                $response['response'] = array('failureNoticeHtml' => 'Form already exists. Either choose to resume the form, or enter a different password to create a new form.');
            }
        }
        else if($formState == 'resumeForm') {
            $response = $this->getSavedState();
        }

        return $response;
    }

    public function createSaveState($formData) {
        // Make sure we have a table to work with
        $this->createSaveStateTable();

        // Connect to the database using the form settings
        $mysqli = new mysqli($this->saveState['database']['host'], $this->saveState['database']['username'], $this->saveState['database']['password'], $this->saveState['database']['database']);

        $sql = 'INSERT INTO `'.$this->saveState['database']['table'].'` (`username`, `password`, `form`, `time_added`) VALUES (\''.$_SESSION[$this->id]['saveState']['username'].'\', MD5(\''.$_SESSION[$this->id]['saveState']['password'].'\'), \''.$formData.'\', NOW())';
        $query = $mysqli->prepare($sql);
        if(is_object($query)) {
            $query->execute();
        }
        else {
            $debug = debug_backtrace();
            die("Error when preparing statement. Call came from {$debug[1]['function']} on line {$debug[1]['line']} in {$debug[1]['file']}.\n<br /><br />{$mysqli->error}:\n<br /><br />".$sql);
        }

        if($query->errno) {
            $response = array("status" => "failure", "response" => $query->error, "sql" => $sql);
        }
        else {
            // Send a save state link
            $this->sendSaveStateLink();
            $response = array('status' => 'success', "response" => 'Successfully created a new form state.');
        }

        return $response;
    }

    public function sendSaveStateLink() {
        // Short circuit if they don't have the e-mail options set
        if(!isset($this->saveState['email'])) {
            return false;
        }

        // Set the form headers
        $headers = 'From: '.$this->saveState['email']['fromName'].' <'.$this->saveState['email']['fromEmail'].'>'."\r\n".'X-Mailer: PHP/'.phpversion();

        // Set the subject
        $subject = $this->saveState['email']['subject'];

        // Set the e-mail and replace [formUrl] with the real form URL
        $message = str_replace('[formUrl]', $this->saveState['email']['formUrl'], $this->saveState['email']['message']);

        // Send the message
        if(mail($_SESSION[$this->id]['saveState']['username'], $subject, $message, $headers)) {
            return true;
        }
        else {
            return false;
        }
    }

    public function saveState($formData) {
        // Make sure we have a table to work with
        $this->createSaveStateTable();

        // Connect to the database using the form settings
        $mysqli = new mysqli($this->saveState['database']['host'], $this->saveState['database']['username'], $this->saveState['database']['password'], $this->saveState['database']['database']);

        $sql = 'UPDATE `'.$this->saveState['database']['table'].'` SET `form` = \''.$formData.'\', `time_updated` = NOW() WHERE `username` = \''.$_SESSION[$this->id]['saveState']['username'].'\' AND `password` = MD5(\''.$_SESSION[$this->id]['saveState']['password'].'\')';
        $query = $mysqli->prepare($sql);
        if(is_object($query)) {
            $query->execute();
        }
        else {
            $debug = debug_backtrace();
            die("Error when preparing statement. Call came from {$debug[1]['function']} on line {$debug[1]['line']} in {$debug[1]['file']}.\n<br /><br />{$mysqli->error}:\n<br /><br />".$sql);
        }

        if($query->errno) {
            $response = array("status" => "failure", "response" => $query->error, "sql" => $sql);
        }
        else {
            $response = array('status' => 'success', "response" => 'Successfully updated the form state.');
        }

        return $response;
    }

    public function getSavedState() {
        // Connect to the database
        $mysqli = new mysqli($this->saveState['database']['host'], $this->saveState['database']['username'], $this->saveState['database']['password'], $this->saveState['database']['database']);

        // Get the saved state from the appropriate table
        $sql = 'SELECT * FROM `'.$this->saveState['database']['table'].'` WHERE `username` = \''.$_SESSION[$this->id]['saveState']['username'].'\' AND `password` = MD5(\''.$_SESSION[$this->id]['saveState']['password'].'\')';
        $query = $mysqli->prepare($sql);
        if(is_object($query)) {
            $query->execute();
        }
        else {
            $debug = debug_backtrace();
            die("Error when preparing statement. Call came from {$debug[1]['function']} on line {$debug[1]['line']} in {$debug[1]['file']}.\n<br /><br />{$mysqli->error}:\n<br /><br />".$sql);
        }
        $query->store_result();
        if($query->errno) {
            $response = array("status" => "failure", "response" => $query->error, "sql" => $sql);
        }
        else if($query->num_rows == 0) {
            $response = array("status" => "failure", "response" => array('failureNoticeHtml' => 'No form exists for that username and password combination. Try again or start a new form.'));
        }
        else {
            $resultArray = array();

            for($i = 0; $i < $query->num_rows(); $i++) {
                $resultArray[$i] = array();
                $boundedVariables = array();

                $meta = $query->result_metadata();

                while($column = $meta->fetch_field()) {
                    $resultArray[$i][$column->name] = null;

                    $boundedVariables[] = &$resultArray[$i][$column->name];
                }
                call_user_func_array(array($query, 'bind_result'), $boundedVariables);

                $query->fetch();
            }

            foreach($resultArray as &$result) {
                foreach($result as &$value) {
                    if(Utility::isJson($value)) {
                        $value = json_decode($value);
                    }
                    else if(Utility::isJson(urldecode($value))) {
                        $value = json_decode(urldecode($value));
                    }
                }
                $result = json_decode(json_encode($result));
            }

            //print_r($result);

            $response = array("status" => "success", "response" => $result->form);
        }

        return $response;
    }

    public function createSaveStateTable() {
        $mysqli = new mysqli($this->saveState['database']['host'], $this->saveState['database']['username'], $this->saveState['database']['password'], $this->saveState['database']['database']);

        $sql = '
            CREATE TABLE IF NOT EXISTS `'.$this->saveState['database']['table'].'` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `username` varchar(64) NOT NULL,
              `password` varchar(32) NOT NULL,
              `form` text,
              `time_updated` datetime,
              `time_added` datetime,
              PRIMARY KEY(`id`),
              INDEX `'.$this->saveState['database']['table'].'_index`(`id`, `username`, `password`)
            )
            ENGINE=MYISAM
            ROW_FORMAT=default
        ';

        $query = $mysqli->prepare($sql);

        if(is_object($query)) {
            $query->execute();
        }
        else {
            $debug = debug_backtrace();
            die("Error when preparing statement. Call came from {$debug[1]['function']} on line {$debug[1]['line']} in {$debug[1]['file']}.\n<br /><br />{$mysqli->error}:\n<br /><br />".$sql);
        }

        $query->store_result();
        if($query->errno) {
            $response = array("status" => "failure", "response" => $query->error, "sql" => $sql);
        }
        else {
            $response = array("status" => "success", "response" => 'Table `'.$this->saveState['database']['table'].'` created successfully.');
        }

        return $response;
    }

    function saveToSession($callbackFunctionName) {
        // Patch the callback function into $this

        $this->jFormerId = $this->id.uniqid();

        $_SESSION[$this->jFormerId] = $this;

        return $this;
    }

    function processRequest($silent = false) {
        // Are they trying to post a file that is too large?
        if(isset($_SERVER['CONTENT_LENGTH']) && empty($_POST)) {
            $this->setStatus('success', array('failureNoticeHtml' => 'Your request ('.round($_SERVER['CONTENT_LENGTH']/1024/1024, 1).'M) was too large for the server to handle. '.ini_get('post_max_size').' is the maximum request size.'));
            echo '
                <script type="text/javascript" language="javascript">
                    parent.'.$this->id.'Object.handleFormSubmissionResponse('.json_encode($this->getStatus()).');
                </script>
            ';
            exit();
        }

        // Are they trying to post something to the form?
        if(isset($_POST['jFormer']) && $this->id == $_POST['jFormerId'] || isset($_POST['jFormerTask'])) {
            // Process the form, get the form state, or display the form
            if(isset($_POST['jFormer'])) {
                //echo json_encode($_POST);
                $onSubmitErrorMessageArray = array();

                // Set the form components and validate the form
                $this->setData($_POST['jFormer'], $_FILES);

                //print_r($this->getData());

                // Run validation
                $this->validate();
                if(!$this->validationPassed) {
                    $this->setStatus('failure', array('validationFailed' => $this->validationResponse));
                }
                else {
                    try {
                        $onSubmitResponse = call_user_func($this->onSubmitFunctionServerSide, $this->getData());
                    }
                    catch(Exception $exception) {
                        $onSubmitErrorMessageArray[] = $exception->getTraceAsString();
                    }

                    // Make sure you actually get a callback response
                    if(empty($onSubmitResponse)) {
                        $onSubmitErrorMessageArray[] = '<p>The function <b>'.$this->onSubmitFunctionServerSide.'</b> did not return a valid response.</p>';
                    }

                    // If there are no errors, it is a successful response
                    if(empty($onSubmitErrorMessageArray)) {
                        $this->setStatus('success', $onSubmitResponse);
                    }
                    else {
                        $this->setStatus('failure', array('failureHtml' => $onSubmitErrorMessageArray));
                    }
                }

                echo '
                    <script type="text/javascript" language="javascript">
                        parent.'.$this->id.'Object.handleFormSubmissionResponse('.json_encode($this->getStatus()).');
                    </script>
                ';

                //echo json_encode($this->getValues());

                exit();
            }
            // Get the form's status
            else if(isset($_POST['jFormerTask']) && $_POST['jFormerTask'] == 'getFormStatus') {
                $onSubmitResponse = $this->getStatus();
                echo json_encode($onSubmitResponse);
                $this->resetStatus();
                exit();
            }
            // Set the save state username and password
            else if(isset($_POST['jFormerTask']) && $_POST['jFormerTask'] == 'initializeSaveState') {
                echo json_encode($this->initializeSaveState($_POST['identifier'], $_POST['password'], $_POST['formState'], $_POST['formData']));
                exit();
            }
            // Get the saved state
            else if(isset($_POST['jFormerTask']) && $_POST['jFormerTask'] == 'getSavedState') {
                echo json_encode($this->getSavedState($this->saveState['identifier'], $this->saveState['password']));
                exit();
            }
            // Save the current form state
            else if(isset($_POST['jFormerTask']) && $_POST['jFormerTask'] == 'saveState') {
                echo json_encode($this->saveState($_POST['formData']));
                exit();
            }
        }
        // If they aren't trying to post something to the form
        else if(!$silent) {
            $this->outputHtml();
        }
    }

    function getOptions() {
        $options = array();
        $options['options'] = array();
        $options['jFormPages'] = array();

        // Get all of the pages
        foreach($this->jFormPageArray as $jFormPage) {
            $options['jFormPages'][$jFormPage->id] = $jFormPage->getOptions();
        }

        // Set form options
        if(!$this->clientSideValidation) {
            $options['options']['clientSideValidation'] = $this->clientSideValidation;
        }
        if($this->debugMode) {
            $options['options']['debugMode'] = $this->debugMode;
        }
        if(!$this->validationTips) {
            $options['options']['validationTips'] = $this->validationTips;
        }
        if($this->disableAnalytics) {
            $options['options']['disableAnalytics'] = $this->disableAnalytics;
        }
        if(!$this->setupPageScroller) {
            $options['options']['setupPageScroller'] = $this->setupPageScroller;
        }
        if($this->animationOptions !== null) {
            $options['options']['animationOptions'] = $this->animationOptions;
        }
        if($this->pageNavigatorEnabled) {
            $options['options']['pageNavigator'] = $this->pageNavigator;
        }
        if($this->saveStateEnabled) {
            $options['options']['saveState'] = $this->saveState;
            
            // Don't give your database login out in the options
            unset($options['options']['saveState']['database']);
        }
        if($this->splashPageEnabled) {
            $options['options']['splashPage'] = $this->splashPage;
            unset($options['options']['splashPage']['content']);
        }
        if(!empty($this->onSubmitStartClientSide)) {
            $options['options']['onSubmitStart'] = $this->onSubmitStartClientSide;
        }
        if(!empty($this->onSubmitFinishClientSide)) {
            $options['options']['onSubmitFinish'] = $this->onSubmitFinishClientSide;
        }
        if(!$this->alertsEnabled) {
            $options['options']['alertsEnabled'] = false;
        }
        if($this->submitButtonText != 'Submit') {
            $options['options']['submitButtonText'] = $this->submitButtonText;
        }
        if($this->submitProcessingButtonText != 'Processing...') {
            $options['options']['submitProcessingButtonText'] = $this->submitProcessingButtonText;
        }
        if($this->progressBar) {
            $options['options']['progressBar'] = $this->progressBar;
        }
        
        if(empty($options['options'])) {
            unset($options['options']);
        }

        return $options;
    }

    function outputHtml() {
        echo $this->getHtml();
    }

    function  __toString() {
        $element = $this->getHtml();
        return $element->__toString();
    }

    function getHtml() {
        // Create the form
        $formElement = new JFormElement('form', array(
            'id' => $this->id,
            'target' => $this->id.'-iframe',
            'enctype' => 'multipart/form-data',
            'method' => 'post',
            'class' => $this->class,
            'action' => $this->action,
        ));

        // Set the style
        if(!empty($this->style)) {
            $formElement->addToAttribute('style', $this->style);
        }
        

        // Global messages
        if($this->alertsEnabled) {
            $jFormerAlertWrapperDiv = new JFormElement('div', array(
                'class' => 'jFormerAlertWrapper',
                'style' => 'display: none;',
            ));
            $alertDiv = new JFormElement('div', array(
                'class' => 'jFormerAlert',
            ));
            $jFormerAlertWrapperDiv->insert($alertDiv);
            $formElement->insert($jFormerAlertWrapperDiv);
        }

        // If a splash is enabled
        if($this->splashPageEnabled || $this->saveStateEnabled) {
            // Create a splash page div
            $splashPageDiv = new JFormElement('div', array(
                'id' => $this->id.'-splash-page',
                'class' => 'jFormerSplashPage jFormPage',
            ));

            // Set defaults if they aren't set
            if(!isset($this->splashPage['content'])) {
                $this->splashPage['content'] = '';
            }
            if(!isset($this->splashPage['splashButtonText'])) {
                $this->splashPage['splashButtonText'] = 'Begin';
            }

            $splashPageDiv->insert('<div class="jFormerSplashPageContent">'.$this->splashPage['content'].'</div>');

            // If the form can be saved, show the necessary components
            if($this->saveStateEnabled) {
                $saveStateIdentifier = new jFormComponentSingleLineText('saveStateIdentifier', 'E-mail address:', array(
                    'tip' => '<p>We will send form results to this e-mail address.</p>',
                    'validationOptions' => array('required', 'email'),
                ));
                $saveStateStatus = new jFormComponentMultipleChoice('saveStateStatus', 'Starting a new form?',
                    array(
                        array('value' => 'newForm', 'label' => 'Yes, let me start a new form', 'checked' => true),
                        array('value' => 'resumeForm', 'label' => 'No, I want to continue a previous form'),
                    ),
                    array(
                        'multipleChoiceType' => 'radio',
                        'validationOptions' => array('required'),
                    )
                );
                $saveStatePassword = new jFormComponentSingleLineText('saveStatePassword', 'Create password:', array(
                    'type' => 'password',
                    'tip' => '<p>Use this to come back and resume your form.</p>',
                    'showPasswordStrength' => true,
                    'validationOptions' => array('required', 'password'),
                ));

                // Add the components to the class save state variable
                $this->saveState['components'] = array($saveStateIdentifier->id => $saveStateIdentifier->getOptions(), $saveStateStatus->id => $saveStateStatus->getOptions(), $saveStatePassword->id => $saveStatePassword->getOptions());

                $splashPageDiv->insert($saveStateIdentifier->__toString().$saveStateStatus->__toString().$saveStatePassword->__toString());
            }
            
            // Create a splash button if there is no custom button ID
            if(!isset($this->splashPage['customButtonId'])) {
                $splashLi = new JFormElement('li', array('class' => 'splashLi'));
                $splashButton = new JFormElement('button', array('class' => 'splashButton'));
                $splashButton->update($this->splashPage['splashButtonText']);
                $splashLi->insert($splashButton);
            }
        }

        // Add a title to the form
        if(!empty($this->title)) {
            $title = new JFormElement('div', array(
                'class' => $this->titleClass
            ));
            $title->update($this->title);
            $formElement->insert($title);
        }

        // Add a description to the form
        if(!empty($this->description)) {
            $description = new JFormElement('div', array(
                'class' => $this->descriptionClass
            ));
            $description->update($this->description);
            $formElement->insert($description);
        }

        // Add the page navigator if enabled
        if($this->pageNavigatorEnabled) {
            $pageNavigatorDiv = new JFormElement('div', array(
                'class' => 'jFormPageNavigator',
            ));
            if(isset($this->pageNavigator['position']) && $this->pageNavigator['position'] == 'right') {
                $pageNavigatorDiv->addToAttribute('class', ' jFormPageNavigatorRight');
            }
            else {
                $pageNavigatorDiv->addToAttribute('class', ' jFormPageNavigatorTop');
            }

            $pageNavigatorUl = new JFormElement('ul', array(
            ));

            $jFormPageArrayCount = 0;
            foreach($this->jFormPageArray as $jFormPageKey => $jFormPage) {
                $jFormPageArrayCount++;
                
                $pageNavigatorLabel = new JFormElement('li', array(
                    'id' => 'navigatePage'.$jFormPageArrayCount,
                    'class' => 'jFormPageNavigatorLink',
                ));

                // If the label is numeric
                if(isset($this->pageNavigator['label']) && $this->pageNavigator['label'] == 'numeric') {
                    $pageNavigatorLabelText = 'Page '.$jFormPageArrayCount;
                }
                else {
                    // Add a link prefix if there is a title
                    if(!empty($jFormPage->title)) {
                        $pageNavigatorLabelText = '<span class="jFormNavigatorLinkPrefix">'.$jFormPageArrayCount.'</span> '.strip_tags($jFormPage->title);
                    }
                    else {
                        $pageNavigatorLabelText = 'Page '.$jFormPageArrayCount;
                    }
                }
                $pageNavigatorLabel->update($pageNavigatorLabelText);

                if($jFormPageArrayCount != 1) {
                    $pageNavigatorLabel->addToAttribute('class', ' jFormPageNavigatorLinkLocked');
                }
                else {
                    $pageNavigatorLabel->addToAttribute('class', ' jFormPageNavigatorLinkUnlocked jFormPageNavigatorLinkActive');
                }

                $pageNavigatorUl->insert($pageNavigatorLabel);
            }

            // Add the page navigator ul to the div
            $pageNavigatorDiv->insert($pageNavigatorUl);

            // Add the progress bar if it is enabled
            if($this->progressBar) {
                $pageNavigatorDiv->insert('<div class="jFormerProgress"><div class="jFormerProgressBar"></div></div>');
            }

            // Hide the progress bar if there is a splash page
            if($this->splashPageEnabled) {
                $pageNavigatorDiv->addToAttribute('style', 'display: none;');
            }

            $formElement->insert($pageNavigatorDiv);
        }

        // Add the jFormerControl UL
        $jFormerControlUl = new JFormElement('ul', array(
            'class' => 'jFormerControl',
        ));

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
        if($this->splashPageEnabled || $this->saveStateEnabled) {
            $nextButtonLi->setAttribute('style', 'display: none;');
        }
        $nextButtonLi->insert($nextButton);

        // Add a splash page button if it exists
        if(isset($splashLi)) {
            $jFormerControlUl->insert($splashLi);
        }

        // Add the previous and next buttons
        $jFormerControlUl->insert($previousButtonLi.$nextButtonLi);

        // Create the page wrapper and scrollers
        $jFormPageWrapper = new JFormElement('div', array('class' => 'jFormPageWrapper'));
        $jFormPageScroller = new JFormElement('div', array('class' => 'jFormPageScroller'));
        
        // Add a splash page if it exists
        if(isset($splashPageDiv)) {
            $jFormPageScroller->insert($splashPageDiv);
        }

        // Add the form pages to the form
        $jFormPageCount = 0;
        foreach($this->jFormPageArray as $jFormPage) {
            // Hide everything but the first page
            if($jFormPageCount != 0 || ($jFormPageCount == 0 && ($this->splashPageEnabled || $this->saveStateEnabled))) {
                $jFormPage->style .= 'display: none;';
            }

            $jFormPageScroller->insert($jFormPage);
            $jFormPageCount++;
        }

        // Page wrapper wrapper
        $pageWrapperContainer = new JFormElement('div', array('class' => 'jFormWrapperContainer'));

        // Insert the page wrapper and the jFormerControl UL to the form
        $formElement->insert($pageWrapperContainer->insert($jFormPageWrapper->insert($jFormPageScroller).$jFormerControlUl));

        // Create a script tag to initialize jFormer JavaScript
        $script = new JFormElement('script', array(
            'type' => 'text/javascript',
            'language' => 'javascript'
        ));

        // Update the script tag
        $script->update('$(document).ready(function () { '.$this->id.'Object = new JFormer(\''.$this->id.'\', '.json_encode($this->getOptions()).'); });');
        $formElement->insert($script);

        // Add a hidden iframe to handle the form posts
        $iframe = new JFormElement('iframe', array(
            'id' => $this->id.'-iframe',
            'name' => $this->id.'-iframe',
            'class' => 'jFormerIFrame',
            'frameborder' => 0,
            'src' => '/empty.html',
            //'src' => str_replace($_SERVER['DOCUMENT_ROOT'], '', __FILE__).'?iframe=true',
        ));

        if($this->debugMode){
            $iframe->addToAttribute('style', 'display:block;');
        }

        $formElement->insert($iframe);


        // After control
        if(!empty($this->afterControl)) {
            $subSubmitInstructions = new JFormElement('div', array('class' => 'jFormerAfterControl'));
            $subSubmitInstructions->update($this->afterControl);
            $formElement->insert($subSubmitInstructions);
        }

        return $formElement;
    }

    static function formValuesToHtml($formValues) {
        $div = new JFormElement('div', array(
            'style' => 'font-family: Arial, san-serif;'
        ));

        foreach($formValues as $pageKey => $section) {
            $div->insert('<h1>'.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($pageKey)).'</h1>');

            foreach($section as $sectionKey => $sectionValue) {
                // If the sectionValue is an array (instances)
                if(is_array($sectionValue)) {
                    $div->insert('<h2>'.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($sectionKey)).' ('.sizeof($sectionValue).' total)</h2>');
                    foreach($sectionValue as $sectionInstanceIndex => $section) {
                        $div->insert('<h2>('.($sectionInstanceIndex + 1).') '.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($sectionKey)).'</h2>');
                        $div->insert(JFormer::sectionFormValuesToHtml($section));
                    }
                }
                else {
                    $div->insert('<h2>'.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($sectionKey)).'</h2>');
                    $div->insert(JFormer::sectionFormValuesToHtml($sectionValue));
                }
            }
        }

        return $div;
    }

    static function sectionFormValuesToHtml($sectionFormValues) {
        $div = new JFormElement('div');
        foreach($sectionFormValues as $componentKey => $componentValue) {
            if(is_object($componentValue) || is_array($componentValue)) {
                // If the component value is an array (instances)
                if(is_array($componentValue)) {
                    $div->insert('<h4>'.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($componentKey)).' ('.sizeof($componentValue).' total)</h4>');
                }
                else {
                    $div->insert('<h4>'.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($componentKey)).'</h4>');
                }
                foreach($componentValue as $componentValueKey => $componentValueValue) {
                    if(is_int($componentValueKey)) {
                        if(is_object($componentValueValue)) {
                            foreach($componentValueValue as $instanceKey => $instanceValue) {
                                $div->insert('<p>('.($componentValueKey + 1).') '.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($instanceKey)).': <b>'.$instanceValue.'</b></p>');
                            }
                        }
                        else {
                            $div->insert('<p><b>'.$componentValueValue.'</b></p>');
                        }
                    }
                    else {
                        $div->insert('<p>'.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($componentValueKey)).': <b>'.$componentValueValue.'</b></p>');
                    }
                }
            }
            else {
                $div->insert('<p>'.Utility::stringToTitle(Utility::fromCamelCaseToSpaces($componentKey)).': <b>'.$componentValue.'</b></p>');
            }
        }
        return $div;
    }
}

// Handle any requests that come to this file
if(isset($_GET['iframe'])) {
    echo '';
}


?>