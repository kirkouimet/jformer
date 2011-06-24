<?php
// Include the jFormer PHP (use an good path in your code)
if(file_exists('../php/JFormer.php')) {
    require_once('../php/JFormer.php');
}
else if(file_exists('../../php/JFormer.php')) {
    require_once('../../php/JFormer.php');
}

// Create the form
$multipleChoiceComponentForm = new JFormer('multipleChoiceComponentForm', array(
    'title' => '<h1>Multiple Choice Component</h1>',
    'submitButtonText' => 'Test',
));

// Add components to the form
$multipleChoiceComponentForm->addJFormComponentArray(array(
    new JFormComponentMultipleChoice('multipleChoice1', 'Multiple choice checkboxes:',
        array(
            array('label' => 'Option 1', 'value' => '1'),
            array('label' => 'Option 2', 'value' => '2', 'checked' => true),
            array('label' => 'Option 3', 'value' => '2'),
        ),
        array(
            'tip' => '<p>This is a tip on a multiple choice component.</p>',
        )
    ),
    new JFormComponentMultipleChoice('multipleChoice2', 'Multiple choice radio buttons:',
        array(
            array('label' => 'Option 1', 'value' => '1'),
            array('label' => 'Option 2', 'value' => '2', 'checked' => true),
            array('label' => 'Option 3', 'value' => '2'),
        ),
        array(
            'multipleChoiceType' => 'radio',
        )
    ),
));

// Set the function for a successful form submission
function onSubmit($formValues) {
    // Return a simple debug response
    return array('failureNoticeHtml' => json_encode($formValues));
}

// Process any request to the form
$multipleChoiceComponentForm->processRequest();
?>