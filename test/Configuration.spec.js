/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Configuration } from "@moonwalkingbits/apollo-configuration";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { expect } = require("chai");

describe("Configuration", () => {
    let configuration;

    beforeEach(() => {
        configuration = new Configuration();
    });

    describe("#all", () => {
        it("should be empty by default", () => {
            expect(configuration.all()).to.eql({});
        });

        it("should accept settings through the constructor", () => {
            const settings = {key: "value"};
            const configuration = new Configuration(settings);

            expect(configuration.all()).to.eql(settings);
        });

        it("should return all settings", () => {
            configuration.set("key", "value");

            expect(configuration.all()).to.eql({key: "value"});
        });
    });

    describe("#set", () => {
        it("should set value for key path", () => {
            configuration.set("key", "value");

            expect(configuration.get("key")).to.equal("value");
        });

        it("should set value for nested key path", () => {
            configuration.set("nested.key", "value");

            expect(configuration.all()).to.have.nested.property("nested.key", "value");
        });
    });

    describe("#clear", () => {
        it("should clear all settings", () => {
            configuration.set("key", "value");
            configuration.clear();

            expect(configuration.all()).to.eql({});
        });
    });

    describe("#has", () => {
        it("should determine if key path is present", () => {
            expect(configuration.has("key")).to.be.false;

            configuration.set("key", "value");

            expect(configuration.has("key")).to.be.true;
        });

        it("should determine if nested key path is present", () => {
            expect(configuration.has("nested.key")).to.be.false;

            configuration.set("nested.key", "value");

            expect(configuration.has("nested.key")).to.be.true;
        });

        it("should not throw if key path is longer than object when checking key path", () => {
            configuration.set("key", "value");

            expect(configuration.has("key.nested.key")).to.be.false;
        });
    });

    describe("#get", () => {
        it("should return value for key path", () => {
            configuration.set("key", "value");

            expect(configuration.get("key")).to.equal("value");
        });

        it("should return value for nested key path", () => {
            configuration.set("nested.key", "value");

            expect(configuration.get("nested.key")).to.equal("value");
        });

        it("should not throw if key path is longer than object when retrieving value", () => {
            configuration.set("key", "value");

            expect(configuration.get("key.nested.key")).to.be.null;
        });

        it("should return undefined if key path is not found", () => {
            expect(configuration.get("key")).to.be.null;
        });

        it("should return default value if key path is not found", () => {
            expect(configuration.get("key", "default")).to.equal("default");
        });
    });

    describe("#remove", () => {
        it("should remove value from key path", () => {
            configuration.set("key", "value");
            configuration.remove("key");

            expect(configuration.has("key")).to.be.false;
        });

        it("should not throw if key path is not found when removing value", () => {
            configuration.remove("key");
        });

        it("should remove value from nested key path", () => {
            configuration.set("nested.key", "value");
            configuration.remove("nested.key");

            expect(configuration.has("nested.key")).to.be.false;
        });

        it("should not throw if nested key path is not found when removing value", () => {
            configuration.remove("nested.key");
        });
    });

    describe("#merge", () => {
        it("should merge configurations", () => {
            const configuration = new Configuration({key: "value"});
            const otherConfiguration = new Configuration({otherKey: "other value"});
            const mergedConfiguration = configuration.merge(otherConfiguration);

            expect(mergedConfiguration.all()).to.eql({
                key: "value",
                otherKey: "other value"
            });
        });

        it("should merge configurations at key path", () => {
            const configuration = new Configuration({key: "value"});
            const otherConfiguration = new Configuration({otherKey: "other value"});
            const mergedConfiguration = configuration.merge(otherConfiguration, "nested");

            expect(mergedConfiguration.all()).to.eql({
                key: "value",
                nested: {
                    otherKey: "other value"
                }
            });
        });

        it("should merge configurations at nested key path", () => {
            const configuration = new Configuration({key: "value"});
            const otherConfiguration = new Configuration({otherKey: "other value"});
            const mergedConfiguration = configuration.merge(otherConfiguration, "nested.section");

            expect(mergedConfiguration.all()).to.eql({
                key: "value",
                nested: {
                    section: {
                        otherKey: "other value"
                    }
                }
            });
        });

        it("should merge configurations at existing key path", () => {
            const configuration = new Configuration({nested: {key: "value"}});
            const otherConfiguration = new Configuration({otherKey: "other value"});
            const mergedConfiguration = configuration.merge(otherConfiguration, "nested.section");

            expect(mergedConfiguration.all()).to.eql({
                nested: {
                    key: "value",
                    section: {
                        otherKey: "other value"
                    }
                }
            });
        });
    });
});
