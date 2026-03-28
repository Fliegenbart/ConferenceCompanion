import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function parseEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf8");
  const env: Record<string, string> = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalsIndex = line.indexOf("=");

    if (equalsIndex <= 0) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

export function loadTestEnv() {
  const baseDir = process.cwd();
  const envFiles = [".env.local", ".env", ".env.example"].map((fileName) => path.resolve(baseDir, fileName));
  const mergedEnv: Record<string, string> = Object.assign({}, ...envFiles.map(parseEnvFile));

  for (const [key, value] of Object.entries(mergedEnv)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  const localDatabaseUrl = `postgresql://${os.userInfo().username}@localhost:5432/conference_companion?schema=public`;

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("postgres:postgres@localhost")) {
    process.env.DATABASE_URL = localDatabaseUrl;
  }

  return process.env;
}
