<?php
// Include the jFormer PHP (use an good path in your code)
if(file_exists('../php/JFormer.php')) {
    require_once('../php/JFormer.php');
}
else if(file_exists('../../php/JFormer.php')) {
    require_once('../../php/JFormer.php');
}

// Create the form
$likertComponentForm = new JFormer('likertComponentForm', array(
    'title' => '<h1>Likert Component</h1>',
    'submitButtonText' => 'Test',
));

// Add components to the form
$likertComponentForm->addJFormComponentArray(array(
    new JFormComponentLikert('likert1', 'Likert component:',
        array(
            array('value' => '1', 'label' => 'Yes', 'sublabel' => 'Yes'),
            array('value' => '2', 'label' => 'No', 'sublabel' => 'No'),
        ),
        array(
            array(
                'name' => 'statement1',
                'statement' => 'Statement 1',
                'validationOptions' => array('required'),
            ),
            array(
                'name' => 'statement2',
                'statement' => 'Statement 2',
            ),
            array(
                'name' => 'statement3',
                'statement' => 'Statement 3',
                'description' => '<p>Statement description.</p>',
                'tip' => '<p>This is a tip on a statement.</p>',
            ),
        ),
        array(
            'validationOptions' => array('required'),
            'description' => '<p>Likert description.</p>',
        )
    ),
));

// Set the function for a successful form submission
function onSubmit($formValues) {
    // Return a simple debug response
    return array('failureNoticeHtml' => json_encode($formValues));
}

// Process any request to the form
$likertComponentForm->processRequest();
?>