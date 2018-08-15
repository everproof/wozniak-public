<?php

namespace App;

/**
 * Created by PhpStorm.
 * User: bohda
 * Date: 28/11/2016
 * Time: 10:18 AM
 */
class Config {
    /**
     * Read a value from the config file. Config keys should be provided in dot-notation.
     * Example:
     *  email.gmail.hsot
     * @param string $key
     * @return mixed|null
     */
    public static function read($key) {
        $keys = explode(".", $key);
        $config = require __DIR__ . "/../config.php";

        foreach ($keys as $k) {
            if (isset($config[$k])) {
                $config = $config[$k];
            } else {
                return null;
            }
        }

        return $config;
    }

    /**
     * Check if a key has been defined in the config file. Keys should be provided in dot-notation.
     * Example:
     *  email.gmail.host
     * @param string $key
     * @return bool
     *  TRUE if the config item exists, FALSE otherwise
     */
    public static function exists($key) {
        return self::read($key) !== null;
    }
}