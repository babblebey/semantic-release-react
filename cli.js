#!/usr/bin/env node

import { runRelease } from "./index.js";
import { parseRuntimeOptions } from "./lib/parse-runtime-options.js";

async function main() {
  try {
    const runtimeOptions = parseRuntimeOptions(process.argv.slice(2));
    const result = await runRelease(runtimeOptions);

    if (!result) {
      console.log("[semantic-release-react] No release was published.");
      return;
    }

    if (result.nextRelease?.version) {
      console.log(`[semantic-release-react] ${runtimeOptions.dryRun ? "Version to be released: " : "Released"} ${result.nextRelease.version}.`);
    }

    return;
  } catch (error) {
    logReleaseError(error);
    process.exitCode = getExitCode(error);
  }
}

function getExitCode(error) {
  if (hasSemanticReleaseErrors(error)) {
    return 2;
  }

  return 1;
}

function hasSemanticReleaseErrors(error) {
  if (!error || typeof error !== "object") {
    return false;
  }

  if (error.semanticRelease === true) {
    return true;
  }

  return Array.isArray(error.errors) && error.errors.some((nestedError) => nestedError?.semanticRelease === true);
}

function logReleaseError(error) {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    for (const nestedError of error.errors) {
      const code = nestedError?.code ? `${nestedError.code}: ` : "";
      const message = nestedError?.message ?? String(nestedError);
      console.error(`[semantic-release-react] ${code}${message}`);
    }
    return;
  }

  const code = error?.code ? `${error.code}: ` : "";
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[semantic-release-react] ${code}${message}`);
}

await main();