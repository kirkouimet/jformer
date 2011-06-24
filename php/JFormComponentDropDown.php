<?php
class JFormComponentDropDown extends JFormComponent {
    var $dropDownOptionArray = array();

    var $disabled = false;
    var $multiple = false;
    var $size = null;
    var $width = null;

    /**
     * Constructor
     */
    function __construct($id, $label, $dropDownOptionArray, $optionArray = array()) {
        // General settings
        $this->id = $id;
        $this->name = $this->id;
        $this->class = 'jFormComponentDropDown';
        $this->label = $label;
        $this->dropDownOptionArray = $dropDownOptionArray;

        // Initialize the abstract FormComponent object
        $this->initialize($optionArray);
    }

    function getOption($optionValue, $optionLabel, $optionSelected, $optionDisabled) {
        $option = new JFormElement('option', array('value' => $optionValue));
        $option->update($optionLabel);

        if($optionSelected) {
            $option->setAttribute('selected', 'selected');
        }

        if($optionDisabled) {
            $option->setAttribute('disabled', 'disabled');
        }

        return $option;
    }

    public static function getCountryArray($selectedCountry = null) {
        $countryArray = array(array('value' => '', 'label'  => 'Select a Country', 'disabled' => true), array('value' => 'US', 'label'  => 'United States of America'), array('value' => 'AF', 'label'  => 'Afghanistan'), array('value' => 'AL', 'label'  => 'Albania'), array('value' => 'DZ', 'label'  => 'Algeria'), array('value' => 'AS', 'label'  => 'American Samoa'), array('value' => 'AD', 'label'  => 'Andorra'), array('value' => 'AO', 'label'  => 'Angola'), array('value' => 'AI', 'label'  => 'Anguilla'), array('value' => 'AQ', 'label'  => 'Antarctica'), array('value' => 'AG', 'label'  => 'Antigua and Barbuda'), array('value' => 'AR', 'label'  => 'Argentina'), array('value' => 'AM', 'label'  => 'Armenia'), array('value' => 'AW', 'label'  => 'Aruba'), array('value' => 'AU', 'label'  => 'Australia'), array('value' => 'AT', 'label'  => 'Austria'), array('value' => 'AZ', 'label'  => 'Azerbaijan'), array('value' => 'BS', 'label'  => 'Bahamas'), array('value' => 'BH', 'label'  => 'Bahrain'), array('value' => 'BD', 'label'  => 'Bangladesh'), array('value' => 'BB', 'label'  => 'Barbados'), array('value' => 'BY', 'label'  => 'Belarus'), array('value' => 'BE', 'label'  => 'Belgium'), array('value' => 'BZ', 'label'  => 'Belize'), array('value' => 'BJ', 'label'  => 'Benin'), array('value' => 'BM', 'label'  => 'Bermuda'), array('value' => 'BT', 'label'  => 'Bhutan'), array('value' => 'BO', 'label'  => 'Bolivia'), array('value' => 'BA', 'label'  => 'Bosnia and Herzegovina'), array('value' => 'BW', 'label'  => 'Botswana'), array('value' => 'BV', 'label'  => 'Bouvet Island'), array('value' => 'BR', 'label'  => 'Brazil'), array('value' => 'IO', 'label'  => 'British Indian Ocean Territory'), array('value' => 'BN', 'label'  => 'Brunei'), array('value' => 'BG', 'label'  => 'Bulgaria'), array('value' => 'BF', 'label'  => 'Burkina Faso'), array('value' => 'BI', 'label'  => 'Burundi'), array('value' => 'KH', 'label'  => 'Cambodia'), array('value' => 'CM', 'label'  => 'Cameroon'), array('value' => 'CA', 'label'  => 'Canada'), array('value' => 'CV', 'label'  => 'Cape Verde'), array('value' => 'KY', 'label'  => 'Cayman Islands'), array('value' => 'CF', 'label'  => 'Central African Republic'), array('value' => 'TD', 'label'  => 'Chad'), array('value' => 'CL', 'label'  => 'Chile'), array('value' => 'CN', 'label'  => 'China'), array('value' => 'CX', 'label'  => 'Christmas Island'), array('value' => 'CC', 'label'  => 'Cocos (Keeling) Islands'), array('value' => 'CO', 'label'  => 'Columbia'), array('value' => 'KM', 'label'  => 'Comoros'), array('value' => 'CG', 'label'  => 'Congo'), array('value' => 'CK', 'label'  => 'Cook Islands'), array('value' => 'CR', 'label'  => 'Costa Rica'), array('value' => 'CI', 'label'  => 'Cote D\'Ivorie (Ivory Coast)'), array('value' => 'HR', 'label'  => 'Croatia (Hrvatska)'), array('value' => 'CU', 'label'  => 'Cuba'), array('value' => 'CY', 'label'  => 'Cyprus'), array('value' => 'CZ', 'label'  => 'Czech Republic'), array('value' => 'CD', 'label'  => 'Democratic Republic of Congo (Zaire)'), array('value' => 'DK', 'label'  => 'Denmark'), array('value' => 'DJ', 'label'  => 'Djibouti'), array('value' => 'DM', 'label'  => 'Dominica'), array('value' => 'DO', 'label'  => 'Dominican Republic'), array('value' => 'TP', 'label'  => 'East Timor'), array('value' => 'EC', 'label'  => 'Ecuador'), array('value' => 'EG', 'label'  => 'Egypt'), array('value' => 'SV', 'label'  => 'El Salvador'), array('value' => 'GQ', 'label'  => 'Equatorial Guinea'), array('value' => 'ER', 'label'  => 'Eritrea'), array('value' => 'EE', 'label'  => 'Estonia'), array('value' => 'ET', 'label'  => 'Ethiopia'), array('value' => 'FK', 'label'  => 'Falkland Islands (Malvinas)'), array('value' => 'FO', 'label'  => 'Faroe Islands'), array('value' => 'FJ', 'label'  => 'Fiji'), array('value' => 'FI', 'label'  => 'Finland'), array('value' => 'FR', 'label'  => 'France'), array('value' => 'FX', 'label'  => 'France), Metropolitanarray('), array('value' => 'GF', 'label'  => 'French Guinea'), array('value' => 'PF', 'label'  => 'French Polynesia'), array('value' => 'TF', 'label'  => 'French Southern Territories'), array('value' => 'GA', 'label'  => 'Gabon'), array('value' => 'GM', 'label'  => 'Gambia'), array('value' => 'GE', 'label'  => 'Georgia'), array('value' => 'DE', 'label'  => 'Germany'), array('value' => 'GH', 'label'  => 'Ghana'), array('value' => 'GI', 'label'  => 'Gibraltar'), array('value' => 'GR', 'label'  => 'Greece'), array('value' => 'GL', 'label'  => 'Greenland'), array('value' => 'GD', 'label'  => 'Grenada'), array('value' => 'GP', 'label'  => 'Guadeloupe'), array('value' => 'GU', 'label'  => 'Guam'), array('value' => 'GT', 'label'  => 'Guatemala'), array('value' => 'GN', 'label'  => 'Guinea'), array('value' => 'GW', 'label'  => 'Guinea-Bissau'), array('value' => 'GY', 'label'  => 'Guyana'), array('value' => 'HT', 'label'  => 'Haiti'), array('value' => 'HM', 'label'  => 'Heard and McDonald Islands'), array('value' => 'HN', 'label'  => 'Honduras'), array('value' => 'HK', 'label'  => 'Hong Kong'), array('value' => 'HU', 'label'  => 'Hungary'), array('value' => 'IS', 'label'  => 'Iceland'), array('value' => 'IN', 'label'  => 'India'), array('value' => 'ID', 'label'  => 'Indonesia'), array('value' => 'IR', 'label'  => 'Iran'), array('value' => 'IQ', 'label'  => 'Iraq'), array('value' => 'IE', 'label'  => 'Ireland'), array('value' => 'IL', 'label'  => 'Israel'), array('value' => 'IT', 'label'  => 'Italy'), array('value' => 'JM', 'label'  => 'Jamaica'), array('value' => 'JP', 'label'  => 'Japan'), array('value' => 'JO', 'label'  => 'Jordan'), array('value' => 'KZ', 'label'  => 'Kazakhstan'), array('value' => 'KE', 'label'  => 'Kenya'), array('value' => 'KI', 'label'  => 'Kiribati'), array('value' => 'KW', 'label'  => 'Kuwait'), array('value' => 'KG', 'label'  => 'Kyrgyzstan'), array('value' => 'LA', 'label'  => 'Laos'), array('value' => 'LV', 'label'  => 'Latvia'), array('value' => 'LB', 'label'  => 'Lebanon'), array('value' => 'LS', 'label'  => 'Lesotho'), array('value' => 'LR', 'label'  => 'Liberia'), array('value' => 'LY', 'label'  => 'Libya'), array('value' => 'LI', 'label'  => 'Liechtenstein'), array('value' => 'LT', 'label'  => 'Lithuania'), array('value' => 'LU', 'label'  => 'Luxembourg'), array('value' => 'MO', 'label'  => 'Macau'), array('value' => 'MK', 'label'  => 'Macedonia'), array('value' => 'MG', 'label'  => 'Madagascar'), array('value' => 'MW', 'label'  => 'Malawi'), array('value' => 'MY', 'label'  => 'Malaysia'), array('value' => 'MV', 'label'  => 'Maldives'), array('value' => 'ML', 'label'  => 'Mali'), array('value' => 'MT', 'label'  => 'Malta'), array('value' => 'MH', 'label'  => 'Marshall Islands'), array('value' => 'MQ', 'label'  => 'Martinique'), array('value' => 'MR', 'label'  => 'Mauritania'), array('value' => 'MU', 'label'  => 'Mauritius'), array('value' => 'YT', 'label'  => 'Mayotte'), array('value' => 'MX', 'label'  => 'Mexico'), array('value' => 'FM', 'label'  => 'Micronesia'), array('value' => 'MD', 'label'  => 'Moldova'), array('value' => 'MC', 'label'  => 'Monaco'), array('value' => 'MN', 'label'  => 'Mongolia'), array('value' => 'MS', 'label'  => 'Montserrat'), array('value' => 'MA', 'label'  => 'Morocco'), array('value' => 'MZ', 'label'  => 'Mozambique'), array('value' => 'MM', 'label'  => 'Myanmar (Burma)'), array('value' => 'NA', 'label'  => 'Namibia'), array('value' => 'NR', 'label'  => 'Nauru'), array('value' => 'NP', 'label'  => 'Nepal'), array('value' => 'NL', 'label'  => 'Netherlands'), array('value' => 'AN', 'label'  => 'Netherlands Antilles'), array('value' => 'NC', 'label'  => 'New Caledonia'), array('value' => 'NZ', 'label'  => 'New Zealand'), array('value' => 'NI', 'label'  => 'Nicaragua'), array('value' => 'NE', 'label'  => 'Niger'), array('value' => 'NG', 'label'  => 'Nigeria'), array('value' => 'NU', 'label'  => 'Niue'), array('value' => 'NF', 'label'  => 'Norfolk Island'), array('value' => 'KP', 'label'  => 'North Korea'), array('value' => 'MP', 'label'  => 'Northern Mariana Islands'), array('value' => 'NO', 'label'  => 'Norway'), array('value' => 'OM', 'label'  => 'Oman'), array('value' => 'PK', 'label'  => 'Pakistan'), array('value' => 'PW', 'label'  => 'Palau'), array('value' => 'PA', 'label'  => 'Panama'), array('value' => 'PG', 'label'  => 'Papua New Guinea'), array('value' => 'PY', 'label'  => 'Paraguay'), array('value' => 'PE', 'label'  => 'Peru'), array('value' => 'PH', 'label'  => 'Philippines'), array('value' => 'PN', 'label'  => 'Pitcairn'), array('value' => 'PL', 'label'  => 'Poland'), array('value' => 'PT', 'label'  => 'Portugal'), array('value' => 'PR', 'label'  => 'Puerto Rico'), array('value' => 'QA', 'label'  => 'Qatar'), array('value' => 'RE', 'label'  => 'Reunion'), array('value' => 'RO', 'label'  => 'Romania'), array('value' => 'RU', 'label'  => 'Russia'), array('value' => 'RW', 'label'  => 'Rwanda'), array('value' => 'SH', 'label'  => 'Saint Helena'), array('value' => 'KN', 'label'  => 'Saint Kitts and Nevis'), array('value' => 'LC', 'label'  => 'Saint Lucia'), array('value' => 'PM', 'label'  => 'Saint Pierre and Miquelon'), array('value' => 'VC', 'label'  => 'Saint Vincent and The Grenadines'), array('value' => 'SM', 'label'  => 'San Marino'), array('value' => 'ST', 'label'  => 'Sao Tome and Principe'), array('value' => 'SA', 'label'  => 'Saudi Arabia'), array('value' => 'SN', 'label'  => 'Senegal'), array('value' => 'SC', 'label'  => 'Seychelles'), array('value' => 'SL', 'label'  => 'Sierra Leone'), array('value' => 'SG', 'label'  => 'Singapore'), array('value' => 'SK', 'label'  => 'Slovak Republic'), array('value' => 'SI', 'label'  => 'Slovenia'), array('value' => 'SB', 'label'  => 'Solomon Islands'), array('value' => 'SO', 'label'  => 'Somalia'), array('value' => 'ZA', 'label'  => 'South Africa'), array('value' => 'GS', 'label'  => 'South Georgia'), array('value' => 'KR', 'label'  => 'South Korea'), array('value' => 'ES', 'label'  => 'Spain'), array('value' => 'LK', 'label'  => 'Sri Lanka'), array('value' => 'SD', 'label'  => 'Sudan'), array('value' => 'SR', 'label'  => 'Suriname'), array('value' => 'SJ', 'label'  => 'Svalbard and Jan Mayen'), array('value' => 'SZ', 'label'  => 'Swaziland'), array('value' => 'SE', 'label'  => 'Sweden'), array('value' => 'CH', 'label'  => 'Switzerland'), array('value' => 'SY', 'label'  => 'Syria'), array('value' => 'TW', 'label'  => 'Taiwan'), array('value' => 'TJ', 'label'  => 'Tajikistan'), array('value' => 'TZ', 'label'  => 'Tanzania'), array('value' => 'TH', 'label'  => 'Thailand'), array('value' => 'TG', 'label'  => 'Togo'), array('value' => 'TK', 'label'  => 'Tokelau'), array('value' => 'TO', 'label'  => 'Tonga'), array('value' => 'TT', 'label'  => 'Trinidad and Tobago'), array('value' => 'TN', 'label'  => 'Tunisia'), array('value' => 'TR', 'label'  => 'Turkey'), array('value' => 'TM', 'label'  => 'Turkmenistan'), array('value' => 'TC', 'label'  => 'Turks and Caicos Islands'), array('value' => 'TV', 'label'  => 'Tuvalu'), array('value' => 'UG', 'label'  => 'Uganda'), array('value' => 'UA', 'label'  => 'Ukraine'), array('value' => 'AE', 'label'  => 'United Arab Emirates'), array('value' => 'UK', 'label'  => 'United Kingdom'), array('value' => 'US', 'label'  => 'United States of America'), array('value' => 'UM', 'label'  => 'United States Minor Outlying Islands'), array('value' => 'UY', 'label'  => 'Uruguay'), array('value' => 'UZ', 'label'  => 'Uzbekistan'), array('value' => 'VU', 'label'  => 'Vanuatu'), array('value' => 'VA', 'label'  => 'Vatican City (Holy See)'), array('value' => 'VE', 'label'  => 'Venezuela'), array('value' => 'VN', 'label'  => 'Vietnam'), array('value' => 'VG', 'label'  => 'Virgin Islands (British)'), array('value' => 'VI', 'label'  => 'Virgin Islands (US)'), array('value' => 'WF', 'label'  => 'Wallis and Futuna Islands'), array('value' => 'EH', 'label'  => 'Western Sahara'), array('value' => 'WS', 'label'  => 'Western Samoa'), array('value' => 'YE', 'label'  => 'Yemen'), array('value' => 'YU', 'label'  => 'Yugoslavia'), array('value' => 'ZM', 'label'  => 'Zambia'), array('value' => 'ZW', 'label'  => 'Zimbabwe'));

        if(!empty($selectedCountry)) {
            foreach($countryArray as &$countryOption)  {
                if($countryOption['value'] == $selectedCountry) {
                    $countryOption['selected'] = true;
                    break;
                }
            }
        }
        else {
            $countryArray[0]['selected'] = true;
        }

        return $countryArray;
    }

    public static function getStateArray($selectedState = null) {
        $stateArray = array(array('value' => '', 'label'  => 'Select a State', 'disabled' => true), array('value' => 'AL', 'label'  => 'Alabama'), array('value' => 'AK', 'label'  => 'Alaska'), array('value' => 'AZ', 'label'  => 'Arizona'), array('value' => 'AR', 'label'  => 'Arkansas'), array('value' => 'CA', 'label'  => 'California'), array('value' => 'CO', 'label'  => 'Colorado'), array('value' => 'CT', 'label'  => 'Connecticut'), array('value' => 'DE', 'label'  => 'Delaware'), array('value' => 'DC', 'label'  => 'District of Columbia'), array('value' => 'FL', 'label'  => 'Florida'), array('value' => 'GA', 'label'  => 'Georgia'), array('value' => 'HI', 'label'  => 'Hawaii'), array('value' => 'ID', 'label'  => 'Idaho'), array('value' => 'IL', 'label'  => 'Illinois'), array('value' => 'IN', 'label'  => 'Indiana'), array('value' => 'IA', 'label'  => 'Iowa'), array('value' => 'KS', 'label'  => 'Kansas'), array('value' => 'KY', 'label'  => 'Kentucky'), array('value' => 'LA', 'label'  => 'Louisiana'), array('value' => 'ME', 'label'  => 'Maine'), array('value' => 'MD', 'label'  => 'Maryland'), array('value' => 'MA', 'label'  => 'Massachusetts'), array('value' => 'MI', 'label'  => 'Michigan'), array('value' => 'MN', 'label'  => 'Minnesota'), array('value' => 'MS', 'label'  => 'Mississippi'), array('value' => 'MO', 'label'  => 'Missouri'), array('value' => 'MT', 'label'  => 'Montana'), array('value' => 'NE', 'label'  => 'Nebraska'), array('value' => 'NV', 'label'  => 'Nevada'), array('value' => 'NH', 'label'  => 'New Hampshire'), array('value' => 'NJ', 'label'  => 'New Jersey'), array('value' => 'NM', 'label'  => 'New Mexico'), array('value' => 'NY', 'label'  => 'New York'), array('value' => 'NC', 'label'  => 'North Carolina'), array('value' => 'ND', 'label'  => 'North Dakota'), array('value' => 'OH', 'label'  => 'Ohio'), array('value' => 'OK', 'label'  => 'Oklahoma'), array('value' => 'OR', 'label'  => 'Oregon'), array('value' => 'PA', 'label'  => 'Pennsylvania'), array('value' => 'RI', 'label'  => 'Rhode Island'), array('value' => 'SC', 'label'  => 'South Carolina'), array('value' => 'SD', 'label'  => 'South Dakota'), array('value' => 'TN', 'label'  => 'Tennessee'), array('value' => 'TX', 'label'  => 'Texas'), array('value' => 'UT', 'label'  => 'Utah'), array('value' => 'VT', 'label'  => 'Vermont'), array('value' => 'VA', 'label'  => 'Virginia'), array('value' => 'WA', 'label'  => 'Washington'), array('value' => 'WV', 'label'  => 'West Virginia'), array('value' => 'WI', 'label'  => 'Wisconsin'), array('value' => 'WY', 'label'  => 'Wyoming'));

        if(!empty($selectedState)) {
            foreach($stateArray as &$stateOption)  {
                if($stateOption['value'] == $selectedState) {
                    $stateOption['selected'] = true;
                    break;
                }
            }
        }
        else {
            $stateArray[0]['selected'] = true;
        }

        return $stateArray;
    }

    public static function getMonthArray() {
        return array(array('value' => '01', 'label'  => 'January'), array('value' => '02', 'label'  => 'February'), array('value' => '03', 'label'  => 'March'), array('value' => '04', 'label'  => 'April'), array('value' => '05', 'label'  => 'May'), array('value' => '06', 'label'  => 'June'), array('value' => '07', 'label'  => 'July'), array('value' => '08', 'label'  => 'August'), array('value' => '09', 'label'  => 'September'), array('value' => '10', 'label'  => 'October'), array('value' => '11', 'label'  => 'November'), array('value' => '12', 'label'  => 'December'));
    }

    public static function getYearArray($minYear, $maxYear) {
        $yearArray = array();
        for($i = $maxYear - $minYear; $i > 0; $i--) {
            $yearArray[] = array('value' => $i + $minYear, 'label' => $i + $minYear);
        }
        return $yearArray;
    }

    /**
     *
     * @return string
     */
    function __toString() {
        // Div tag contains everything about the component
        $div = parent::generateComponentDiv();

        // Select tag
        $select = new JFormElement('select', array(
            'id' => $this->id,
            'name' => $this->name,
            'class' => $this->class,
        ));

        // Only use if disabled is set, otherwise will throw an error
        if($this->disabled) {
            $select->setAttribute('disabled', 'disabled');
        }
        if($this->multiple) {
            $select->setAttribute('multiple', 'multiple');
        }
        if($this->size != null) {
            $select->setAttribute('size', $this->size);
        }
        if($this->width != null) {
            $select->setAttribute('style', 'width:'.$this->width);
        }

        // Check for any opt groups
        $optGroupArray = array();
        foreach($this->dropDownOptionArray as $dropDownOption) {
            if(isset($dropDownOption['optGroup']) && !empty($dropDownOption['optGroup'])) {
                $optGroupArray[] = $dropDownOption['optGroup'];
            }
        }
        $optGroupArray = array_unique($optGroupArray);

        // Create the optgroup elements
        foreach($optGroupArray as $optGroup) {
            ${$optGroup} = new JFormElement('optgroup', array('label' => $optGroup));
        }

        // Add any options to their appropriate optgroup
        foreach($this->dropDownOptionArray as $dropDownOption) {
            if(isset($dropDownOption['optGroup']) && !empty($dropDownOption['optGroup'])) {
                $optionValue = isset($dropDownOption['value']) ? $dropDownOption['value'] : '';
                $optionLabel =  isset($dropDownOption['label']) ? $dropDownOption['label'] : '';
                $optionSelected =  isset($dropDownOption['selected']) ? $dropDownOption['selected'] : false;
                $optionDisabled =  isset($dropDownOption['disabled']) ? $dropDownOption['disabled'] : false;
                $optionOptGroup =  isset($dropDownOption['optGroup']) ? $dropDownOption['optGroup'] : '';
            
                ${$dropDownOption['optGroup']}->insert($this->getOption($optionValue, $optionLabel, $optionSelected, $optionDisabled));
            }
        }
        
        // Add any options that are not in an opt group to the select
        foreach($this->dropDownOptionArray as $dropDownOption) {
            // Handle optgroup addition - only add the group if you haven't seen it yet
            if(isset($dropDownOption['optGroup']) && !empty($dropDownOption['optGroup']) && !isset(${$dropDownOption['optGroup'].'Added'})) {
                $select->insert(${$dropDownOption['optGroup']});
                ${$dropDownOption['optGroup'].'Added'} = true;
            }
            // Add any other elements
            else if(!isset($dropDownOption['optGroup'])) {
                $optionValue = isset($dropDownOption['value']) ? $dropDownOption['value'] : '';
                $optionLabel =  isset($dropDownOption['label']) ? $dropDownOption['label'] : '';
                $optionSelected =  isset($dropDownOption['selected']) ? $dropDownOption['selected'] : false;
                $optionDisabled =  isset($dropDownOption['disabled']) ? $dropDownOption['disabled'] : false;
                $optionOptGroup =  isset($dropDownOption['optGroup']) ? $dropDownOption['optGroup'] : '';

                $select->insert($this->getOption($optionValue, $optionLabel, $optionSelected, $optionDisabled));
            }
        }

        // Add the select box to the div
        $div->insert($select);

        // Add any description (optional)
        $div = $this->insertComponentDescription($div);

        // Add a tip (optional)
        $div = $this->insertComponentTip($div, $this->id.'-div');

        return $div->__toString();
    }
}


?>
