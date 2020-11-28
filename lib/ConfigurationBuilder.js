/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Configuration from "./Configuration.js";

/**
 * An in-memory implementation of a configuration builder.
 *
 * @implements {ConfigurationBuilderInterface}
 */
class ConfigurationBuilder {
    /**
     * Create a new configuration builder instance.
     *
     * @public
     */
    constructor() {
        /**
         * A list of configuration sources to use when constructing the
         * configuration instance.
         *
         * @private
         * @type {Array.<ConfigurationSourceInterface>}
         */
        this.configurationSources = [];
    }

    /**
     * @inheritdoc
     */
    addConfigurationSource(configurationSource, keyPath) {
        this.configurationSources.push({configurationSource, keyPath});

        return this;
    }

    /**
     * @inheritdoc
     */
    async build(mergeStrategy) {
        const settingsPromises = this.configurationSources.map(async ({ configurationSource, keyPath }) => ({
            settings: await configurationSource.load(),
            keyPath
        }));
        const resolvedSettings = await Promise.all(settingsPromises);

        return resolvedSettings.reduce((configuration, { settings, keyPath }) => configuration.merge(
            new Configuration(settings),
            keyPath,
            mergeStrategy
        ), new Configuration());
    }
}

export default ConfigurationBuilder;
