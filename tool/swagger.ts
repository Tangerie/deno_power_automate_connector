import { parseArgs } from "@std/cli/parse-args";
import { toFileUrl, join } from "@std/path";
import { buildSwagger } from "../src/swagger.ts";
import "@std/dotenv/load";

const args = parseArgs(Deno.args, {
    string:["outDir"],
});


if(!Deno.env.get("APP_TITLE") || !Deno.env.get("APP_HOST")) {
    throw Error("APP_TITLE & APP_HOST env required")
}

for(const file of args._) await import(toFileUrl(Deno.realPathSync(String(file))).href);

const swagger = buildSwagger({
    info: {
        title: Deno.env.get("APP_TITLE")!,
        description: Deno.env.get("APP_DESCRIPTION") ?? "",
        version: Deno.env.get("APP_VERSION") ?? "1.0.0"
    },
    basePath: Deno.env.get("APP_BASE_PATH") ?? "/",
    host: Deno.env.get("APP_HOST")!
})

if(args.outDir) {
    await Deno.mkdir(args.outDir, { recursive: true });
    const p = join(args.outDir, "apiDefinition.swagger.json")
    Deno.writeTextFileSync(p, JSON.stringify(swagger, null, 2));
    console.log("Wrote to", p)
} else {
    console.log(JSON.stringify(swagger, null, 2));
}