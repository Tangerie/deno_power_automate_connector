# Deno Power Automate Connector
`deno add --jsr @tangerie/power-automate-connector`

## Usage

### Actions
```ts
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
```

### Router
```ts
import { Application } from "@oak/oak";
import "./actions/mod.ts";
import { createRouter } from "@tangerie/power_automate_connector";

const app = new Application();
const router = createRouter({ apiKey: "..." });
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
```

### Create Connector
#### `connector/apiProperties.json`
```json
{
  "properties": {
    "connectionParameters": {
      "api_key": {
        "type": "securestring",
        "uiDefinition": {
          "displayName": "API Key",
          "description": "The X-API-Key for power_automate_utils.",
          "tooltip": "Provide your API key",
          "constraints": {
            "tabIndex": 2,
            "clearText": false,
            "required": "true"
          }
        }
      }
    },
    "iconBrandColor": "#86d0cc",
    "capabilities": [],
    "policyTemplateInstances": []
  }
}
```
#### `.env`
```ini
APP_TITLE=Tangerie Utils
APP_HOST=tangerie.xyz
APP_BASE_PATH=/power-automate-utils
APP_DESCRIPTION=...
APP_VERSION=1.0.0
```

```bash
deno add --jsr @tangerie/power-automate-connector

# Create connector/apiDefinition.swagger.json from actions imported in actions/mod.ts
deno -A @tangerie/power-automate-connector/swagger ./actions/mod.ts --outDir ./connector

# Create in Power Automate
paconn create --api-def connector/apiDefinition.swagger.json --api-prop connector/apiProperties.json
# OR Push to Power Automate
paconn update -s settings.json
```