<?php

// Include the jFormer PHP
// uses the production code
require_once('../source/production/jformer-1.0.1.min.php');

// Create the form
$registrationForm = new JFormer('registration', array(
            'submitButtonText' => 'Register',
        ));

// Add components to the Form
$registrationForm->addJFormComponentArray(array(
    // username
    new JFormComponentSingleLineText('username', 'Username:', array(
        // validate to pass username requirements : at least 4 characters and no special characters
        'validationOptions' => array('required', 'username'),
    )),
    // email
    new JFormComponentSingleLineText('email', 'E-mail Address:', array(
        // has to be formatted like an email xxx@xxx.xxx
        'validationOptions' => array('required', 'email'),
    )),
    //password
    new JFormComponentSingleLineText('password', 'Password:', array(
        //change the type of input to password
        'type' => 'password',
        // must meet minimum requirements ( 4 characters )
        'validationOptions' => array('required', 'password'),
    )),
    new JFormComponentSingleLineText('passwordConfirm', 'Confirm Password:', array(
        'type' => 'password',
        // must match the id of the field given
        'validationOptions' => array('required', 'password', 'matches' => 'password'),
    )),
    new JFormComponentMultipleChoice('updates', '', array(
        // each radio or checkbox is an array with values for 'value' and 'label' can also be given a tip
        // if only one option like this example, the label from the component is overwritten by the label for the option
        array('value' => 'signup', 'label' => 'I would like to recieve updates.'),
            ),
            array()),
    new JFormComponentMultipleChoice('update_type', 'How would you like to receive updates?', array(
        array('value' => 'Email', 'label' => 'Send updates to my Email'),
        array('value' => 'Text Message', 'label' => 'Send updates to my Phone via Text Message'),
            ),
            array(
                // multiple choice type changes to radio
                'multipleChoiceType' => 'radio',
                'validationOptions' => array('required'),
                // dependency options are set here,
                'dependencyOptions' => array(
                    // the id of the component it checks
                    'dependentOn' => 'updates',
                    // display type - can be lock or hide
                    'display' => 'hide',
                    // the function it runs on each check if returns true, the component is enabled
                    'jsFunction' => '$("#updates-choice1").is(":checked");'
                ),
    )),
    new JFormComponentSingleLineText('phone', 'Phone Number:', array(
        // mask to format for a phone number 9 = numbers, z = letters
        'mask' => '(999) 999-9999',
        'validationOptions' => array('required'),
        'dependencyOptions' => array(
            'dependentOn' => array('update_type', 'updates'),
            'display' => 'hide',
            'jsFunction' => '$("#update_type-choice2").is(":checked") && $("#updates-choice1").is(":checked");'
        ),
    )),
    new JFormComponentMultipleChoice('terms', '', array(
        array('value' => 'agree', 'label' => 'Do you agree to the site <a href="/legal/terms-and-conditions/" target="_blank">Terms and Conditions</a>?'),
            ),
            array(
                'validationOptions' => array('required'),
    )),
));

// Set the function for a successful form submission
function onSubmit($formValues) {
    //return array('failureHtml' => json_encode($formValues));
    $secondary = '';
    if ($formValues->updates[0] == 'signup') {
        $updates = 'yes';
        // type, and detail
        $type = $formValues->update_type;
        $secondary = '<p>Update Type: ' . $type . '</p>';
        if ($type == 'phone') {
            $secondary .= '<p>Phone Number: ' . $formValues->phone . '</p>';
        }
    } else {
        $updates = 'no';
    }


    return array(
        'successPageHtml' => '<h2>Thanks for Using jFormer</h2>
            <p>Username: ' . $formValues->username . '</p>
            <p>E-mail: ' . $formValues->email . '</p>
            <h3>Updates</h3>
            <p>Receive Updates: ' . $updates . '</p>
            ' . $secondary,
    );
}

// Process any request to the form
$registration->processRequest();
?>
