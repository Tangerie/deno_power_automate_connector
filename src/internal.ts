import type { UnknownActionDefinition } from "./types.ts";

export const registry : Map<string, UnknownActionDefinition> = new Map();

export const getPath = (name : string) => "/" + name.toLocaleLowerCase().replaceAll(" ", "-");