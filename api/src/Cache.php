<?php

namespace App;

/**
 * Simple class for reading and writing to a cache
 */
class Cache {
    /**
     * Read a value from cache. If the key isn't found, null is returned.
     * @param string $key
     *  The key in the cache to search for
     * @param mixed [$default]
     *  The default value to return if the cache key can't be found.
     * @return null|string
     */
    public static function read($key, $default = null) {
        $file = Config::read("cache.folder") . "/$key";
        if (file_exists($file)) {
            return file_get_contents($file);
        } else {
            return $default;
        }
    }

    /**
     * Write the given key/value to file
     * @param string $key
     * @param string $value
     */
    public static function write($key, $value) {
        $file = Config::read("cache.folder") . "/$key";
        $dir = dirname($file);
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        file_put_contents($file, $value);
    }
}