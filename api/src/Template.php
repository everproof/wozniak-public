<?php

namespace App;

/**
 * Simple template generating class.
 */
class Template {
    /**
     * Render a new template from the given file with the given variables. The template file specified
     * should be relative to the templates folder provided in the config file.
     *
     * Variables in the template file should be in the form '{{variable name}}'.
     *
     * Example:
     *
     *  my-template.txt
     *  --------------------------
     *  Hello {{name}}. You have won ${{money}}!
     *
     *  PHP file
     *  --------------------------
     *  echo Template::render("my-template.txt", [ "{{name}}" => "Frank", "{{money}}" => 5000 ]);
     *
     *  Output
     *  --------------------------
     *  Hello Frank. You have won $5000!
     *
     *
     * @param string $name
     *  The template file to render
     * @param array $variables
     *  The array of variables to be inserted into the template file
     * @return string
     */
    public static function render($name, array $variables) {
        $contents = file_get_contents(__DIR__ . "/../templates/" . $name);
        return strtr($contents, $variables);
    }
}