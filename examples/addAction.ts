import { define } from "@tangerie/power_automate_connector"
import { z } from "@zod/zod/v4";

export const add = define({
    name: "add",
    summary: "Add 2 numbers",
    input: z.object({
        a: z.number().describe("A").default(1),
        b: z.number().describe("B").default(2)
    }),
    output: z.object({
        result: z.number()
    }),
    handler(input) {
        const result = input.a + input.b;
        return { result }
    },
})