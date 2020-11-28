/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * An interface representing a configuration object.
 */
declare interface ConfigurationInterface {
    /**
     * Assign a value to a key path.
     *
     * After this operation the value will be available at the given key path.
     *
     * @param keyPath Key path to assign a value to.
     * @param value Value to assign to the key path.
     */
    set(keyPath: string, value: any): void;

    /**
     * Determine if the key path exists in the configuration.
     *
     * @param keyPath Key path to check for.
     * @return True if the key path exists in the configuration.
     */
    has(keyPath: string): boolean;

    /**
     * Retrieve the value at the given key path.
     *
     * @param keyPath Key path to retrieve value from.
     * @param defaultValue Value to return if key path doesn't exist.
     * @return The value at the key path or default value.
     */
    get<T = any>(keyPaht: string, defaultValue?: T): T;

    /**
     * Retrieves all settings in the configuration instance.
     *
     * @return All settings.
     */
    all(): {[key: string]: any};

    /**
     * Remove key path from the configuration.
     *
     * If the key path does not exist no operation is performed.
     *
     * @param keyPath Key path to be removed.
     */
    remove(keyPath: string): void;

    /**
     * Removes all configuration settings effectively leaving it empty.
     */
    clear(): void;

    /**
     * Produce a new configuration instance by merging the given configuration
     * with this instance.
     *
     * @param configuration Configuration instance to merge with.
     * @param keyPath Key path to merge in the new instance at.
     * @param strategy Merge strategy to use when merging arrays.
     * @return Merged configuration instance.
     */
    merge(
        configuration: ConfigurationInterface,
        keyPath?: string,
        strategy?: MergeStrategy
    ): ConfigurationInterface;
}

/**
 * A configuration instance represents the frontend of a configuration.
 * It provides operations to easily access, alter or extend the configuration.
 */
declare class Configuration implements ConfigurationInterface {
    /**
     * Create a new configuration instance using the given settings.
     *
     * @param settings Initial configuration settings.
     */
    public constructor(settings?: {[key: string]: any});

    /**
     * Assign a value to a key path.
     *
     * After this operation the value will be available at the given key path.
     *
     * @param keyPath Key path to assign a value to.
     * @param value Value to assign to the key path.
     */
    public set(keyPath: string, value: any): void;

    /**
     * Determine if the key path exists in the configuration.
     *
     * @param keyPath Key path to check for.
     * @return True if the key path exists in the configuration.
     */
    public has(keyPath: string): boolean;

    /**
     * Retrieve the value at the given key path.
     *
     * @param keyPath Key path to retrieve value from.
     * @param defaultValue Value to return if key path doesn't exist.
     * @return The value at the key path or default value.
     */
    public get<T = any>(keyPaht: string, defaultValue?: T): T;

    /**
     * Retrieves all settings in the configuration instance.
     *
     * @return All settings.
     */
    public all(): {[key: string]: any};

    /**
     * Remove key path from the configuration.
     *
     * If the key path does not exist no operation is performed.
     *
     * @param keyPath Key path to be removed.
     */
    public remove(keyPath: string): void;

    /**
     * Removes all configuration settings effectively leaving it empty.
     */
    public clear(): void;

    /**
     * Produce a new configuration instance by merging the given configuration
     * with this instance.
     *
     * @param configuration Configuration instance to merge with.
     * @param keyPath Key path to merge in the new instance at.
     * @param strategy Merge strategy to use when merging arrays.
     * @return Merged configuration instance.
     */
    public merge(
        configuration: ConfigurationInterface,
        keyPath?: string,
        strategy?: MergeStrategy
    ): ConfigurationInterface;
}

/**
 * An interface representing a configuration source.
 *
 * Configuration sources are used to construct a final configuration instance.
 */
declare interface ConfigurationSourceInterface {
    /**
     * Provide the configuration source settings.
     *
     * @return Configuration settings.
     */
    load(): Promise<{[key: string]: any}>;
}

/**
 * A convenient configuration source used to add plain objects to configurations.
 */
declare class ObjectConfigurationSource implements ConfigurationSourceInterface {
    /**
     * Create a new configuration source instance.
     *
     * @param settings Settings to contribute to the configuration.
     */
    public constructor(settings: {[key: string]: any});

    /**
     * @inheritdoc
     */
    public load(): Promise<{[key: string]: any}>;
}

/**
 * This abstract class provides a convenient base to extend so you only have to
 * worry about the parsing of the configuration file and not the loading.
 */
declare abstract class AbstractFileConfigurationSource {
    /**
     * Create a new file configuration instance.
     *
     * @param file Configuration file to load.
     */
    public constructor(file: string);

    /**
     * Reads the entire file and returns the content.
     *
     * @return Raw contents of the file.
     */
    protected readFile(): Promise<string>;
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
 */
declare interface ConfigurationBuilderInterface {
    /**
     * Add configuration source to be merged into final configuration.
     *
     * If a key path is supplied all settings from this configuration source
     * will be merged in at the given key path. If it doen't exist it will
     * be created.
     *
     * @param configurationSource Configuration source to be used in configuration.
     * @param keyPath Key path to merge in the configuration from configuration source into.
     * @return The same instance for method chaining.
     */
    addConfigurationSource(configurationSource: ConfigurationSourceInterface, keyPath?: string): this;

    /**
     * Use all provided configuration sources to build a single configuration instance.
     *
     * @param mergeStrategy Merge strategy to use when merging arrays.
     * @return Resulting configuration instance.
     */
    build(mergeStrategy?: MergeStrategy): Promise<ConfigurationInterface>;
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
 */
declare class ConfigurationBuilder implements ConfigurationBuilderInterface {
    /**
     * Create a new configuration builder instance.
     */
    public constructor();

    /**
     * Add configuration source to be merged into final configuration.
     *
     * If a key path is supplied all settings from this configuration source
     * will be merged in at the given key path. If it doen't exist it will
     * be created.
     *
     * @param configurationSource Configuration source to be used in configuration.
     * @param keyPath Key path to merge in the configuration from configuration source into.
     * @return The same instance for method chaining.
     */
    public addConfigurationSource(configurationSource: ConfigurationSourceInterface, keyPath?: string): this;

    /**
     * Use all provided configuration sources to build a single configuration instance.
     *
     * @param mergeStrategy Merge strategy to use when merging arrays.
     * @return Resulting configuration instance.
     */
    public build(mergeStrategy?: MergeStrategy): Promise<ConfigurationInterface>;
}

/**
 * Represents a fixed set of merge strategies.
 */
declare enum MergeStrategy {
    MERGE_INDEXED = "MERGE_INDEXED",
    REPLACE_INDEXED = "REPLACE_INDEXED"
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
