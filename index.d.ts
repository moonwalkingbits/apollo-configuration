/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * An interface representing a configuration source.
 *
 * Configuration sources are used to construct a final configuration instance.
 *
 * @interface ConfigurationSourceInterface
 */
declare interface ConfigurationSourceInterface {
    /**
     * Provide the configuration source settings.
     *
     * @function
     * @name ConfigurationSourceInterface#load
     * @return {Promise.<Object.<string, *>>} Configuration settings.
     */
    load(): Promise<{[key: string]: any}>;
}

/**
 * A configuration instance represents the frontend of a configuration.
 * It provides operations to easily access, alter or extend the configuration.
 *
 * @interface ConfigurationInterface
 */
declare interface ConfigurationInterface {
    /**
     * Assign a value to a key path.
     *
     * After this operation the value will be available at the given key path.
     *
     * @function
     * @name ConfigurationInterface#set
     * @param {string} keyPath Key path to assign a value to.
     * @param {*} value Value to assign to the key path.
     */
    set(keyPath: string, value: any): void;

    /**
     * Determine if the key path exists in the configuration.
     *
     * @function
     * @name ConfigurationInterface#has
     * @param {string} keyPath Key path to check for.
     * @return {boolean} True if the key path exists in the configuration.
     */
    has(keyPath: string): boolean;

    /**
     * Retrieve the value at the given key path.
     *
     * @function
     * @name ConfigurationInterface#get
     * @param {string} keyPath Key path to retrieve value from.
     * @param {*} [defaultValue=null] Value to return if key path doesn't exist.
     * @return {*} The value at the key path or default value.
     */
    get<T = any>(keyPaht: string, defaultValue?: T): T;

    /**
     * Retrieves all settings in the configuration instance.
     *
     * @function
     * @name ConfigurationInterface#all
     * @return {Object.<string, *>} All settings.
     */
    all(): {[key: string]: any};

    /**
     * Remove key path from the configuration.
     *
     * If the key path does not exist no operation is performed.
     *
     * @function
     * @name ConfigurationInterface#remove
     * @param {string} keyPath Key path to be removed.
     */
    remove(keyPath: string): void;

    /**
     * Removes all configuration settings effectively leaving it empty.
     *
     * @function
     * @name ConfigurationInterface#clear
     */
    clear(): void;

    /**
     * Produce a new configuration instance by merging the given configuration
     * with this instance.
     *
     * @function
     * @name ConfigurationInterface#merge
     * @param {ConfigurationInterface} configuration Configuration instance to merge with.
     * @param {string} [keyPath=null] Key path to merge in the new instance at.
     * @param {MergeStrategy} [strategy=MergeStrategy.MERGE_INDEXED] Merge strategy to use when merging arrays.
     * @return {ConfigurationInterface} Merged configuration instance.
     */
    merge(
        configuration: ConfigurationInterface,
        keyPath?: string,
        strategy?: MergeStrategy
    ): ConfigurationInterface;
}

/**
 * This abstract class provides a convenient base to extend so you only have to
 * worry about the parsing of the configuration file and not the loading.
 *
 * @abstract
 * @implements {ConfigurationSourceInterface}
 */
declare abstract class AbstractFileConfigurationSource {
    /**
     * Create a new file configuration instance.
     *
     * @public
     * @param {string} file Configuration file to load.
     */
    public constructor(file: string);

    /**
     * Reads the entire file and returns the content.
     *
     * @protected
     * @return {Promise.<string>} Raw contents of the file.
     */
    protected readFile(): Promise<string>;
}

/**
 * An in-memory implementation of a configuration object.
 *
 * @implements {ConfigurationInterface}
 */
declare class Configuration implements ConfigurationInterface {
    /**
     * Create a new configuration instance using the given settings.
     *
     * @public
     * @param {?Object.<string, *>} settings Initial configuration settings.
     */
    public constructor(settings?: {[key: string]: any});

    /**
     * @inheritdoc
     */
    public set(keyPath: string, value: any): void;

    /**
     * @inheritdoc
     */
    public has(keyPath: string): boolean;

    /**
     * @inheritdoc
     */
    public get<T = any>(keyPaht: string, defaultValue?: T): T;

    /**
     * @inheritdoc
     */
    public all(): {[key: string]: any};

    /**
     * @inheritdoc
     */
    public remove(keyPath: string): void;

    /**
     * @inheritdoc
     */
    public clear(): void;

    /**
     * @inheritdoc
     */
    public merge(
        configuration: ConfigurationInterface,
        keyPath?: string,
        strategy?: MergeStrategy
    ): ConfigurationInterface;
}

/**
 * The configuration builder provides a simple and very extendible way of
 * creating configuration objects.
 *
 * The idea is that you add one or more configuration sources and the builder
 * will merge them all together into a single configuration instance. One
 * benefit with this approach is that you can pass the configuration builder
 * around so multiple participants can get a chance to contribute to the final
 * configuration instance result.
 *
 * @interface ConfigurationBuilderInterface
 */
declare interface ConfigurationBuilderInterface {
    /**
     * Add configuration source to be merged into final configuration.
     *
     * If a key path is supplied all settings from this configuration source
     * will be merged in at the given key path. If it doen't exist it will
     * be created.
     *
     * @function
     * @name ConfigurationBuilderInterface#addConfigurationSource
     * @param {ConfigurationSourceInterface} configurationSource Configuration source to be used in configuration.
     * @param {?string} keyPath Key path to merge in the configuration from configuration source into.
     * @return {this} The same instance for method chaining.
     */
    addConfigurationSource(configurationSource: ConfigurationSourceInterface, keyPath?: string): this;

    /**
     * Use all provided configuration sources to build a single configuration instance.
     *
     * @function
     * @name ConfigurationBuilderInterface#build
     * @param {?MergeStrategy} mergeStrategy Merge strategy to use when merging arrays.
     * @return {Promise.<ConfigurationInterface>} Resulting configuration instance.
     */
    build(mergeStrategy?: MergeStrategy): Promise<ConfigurationInterface>;
}

/**
 * Represents a fixed set of merge strategies.
 *
 * @readonly
 * @enum {string}
 */
declare enum MergeStrategy {
    MERGE_INDEXED = "MERGE_INDEXED",
        REPLACE_INDEXED = "REPLACE_INDEXED"
}

/**
 * A convenient configuration source used to add plain objects to configurations.
 *
 * @implements {ConfigurationSourceInterface}
 */
declare class ObjectConfigurationSource implements ConfigurationSourceInterface {
    /**
     * Create a new configuration source instance.
     *
     * @public
     * @param {Object.<string, *>} settings Settings to contribute to the configuration.
     */
    public constructor(settings: {[key: string]: any});

    /**
     * @inheritdoc
     */
    public load(): Promise<{[key: string]: any}>;
}

/**
 * An in-memory implementation of a configuration builder.
 *
 * @implements {ConfigurationBuilderInterface}
 */
declare class ConfigurationBuilder implements ConfigurationBuilderInterface {
    /**
     * Create a new configuration builder instance.
     *
     * @public
     */
    public constructor();

    /**
     * @inheritdoc
     */
    public addConfigurationSource(configurationSource: ConfigurationSourceInterface, keyPath?: string): this;

    /**
     * @inheritdoc
     */
    public build(mergeStrategy?: MergeStrategy): Promise<ConfigurationInterface>;
}

export {
    AbstractFileConfigurationSource,
    Configuration,
    ConfigurationBuilder,
    ConfigurationBuilderInterface,
    ConfigurationInterface,
    ConfigurationSourceInterface,
    MergeStrategy,
    ObjectConfigurationSource
};
