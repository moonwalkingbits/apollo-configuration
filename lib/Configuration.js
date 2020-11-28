/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import MergeStrategy from "./MergeStrategy.js";
import mergeObjects from "./mergeObjects.js";

/**
 * A configuration instance represents the frontend of a configuration.
 * It provides operations to easily access, alter or extend the configuration.
 */
class Configuration {
    /**
     * Create a new configuration instance using the given settings.
     *
     * @public
     * @param {Object.<string, *>} settings Initial configuration settings.
     */
    constructor(settings = {}) {
        /**
         * Configuration settings.
         *
         * @private
         * @type {Object.<string, *>}
         */
        this.settings = settings;
    }

    /**
     * Assign a value to a key path.
     *
     * After this operation the value will be available at the given key path.
     *
     * @public
     * @param {string} keyPath Key path to assign a value to.
     * @param {*} value Value to assign to the key path.
     */
    set(keyPath, value) {
        const properties = keyPath.split(".");
        let intermediate = this.settings;

        while (properties.length > 1) {
            let key = properties.shift();

            if (typeof intermediate[key] !== "object") {
                intermediate[key] = {};
            }

            intermediate = intermediate[key];
        }

        intermediate[properties.shift()] = value;
    }

    /**
     * Determine if the key path exists in the configuration.
     *
     * @public
     * @param {string} keyPath Key path to check for.
     * @return {boolean} True if the key path exists in the configuration.
     */
    has(keyPath) {
        const properties = keyPath.split(".");
        let intermediate = this.settings;

        while (properties.length > 0) {
            let key = properties.shift();

            if (typeof intermediate !== "object" || !(key in intermediate)) {
                return false;
            }

            intermediate = intermediate[key];
        }

        return true;
    }

    /**
     * Retrieve the value at the given key path.
     *
     * @public
     * @param {string} keyPath Key path to retrieve value from.
     * @param {*} [defaultValue=null] Value to return if key path doesn't exist.
     * @return {*} The value at the key path or default value.
     */
    get(keyPath, defaultValue = null) {
        const properties = keyPath.split(".");
        let intermediate = this.settings;

        while (properties.length > 0) {
            let key = properties.shift();

            if (typeof intermediate !== "object" || !(key in intermediate)) {
                return defaultValue;
            }

            intermediate = intermediate[key];
        }

        return intermediate;
    }

    /**
     * Retrieves all settings in the configuration instance.
     *
     * @public
     * @return {Object.<string, *>} All settings.
     */
    all() {
        return this.settings;
    }

    /**
     * Remove key path from the configuration.
     *
     * If the key path does not exist no operation is performed.
     *
     * @public
     * @param {string} keyPath Key path to be removed.
     */
    remove(keyPath) {
        const properties = keyPath.split(".");
        let intermediate = this.settings;

        while (properties.length > 1) {
            let key = properties.shift();

            if (typeof intermediate[key] !== "object") {
                return;
            }

            intermediate = intermediate[key];
        }

        delete intermediate[properties.shift()];
    }

    /**
     * Removes all configuration settings effectively leaving it empty.
     *
     * @public
     */
    clear() {
        this.settings = {};
    }

    /**
     * Produce a new configuration instance by merging the given configuration
     * with this instance.
     *
     * @public
     * @param {Configuration} configuration Configuration instance to merge with.
     * @param {string} [keyPath=null] Key path to merge in the new instance at.
     * @param {MergeStrategy} [strategy=MergeStrategy.MERGE_INDEXED] Merge strategy to use when merging arrays.
     * @return {Configuration} Merged configuration instance.
     */
    merge(configuration, keyPath = null, strategy = MergeStrategy.MERGE_INDEXED) {
        const base = keyPath !== null ? this.get(keyPath, {}) : this.all();
        const settings = mergeObjects(base, configuration.all(), strategy);

        if (keyPath === null) {
            return new Configuration(settings);
        }

        const mergedConfiguration = new Configuration(this.all());
        mergedConfiguration.set(keyPath, settings);

        return mergedConfiguration;
    }
}

export default Configuration;
