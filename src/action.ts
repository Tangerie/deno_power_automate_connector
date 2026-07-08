import type { z } from "@zod/zod/v4";
import { registry } from "./internal.ts";
import type { ActionDefinition, UnknownActionDefinition } from "./types.ts";

export function define<I extends z.ZodType, O extends z.ZodType>(definition : ActionDefinition<I, O>): ActionDefinition<I, O> {
    if(registry.has(definition.name)) throw new Error(`Duplicate action ${definition.name}`);
    registry.set(definition.name, definition as unknown as UnknownActionDefinition);
    return definition;
}
