<?php
// Include the jFormer PHP
// uses the production code
require_once('../source/production/jformer-1.0.1.min.php');

// Create the form
$loginForm = new JFormer('loginForm', array(
    'submitButtonText' => 'Login',
));

// Check to see if the remember me checkbox should be checked by default
$rememberMe = array(array('value' => 'remember', 'label' => 'Keep me logged in on this computer'));

// Add components to the section
$loginForm->addJFormComponentArray(array(
    new JFormComponentSingleLineText('username', 'Username:', array(
        'validationOptions' => array('required', 'username'),
       // 'tip' => '<p>The demo login is <b>admin</b>.</p>',
    )),

    new JFormComponentSingleLineText('password', 'Password:', array(
        'type' => 'password',
        'validationOptions' => array('required', 'password'),
       // 'tip' => '<p>Password is 12345</p>',
    )),

    new JFormComponentMultipleChoice('rememberMe', '', $rememberMe, array(
        //'tip' => '<p>If a cookie is set you can have this checked by default.</p>',
    )),
));

// Set the function for a successful form submission
function onSubmit($formValues) {

    //SQL and or other Server side checks go here
    if($formValues->username == 'admin' && $formValues->password == '12345') {
        // if they do not want to be remembered
        if(!empty($formValues->rememberMe)) {
            // Let them know they successfully logged in
            $response = array('successPageHtml' => '<h1>Login Successful</h1><p>We\'ll keep you logged in on this computer.</p>');
            // could also do a redirect
            //return array('redirect' => 'http://www.jformer.com');
        }
        else {
            $response = array('successPageHtml' => '<h1>Login Successful</h1><p>We won\'t keep you logged in on this computer.</p>');
        }
    }
    // if they do not pass, give some sort of failure notice
    else {
        $response = array(
            'failureNoticeHtml' => 'Invalid username or password.',
            'failureJs' => "$('#password').val('').focus();"  // notice you can pass a javascript callback to run if it fails
            );
    }

    return $response;
}

// Process any request to the form
$loginForm->processRequest();


?>
