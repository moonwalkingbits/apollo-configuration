/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ConfigurationBuilder, ObjectConfigurationSource, MergeStrategy } from "@moonwalkingbits/apollo-configuration";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { expect } = require("chai");

describe("ConfigurationBuilder", () => {
    let configurationBuilder;

    beforeEach(() => {
        configurationBuilder = new ConfigurationBuilder();
    });

    describe("#constructor", () => {
        it("should build an empty configuration if no configuration sources", async () => {
            expect((await configurationBuilder.build()).all()).to.eql({});
        });

        it("should accept configuration sources", async () => {
            const settings = {key: "value"};
            const configuration = await configurationBuilder.addConfigurationSource(new ObjectConfigurationSource(settings))
                .build();

            expect(configuration.all()).to.eql(settings);
        });
    });

    describe("#build", () => {
        it("should merge configuration sources", async () => {
            const settings = {key: "value"};
            const otherSettings = {otherKey: "other value"};
            const configuration = await configurationBuilder.addConfigurationSource(new ObjectConfigurationSource(settings))
                .addConfigurationSource(new ObjectConfigurationSource(otherSettings))
                .build();

            expect(configuration.all()).to.eql({
                key: "value",
                otherKey: "other value"
            });
        });

        it("should merge configuration sources using strategy", async () => {
            const settings = {list: ["one", "two", "three"]};
            const otherSettings = {list: ["two", "three", "four"]};

            configurationBuilder.addConfigurationSource(new ObjectConfigurationSource(settings))
                .addConfigurationSource(new ObjectConfigurationSource(otherSettings));

            const mergedConfiguration = await configurationBuilder.build(MergeStrategy.MERGE_INDEXED);
            const replacedConfiguration = await configurationBuilder.build(MergeStrategy.REPLACE_INDEXED);

            expect(mergedConfiguration.get("list")).to.eql(["one", "two", "three", "four"]);
            expect(replacedConfiguration.get("list")).to.eql(["two", "three", "four"]);
        });

        it("should merge nested configuration sources", async () => {
            const settings = {
                nested: {
                    key: "value"
                }
            };
            const otherSettings = {
                nested: {
                    other: {
                        key: "other value"
                    }
                }
            };
            const configuration = await configurationBuilder.addConfigurationSource(new ObjectConfigurationSource(settings))
                .addConfigurationSource(new ObjectConfigurationSource(otherSettings))
                .build();

            expect(configuration.all()).to.eql({
                nested: {
                    key: "value",
                    other: {
                        key: "other value"
                    }
                }
            });
        });

        it("should merge configuration sources at key path", async () => {
            const settings = {key: "value"};
            const otherSettings = {otherKey: "other value"};
            const configuration = await configurationBuilder.addConfigurationSource(new ObjectConfigurationSource(settings))
                .addConfigurationSource(new ObjectConfigurationSource(otherSettings), "nested")
                .build();

            expect(configuration.all()).to.eql({
                key: "value",
                nested: {
                    otherKey: "other value"
                }
            });
        });

        it("should merge configuration sources at nested key path", async () => {
            const settings = {key: "value"};
            const otherSettings = {otherKey: "other value"};
            const configuration = await configurationBuilder.addConfigurationSource(new ObjectConfigurationSource(settings))
                .addConfigurationSource(new ObjectConfigurationSource(otherSettings), "nested.section")
                .build();

            expect(configuration.all()).to.eql({
                key: "value",
                nested: {
                    section: {
                        otherKey: "other value"
                    }
                }
            });
        });

        it("should merge configuration sources at existing key path", async () => {
            const settings = {
                nested: {
                    key: "value"
                }
            };
            const otherSettings = {otherKey: "other value"};
            const configuration = await configurationBuilder.addConfigurationSource(new ObjectConfigurationSource(settings))
                .addConfigurationSource(new ObjectConfigurationSource(otherSettings), "nested")
                .build();

            expect(configuration.all()).to.eql({
                nested: {
                    key: "value",
                    otherKey: "other value"
                }
            });
        });
    });
});
