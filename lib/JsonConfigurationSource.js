/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractFileConfigurationSource from "./AbstractFileConfigurationSource.js";

/**
 * A JSON file configuration source.
 *
 * @implements {ConfigurationSourceInterface}
 */
class JsonConfigurationSource extends AbstractFileConfigurationSource {
    /**
     * Provide the configuration source settings.
     *
     * @public
     * @async
     * @return {Promise.<Object.<string, *>>} Configuration settings.
     */
    async load() {
        return JSON.parse(await this.readFile());
    }
}

export default JsonConfigurationSource;
