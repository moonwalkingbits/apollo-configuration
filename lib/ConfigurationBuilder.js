/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Configuration from "./Configuration.js";

/**
 * An interface representing a configuration source.
 *
 * Configuration sources are used to construct a final configuration instance.
 *
 * @interface ConfigurationSourceInterface
 */

/**
 * Provide the configuration source settings.
 *
 * @function
 * @name ConfigurationSourceInterface#load
 * @return Configuration settings.
 */

/**
 * The configuration builder provides a simple and very extendible way of
 * creating configuration objects.
 *
 * The idea is that you add one or more configuration sources and the builder
 * will merge them all together into a single configuration instance. One
 * benefit with this approach is that you can pass the configuration builder
 * around so multiple participants can get a chance to contribute to the final
 * configuration instance result.
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
     * Add configuration source to be merged into final configuration.
     *
     * If a key path is supplied all settings from this configuration source
     * will be merged in at the given key path. If it doen't exist it will
     * be created.
     *
     * @public
     * @param {ConfigurationSourceInterface} configurationSource Configuration source to be used in configuration.
     * @param {?string} keyPath Key path to merge in the configuration from configuration source into.
     * @return {this} The same instance for method chaining.
     */
    addConfigurationSource(configurationSource, keyPath) {
        this.configurationSources.push({configurationSource, keyPath});

        return this;
    }

    /**
     * Use all provided configuration sources to build a single configuration instance.
     *
     * @public
     * @param {?MergeStrategy} mergeStrategy Merge strategy to use when merging arrays.
     * @return {Promise.<Configuration>} Resulting configuration instance.
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
