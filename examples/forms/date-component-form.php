<?php
// Include the jFormer PHP (use an good path in your code)
if(file_exists('../php/JFormer.php')) {
    require_once('../php/JFormer.php');
}
else if(file_exists('../../php/JFormer.php')) {
    require_once('../../php/JFormer.php');
}

// Create the form
$dateComponentForm = new JFormer('dateComponentForm', array(
    'title' => '<h1>Date Component</h1>',
    'submitButtonText' => 'Test',
));

// Add components to the form
$dateComponentForm->addJFormComponentArray(array(
    new JFormComponentDate('date1', 'Date:', array(
        'tip' => '<p>This is a tip on a date component.</p>',
    )),
));

// Set the function for a successful form submission
function onSubmit($formValues) {
    // Return a simple debug response
    return array('failureNoticeHtml' => json_encode($formValues));
}

// Process any request to the form
$dateComponentForm->processRequest();
?>