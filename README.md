# semantic-release-react

A focused release CLI for React projects built on `@semantic-release/core`.

## What it does

- Runs semantic-release through a custom CLI (`semantic-release-react`)
- Writes the computed release version to `package.json` in the `prepare` step
- Ships default plugins for:
  - `@semantic-release/commit-analyzer`
  - `@semantic-release/release-notes-generator`
  - `@semantic-release/git`
- Supports GitHub or GitLab release plugins only when they are explicitly configured in semantic-release config

## Requirements

- Node.js `^22.14.0 || >=24.10.0`

## Install

```bash
pnpm install
```

## Run

```bash
pnpm run release
```

Dry run:

```bash
pnpm run release:dry-run
```

You can pass semantic-release runtime options through the CLI:

```bash
node cli.js --dry-run --no-ci --branches main --tag-format v${version}
```

## Provider configuration

This CLI reads provider plugins from your semantic-release config. It does not auto-detect provider.

If you set your own `plugins` list in config, semantic-release treats that list as authoritative.

### GitHub example

Create `.releaserc.json`:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/github"
  ]
}
```

### GitLab example

Create `.releaserc.json`:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/gitlab"
  ]
}
```

## Default plugin behavior

- The CLI seeds semantic-release with `baseConfig.plugins` containing:
  - `@semantic-release/commit-analyzer`
  - `@semantic-release/release-notes-generator`
  - `@semantic-release/git`
- The `@semantic-release/git` plugin is required and is injected if your configured plugin list does not include it.
- The internal package version writer plugin is always appended at runtime.

## Exit codes

- `0`: success (release published or no release needed)
- `1`: unexpected runtime failure
- `2`: semantic-release validation/config/policy failure

## Verification commands

Base dry run (no provider plugin):

```bash
rm -f .releaserc.json
node cli.js --dry-run --no-ci
```

Dry run with GitHub plugin configured:

```bash
cat > .releaserc.json <<'JSON'
{
  "branches": ["main"],
  "plugins": ["@semantic-release/github"]
}
JSON
node cli.js --dry-run --no-ci
```

Dry run with GitLab plugin configured:

```bash
cat > .releaserc.json <<'JSON'
{
  "branches": ["main"],
  "plugins": ["@semantic-release/gitlab"]
}
JSON
node cli.js --dry-run --no-ci
```

Dry run with default plugin override:

```bash
cat > .releaserc.json <<'JSON'
{
  "branches": ["main"],
  "plugins": [["@semantic-release/commit-analyzer", { "preset": "angular" }]]
}
JSON
node cli.js --dry-run --no-ci
rm -f .releaserc.json
```
