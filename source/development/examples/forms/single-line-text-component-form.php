<?php
// Include the jFormer PHP (use an good path in your code)
if(file_exists('../php/JFormer.php')) {
    require_once('../php/JFormer.php');
}
else if(file_exists('../../php/JFormer.php')) {
    require_once('../../php/JFormer.php');
}

// Create the form
$singleLineTextComponentForm = new JFormer('singleLineTextComponentForm', array(
    'title' => '<h1>Single Line Text Component</h1>',
    'submitButtonText' => 'Test',
));

// Add components to the form
$singleLineTextComponentForm->addJFormComponentArray(array(
    new JFormComponentSingleLineText('singleLineText1', 'Single line text:', array(
        'tip' => '<p>This is a tip on a single line text component.</p>',
    )),
));

// Set the function for a successful form submission
function onSubmit($formValues) {
    // Return a simple debug response
    return array('failureNoticeHtml' => json_encode($formValues));
}

// Process any request to the form
$singleLineTextComponentForm->processRequest();
?>