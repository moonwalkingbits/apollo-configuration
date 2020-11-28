/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * A convenient configuration source used to add plain objects to configurations.
 */
class ObjectConfigurationSource {
    /**
     * Create a new configuration source instance.
     *
     * @public
     * @param {Object.<string, *>} settings Settings to contribute to the configuration.
     */
    constructor(settings) {
        /**
         * Settings to contribute to the configuration.
         *
         * @private
         * @type {Object.<string, *>}
         */
        this.settings = settings;
    }

    /**
     * Provide the configuration source settings.
     *
     * @public
     * @return {Object.<string, *>}Configuration settings.
     */
    load() {
        return Promise.resolve(this.settings);
    }
}

export default ObjectConfigurationSource;
