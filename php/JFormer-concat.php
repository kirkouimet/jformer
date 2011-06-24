<?php

$php = '';

$php .= file_get_contents('JFormElement.php');
$php .= file_get_contents('JFormer.php');
$php .= file_get_contents('JFormPage.php');
$php .= file_get_contents('JFormSection.php');
$php .= file_get_contents('JFormComponent.php');
$php .= file_get_contents('JFormComponentAddress.php');
$php .= file_get_contents('JFormComponentCreditCard.php');
$php .= file_get_contents('JFormComponentDate.php');
$php .= file_get_contents('JFormComponentDropDown.php');
$php .= file_get_contents('JFormComponentFile.php');
$php .= file_get_contents('JFormComponentHidden.php');
$php .= file_get_contents('JFormComponentHtml.php');
$php .= file_get_contents('JFormComponentLikert.php');
$php .= file_get_contents('JFormComponentMultipleChoice.php');
$php .= file_get_contents('JFormComponentName.php');
$php .= file_get_contents('JFormComponentSingleLineText.php');
$php .= file_get_contents('JFormComponentTextArea.php');

$php = str_ireplace('?>', '', $php);
$php = str_ireplace('<?php', '', $php);

echo '<?php'.$php.'?>';

?>