import path from "node:path";

import { defineConfig } from "@playwright/test";

import { loadTestEnv } from "./e2e/support/env";

const testEnv = Object.fromEntries(
  Object.entries(loadTestEnv()).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
);
testEnv.E2E_TESTING = "1";
testEnv.NEXTAUTH_URL = "http://127.0.0.1:3011";
testEnv.NEXT_PUBLIC_APP_URL = "http://127.0.0.1:3011";

const webServerCommand =
  process.env.CI === "true"
    ? "bash -lc 'set -a; [ -f .env ] && source .env; set +a; export NEXTAUTH_URL=http://127.0.0.1:3011; export NEXT_PUBLIC_APP_URL=http://127.0.0.1:3011; pnpm db:push && pnpm db:seed && pnpm build && pnpm start --hostname 127.0.0.1 --port 3011'"
    : "bash -lc 'set -a; [ -f .env ] && source .env; set +a; export NEXTAUTH_URL=http://127.0.0.1:3011; export NEXT_PUBLIC_APP_URL=http://127.0.0.1:3011; pnpm db:push && pnpm db:seed && pnpm build && pnpm start --hostname 127.0.0.1 --port 3011'";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3011",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: webServerCommand,
    url: "http://127.0.0.1:3011",
    reuseExistingServer: false,
    timeout: 120_000,
    env: testEnv,
  },
  outputDir: path.join("output", "playwright"),
});
