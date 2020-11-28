/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ObjectConfigurationSource } from "@moonwalkingbits/apollo-configuration";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { expect } = require("chai");

describe("ObjectConfigurationSource", () => {
    describe("#load", () => {
        it("should return the value given in constructor", async () => {
            const value = {key: "value"};

            expect(await new ObjectConfigurationSource(value).load()).to.eql(value);
        });
    });
});
