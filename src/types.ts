import type { z } from "@zod/zod/v4";

export interface ActionDefinition<I extends z.ZodType, O extends z.ZodType> {
    /** operationId */
    name: string;
    /** Shows on node */
    summary: string;
    description?: string;
    input: I;
    output: O;
    handler: (input: z.infer<I>) => Promise<z.infer<O>> | z.infer<O>;
}

export type UnknownActionDefinition = ActionDefinition<z.ZodUnknown, z.ZodUnknown>;

export interface AppConfig {
    info: {
        title: string;
        description: string;
        version: string;
    };
    host: string;
    basePath: string;
}