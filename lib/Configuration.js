/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import MergeStrategy from "./MergeStrategy.js";
import mergeObjects from "./mergeObjects.js";

/**
 * An in-memory implementation of a configuration object.
 *
 * @implements {ConfigurationInterface}
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
         * @type {Object.<string, *>}
         */
        this.settings = settings;
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
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
     * @inheritdoc
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
     * @inheritdoc
     */
    all() {
        return this.settings;
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    clear() {
        this.settings = {};
    }

    /**
     * @inheritdoc
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
