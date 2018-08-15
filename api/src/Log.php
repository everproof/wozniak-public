<?php
/**
 * Created by PhpStorm.
 * User: bohda
 * Date: 29/11/2016
 * Time: 10:28 AM
 */

namespace App;


/**
 * Simple class for logging messages to a file. There will be a new log file created for each day. They will
 * be named in the format yyyymmdd.log and stored under the logging folder (refer to config file for loggin
 * location).
 * @package App
 */
class Log {
    private static $messages = [];

    /**
     * Write the given message to the log
     * @param string $message
     *  The message to add to the log
     * @param int $level
     *  The log level for this message
     */
    public static function write($message, $level = 0) {
        $message = trim($message);
        self::$messages[] = "<level>$level</level><message>$message</message>";
    }

    /**
     * Flush all logging messages to a file. The file that they will be flushed to is today's current date
     * in the format "yyyymmdd.log"
     */
    public static function flush() {
        if (!file_exists(Config::read("logging.folder"))) {
            mkdir(Config::read("logging.folder"));
        }
        $filename = Config::read("logging.folder") . "/" . date("Ymd") . ".log";
        file_put_contents($filename, implode("\n", self::$messages), FILE_APPEND);
    }
}