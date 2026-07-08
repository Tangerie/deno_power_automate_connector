import { Router } from "@oak/oak/router";
import { getPath, registry } from "./internal.ts";
import type { Context } from "@oak/oak/context";
import type { ResponseBody } from "@oak/oak/response";

interface Config {
    apiKey : string;
}

function throwError(ctx : Context, code : number, message : string) {
    ctx.response.status = code;
    ctx.response.body = { error: message };
}

export function createRouter(cfg : Config) {
    const router = new Router();

    for(const action of registry.values()) {
        router.post(getPath(action.name), async ctx => {
            // Optional shared-secret gate.
            if (ctx.request.headers.get("x-api-key") !== cfg.apiKey) {
                return throwError(ctx, 401, "Unauthorized");
            }

            let raw : unknown;
            try {
                raw = await ctx.request.body.json();
            } catch {
                return throwError(ctx, 400, "Body must be valid JSON");
            }

            const parsed = action.input.safeParse(raw);
            if(!parsed.success) return throwError(ctx, 422, "Validation failed");

            try {
                const result = await action.handler(parsed.data);
                ctx.response.type = "json";
                ctx.response.body = action.output.parse(result) as ResponseBody;
            } catch(err) {
                return throwError(ctx, 500, String(err));
            }
        })
    }
}


