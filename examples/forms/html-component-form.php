<?php
// Include the jFormer PHP (use an good path in your code)
if(file_exists('../php/JFormer.php')) {
    require_once('../php/JFormer.php');
}
else if(file_exists('../../php/JFormer.php')) {
    require_once('../../php/JFormer.php');
}

// Create the form
$htmlComponentForm = new JFormer('htmlComponentForm', array(
    'title' => '<h1>HTML Component</h1>',
    'submitButtonText' => 'Test',
));

// Add components to the form
$htmlComponentForm->addJFormComponentArray(array(
    new JFormComponentHtml('<p>This is an HTML component. It records no input and has no validation. Use it to insert HTML inbetween your components.</p>'),
));

// Set the function for a successful form submission
function onSubmit($formValues) {
    // Return a simple debug response
    return array('failureNoticeHtml' => json_encode($formValues));
}

// Process any request to the form
$htmlComponentForm->processRequest();
?>