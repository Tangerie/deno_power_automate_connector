import type { z } from "@zod/zod/v4";
import { getPath, registry } from "./internal.ts";
import type { AppConfig } from "./types.ts";

const getJSONSchema = (schema : z.ZodType) => schema.toJSONSchema({
    target: "openapi-3.0",
    cycles: "throw",
    reused: "inline"
});



export function buildSwagger(config : AppConfig): Record<string, unknown> {
    const paths: Record<string, unknown> = {};
    for(const action of registry.values()) {
        const operation: Record<string, unknown> = {
            operationId: action.name,
            summary: action.summary,
            description: action.description,
            tags: [],
            consumes: ["application/json"],
            produces: ["application/json"],
            parameters: [
                {
                    in: "body",
                    name: "body",
                    required: true,
                    schema: getJSONSchema(action.input),
                },
            ],
            responses: {
                "200": { description: "Success", schema: getJSONSchema(action.output) },
                "400": { description: "Body was not valid JSON." },
                "422": { description: "Input failed schema validation." },
            },
        };
        operation["x-ms-visibility"] = "important";

        paths[getPath(action.name)] = { post: operation };
    }

    return {
        swagger: "2.0",
        info: config.info,
        host: config.host,
        basePath: config.basePath,
        schemes: ["https"] as const,
        consumes: ["application/json"],
        produces: ["application/json"],
        paths,
        definitions: {},
        securityDefinitions: {
            api_key: { type: "apiKey", in: "header", name: "X-API-Key" },
        },
        security: [{ api_key: [] as string[] }],
        tags: [],
    };
}