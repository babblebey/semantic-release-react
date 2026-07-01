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

## Usage

Run directly with `npx` (no local install required):

```bash
npx semantic-release-react
```

Dry run:

```bash
npx semantic-release-react --dry-run --no-ci
```

You can pass semantic-release runtime options through the CLI:

```bash
npx semantic-release-react --branches main --tag-format v${version}
```

## Optional local install

If you prefer pinning the package in your project:

```bash
pnpm add -D semantic-release-react
```

Then run:

```bash
pnpm semantic-release-react --dry-run --no-ci
```

## Configure your Git provider (publish + release notes)

To publish releases to your Git provider and generate release notes, choose one provider plugin in your semantic-release config.

### Step 1: Create `.releaserc.json`

If you define your own `plugins` array, semantic-release treats it as the full plugin list.
Include the plugins you need for release analysis and notes generation.

Use this as a safe baseline:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator"
  ]
}
```

### Step 2: Add your provider plugin

#### GitHub

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github"
  ]
}
```

Set one of these environment variables in CI:

- `GITHUB_TOKEN`
- `GH_TOKEN`

#### GitLab

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/gitlab"
  ]
}
```

Set one of these environment variables in CI:

- `GITLAB_TOKEN`
- `GL_TOKEN`

### Step 3: Run a dry run

```bash
npx semantic-release-react --dry-run --no-ci
```

If the dry run succeeds, run in CI without `--dry-run` to publish releases and release notes.

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
npx semantic-release-react --dry-run --no-ci
```

Dry run with GitHub plugin configured:

```bash
cat > .releaserc.json <<'JSON'
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github"
  ]
}
JSON
npx semantic-release-react --dry-run --no-ci
```

Dry run with GitLab plugin configured:

```bash
cat > .releaserc.json <<'JSON'
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/gitlab"
  ]
}
JSON
npx semantic-release-react --dry-run --no-ci
```

Dry run with default plugin override:

```bash
cat > .releaserc.json <<'JSON'
{
  "branches": ["main"],
  "plugins": [["@semantic-release/commit-analyzer", { "preset": "angular" }]]
}
JSON
npx semantic-release-react --dry-run --no-ci
rm -f .releaserc.json
```
