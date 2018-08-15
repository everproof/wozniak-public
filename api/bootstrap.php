<?php


require_once "vendor/autoload.php";

$config = array(
    // required
    'access_token' => \App\Config::read("rollbar.api_key"),
    // optional - environment name. any string will do.
    'environment' => \App\Config::read("rollbar.environment"),
);
Rollbar::init($config);