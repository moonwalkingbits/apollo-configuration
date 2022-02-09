/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Determine if the given value is a JavaScript object.
 *
 * @private
 * @param {*} value Value to check.
 * @return {boolean} True if the given value is an object.
 */
function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

export default isObject;
