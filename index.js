import semanticRelease, { getLogger, resolveConfig, resolveEnvCi } from "@semantic-release/core";
import { parseRuntimeOptions } from "./lib/parse-runtime-options.js";
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

  const configuredPlugins = Array.isArray(options.plugins) ? options.plugins : [];
  const plugins = ensureRequiredPlugins(configuredPlugins);

  return semanticRelease({
    context: {
      ...context,
      options
    },
    plugins
  });
}

function ensureRequiredPlugins(configuredPlugins) {
  const hasGitPlugin = configuredPlugins.some((pluginSpec) => getPluginName(pluginSpec) === "@semantic-release/git");
  const normalizedPlugins = hasGitPlugin ? [...configuredPlugins] : [...configuredPlugins, "@semantic-release/git"];

  return [versionWriterPlugin, ...normalizedPlugins];
}

function getPluginName(pluginSpec) {
  if (typeof pluginSpec === "string") {
    return pluginSpec;
  }

  if (Array.isArray(pluginSpec)) {
    return getPluginName(pluginSpec[0]);
  }

  if (pluginSpec && typeof pluginSpec === "object" && typeof pluginSpec.path === "string") {
    return pluginSpec.path;
  }

  return null;
}