/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile } from "fs/promises";

/**
 * This abstract class provides a convenient base to extend so you only have to
 * worry about the parsing of the configuration file and not the loading.
 *
 * @abstract
 * @implements {ConfigurationSourceInterface}
 */
class AbstractFileConfigurationSource {
    /**
     * Create a new file configuration instance.
     *
     * @public
     * @param {string} file Configuration file to load.
     */
    constructor(file) {
        /**
         * Configuration file.
         *
         * @private
         * @type {string}
         */
        this.file = file;
    }

    /**
     * Reads the entire file and returns the content.
     *
     * @protected
     * @return {Promise.<string>} Raw contents of the file.
     */
    readFile() {
        return readFile(this.file);
    }
}

export default AbstractFileConfigurationSource;
