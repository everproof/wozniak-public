<?php
/**
 * Created by PhpStorm.
 * User: bohda
 * Date: 28/11/2016
 * Time: 5:09 PM
 */

namespace App\Traits;

/**
 * Trait for allowing getters in a class. To define a getting simply implement
 * a protected method with prefix '_get' and first letter capitalised for the property
 * you wish to create a getter for.
 *
 * Example:
 *  Say you wanted to create a getter for the 'firstName' property. You would then need to define
 *  the method '_getFirstName'.
 * @package Traits
 */
trait Getter {
    public function __get($name) {
        $method = "_get" . ucfirst($name);

        if (method_exists($this, $method)) {
            return $this->$method();
        } else {
            return null;
        }
    }
}