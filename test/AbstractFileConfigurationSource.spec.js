/*
 * Copyright (c) 2020 Martin Pettersson
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { AbstractFileConfigurationSource } from "@moonwalkingbits/apollo-configuration";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { expect } = require("chai");

describe("AbstractFileConfigurationSource", () => {
    describe("#readFile", () => {
        it("should return the contents of the file", async () => {
            const content = await new AbstractFileConfigurationSource("test/fixtures/content.txt").readFile();

            expect(content.toString()).to.eql("content");
        });
    });
});;
