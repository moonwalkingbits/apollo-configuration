/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import MergeStrategy from "./MergeStrategy.js";

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

/**
 * Merge the two given object into one using the given merge strategy.
 *
 * The second object takes precedence.
 *
 * @private
 * @param {Object.<string, *>} a First object.
 * @param {Object.<string, *>} b Second object.
 * @param {MergeStrategy} mergeStrategy The strategy to use when merging arrays.
 * @return {Object.<string, *>} Result of combining the two objects.
 */
function mergeObjects(a, b, mergeStrategy) {
    const aCopy = Object.assign({}, a);

    for (let [key, value] of Object.entries(b)) {
        if (!(key in aCopy)) {
            aCopy[key] = value;

            continue;
        }

        if (isObject(a[key]) && isObject(value)) {
            aCopy[key] = mergeObjects(aCopy[key], value, mergeStrategy);

            continue;
        }

        if (mergeStrategy === MergeStrategy.MERGE_INDEXED && Array.isArray(aCopy[key]) && Array.isArray(value)) {
            aCopy[key] = Array.from(new Set([...aCopy[key], ...value]));

            continue;
        }

        aCopy[key] = value;
    }

    return aCopy;
}

export default mergeObjects;
