<?php
/**
 * Created by PhpStorm.
 * User: bohda
 * Date: 28/11/2016
 * Time: 11:05 AM
 */

namespace App;
use App\Traits\Getter;


/**
 * Will convert any data (ideally POST data) that is part of the contact form into a format that can be added
 * to an email message.
 *
 * You must add a hidden field called 'formName' which contains the name of the contact form. This name is
 * used in the notification email.
 *
 * For any field you want to be recorded in the form. It's name *must* be prefixed by "contact_"
 * @property string organisation
 * @property string name
 * @property string email
 * @property string phone
 * @property string numEmployees
 * @property string formName
 * @property string buttonName
 * @property string recaptchaResponse
 * @package App
 */
class ContactInfo {
    use Getter;

    /**
     * @var array
     *  The data from the contact form
     */
    private $data = [];

    /**
     * ContactInfo constructor.
     *
     * Create a new ContactInfo object from the given data.
     *
     * @param array $data
     *  The data that is part of a contact form
     */
    public function __construct(array $data) {
        $this->formName = isset($data["formName"]) ? $data["formName"] : "Unknown";
        $this->buttonName = isset($data["buttonName"]) ? $data["buttonName"] : null;
        $this->data = $data;
    }

    /**
     * Convert the contact information into raw text to be added to a text notification email.
     * @return string
     *  The generated text
     */
    public function asRawString() {
        $buttonName = $this->buttonName ? " (" . $this->buttonName . ")" : "";
        $lines = [];
        $lines[] = "Form: " . $this->formName . $buttonName;

        foreach ($this->data as $key => $value) {
            $key = str_replace("contact_", "", $key);
            $lines[] = "$key";
            $lines[] = "----------";
            $lines[] = $value;
            $lines[] = "";
        }

        return implode("\r\n", $lines);
    }

    /**
     * Convert the contact information into HTML to be added to a notification email.
     * @return string
     *  The generated HTML
     */
    public function asHtml() {
        $buttonName = $this->buttonName ? " (" . $this->buttonName . ")" : "";
        $html = "<li><strong>Form:</strong> " . $this->formName . $buttonName . "</li>";

        foreach ($this->data as $key => $value) {
            $key = str_replace("contact_", "", $key);
            $html .= "<li><strong>$key:</strong> $value</li>";
        }

        return "<ul style='list-style: none;'>$html</ul>";
    }

    /*
     * The following are the definitions of the getters. Each getter does its best to search through the
     * parsed form/contact data and find key-values that might match
     */

    /**
     * Get the name of the form this contact info came from. The name is retrieved from the hidden input 'formName'.
     * @return string
     *  The name of the contact form this information came from
     */
    protected function _getFormName() {
        return $this->defaultValue("formName", "Unknown Form");
    }

    protected function _getName() {
        return $this->defaultValue("contact_name");
    }

    protected function _getEmail() {
        return $this->defaultValue("contact_email");
    }

    protected function _getPhone() {
        return $this->defaultValue(["contact_phone", "contact_mobile"]);
    }

    protected function _getOrganisation() {
        return $this->defaultValue(
            ["contact_organisation", "contact_association", "contact_league"],
            "No Organisation Given"
        );
    }

    protected function _getNumEmployees() {
        return $this->defaultValue(["contact_teams", "contact_association"]);
    }

    protected function _getMessage() {
        return $this->defaultValue("contact_message");
    }

    protected function _getRecaptchaResponse() {
        return $this->defaultValue("g-recaptcha-response");
    }

    /**
     * Simple wrapper for returning a default value when searching for a key in $this->data. Key search
     * preference is the same as the order that they are parsed. This means if the first key in the keys
     * list is found (exists), all other ones will be ignored.
     * @param string|string[] $key
     *  The key or keys to look for
     * @param mixed [$default]
     *  The value to return if the key/s don't exist
     * @return mixed
     */
    private function defaultValue($key, $default = null) {
        // Convert non-array key variable into an array and give it a better name
        $keys = is_array($key) ? $key : [$key];

        // Loop over all the keys and try and return a value for one.
        foreach ($keys as $search) {
            if (array_key_exists($search, $this->data)) {
                return $this->data[$search];
            }
        }
        // return the default value
        return $default;
    }
}
