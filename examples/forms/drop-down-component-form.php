<?php
// Include the jFormer PHP (use an good path in your code)
if(file_exists('../php/JFormer.php')) {
    require_once('../php/JFormer.php');
}
else if(file_exists('../../php/JFormer.php')) {
    require_once('../../php/JFormer.php');
}

// Create the form
$dropDownComponentForm = new JFormer('dropDownComponentForm', array(
    'title' => '<h1>Drop Down Component</h1>',
    'submitButtonText' => 'Test',
));

// Add components to the form
$dropDownComponentForm->addJFormComponentArray(array(
    new JFormComponentDropDown('dropDown1', 'Drop down:',
        array(
            array('label' => 'Choice 1', 'value' => '1'),
            array('label' => 'Choice 2', 'value' => '2'),
            array('label' => 'Choice 3', 'value' => '3'),
            array('label' => 'Choice 4', 'value' => '4'),
            array('label' => 'Choice 5', 'value' => '5'),
        ),
        array(
            'tip' => '<p>This is a tip on a drop down component.</p>',
        )
    ),
));

// Set the function for a successful form submission
function onSubmit($formValues) {
    // Return a simple debug response
    return array('failureNoticeHtml' => json_encode($formValues));
}

// Process any request to the form
$dropDownComponentForm->processRequest();
?>