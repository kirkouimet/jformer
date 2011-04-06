<?php
// Include the jFormer PHP (use an good path in your code)
if(file_exists('../php/JFormer.php')) {
    require_once('../php/JFormer.php');
}
else if(file_exists('../../php/JFormer.php')) {
    require_once('../../php/JFormer.php');
}

// Create the form
$nameComponentForm = new JFormer('nameComponentForm', array(
    'title' => '<h1>Name Component</h1>',
    'submitButtonText' => 'Test',
));

// Add components to the form
$nameComponentForm->addJFormComponentArray(array(
    new JFormComponentName('name1', 'Name:', array(
        'tip' => '<p>This is a tip on a name component.</p>',
    )),
));

// Set the function for a successful form submission
function onSubmit($formValues) {
    // Return a simple debug response
    return array('failureNoticeHtml' => json_encode($formValues));
}

// Process any request to the form
$nameComponentForm->processRequest();
?>