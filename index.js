import semanticRelease, { getLogger, resolveConfig, resolveEnvCi } from "@semantic-release/core";
import { parseRuntimeOptions } from "./lib/config-resolver.js";
import { versionWriterPlugin } from "./lib/version-writer.js";

const BASE_CONFIG = {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/git"
  ]
};

export async function runRelease(argv = []) {
  const runtimeOptions = parseRuntimeOptions(argv);
  const cwd = process.cwd();
  const env = process.env;
  const stdout = process.stdout;
  const stderr = process.stderr;
  const envCi = resolveEnvCi({ cwd, env });
  const logger = getLogger({ stdout, stderr });

  Object.assign(env, {
    GIT_AUTHOR_NAME: "semantic-release-bot",
    GIT_AUTHOR_EMAIL: "semantic-release-bot@semantic-release-react.com",
    GIT_COMMITTER_NAME: "semantic-release-bot",
    GIT_COMMITTER_EMAIL: "semantic-release-bot@semantic-release-react.com",
    ...env,
    GIT_ASKPASS: "echo",
    GIT_TERMINAL_PROMPT: 0,
  });

  const context = {
    cwd,
    env,
    envCi,
    logger,
    stdout,
    stderr,
  };
  const { options } = await resolveConfig(context, runtimeOptions, {
    baseConfig: BASE_CONFIG
  });

  // Get Configured Plugins and add versionWriterPlugin to the end of the list
  const configuredPlugins = Array.isArray(options.plugins) ? options.plugins : [];
  // Add Non-negotiable versionWriterPlugin to the end of the list of configured plugins   
  const plugins = [...configuredPlugins, versionWriterPlugin];

  return semanticRelease({
    context: {
      ...context,
      options
    },
    plugins
  });
}