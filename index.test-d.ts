/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { expectAssignable, expectError, expectType } from "tsd";

import {
    AbstractFileConfigurationSource,
    Configuration,
    ConfigurationBuilder,
    ConfigurationBuilderInterface,
    ConfigurationInterface,
    ConfigurationSourceInterface,
    MergeStrategy,
    ObjectConfigurationSource
} from ".";

/*
|--------------------------------------------------------------------------
| AbstractFileConfigurationSource
|--------------------------------------------------------------------------
|
| These tests ensures the API of the abstract file configuration source.
|
*/

class JsonConfigurationSource extends AbstractFileConfigurationSource {
    public async load(): Promise<{[key: string]: any}> {
        return JSON.parse(await this.readFile());
    }
}

const jsonConfigurationSource = new JsonConfigurationSource("config.json");

expectAssignable<ConfigurationSourceInterface>(jsonConfigurationSource);
expectType<{[key: string]: any}>(await jsonConfigurationSource.load());

/*
|--------------------------------------------------------------------------
| ObjectConfigurationSource
|--------------------------------------------------------------------------
|
| These tests ensures the API of the object configuration source.
|
*/

const objectConfigurationSource = new ObjectConfigurationSource({});

expectAssignable<ConfigurationSourceInterface>(objectConfigurationSource);
expectType<{[key: string]: any}>(await objectConfigurationSource.load());

/*
|--------------------------------------------------------------------------
| ConfigurationBuilder
|--------------------------------------------------------------------------
|
| These tests ensures the API of the configuration builder.
|
*/

const configurationBuilder = new ConfigurationBuilder();

expectAssignable<ConfigurationBuilderInterface>(configurationBuilder);
expectType<ConfigurationBuilder>(configurationBuilder.addConfigurationSource(new ObjectConfigurationSource({})));
expectType<ConfigurationBuilder>(configurationBuilder.addConfigurationSource(new ObjectConfigurationSource({}), "keyPath"));
expectType<ConfigurationInterface>(await configurationBuilder.build());
expectType<ConfigurationInterface>(await configurationBuilder.build(MergeStrategy.MERGE_INDEXED));

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
|
| These tests ensures the API of the configuration object.
|
*/

const configuration = new Configuration();

expectAssignable<ConfigurationInterface>(configuration);
expectAssignable<ConfigurationInterface>(new Configuration({}));
expectType<void>(configuration.set("key", "value"));
expectType<boolean>(configuration.has("key"));
expectType<string>(configuration.get("key"));
expectType<number>(configuration.get("key"));
expectError(() => {
    const value: string = configuration.get("key", 5);
});
const value: string = configuration.get("key", "value");
expectType<{[key: string]: any}>(configuration.all());
expectType<void>(configuration.remove("key"));
expectType<void>(configuration.clear());
expectType<ConfigurationInterface>(configuration.merge(new Configuration()));
expectType<ConfigurationInterface>(configuration.merge(new Configuration(), "key"));
expectType<ConfigurationInterface>(configuration.merge(new Configuration(), "key", MergeStrategy.MERGE_INDEXED));
