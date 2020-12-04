/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { JsonConfigurationSource } from "@moonwalkingbits/apollo-configuration";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { expect } = require("chai");

describe("JsonConfigurationSource", () => {
    describe("#load", () => {
        it("should return the configuration in the given file", async () => {
            expect(await new JsonConfigurationSource("test/fixtures/config.json").load()).to.eql({key: "value"});
        });
    });
});
