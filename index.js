import semanticRelease, { getLogger, resolveConfig, resolveEnvCi } from "@semantic-release/core";
import { versionWriterPlugin } from "./lib/version-writer.js";

const BASE_CONFIG = {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/git"
  ]
};

export async function runRelease(runtimeOptions) {
  const cwd = process.cwd();
  const env = process.env;
  const stdout = process.stdout;
  const stderr = process.stderr;
  const envCi = resolveEnvCi({ cwd, env });
  const logger = getLogger({ stdout, stderr });

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