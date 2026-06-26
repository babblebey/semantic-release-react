import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const versionWriterPlugin = {
  prepare: async (_, context) => {
    const packageJsonPath = path.join(context.cwd, "package.json");
    const packageJsonRaw = await readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonRaw);

    packageJson.version = context.nextRelease.version;

    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");
    context.logger.log("Updated package.json version to %s", context.nextRelease.version);
  }
};